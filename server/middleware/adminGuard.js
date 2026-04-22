'use strict';

const { ADMIN_CHAT_IDS } = require('../config');

const allowed = new Set(ADMIN_CHAT_IDS.map(String));

function getChatId(ctx) {
  if (ctx.chat && ctx.chat.id != null) return ctx.chat.id.toString();
  const cbChat = ctx.callbackQuery && ctx.callbackQuery.message && ctx.callbackQuery.message.chat;
  return cbChat && cbChat.id != null ? cbChat.id.toString() : null;
}

function isFromAdminChat(ctx) {
  const chatId = getChatId(ctx);
  return chatId != null && allowed.has(chatId);
}

function adminOnly(handler) {
  return async (ctx, ...rest) => {
    if (!isFromAdminChat(ctx)) {
      if (ctx.callbackQuery) {
        try { await ctx.answerCbQuery('⛔ Недостатньо прав.', { show_alert: true }); } catch { /* ignore */ }
      }
      return;
    }
    return handler(ctx, ...rest);
  };
}

module.exports = { adminOnly, isFromAdminChat };
