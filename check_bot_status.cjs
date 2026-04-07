const { Client } = require('ssh2');

const conn = new Client();

const execCmd = (cmd) => {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '', errOut = '';
      stream.on('close', (code) => resolve({ code, out, errOut }))
            .on('data', (d) => out += d)
            .stderr.on('data', (d) => errOut += d);
    });
  });
};

conn.on('ready', async () => {
  console.log('✅ CONNECTED TO VPS\n');
  try {
    // Quick status check
    console.log('📊 PM2 Status:');
    const status = await execCmd('pm2 list');
    console.log(status.out);

    console.log('\n📜 Last 20 output lines:');
    const logs = await execCmd('pm2 logs legalclick-bot --out --lines 20 --nostream 2>&1');
    console.log(logs.out);

    console.log('\n📜 Last 5 error lines:');
    const errLogs = await execCmd('pm2 logs legalclick-bot --err --lines 5 --nostream 2>&1');
    console.log(errLogs.out);

    conn.end();
  } catch (err) {
    console.error('CRITICAL ERROR:', err);
    conn.end();
  }
}).on('error', (err) => {
  console.error('CONNECTION ERROR:', err.message);
}).connect({
  host: '178.104.136.90',
  port: 22,
  username: 'root',
  password: 'Rost27041975!'
});
