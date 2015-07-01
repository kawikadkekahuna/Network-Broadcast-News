var net = require('net');
var HOST = '0.0.0.0';
var PORT = 6969;
var CONNECTED_CLIENTS = [];
var socketState;

function clientConnected(socket) {
  var socketName;
  createUsername(socket);
  CONNECTED_CLIENTS.push(socket);

  socket.on('end', function() {
    console.log('client disconnected');

  });

  socket.on('update', function() {

    console.log('updated');
  })

  socket.on('data', function(chunk) {
    if (socketState === 'init') {
      socket.username = chunk;
      socketName = chunk;
      socket.write('WELCOME ' + socketName);
      socketState = 'regular';
    } else if (socketState === 'regular') {
      var message = '\n' + socketName + ' ' + chunk;
      CONNECTED_CLIENTS.forEach(sendMessage(message));
    }
  });
}

function sendMessage(message) {

  process.stdout.write(message);
  return function(client) {
    client.write(message);

  }
}


var server = net.createServer(clientConnected);

server.listen(PORT, function() {
  console.log('Server listening on: ' + HOST + ':' + PORT + '\n');
})

server.on('connection', function(socket) {
  var address = socket.remoteAddress + ':' + socket.remotePort;
  process.stdout.write('CONNECTED: ' + address + '\n');


})

server.on('error', function(error) {
  if (error.code == 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(function() {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});


function createUsername(socket) {
  socketState = 'init';
  socket.write('Welcome to TCP Chat.  Please enter your alias \n');
};