const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected with old password. Changing password...');
  conn.shell((err, stream) => {
    if (err) throw err;
    let dataBuffer = '';
    stream.on('data', (d) => {
      dataBuffer += d.toString();
      process.stdout.write(d.toString());
      if (dataBuffer.includes('Current password:')) {
        stream.write('sLN4Nme4R4EmidwVccsu\n');
        dataBuffer = '';
      } else if (dataBuffer.includes('New password:')) {
        stream.write('Rost27041975!\n');
        dataBuffer = '';
      } else if (dataBuffer.includes('Retype new password:')) {
        stream.write('Rost27041975!\n');
        dataBuffer = '';
      } else if (dataBuffer.includes('passwd: password updated successfully')) {
        console.log('SUCCESS: Password updated!');
        conn.end();
        process.exit(0);
      }
    });
    // Wait for the shell to prompt
  });
}).on('error', (err) => {
  console.error('Connection error with old password:', err.message);
  process.exit(1);
}).connect({
  host: '178.104.136.90',
  port: 22,
  username: 'root',
  password: 'sLN4Nme4R4EmidwVccsu'
});
