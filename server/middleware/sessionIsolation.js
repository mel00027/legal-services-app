'use strict';

const db = require('../db');

module.exports = async function sessionIsolation(ctx, next) {
  if (ctx.chat && ctx.chat.type === 'private' && ctx.from) {
    const session = await db.getSession(ctx.from.id);
    if (session && session.status === 'active_consultation') {
      const topic = await db.getTopic(ctx.from.id);
      if (topic && topic.is_open === 1) {
        const msgText = (ctx.message && ctx.message.text) ? ctx.message.text : '';
        if (msgText.startsWith('/') || ctx.callbackQuery) {
          if (ctx.callbackQuery) {
            try { await ctx.answerCbQuery(); } catch { /* ignore */ }
          }
          try {
            await ctx.reply('⚠️ У вас зараз активна консультація з юристом. Будь ласка, пишіть ваші повідомлення сюди. Щоб створити нову заявку, дочекайтесь завершення поточної.');
          } catch { /* ignore */ }
          return;
        }
      }
    }
  }
  return next();
};
