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
  console.log('CONNECTED TO VPS');
  try {
    const commands = [
      'rm -rf /opt/legalclick', // Clean any previous attempts
      'git clone git@github.com:mel00027/legal-services-app.git /opt/legalclick',
      'cd /opt/legalclick && npm install',
      'cd /opt/legalclick/server && npm install',
      'cp /opt/legalclick/server/.env.example /opt/legalclick/server/.env'
    ];

    for (const cmd of commands) {
      console.log(`Executing: ${cmd}`);
      const res = await execCmd(cmd);
      if (res.out) console.log(res.out.trim());
      if (res.code !== 0) {
        console.error(`ERROR: Command failed with code ${res.code}`);
        console.error(res.errOut);
        if (cmd.includes('git clone')) throw new Error('Cloning failed');
      }
    }

    // Update .env with real values
    const botToken = '8713961917:AAFJAnFKiZ5_jMvkIJzRp4F38_j6WN-3MbY';
    const adminChatId = '-1003704423334';
    const dbPath = '/var/data/legalclick/database.sqlite';
    const monobankToken = 'uzfzIW4psGfaOguUkHcwiIFsdHtSO0QJ9sI879VpxFSc';

    console.log('Configuring .env...');
    const envContent = `BOT_TOKEN=${botToken}\nADMIN_CHAT_ID=${adminChatId}\nDB_PATH=${dbPath}\nMONOBANK_API_TOKEN=${monobankToken}\n`;
    await execCmd(`echo "${envContent}" > /opt/legalclick/server/.env`);

    console.log('STARTING BOT WITH PM2...');
    await execCmd('cd /opt/legalclick && pm2 start ecosystem.config.js');
    await execCmd('pm2 save');
    await execCmd('pm2 startup | grep "sudo" | bash'); // Attempt auto-startup setup

    console.log('=== DEPLOYMENT COMPLETE ===');
    const status = await execCmd('pm2 list');
    console.log(status.out);

    conn.end();
  } catch (err) {
    console.error('CRITICAL DEPLOYMENT ERROR:', err);
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
