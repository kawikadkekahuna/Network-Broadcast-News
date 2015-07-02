var net = require('net');
var PORT = 6969;
var FILE_NAME = 'server.logs';
var HOST = '0.0.0.0';
var state;


var socket = net.createConnection({
  port: PORT,
  host: HOST
});

socket.on('end',function(){
  process.stdout.write('Disconnected from server');
  socket.end();
})

socket.on('data', function(message) {
  
  process.stdout.write(message);

});


process.stdin.pipe(socket);
// socket.end();''