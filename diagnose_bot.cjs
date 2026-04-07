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
    // 1. Check if PM2 is running and bot status
    console.log('=== PM2 STATUS ===');
    const pm2List = await execCmd('pm2 list');
    console.log(pm2List.out);
    if (pm2List.errOut) console.error(pm2List.errOut);

    // 2. Check recent PM2 error logs
    console.log('\n=== PM2 ERROR LOGS (last 50 lines) ===');
    const errLogs = await execCmd('pm2 logs legalclick-bot --err --lines 50 --nostream 2>&1 || echo "No error logs"');
    console.log(errLogs.out);
    if (errLogs.errOut) console.error(errLogs.errOut);

    // 3. Check recent PM2 output logs
    console.log('\n=== PM2 OUTPUT LOGS (last 30 lines) ===');
    const outLogs = await execCmd('pm2 logs legalclick-bot --out --lines 30 --nostream 2>&1 || echo "No output logs"');
    console.log(outLogs.out);
    if (outLogs.errOut) console.error(outLogs.errOut);

    // 4. Check if the code exists
    console.log('\n=== PROJECT FILES ===');
    const files = await execCmd('ls -la /opt/legalclick/ 2>&1 || echo "Directory not found"');
    console.log(files.out);

    // 5. Check if server directory exists and has node_modules
    console.log('\n=== SERVER DIR ===');
    const serverDir = await execCmd('ls -la /opt/legalclick/server/ 2>&1 || echo "Server dir not found"');
    console.log(serverDir.out);

    // 6. Check .env file on VPS
    console.log('\n=== ENV FILE ===');
    const envFile = await execCmd('cat /opt/legalclick/server/.env 2>&1 || echo "No .env file"');
    console.log(envFile.out);

    // 7. Check if node is installed
    console.log('\n=== NODE VERSION ===');
    const nodeVer = await execCmd('node --version 2>&1');
    console.log(nodeVer.out);

    // 8. Check ecosystem config on server
    console.log('\n=== ECOSYSTEM CONFIG ===');
    const ecoConfig = await execCmd('cat /opt/legalclick/ecosystem.config.cjs 2>&1 || echo "No ecosystem config"');
    console.log(ecoConfig.out);

    // 9. Check bot_errors.log on server
    console.log('\n=== BOT ERRORS LOG ===');
    const botErrors = await execCmd('cat /opt/legalclick/server/bot_errors.log 2>&1 || echo "No bot errors log"');
    console.log(botErrors.out);

    // 10. Try to check if process is listening
    console.log('\n=== RUNNING NODE PROCESSES ===');
    const nodeProcs = await execCmd('ps aux | grep node | grep -v grep 2>&1');
    console.log(nodeProcs.out);

    // 11. Check disk space
    console.log('\n=== DISK SPACE ===');
    const disk = await execCmd('df -h / 2>&1');
    console.log(disk.out);

    // 12. Check memory
    console.log('\n=== MEMORY ===');
    const mem = await execCmd('free -m 2>&1');
    console.log(mem.out);

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
