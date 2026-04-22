#!/usr/bin/env node
'use strict';

/*
 * Diagnostic: dump all users from the bot's SQLite DB.
 * Usage: node scripts/check_db.js
 * Uses DB_PATH from server/.env if set, otherwise defaults from server/db.js.
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', 'server', '.env') });
const db = require('../server/db');

(async () => {
  try {
    await db.initDB();
    const users = await db.db().all('SELECT * FROM users');
    console.log('ALL USERS:', JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
  process.exit(0);
})();
