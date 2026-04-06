const { Client } = require('ssh2');

async function changePassword() {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      conn.shell({ term: 'xterm' }, (err, stream) => {
        if (err) return reject(err);
        
        let output = '';
        stream.on('data', (data) => {
          const str = data.toString();
          output += str;
          process.stdout.write(str);
          
          if (str.includes('(current) UNIX password:')) {
            stream.write('sLN4Nme4R4EmidwVccsu\n');
          } else if (str.includes('New password:')) {
            stream.write('Rost27041975!\n');
          } else if (str.includes('Retype new password:')) {
            stream.write('Rost27041975!\n');
          } else if (str.includes('root@') && output.includes('password updated successfully')) {
             console.log("\nPassword changed successfully.");
             conn.end();
             resolve();
          } else if (str.includes('root@') && !output.includes('password updated')) {
            // Already logged in without prompt?
             conn.end();
             resolve();
          }
        });
      });
    }).on('error', reject).connect({
      host: '178.104.136.90',
      port: 22,
      username: 'root',
      password: 'sLN4Nme4R4EmidwVccsu'
    });
  });
}

const execCommand = (client, cmd) => {
  return new Promise((resolve, reject) => {
    client.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '', errOut = '';
      stream.on('close', (code) => resolve({ code, out, errOut }))
            .on('data', (d) => out += d)
            .stderr.on('data', (d) => errOut += d);
    });
  });
};

async function setupServer() {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', async () => {
      console.log('Connected with new password.');
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
          if (res.code !== 0) console.log(`Exited with ${res.code}`, res.errOut);
        }

        const keyInfo = await execCommand(conn, 'cat /root/.ssh/id_ed25519.pub');
        console.log('=== DEPLOY KEY ===\n' + keyInfo.out.trim() + '\n==================');
        conn.end();
        resolve();
      } catch(e) {
        conn.end();
        reject(e);
      }
    }).on('error', reject).connect({
      host: '178.104.136.90',
      port: 22,
      username: 'root',
      password: 'Rost27041975!'
    });
  });
}

async function run() {
  try {
    console.log("Stage 1: Changing password...");
    try {
      await changePassword();
    } catch(e) {
       console.log("Could not log in with old password, maybe it was already changed.");
    }
    console.log("\nStage 2: Running setup...");
    await setupServer();
  } catch(e) {
    console.error("Setup failed:", e);
  }
}

run();
