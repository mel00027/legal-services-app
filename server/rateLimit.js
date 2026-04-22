'use strict';

const { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } = require('./config');

const buckets = new Map();

function isRateLimited(userId) {
  if (userId == null) return false;
  const now = Date.now();
  const entry = buckets.get(userId);
  if (!entry || now >= entry.resetAt) {
    buckets.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [userId, entry] of buckets.entries()) {
    if (now >= entry.resetAt) buckets.delete(userId);
  }
}, RATE_LIMIT_WINDOW_MS);
if (cleanup.unref) cleanup.unref();

module.exports = { isRateLimited };
