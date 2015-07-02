var net = require('net');
var HOST = '0.0.0.0';
var PORT = 6969;
var CONNECTED_CLIENTS = [];
var CLIENT_ID = [];
var INIT_STATE = 'init';
var OPENED_STATE = 'opened';
var ADMIN_NAME = 'ADMIN';

function clientConnected(socket) {
  // var socketName;
  createUsername(socket);
  CONNECTED_CLIENTS.push(socket);


  socket.on('data', function(chunk) {
    if (socket.socketState === INIT_STATE) {
      socket.username = chunk.toString().substring(0, chunk.length - 1);
      if (CLIENT_ID.indexOf(socket.username) === -1 && socket.username !== ADMIN_NAME.toLowerCase() && socket.username !== ADMIN_NAME) {
        CLIENT_ID.push(socket.username);
        socket.write('WELCOME ' + socket.username + '\n');
        socket.socketState = OPENED_STATE;
        process.stdout.write(socket.username + ' has joined the chat');
      } else {
        socket.write('Invalid username.  Please enter another alias \n');
      }
    } else if (socket.socketState === OPENED_STATE) {
      var message = '\n' + socket.username + '> ' + chunk;
      CONNECTED_CLIENTS.forEach(sendMessage(message));
    }
  });



  socket.on('end', function() {
    process.stdout.write('\n' + socket.username.toString() + ' has disconnected ' + '\n');
    //Removes socket from connected clients when done
    socket.socketIndex = CONNECTED_CLIENTS.indexOf(socket);
    CONNECTED_CLIENTS.splice(socket.socketIndex, 1);
    socket.destroy();


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
  socket.socketState = INIT_STATE;
  socket.write('Welcome to TCP Chat.  Please enter your alias \n');
};