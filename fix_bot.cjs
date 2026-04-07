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
    // Step 1: Check what's in server/package.json
    console.log('📋 Server package.json:');
    const pkg = await execCmd('cat /opt/legalclick/server/package.json');
    console.log(pkg.out);

    // Step 2: Check which modules are missing
    console.log('\n🔍 Testing require of dotenv...');
    const testDotenv = await execCmd('cd /opt/legalclick/server && node -e "require(\'dotenv\')" 2>&1');
    console.log(testDotenv.out || 'OK');
    if (testDotenv.errOut) console.log('ERROR:', testDotenv.errOut);

    console.log('\n🔍 Testing require of telegraf...');
    const testTelegraf = await execCmd('cd /opt/legalclick/server && node -e "require(\'telegraf\')" 2>&1');
    console.log(testTelegraf.out || 'OK');
    if (testTelegraf.errOut) console.log('ERROR:', testTelegraf.errOut);

    console.log('\n🔍 Testing require of sqlite3...');
    const testSqlite = await execCmd('cd /opt/legalclick/server && node -e "require(\'sqlite3\')" 2>&1');
    console.log(testSqlite.out || 'OK');
    if (testSqlite.errOut) console.log('ERROR:', testSqlite.errOut);

    console.log('\n🔍 Testing require of sqlite...');
    const testSqliteOpen = await execCmd('cd /opt/legalclick/server && node -e "require(\'sqlite\')" 2>&1');
    console.log(testSqliteOpen.out || 'OK');
    if (testSqliteOpen.errOut) console.log('ERROR:', testSqliteOpen.errOut);

    // Step 3: Install missing deps
    console.log('\n📦 Installing all server dependencies...');
    const install = await execCmd('cd /opt/legalclick/server && npm install dotenv telegraf sqlite3 sqlite 2>&1');
    console.log(install.out);
    if (install.errOut) console.error(install.errOut);

    // Step 4: Stop & restart
    console.log('\n🛑 Stopping PM2...');
    const stop = await execCmd('pm2 delete all 2>&1');
    console.log(stop.out);

    console.log('\n🚀 Starting bot...');
    const start = await execCmd('cd /opt/legalclick && pm2 start ecosystem.config.cjs');
    console.log(start.out);
    if (start.errOut) console.error(start.errOut);

    // Wait for startup
    await new Promise(r => setTimeout(r, 5000));

    // Step 5: Check status
    console.log('\n📊 Final PM2 Status:');
    const status = await execCmd('pm2 list');
    console.log(status.out);

    // Step 6: Check logs
    console.log('\n📜 Output logs:');
    const logs = await execCmd('pm2 logs legalclick-bot --out --lines 15 --nostream 2>&1');
    console.log(logs.out);

    console.log('\n📜 Error logs:');
    const errLogs = await execCmd('pm2 logs legalclick-bot --err --lines 15 --nostream 2>&1');
    console.log(errLogs.out);

    // Step 7: Save
    console.log('\n💾 Saving PM2...');
    const save = await execCmd('pm2 save');
    console.log(save.out);

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
