var net = require('net');
var PORT = 6969;
var FILE_NAME = 'server.logs';
var HOST = '0.0.0.0';


var socket = net.createConnection({
  port: PORT,
  host: HOST
  });

// socket.addListener('update');

socket.on('data',function(message){
  process.stdout.write(message);
})

process.stdin.pipe(socket);
// socket.end();''
