const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('SUCCESS: Connection established with new password!');
  conn.end();
}).on('error', (err) => {
  console.log('FAILURE: Could not connect with new password. ' + err.message);
  conn.end();
}).connect({
  host: '178.104.136.90',
  port: 22,
  username: 'root',
  password: 'Rost27041975!'
});
