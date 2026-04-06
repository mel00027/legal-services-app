const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

// Database path: use DB_PATH from .env, else persistent dir outside codebase
const DEFAULT_DB_DIR = process.platform === 'win32' 
  ? path.join(__dirname) // Local dev: same folder
  : '/var/data/legalclick'; // Production: persistent dir outside deploy

const DB_DIR = process.env.DB_PATH 
  ? path.dirname(process.env.DB_PATH) 
  : DEFAULT_DB_DIR;

const DB_PATH = process.env.DB_PATH || path.join(DB_DIR, 'database.sqlite');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let db;

async function initDB() {
  db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  // Table topics
  await db.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_chat_id INTEGER UNIQUE,
      thread_id INTEGER,
      lawyer_user_id INTEGER,
      is_open INTEGER DEFAULT 1,
      closed_at DATETIME,
      followup_sent INTEGER DEFAULT 0
    )
  `);
  
  try {
    await db.exec('ALTER TABLE topics ADD COLUMN followup_sent INTEGER DEFAULT 0');
  } catch (e) {
    // Column might already exist, ignore
  }

  // Table users
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY,
      agreement_status INTEGER DEFAULT 0,
      agreement_date DATETIME
    )
  `);

  // Table sessions
  await db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      user_id INTEGER PRIMARY KEY,
      chat_id INTEGER,
      status TEXT,
      category TEXT,
      description_text TEXT,
      description_media_id TEXT,
      updated_at INTEGER,
      invoice_id TEXT,
      receipt_msg_id INTEGER,
      extra INTEGER DEFAULT 0,
      amount INTEGER
    )
  `);

  // Table admin_states (for handling topic admin steps like extra payment)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS admin_states (
      thread_id INTEGER PRIMARY KEY,
      client_id INTEGER,
      step TEXT
    )
  `);

  console.log(`✅ Database initialized: ${DB_PATH}`);
}

/* USER FUNCTIONS */
async function getUser(userId) {
  return await db.get('SELECT * FROM users WHERE user_id = ?', [userId]);
}

async function saveUserAgreement(userId) {
  await db.run(`
    INSERT INTO users (user_id, agreement_status, agreement_date)
    VALUES (?, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET agreement_status = 1, agreement_date = CURRENT_TIMESTAMP
  `, [userId]);
}

/* SESSION FUNCTIONS */
async function getSession(userId) {
  const row = await db.get('SELECT * FROM sessions WHERE user_id = ?', [userId]);
  return row ? row : null;
}

async function saveSession(userId, data) {
  const now = Date.now();
  await db.run(`
    INSERT INTO sessions (
      user_id, chat_id, status, category, description_text, description_media_id, updated_at, invoice_id, receipt_msg_id, extra, amount
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET 
      chat_id = excluded.chat_id,
      status = excluded.status,
      category = excluded.category,
      description_text = excluded.description_text,
      description_media_id = excluded.description_media_id,
      updated_at = excluded.updated_at,
      invoice_id = excluded.invoice_id,
      receipt_msg_id = excluded.receipt_msg_id,
      extra = excluded.extra,
      amount = excluded.amount
  `, [
    userId, 
    data.chat_id || null, 
    data.status || 'start', 
    data.category || null, 
    data.description_text || null, 
    data.description_media_id || null, 
    now,
    data.invoice_id || null,
    data.receipt_msg_id || null,
    data.extra ? 1 : 0,
    data.amount || null
  ]);
}

async function updateSessionStatus(userId, status) {
  await db.run('UPDATE sessions SET status = ?, updated_at = ? WHERE user_id = ?', [status, Date.now(), userId]);
}

async function deleteSession(userId) {
  await db.run('DELETE FROM sessions WHERE user_id = ?', [userId]);
}

async function getOldSessions(minutes) {
  const cutoff = Date.now() - (minutes * 60 * 1000);
  const rows = await db.all('SELECT * FROM sessions WHERE status = ? AND updated_at <= ?', ['awaiting_receipt', cutoff]);
  return rows;
}

/* TOPICS FUNCTIONS */
async function getTopic(clientChatId) {
  const row = await db.get('SELECT * FROM topics WHERE client_chat_id = ?', [clientChatId]);
  return row ? row : null;
}

async function saveTopic(clientChatId, threadId) {
  if (threadId === undefined || threadId === null) {
    await db.run('DELETE FROM topics WHERE client_chat_id = ?', [clientChatId]);
  } else {
    await db.run(`
      INSERT INTO topics (client_chat_id, thread_id, is_open) 
      VALUES (?, ?, 1) 
      ON CONFLICT(client_chat_id) DO UPDATE SET 
      thread_id=excluded.thread_id,
      is_open=1
    `, [clientChatId, threadId]);
  }
}

async function getTopicByThreadId(threadId) {
  const row = await db.get('SELECT * FROM topics WHERE thread_id = ?', [threadId]);
  return row ? row : null;
}

async function updateTopicIsOpen(clientChatId, isOpen) {
  if (isOpen) {
    await db.run('UPDATE topics SET is_open = 1, closed_at = NULL WHERE client_chat_id = ?', [clientChatId]);
  } else {
    await db.run('UPDATE topics SET is_open = 0, closed_at = CURRENT_TIMESTAMP WHERE client_chat_id = ?', [clientChatId]);
  }
}

async function setTopicLawyer(clientChatId, lawyerUserId) {
  await db.run('UPDATE topics SET lawyer_user_id = ? WHERE client_chat_id = ?', [lawyerUserId, clientChatId]);
}

async function getPendingFollowups() {
  // SQLite CURRENT_TIMESTAMP is UTC. "-24 hours" modifier checks older than 24h.
  return await db.all("SELECT * FROM topics WHERE is_open = 0 AND followup_sent = 0 AND closed_at <= datetime('now', '-24 hours')");
}

async function markFollowupSent(clientChatId) {
  await db.run('UPDATE topics SET followup_sent = 1 WHERE client_chat_id = ?', [clientChatId]);
}

/* ADMIN STATES FUNCTIONS */
async function getAdminState(threadId) {
  return await db.get('SELECT * FROM admin_states WHERE thread_id = ?', [threadId]);
}

async function saveAdminState(threadId, clientId, step) {
  await db.run(`
    INSERT INTO admin_states (thread_id, client_id, step)
    VALUES (?, ?, ?)
    ON CONFLICT(thread_id) DO UPDATE SET client_id=excluded.client_id, step=excluded.step
  `, [threadId, clientId, step]);
}

async function deleteAdminState(threadId) {
  await db.run('DELETE FROM admin_states WHERE thread_id = ?', [threadId]);
}

module.exports = {
  db: () => db,
  initDB,
  getUser,
  saveUserAgreement,
  getTopic,
  saveTopic,
  getTopicByThreadId,
  updateTopicIsOpen,
  setTopicLawyer,
  getPendingFollowups,
  markFollowupSent,
  getSession,
  saveSession,
  updateSessionStatus,
  deleteSession,
  getOldSessions,
  getAdminState,
  saveAdminState,
  deleteAdminState
};
