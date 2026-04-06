const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

(async () => {
  const db = await open({ filename: './database.sqlite', driver: sqlite3.Database });
  const users = await db.all('SELECT * FROM users');
  console.log('ALL USERS:', JSON.stringify(users, null, 2));
})();
