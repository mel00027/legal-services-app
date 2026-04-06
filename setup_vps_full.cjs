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
      'curl -fsSL https://deb.nodesource.com/setup_20.x | bash -',
      'apt-get install -y nodejs git',
      'npm i -g pm2',
      'mkdir -p /var/data/legalclick',
      'if [ ! -f /root/.ssh/id_ed25519 ]; then ssh-keygen -t ed25519 -N "" -f /root/.ssh/id_ed25519; fi',
      'ssh-keyscan github.com >> /root/.ssh/known_hosts'
    ];

    for (const cmd of commands) {
      console.log(`Executing: ${cmd}`);
      const res = await execCmd(cmd);
      console.log(res.out.trim());
      if (res.code !== 0) {
        console.error(`ERROR: Command failed with code ${res.code}`);
        console.error(res.errOut);
      }
    }

    console.log('FETCHING DEPLOY KEY...');
    const key = await execCmd('cat /root/.ssh/id_ed25519.pub');
    console.log('=== DEPLOY KEY FOR GITHUB ===\n' + key.out.trim() + '\n=============================');

    conn.end();
  } catch (err) {
    console.error('CRITICAL SETUP ERROR:', err);
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
