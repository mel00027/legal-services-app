const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('cd /opt/legalclick && pm2 start ecosystem.config.js && pm2 list && pm2 logs legalclick-bot --lines 20 --no-daemon', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code) => {
      console.log('Stream closed with code ' + code);
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data.toString());
      if (data.toString().includes('Бот LegalClick успішно запущений')) {
          console.log('\nVERIFIED: Bot is running!');
          conn.end();
          process.exit(0);
      }
    }).stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });
  });
}).on('error', (err) => {
  console.error('CONNECTION ERROR:', err.message);
}).connect({
  host: '178.104.136.90',
  port: 22,
  username: 'root',
  password: 'Rost27041975!'
});
