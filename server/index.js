'use strict';

// ── Boot: validate environment before anything else ──────────────
const config = require('./config');
const logger = require('./logger');
const { Telegraf } = require('telegraf');
const db = require('./db');

// Wire up global error logger (replaces raw console.error → async file)
logger.install();

const bot = new Telegraf(config.BOT_TOKEN);

// ── Middleware (order matters!) ──────────────────────────────────
const sessionIsolation = require('./middleware/sessionIsolation');
bot.use(sessionIsolation);

// ── Handlers ────────────────────────────────────────────────────
// Admin MUST be registered before client so that bot.on('message')
// in admin.js (which forwards admin→client) runs first and calls
// next() only when the message is NOT from an admin chat.
const adminHandlers = require('./handlers/admin');
const clientHandlers = require('./handlers/client');
adminHandlers.register(bot);
clientHandlers.register(bot);

// ── Global error boundary (PM2-safe) ────────────────────────────
bot.catch((err, ctx) => {
  console.error(`[Error Boundary] ${ctx.updateType}:`, err.message);
});

// ── Launch ──────────────────────────────────────────────────────
db.initDB()
  .then(() => {
    // Start cron jobs (payment timeouts, follow-ups)
    const cron = require('./cron');
    cron.start(bot);

    return bot.launch();
  })
  .then(() => {
    console.log('✅ Бот LegalClick успішно запущений (модульна архітектура, WAL, CAS)!');
  })
  .catch((err) => {
    console.error('❌ Критична помилка запуску:', err);
    process.exit(1);
  });

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
