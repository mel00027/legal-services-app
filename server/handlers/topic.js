'use strict';

const db = require('../db');
const { CASES_CHAT_ID } = require('../config');
const { topicActionsKeyboard } = require('../content/keyboards');

async function createClientTopic(ctx, clientId, clientName, category) {
  const isForum = String(CASES_CHAT_ID).startsWith('-100');
  const topicRow = await db.getTopic(clientId);
  let threadId = topicRow ? topicRow.thread_id : null;

  if (isForum && !threadId) {
    try {
      const prefix = category ? category.split(' ')[0] : 'Заявка';
      const topicName = `[${prefix}] ${clientName}`;
      const newTopic = await ctx.telegram.createForumTopic(CASES_CHAT_ID, topicName);
      threadId = newTopic.message_thread_id;
      await db.saveTopic(clientId, threadId);
    } catch (e) {
      console.error('Помилка створення топіка:', e.message);
    }
  }
  return threadId;
}

async function dispatchConsultationToTopic(ctx, clientId, clientName, category, threadId) {
  if (!threadId) return;

  const adminMsg = `🚨 <b>Консультацію розпочато! (Оплачено)</b>\n\n` +
    `<b>Клієнт:</b> ${clientName} [ID: ${clientId}]\n` +
    `<b>Категорія:</b> ${category}\n` +
    `<b>Взяв у роботу:</b> @${ctx.from.username || ctx.from.first_name}\n\n` +
    `Усі ваші наступні повідомлення в цьому топіку будуть автоматично доставлені клієнту.👇`;

  try {
    const sentMsg = await ctx.telegram.sendMessage(CASES_CHAT_ID, adminMsg, {
      parse_mode: 'HTML',
      message_thread_id: threadId,
      ...topicActionsKeyboard(clientId),
    });

    try {
      await ctx.telegram.pinChatMessage(CASES_CHAT_ID, sentMsg.message_id);
    } catch { /* ignore missing permissions */ }

    const sess = await db.getSession(clientId);
    if (sess && sess.receipt_msg_id) {
      try {
        await ctx.telegram.copyMessage(CASES_CHAT_ID, clientId, sess.receipt_msg_id, { message_thread_id: threadId });
      } catch { /* ignore */ }
    }
  } catch (error) {
    const msg = error && error.message ? error.message : '';
    if (msg.includes('thread not found') || msg.includes('message context to reply is not found')) {
      await db.saveTopic(clientId, null);
    }
  }
}

module.exports = { createClientTopic, dispatchConsultationToTopic };
