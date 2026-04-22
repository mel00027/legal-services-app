'use strict';

const db = require('../db');
const {
  ADMIN_CHAT_ID,
  CASES_CHAT_ID,
  CONSULTATION_PRICE,
  MAX_MESSAGE_LENGTH,
  MEDIA_GROUP_CACHE_MS,
} = require('../config');
const { isRateLimited } = require('../rateLimit');
const { SUBCATEGORIES, CAT_ID_BY_NAME } = require('../content/categories');
const { SERVICE_TYPE_LABELS } = require('../content/examples');
const { getFaqText } = require('../content/faq');
const { buildStartWelcome, MENU_BODY, getDescriptionPromptText } = require('../content/prompts');
const {
  mainMenu,
  faqReplyMarkup,
  subcategoryKeyboard,
  serviceTypeKeyboard,
  paymentKeyboard,
  confirmPaymentKeyboard,
  caseActionsKeyboard,
  backToPaymentKeyboard,
} = require('../content/keyboards');

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const processedMediaGroups = new Set();

function register(bot) {
  bot.start(async (ctx) => {
    await db.deleteSession(ctx.from.id);
    await db.saveTopic(ctx.from.id, null);
    try {
      await ctx.reply(buildStartWelcome(ctx.from.first_name), {
        parse_mode: 'Markdown',
        ...mainMenu(),
      });
    } catch (e) {
      console.error('/start failed', e.message);
    }
  });

  bot.command('getid', async (ctx) => {
    try { await ctx.reply(`ID цього чату: ${ctx.chat.id}`); } catch { /* ignore */ }
  });

  bot.command('faq', async (ctx) => {
    try {
      await ctx.reply(getFaqText(), { parse_mode: 'HTML', reply_markup: faqReplyMarkup() });
    } catch { /* ignore */ }
  });

  bot.action('show_faq', async (ctx) => {
    await ctx.answerCbQuery();
    try {
      await ctx.editMessageText(getFaqText(), { parse_mode: 'HTML', reply_markup: faqReplyMarkup() });
    } catch { /* ignore */ }
  });

  bot.action('back_to_menu', async (ctx) => {
    await ctx.answerCbQuery();
    await db.deleteSession(ctx.from.id);
    try {
      await ctx.editMessageText(MENU_BODY, { parse_mode: 'Markdown', ...mainMenu() });
    } catch { /* ignore */ }
  });

  const goToDescription = async (ctx, categoryName, backCallback = 'back_to_menu') => {
    await db.saveSession(ctx.from.id, {
      chat_id: ctx.chat.id,
      status: 'awaiting_description',
      category: categoryName,
    });
    try {
      await ctx.editMessageText(getDescriptionPromptText(categoryName), {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: '⬅️ Назад', callback_data: backCallback }]] },
      });
    } catch { /* ignore */ }
  };

  const showSubcategoryScreen = async (ctx, categoryId) => {
    const catData = SUBCATEGORIES[categoryId];
    if (!catData) return goToDescription(ctx, 'Інше');

    await db.saveSession(ctx.from.id, {
      chat_id: ctx.chat.id,
      status: 'awaiting_subcategory',
      category: catData.name,
    });

    try {
      await ctx.editMessageText(
        `Ви обрали: *${catData.name}*\n\nОберіть специфіку питання, щоб ми підібрали профільного спеціаліста:`,
        { parse_mode: 'Markdown', ...subcategoryKeyboard(categoryId) }
      );
    } catch { /* ignore */ }
  };

  bot.action(/^category_([a-z0-9_]+)$/, async (ctx) => {
    const categoryId = ctx.match[1];
    await ctx.answerCbQuery();
    if (!SUBCATEGORIES[categoryId]) return goToDescription(ctx, 'Інше');
    await showSubcategoryScreen(ctx, categoryId);
  });

  bot.action(/^back_to_sub_([a-z0-9_]+)$/, async (ctx) => {
    await ctx.answerCbQuery();
    await showSubcategoryScreen(ctx, ctx.match[1]);
  });

  bot.action(/^subcategory_(.+)$/, async (ctx) => {
    const subcategoryName = ctx.match[1];
    const session = await db.getSession(ctx.from.id);

    if (!session || session.status !== 'awaiting_subcategory') {
      return ctx.answerCbQuery('Заявка не знайдена. Почніть з /start');
    }

    await ctx.answerCbQuery();
    const fullCategory = `${session.category} -> ${subcategoryName}`;
    const parentId = CAT_ID_BY_NAME[session.category];
    const backCallback = parentId ? `back_to_sub_${parentId}` : 'back_to_menu';
    await goToDescription(ctx, fullCategory, backCallback);
  });

  bot.action('back_to_description', async (ctx) => {
    const session = await db.getSession(ctx.from.id);
    if (!session || !session.category) {
      return ctx.answerCbQuery('Заявка не знайдена. Почніть з /start');
    }
    await ctx.answerCbQuery();
    await db.saveSession(ctx.from.id, {
      ...session,
      status: 'awaiting_description',
      receipt_msg_id: null,
    });
    const parentName = session.category.includes(' -> ')
      ? session.category.split(' -> ')[0]
      : session.category;
    const parentId = CAT_ID_BY_NAME[parentName];
    const backCallback = parentId ? `back_to_sub_${parentId}` : 'back_to_menu';
    try {
      await ctx.editMessageText(getDescriptionPromptText(session.category), {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: '⬅️ Назад', callback_data: backCallback }]] },
      });
    } catch { /* ignore */ }
  });

  bot.action(/^service_type_(plan|support|document)$/, async (ctx) => {
    const typeId = ctx.match[1];
    const session = await db.getSession(ctx.from.id);

    if (!session || session.status !== 'awaiting_service_type') {
      return ctx.answerCbQuery('Заявка не знайдена. Почніть з /start');
    }

    const typeLabel = SERVICE_TYPE_LABELS[typeId] || typeId;

    await db.saveSession(ctx.from.id, {
      ...session,
      status: 'searching_lawyer',
      service_type: typeId,
    });

    await ctx.answerCbQuery();
    try {
      await ctx.editMessageText(
        `✅ <b>Запит прийнято!</b>\n\n` +
        `🎯 Вам потрібно: <b>${typeLabel}</b>\n\n` +
        `🔍 Здійснюється підбір профільного юриста за напрямком «${session.category}».\n\n` +
        `⏳ Це може зайняти від <b>10 до 30 хвилин</b>. Щойно фахівець ознайомиться з вашим запитом — ми одразу повідомимо вас.`,
        { parse_mode: 'HTML' }
      );
    } catch { /* ignore */ }

    const clientName = ctx.from.first_name;
    const username = ctx.from.username ? `@${ctx.from.username}` : 'без юзернейму';
    const now = new Date().toLocaleString('uk-UA');
    const crmText =
      `🆕 <b>НОВА ЗАЯВКА</b>\n\n` +
      `👤 <b>Клієнт:</b> ${clientName} (${username}) [ID: <code>${ctx.from.id}</code>]\n` +
      `📁 <b>Категорія:</b> ${session.category}\n` +
      `🎯 <b>Що потрібно:</b> ${typeLabel}\n` +
      `🕐 <b>Час подачі:</b> ${now}\n\n` +
      `📋 <b>Опис ситуації — вище ↑</b>`;

    try {
      if (session.receipt_msg_id) {
        await ctx.telegram.copyMessage(ADMIN_CHAT_ID, ctx.from.id, session.receipt_msg_id);
      }
      await ctx.telegram.sendMessage(ADMIN_CHAT_ID, crmText, {
        parse_mode: 'HTML',
        ...caseActionsKeyboard(ctx.from.id),
      });
    } catch (e) {
      console.error('Помилка відправки в CRM', e.message);
    }
  });

  bot.action('payment_direct', async (ctx) => {
    const session = await db.getSession(ctx.from.id);
    if (!session) return ctx.answerCbQuery('Заявка не знайдена. Почніть з /start');

    await ctx.answerCbQuery();
    await db.updateSessionStatus(ctx.from.id, 'payment_selection');

    try {
      await ctx.editMessageText(
        `До сплати: *${CONSULTATION_PRICE} грн*. Ваша заявка готова до передачі юристу.\n\n` +
        `Після успішної оплати обов'язково завантажте квитанцію.`,
        { parse_mode: 'Markdown', disable_web_page_preview: true, ...paymentKeyboard() }
      );
    } catch { /* ignore */ }
  });

  bot.action('send_receipt_prompt', async (ctx) => {
    const session = await db.getSession(ctx.from.id);
    if (!session) return ctx.answerCbQuery('Заявка не знайдена.');

    await db.updateSessionStatus(ctx.from.id, 'awaiting_receipt');
    await ctx.answerCbQuery();

    try {
      await ctx.editMessageText(
        'Будь ласка, надішліть фото квитанції або скриншот у цей чат прямо зараз 👇',
        backToPaymentKeyboard()
      );
    } catch { /* ignore */ }
  });

  bot.action('go_back_to_payment', async (ctx) => {
    const session = await db.getSession(ctx.from.id);
    if (!session) return ctx.answerCbQuery();

    await db.updateSessionStatus(ctx.from.id, 'payment_selection');

    let msg = `До сплати: *${CONSULTATION_PRICE} грн*. Ваша заявка готова до передачі юристу.\n\nПісля успішної оплати обов'язково завантажте квитанцію.`;
    if (session.extra) {
      const amount = session.amount || CONSULTATION_PRICE;
      msg = `⚖️ Для продовження роботи над вашою справою необхідна доплата.\n\nСума: *${amount} грн*.\n\nПісля успішної оплати завантажте квитанцію сюди.`;
    }

    await ctx.answerCbQuery();
    try {
      await ctx.editMessageText(msg, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        ...paymentKeyboard(),
      });
    } catch { /* ignore */ }
  });

  bot.action('leave_review', async (ctx) => {
    await db.updateSessionStatus(ctx.from.id, 'writing_review');
    await ctx.answerCbQuery();
    try {
      await ctx.editMessageText('Будь ласка, напишіть ваші враження від роботи з юристом (одним повідомленням):');
    } catch { /* ignore */ }
  });

  bot.action('go_home', async (ctx) => {
    await db.deleteSession(ctx.from.id);
    await ctx.answerCbQuery();
    try { await ctx.reply('Виберіть категорію вашого питання:', mainMenu()); } catch { /* ignore */ }
  });

  bot.on(['text', 'voice', 'photo', 'document', 'video'], async (ctx) => {
    if (!ctx.chat || ctx.chat.type !== 'private') return;

    if (ctx.message && ctx.message.text && ctx.message.text.length > MAX_MESSAGE_LENGTH) {
      try { await ctx.reply('Повідомлення занадто довге. Будь ласка, скоротіть текст.'); } catch { /* ignore */ }
      return;
    }
    if (ctx.from && isRateLimited(ctx.from.id)) {
      try { await ctx.reply('Ви надсилаєте повідомлення надто часто. Будь ласка, зачекайте хвилину.'); } catch { /* ignore */ }
      return;
    }

    if (ctx.message.media_group_id) {
      if (processedMediaGroups.has(ctx.message.media_group_id)) return;
      processedMediaGroups.add(ctx.message.media_group_id);
      setTimeout(() => processedMediaGroups.delete(ctx.message.media_group_id), MEDIA_GROUP_CACHE_MS);
    }

    const session = await db.getSession(ctx.from.id);
    const topicRow = await db.getTopic(ctx.from.id);

    if (session && session.status === 'writing_review') {
      const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
      const threadId = topicRow ? topicRow.thread_id : null;
      const targetThread = threadId ? { message_thread_id: threadId } : {};

      try {
        await ctx.telegram.sendMessage(
          ADMIN_CHAT_ID,
          `#відгук від клієнта ${username} [ID: ${ctx.from.id}]:\n\n${ctx.message.text || '[Медіафайл]'}`,
          targetThread
        );
      } catch (e) {
        console.error('review send failed', e.message);
      }
      await db.deleteSession(ctx.from.id);
      try { await ctx.reply('Дякуємо за ваш відгук! Нам дуже приємно. 💙\n\nМожете повернутись на головну: /start'); } catch { /* ignore */ }
      return;
    }

    if (session && session.status === 'searching_lawyer') {
      try { await ctx.reply('⏳ Ваш запит в обробці. Пошук профільного юриста може зайняти від 10 до 30 хвилин. Будь ласка, очікуйте — ми повідомимо вас.'); } catch { /* ignore */ }
      return;
    }

    if (session && session.status === 'awaiting_payment') {
      try {
        await ctx.reply(
          `⚖️ <b>Юрист призначений та чекає на вас!</b>\n\nВартість консультації: <b>${CONSULTATION_PRICE} грн</b>.\nПісля оплати надішліть квитанцію — і ми відразу відкриємо чат.`,
          { parse_mode: 'HTML', ...paymentKeyboard() }
        );
      } catch { /* ignore */ }
      return;
    }

    if (session && session.status === 'awaiting_description') {
      await db.saveSession(ctx.from.id, {
        ...session,
        status: 'awaiting_service_type',
        receipt_msg_id: ctx.message.message_id,
      });

      try {
        await ctx.sendChatAction('typing');
        await delay(800);
        await ctx.reply(
          `Дякуємо — ситуація зрозуміла. 🤝\n\nЩо вам зараз <b>найважливіше</b> отримати від юриста?`,
          { parse_mode: 'HTML', ...serviceTypeKeyboard() }
        );
      } catch { /* ignore */ }
      return;
    }

    if (session && session.status === 'awaiting_service_type') {
      try { await ctx.reply('Будь ласка, оберіть один з варіантів вище — натисніть кнопку. 👆'); } catch { /* ignore */ }
      return;
    }

    if (session && session.status === 'awaiting_receipt') {
      if (!ctx.message.photo && !ctx.message.document) {
        try { await ctx.reply('Будь ласка, надішліть фото або скриншот квитанції.'); } catch { /* ignore */ }
        return;
      }

      await db.updateSessionStatus(ctx.from.id, 'pending_admin_approval');
      try { await ctx.reply('Дякуємо! Квитанцію отримано. Очікуйте на підтвердження (зазвичай це займає кілька хвилин).'); } catch { /* ignore */ }

      const extraLabel = session.extra === 1 ? 'ДОПЛАТА' : 'ОПЛАТА';
      const assignedInfo = session.assigned_lawyer_id
        ? `\n<b>Призначений юрист:</b> ID <code>${session.assigned_lawyer_id}</code> (тільки він може підтвердити)`
        : '';
      const adminMsg =
        `💰 <b>Квитанція про оплату (${extraLabel})</b>\n` +
        `<b>Клієнт:</b> ${ctx.from.first_name} (@${ctx.from.username || 'без_юзернейму'}) [ID: ${ctx.from.id}]\n` +
        `<b>Категорія:</b> ${session.category}${assignedInfo}\n\n` +
        `Перевірте квитанцію (вище) та підтвердіть оплату.`;

      try {
        const sentReceipt = await ctx.telegram.copyMessage(ADMIN_CHAT_ID, ctx.from.id, ctx.message.message_id);
        await ctx.telegram.sendMessage(ADMIN_CHAT_ID, adminMsg, {
          parse_mode: 'HTML',
          reply_to_message_id: sentReceipt.message_id,
          ...confirmPaymentKeyboard(ctx.from.id),
        });
      } catch (e) {
        console.error('Не вдалося відправити квитанцію адміну', e.message);
      }
      return;
    }

    if (session && (session.status === 'payment_selection' || session.status === 'pending_admin_approval')) {
      const msg = session.status === 'pending_admin_approval'
        ? 'Будь ласка, зачекайте підтвердження оплати юристом.'
        : 'Будь ласка, завершiть оплату, щоб юрист міг розпочати роботу.';
      try { await ctx.reply(msg); } catch { /* ignore */ }
      return;
    }

    if (topicRow && topicRow.is_open === 1) {
      try {
        await ctx.telegram.copyMessage(CASES_CHAT_ID, ctx.from.id, ctx.message.message_id, {
          message_thread_id: topicRow.thread_id,
        });
      } catch (e) {
        console.error('Failed to forward client message to topic', e.message);
        const m = e && e.message ? e.message : '';
        if (m.includes('thread not found') || m.includes('message context to reply is not found')) {
          await db.saveTopic(ctx.from.id, null);
          try { await ctx.reply("⚠️ Зв'язок розірвано. Тема з юристом була видалена. Натисніть /start."); } catch { /* ignore */ }
        }
      }
      return;
    }

    try { await ctx.reply('Будь ласка, скористайтесь меню для вибору послуги. Натисніть /start, щоб почати.'); } catch { /* ignore */ }
  });
}

module.exports = { register };
