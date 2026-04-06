const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('CONNECTED TO VPS');
  
  const botToken = '8713961917:AAFJAnFKiZ5_jMvkIJzRp4F38_j6WN-3MbY';
  const adminChatId = '-1003704423334';
  const dbPath = '/var/data/legalclick/database.sqlite';
  const monobankToken = 'uzfzIW4psGfaOguUkHcwiIFsdHtSO0QJ9sI879VpxFSc';

  const envContent = `BOT_TOKEN=${botToken}
ADMIN_CHAT_ID=${adminChatId}
DB_PATH=${dbPath}
MONOBANK_API_TOKEN=${monobankToken}
`;

  // Use base64 to avoid shell escaping issues with special characters in tokens
  const base64Env = Buffer.from(envContent).toString('base64');
  const cmd = `echo "${base64Env}" | base64 -d > /opt/legalclick/server/.env && cat /opt/legalclick/server/.env && pm2 restart legalclick-bot && pm2 logs legalclick-bot --lines 20 --no-daemon`;

  console.log('Writing .env and restarting bot...');
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => conn.end())
          .on('data', (d) => {
            const output = d.toString();
            process.stdout.write(output);
            if (output.includes('Бот LegalClick успішно запущений')) {
              console.log('\nSUCCESS! Bot is now running correctly.');
              conn.end();
              process.exit(0);
            }
          })
          .stderr.on('data', (d) => process.stderr.write(d.toString()));
  });
}).on('error', (err) => console.error(err)).connect({
  host: '178.104.136.90',
  port: 22,
  username: 'root',
  password: 'Rost27041975!'
});
