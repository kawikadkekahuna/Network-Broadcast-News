var net = require('net');
var PORT = 6969;
var FILE_NAME = 'server.logs';
var HOST = '10.0.1.24';
var state;


var socket = net.createConnection({
  port: PORT,
  host: HOST
});

socket.on('end',function(){
  process.stdout.write('You have been kicked');
})

socket.on('data', function(message) {
  
  process.stdout.write(message);

});


process.stdin.pipe(socket);
// socket.end();''