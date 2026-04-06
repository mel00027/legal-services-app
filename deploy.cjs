const { Client } = require('ssh2');

const conn = new Client();

const execCommand = (client, cmd) => {
  return new Promise((resolve, reject) => {
    client.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '', errOut = '';
      stream.on('close', (code, signal) => {
        resolve({ code, out, errOut });
      }).on('data', (data) => {
        out += data;
      }).stderr.on('data', (data) => {
        errOut += data;
      });
    });
  });
};

conn.on('ready', async () => {
  console.log('Client :: ready');
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
      const res = await execCommand(conn, cmd);
      if (res.out) console.log(res.out.trim());
      if (res.code !== 0) console.log(`Exited with code ${res.code}`, res.errOut);
    }

    console.log("Fetching deploy key...");
    const keyInfo = await execCommand(conn, 'cat /root/.ssh/id_ed25519.pub');
    console.log('=== DEPLOY KEY ===\n' + keyInfo.out.trim() + '\n==================');

    conn.end();
  } catch (e) {
    console.error(e);
    conn.end();
  }
}).connect({
  host: '178.104.136.90',
  port: 22,
  username: 'root',
  password: 'sLN4Nme4R4EmidwVccsu'
});
