'use strict';

const db = require('../db');
const {
  CASES_CHAT_ID,
  CONSULTATION_PRICE,
  MAX_MESSAGE_LENGTH,
  MIN_EXTRA_PAYMENT,
  MAX_EXTRA_PAYMENT,
} = require('../config');
const { adminOnly, isFromAdminChat } = require('../middleware/adminGuard');
const {
  paymentKeyboard,
  receiptOnlyKeyboard,
  reviewEndKeyboard,
} = require('../content/keyboards');
const { createClientTopic, dispatchConsultationToTopic } = require('./topic');
const { isRateLimited } = require('../rateLimit');

const RE_TAKE = /^take_case_(\d+)$/;
const RE_REJECT_CASE = /^reject_case_(\d+)$/;
const RE_CONFIRM = /^confirm_payment_(\d+)$/;
const RE_REJECT_PAY = /^reject_payment_(\d+)$/;
const RE_REQ_PAY = /^req_pay_(\d+)$/;
const RE_CLOSE = /^close_chat_(\d+)$/;
const RE_DELETE = /^delete_chat_(\d+)$/;

function parseClientId(match) {
  const id = parseInt(match[1], 10);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function parseExtraAmount(text) {
  if (typeof text !== 'string') return null;
  const trimmed = text.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const n = parseInt(trimmed, 10);
  if (!Number.isSafeInteger(n) || n < MIN_EXTRA_PAYMENT || n > MAX_EXTRA_PAYMENT) return null;
  return n;
}

function lawyerHandle(ctx) {
  return ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
}

function register(bot) {
  bot.action(RE_TAKE, adminOnly(async (ctx) => {
    const clientId = parseClientId(ctx.match);
    if (!clientId) return ctx.answerCbQuery('Невірний запит.', { show_alert: true });

    const taken = await db.takeCaseAtomic(clientId, ctx.from.id);
    if (!taken) {
      return ctx.answerCbQuery('Цю заявку вже взято або відхилено.', { show_alert: true });
    }

    await ctx.answerCbQuery('Ви взяли справу!');
    const originalText = ctx.callbackQuery.message.text || '';
    await ctx.editMessageText(
      `${originalText}\n\n✅ <b>Взяв у роботу:</b> ${lawyerHandle(ctx)}`,
      { parse_mode: 'HTML', reply_markup: { inline_keyboard: [] } }
    ).catch(() => {});

    try {
      await ctx.telegram.sendMessage(
        clientId,
        `✅ <b>Юриста знайдено!</b>\n\n` +
        `Профільний фахівець ознайомився з вашим запитом і готовий розпочати консультацію.\n\n` +
        `Вартість консультації: <b>${CONSULTATION_PRICE} грн</b>.\n` +
        `Після оплати надішліть квитанцію — і ми одразу відкриємо чат з юристом.\n\n` +
        `🛡 <b>Гарантія:</b> Якщо юрист не зможе допомогти — повернемо кошти.`,
        { parse_mode: 'HTML', ...paymentKeyboard() }
      );
    } catch (e) {
      console.error('Не вдалося надіслати повідомлення клієнту', e.message);
    }
  }));

  bot.action(RE_REJECT_CASE, adminOnly(async (ctx) => {
    const clientId = parseClientId(ctx.match);
    if (!clientId) return ctx.answerCbQuery('Невірний запит.', { show_alert: true });

    const session = await db.getSession(clientId);
    if (!session || session.status !== 'searching_lawyer') {
      return ctx.answerCbQuery('Заявку вже опрацьовано.', { show_alert: true });
    }

    await ctx.answerCbQuery('Заявку відхилено.');
    const originalText = ctx.callbackQuery.message.text || '';
    await ctx.editMessageText(
      `${originalText}\n\n❌ <b>Відхилено:</b> ${lawyerHandle(ctx)}`,
      { parse_mode: 'HTML', reply_markup: { inline_keyboard: [] } }
    ).catch(() => {});

    await db.deleteSession(clientId);

    try {
      await ctx.telegram.sendMessage(
        clientId,
        `😔 На жаль, наразі немає вільного фахівця з потрібної спеціалізації.\n\n` +
        `Вашу заявку закрито. Ви можете подати новий запит у будь-який час — натисніть /start.`
      );
    } catch (e) {
      console.error('Не вдалося повідомити клієнта про відхилення', e.message);
    }
  }));

  bot.action(RE_CONFIRM, adminOnly(async (ctx) => {
    const clientId = parseClientId(ctx.match);
    if (!clientId) return ctx.answerCbQuery('Невірний запит.', { show_alert: true });

    const session = await db.getSession(clientId);
    if (!session) return ctx.answerCbQuery('Сесію видалено або втрачено.', { show_alert: true });

    if (session.assigned_lawyer_id && Number(session.assigned_lawyer_id) !== ctx.from.id) {
      return ctx.answerCbQuery('Підтвердити оплату може лише юрист, який взяв цю справу.', { show_alert: true });
    }

    const confirmed = await db.confirmPaymentAtomic(clientId, ctx.from.id);
    if (!confirmed) {
      return ctx.answerCbQuery('Цю заявку вже опрацьовано або статус не дозволяє підтвердження.', { show_alert: true });
    }

    await ctx.answerCbQuery('Оплату підтверджено!');
    try {
      const originalText = ctx.callbackQuery.message.text || ctx.callbackQuery.message.caption || '';
      await ctx.editMessageText(
        `${originalText}\n\n🟢 <b>Взято в роботу юристом:</b> ${lawyerHandle(ctx)}`,
        { parse_mode: 'HTML', reply_markup: { inline_keyboard: [] } }
      ).catch(() => {});

      const nameMatch = originalText.match(/Клієнт:\*?\*?\s*([^()]+?)\s*\(/);
      const fetchedName = nameMatch ? nameMatch[1].trim() : 'Клієнт';

      await ctx.telegram.sendMessage(
        clientId,
        `✅ Оплату успішно підтверджено! Чат відкрито.\n\n` +
        `Ваш профільний юрист уже долучився до бесіди та отримав усі матеріали справи.\n\n` +
        `⚖️ Щоб надати вам не просто шаблонну відповідь, а глибокий юридичний аналіз вашої конкретної ситуації, фахівцю потрібен час на вивчення документів та актуальної судової практики.\n\n` +
        `⏳ Зазвичай підготовка детальної відповіді займає від 1 до 2 годин.\n\n` +
        `Будь ласка, не хвилюйтеся — ви можете закрити бота і займатися своїми справами. Щойно алгоритм дій буде готовий, юрист одразу напише вам сюди!`
      );

      const threadId = await createClientTopic(ctx, clientId, fetchedName, session.category);
      if (threadId) {
        await db.saveTopic(clientId, threadId);
        await db.setTopicLawyer(clientId, ctx.from.id);
        await dispatchConsultationToTopic(ctx, clientId, fetchedName, session.category, threadId);
      }
    } catch (err) {
      console.error('Error confirming payment', err.message);
    }
  }));

  bot.action(RE_REJECT_PAY, adminOnly(async (ctx) => {
    const clientId = parseClientId(ctx.match);
    if (!clientId) return ctx.answerCbQuery('Невірний запит.', { show_alert: true });
    await ctx.answerCbQuery('Оплату відхилено!');

    try {
      await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
      await ctx.reply(
        `❌ Оплату для клієнта [ID: ${clientId}] ВІДХИЛЕНО. ${lawyerHandle(ctx)}`,
        { reply_to_message_id: ctx.callbackQuery.message.message_id }
      );

      const session = await db.getSession(clientId);
      if (session) await db.updateSessionStatus(clientId, 'payment_selection');

      await ctx.telegram.sendMessage(
        clientId,
        'На жаль, ми не змогли підтвердити ваш платіж. Будь ласка, перевірте реквізити або надішліть актуальну квитанцію ще раз.',
        receiptOnlyKeyboard()
      );
    } catch (err) {
      console.error('Error rejecting payment', err.message);
    }
  }));

  bot.action(RE_REQ_PAY, adminOnly(async (ctx) => {
    const clientId = parseClientId(ctx.match);
    if (!clientId) return ctx.answerCbQuery('Невірний запит.', { show_alert: true });
    await ctx.answerCbQuery();

    const threadId = ctx.callbackQuery.message.message_thread_id;
    if (!threadId) return ctx.reply('Ця кнопка працює тільки всередині окремої Теми(Топіка)!');

    const topicInfo = await db.getTopicByThreadId(threadId);
    if (!topicInfo || topicInfo.is_open === 0) return ctx.reply('Консультація вже закрита.');

    await db.saveAdminState(threadId, clientId, 'awaiting_extra_payment');
    await ctx.reply(
      `Виставлення рахунку: відправте суму доплати цифрами (наприклад, 500).\n` +
      `Діапазон: ${MIN_EXTRA_PAYMENT}–${MAX_EXTRA_PAYMENT} грн.`
    );
  }));

  bot.action(RE_CLOSE, adminOnly(async (ctx) => {
    const clientId = parseClientId(ctx.match);
    if (!clientId) return ctx.answerCbQuery('Невірний запит.', { show_alert: true });

    try {
      const topicInfo = await db.getTopic(clientId);
      if (!topicInfo || topicInfo.is_open === 0) {
        return ctx.answerCbQuery('Консультацію вже завершено.');
      }

      await ctx.answerCbQuery('Чат завершено!');
      await db.updateTopicIsOpen(clientId, false);

      const session = await db.getSession(clientId);
      if (session) {
        await db.saveSession(clientId, { ...session, status: 'review_prompt' });
      } else {
        await db.saveSession(clientId, { chat_id: clientId, status: 'review_prompt' });
      }

      await ctx.telegram.sendMessage(
        clientId,
        `Дякуємо, що обрали LegalClick! Ваша справа офіційно закрита. Якщо у вас виникнуть нові питання — ми на зв'язку.\n\nБудемо вдячні за зворотний зв'язок. Це допоможе нам ставати кращими.`,
        reviewEndKeyboard()
      );

      const now = new Date().toLocaleString('uk-UA');
      await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
      await ctx.reply(`🔒 Сесію закрито [${now}]. Для фізичного видалення натисніть "Видалити діалог".`, {
        reply_to_message_id: ctx.callbackQuery.message.message_id,
      });

      if (topicInfo.thread_id) {
        try {
          await ctx.telegram.closeForumTopic(CASES_CHAT_ID, topicInfo.thread_id);
        } catch (closeErr) {
          console.log('Could not close forum topic natively:', closeErr.message);
        }
      }
    } catch (e) {
      console.error('Помилка завершення', e.message);
    }
  }));

  bot.action(RE_DELETE, adminOnly(async (ctx) => {
    const clientId = parseClientId(ctx.match);
    if (!clientId) return ctx.answerCbQuery('Невірний запит.', { show_alert: true });
    await ctx.answerCbQuery('Видалення...');

    try {
      const topicInfo = await db.getTopic(clientId);
      if (topicInfo && topicInfo.thread_id) {
        try {
          await ctx.telegram.deleteForumTopic(CASES_CHAT_ID, topicInfo.thread_id);
        } catch (delErr) {
          console.error('Could not delete forum topic natively:', delErr.message);
          try {
            await ctx.telegram.sendMessage(CASES_CHAT_ID, '❌ Помилка: У бота немає прав на видалення тем (Manage Topics).');
          } catch { /* ignore */ }
        }
      }
      await db.saveTopic(clientId, null);
    } catch (e) {
      console.error('Помилка видалення топіку', e.message);
    }
  }));

  bot.on('message', async (ctx, next) => {
    if (!isFromAdminChat(ctx)) return next();
    if (ctx.message.new_chat_members || ctx.message.forum_topic_created || ctx.message.forum_topic_edited || ctx.message.pinned_message) {
      return;
    }
    if (ctx.from && isRateLimited(ctx.from.id)) {
      try { await ctx.reply('Ви надсилаєте повідомлення надто часто. Будь ласка, зачекайте хвилину.'); } catch { /* ignore */ }
      return;
    }
    if (ctx.message && ctx.message.text && ctx.message.text.length > MAX_MESSAGE_LENGTH) {
      try { await ctx.reply('Повідомлення занадто довге. Будь ласка, скоротіть текст.'); } catch { /* ignore */ }
      return;
    }

    const threadId = ctx.message.message_thread_id;

    if (threadId) {
      const admState = await db.getAdminState(threadId);
      if (admState && admState.step === 'awaiting_extra_payment') {
        const amount = parseExtraAmount(ctx.message.text);
        if (amount === null) {
          try {
            await ctx.reply(
              `❌ Невірна сума. Введіть ціле число у діапазоні ${MIN_EXTRA_PAYMENT}–${MAX_EXTRA_PAYMENT} грн (лише цифри).`
            );
          } catch { /* ignore */ }
          return;
        }
        await db.deleteAdminState(threadId);

        const cid = admState.client_id;
        const session = await db.getSession(cid);
        if (session) {
          await db.saveSession(cid, {
            ...session,
            status: 'awaiting_payment_method',
            extra: 1,
            amount,
          });
        }

        try { await ctx.reply(`✅ Рахунок на ${amount} грн успішно сформовано та надіслано клієнту.`); } catch { /* ignore */ }

        try {
          await ctx.telegram.sendMessage(
            cid,
            `⚖️ Для продовження роботи над вашою справою необхідно внести доплату.\n\n` +
            `Сума: *${amount} грн*.\n\n` +
            `Після успішної оплати завантажте квитанцію сюди.`,
            {
              parse_mode: 'Markdown',
              disable_web_page_preview: true,
              ...paymentKeyboard(),
            }
          );
        } catch (e) {
          console.error('Не вдалося надіслати запит клієнту', e.message);
          try {
            await ctx.reply('❌ Помилка: Не вдалося надіслати запит клієнту. Можливо, він заблокував бота або видалив чат.');
          } catch { /* ignore */ }
        }
        return;
      }
    }

    let clientId = null;
    if (ctx.message.is_topic_message || threadId) {
      const topicRow = await db.getTopicByThreadId(threadId);
      if (topicRow) clientId = topicRow.client_chat_id;
    }

    if (!clientId && ctx.message.reply_to_message) {
      const replyTo = ctx.message.reply_to_message;
      if (replyTo.text && replyTo.text.includes('[ID: ')) {
        const match = replyTo.text.match(/\[ID:\s*(\d+)\]/);
        if (match && match[1]) {
          const parsed = parseInt(match[1], 10);
          if (Number.isSafeInteger(parsed) && parsed > 0) clientId = parsed;
        }
      } else if (replyTo.forward_from && replyTo.forward_from.id) {
        clientId = replyTo.forward_from.id;
      }
    }

    if (clientId) {
      const dbTopic = await db.getTopic(clientId);
      if (!dbTopic || dbTopic.is_open === 0) {
        try {
          await ctx.reply('⚠️ Увага: Консультація закрита. Повідомлення не доставлено клієнту.', {
            reply_to_message_id: ctx.message.message_id,
          });
        } catch { /* ignore */ }
        return;
      }

      try {
        await ctx.telegram.copyMessage(Number(clientId), ctx.chat.id, ctx.message.message_id);
      } catch (error) {
        console.error('Помилка відправки клієнту:', error.message);
        try {
          await ctx.reply('❌ Помилка: Не вдалося надіслати повідомлення клієнту. Можливо він заблокував бота.', {
            message_thread_id: threadId,
          });
        } catch { /* ignore */ }
      }
      return;
    }

    return next();
  });
}

module.exports = { register };
