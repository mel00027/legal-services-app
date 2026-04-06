const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('CONNECTED TO VPS');
  const commands = [
    'cd /opt/legalclick && git pull origin master',
    'cd /opt/legalclick && pm2 start ecosystem.config.cjs',
    'pm2 save',
    'pm2 list'
  ];

  let current = 0;
  const execNext = () => {
    if (current >= commands.length) {
      console.log('DONE');
      conn.end();
      return;
    }
    const cmd = commands[current++];
    console.log(`Executing: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) throw err;
      stream.on('close', () => execNext()).on('data', (d) => process.stdout.write(d.toString())).stderr.on('data', (d) => process.stderr.write(d.toString()));
    });
  };
  execNext();
}).on('error', (err) => console.error(err)).connect({
  host: '178.104.136.90',
  port: 22,
  username: 'root',
  password: 'Rost27041975!'
});
