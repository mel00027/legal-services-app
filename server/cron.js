'use strict';

const db = require('./db');
const {
  PAYMENT_TIMEOUT_MINUTES,
  PAYMENT_TIMEOUT_CHECK_MS,
  FOLLOWUP_CHECK_MS,
} = require('./config');

function start(bot) {
  const timeoutInterval = setInterval(async () => {
    try {
      const oldSessions = await db.getOldSessions(PAYMENT_TIMEOUT_MINUTES);
      for (const session of oldSessions) {
        try {
          await bot.telegram.sendMessage(
            session.user_id,
            `⏳ Час очікування оплати минув (${PAYMENT_TIMEOUT_MINUTES} хв). Заявку автоматично скасовано для зручності.\n\nЩоб почати знову, натисніть /start`
          );
        } catch (e) {
          console.error('Cannot timeout user', e.message);
        }
        await db.deleteSession(session.user_id);
      }
    } catch (err) {
      console.error('Timeout cleanup failed:', err.message);
    }
  }, PAYMENT_TIMEOUT_CHECK_MS);
  if (timeoutInterval.unref) timeoutInterval.unref();

  const followupInterval = setInterval(async () => {
    try {
      const pending = await db.getPendingFollowups();
      for (const topic of pending) {
        try {
          await bot.telegram.sendMessage(
            topic.client_chat_id,
            'Чи залишилися у вас додаткові питання по виконаній справі?\n\nЯкщо так, просто виберіть послугу: /start для нової заявки.'
          );
          await db.markFollowupSent(topic.client_chat_id);
        } catch (e) {
          console.error('Cannot send follow-up', e.message);
        }
      }
    } catch (err) {
      console.error('Follow-up cron failed:', err.message);
    }
  }, FOLLOWUP_CHECK_MS);
  if (followupInterval.unref) followupInterval.unref();
}

module.exports = { start };
