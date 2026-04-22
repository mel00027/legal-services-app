'use strict';

require('dotenv').config();

function required(name) {
  const v = process.env[name];
  if (v == null || !String(v).trim()) {
    throw new Error(`Missing ${name} in .env — refuse to start.`);
  }
  return String(v).trim();
}

function requiredChatId(name) {
  const v = required(name);
  if (!/^-?\d+$/.test(v)) {
    throw new Error(`${name} must be a numeric Telegram chat ID (got: "${v}")`);
  }
  return v;
}

function requiredUrl(name) {
  const v = required(name);
  try {
    new URL(v);
  } catch {
    throw new Error(`${name} must be a valid URL (got: "${v}")`);
  }
  return v;
}

const BOT_TOKEN = required('BOT_TOKEN');
const ADMIN_CHAT_ID = requiredChatId('ADMIN_CHAT_ID');
const CASES_CHAT_ID = process.env.CASES_CHAT_ID ? requiredChatId('CASES_CHAT_ID') : ADMIN_CHAT_ID;
const MONOBANK_PAYMENT_LINK = requiredUrl('MONOBANK_PAYMENT_LINK');
const DB_PATH = process.env.DB_PATH || null;

const ADMIN_CHAT_IDS = Array.from(new Set([ADMIN_CHAT_ID, CASES_CHAT_ID]));

module.exports = {
  BOT_TOKEN,
  ADMIN_CHAT_ID,
  CASES_CHAT_ID,
  ADMIN_CHAT_IDS,
  MONOBANK_PAYMENT_LINK,
  DB_PATH,

  CONSULTATION_PRICE: 1000,
  MAX_MESSAGE_LENGTH: 4000,
  RATE_LIMIT_MAX: 20,
  RATE_LIMIT_WINDOW_MS: 60 * 1000,
  PAYMENT_TIMEOUT_MINUTES: 30,
  PAYMENT_TIMEOUT_CHECK_MS: 5 * 60 * 1000,
  FOLLOWUP_CHECK_MS: 60 * 60 * 1000,
  MEDIA_GROUP_CACHE_MS: 60 * 1000,
  MIN_EXTRA_PAYMENT: 1,
  MAX_EXTRA_PAYMENT: 1_000_000,
};
