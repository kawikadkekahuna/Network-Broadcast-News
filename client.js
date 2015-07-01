var net = require('net');
var PORT = 6969;
var FILE_NAME = 'server.logs';
var HOST = '0.0.0.0';
var state;


var socket = net.createConnection({
  port: PORT,
  host: HOST
});

socket.on('connection', function(socket) {
  state = 'init';
  process.stdin.write('welcome');
})

socket.on('data', function(message) {
  if (state === 'init') {

  } else {
    process.stdout.write(message);
  }
})

process.stdin.pipe(socket);
// socket.end();''