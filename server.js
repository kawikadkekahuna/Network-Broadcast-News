var net = require('net');
var HOST = '0.0.0.0';
var PORT = 6969;
var CONNECTED_CLIENTS = [];
var CLIENT_ID = [];
var INIT_STATE = 'init';
var OPENED_STATE = 'opened';
var ADMIN_NAME = 'ADMIN';
var POWER = '/';

function clientConnected(socket) {
  var CURRENT_STATE;
  createUsername(socket);


  socket.on('data', function(chunk) {
    switch (CURRENT_STATE) {
      case INIT_STATE:
        init(chunk);
        break;

      case OPENED_STATE:
        relayMessage(chunk);
    }

  });

  socket.on('end', function() {
    destroySocket(socket);

  });

  function createUsername(socket) {
    CURRENT_STATE = INIT_STATE;
    socket.write('Welcome to TCP Chat.  Please enter your alias \n');
  };

  function init(chunk) {
    socket.username = chunk.toString().substring(0, chunk.length - 1);
    if (CLIENT_ID.indexOf(socket.username) === -1 && socket.username !== ADMIN_NAME.toLowerCase() && socket.username !== ADMIN_NAME && socket.username !== '[ADMIN]' && socket.username !== '[admin] && ') {
      CLIENT_ID.push(socket.username);
      CONNECTED_CLIENTS.push(socket);
      socket.write('WELCOME ' + socket.username + '\n');
      process.stdout.write(socket.username + ' has joined the chat \n');
      CURRENT_STATE = OPENED_STATE;
    } else {
      socket.write('Invalid username.  Please enter another alias \n');
    }
  }

  function relayMessage(chunk) {
    var message = '\n' + socket.username + '> ' + chunk;
    CONNECTED_CLIENTS.forEach(sendMessage(message));
  }

  function sendMessage(message) {

    process.stdout.write(message);

    return function(client) {
      client.write(message);

    }
  }
}

var server = net.createServer(clientConnected);

server.listen(PORT, function() {

  console.log('Server listening on: ' + HOST + ':' + PORT + '\n');

})

server.on('connection', function(socket) {
  var address = socket.remoteAddress + ':' + socket.remotePort + '\n';
  process.stdout.write('CONNECTED: ' + address);

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

process.stdin.on('data', function(chunk) {
  if (chunk.toString().charAt(0) === POWER) {
    var powerCommand = chunk.toString().substring(0, chunk.toString().indexOf(' '));
    var powerDestination = chunk.toString().substring(chunk.toString().indexOf(' ') + 1, chunk.length - 1);

    switch (powerCommand) {
      case '/kick':
        try {
          var socketIndex = CLIENT_ID.indexOf(powerDestination);
          destroySocket(CONNECTED_CLIENTS[socketIndex]);
        } catch (e) {
          console.log('Could not find target.  Try again');
        }
        break;
      case '/ls':
        try {
          console.log(CLIENT_ID);
        } catch (e) {
          console.log('Could not find target.  Try again');
        }
        break;
      case '/yelp':
        try {
          console.log(CONNECTED_CLIENTS);
        } catch (e) {
          console.log('Could not find target.  Try again');
        }
        break;

    }
  } else {
    relayToServer(chunk)
  }

})

function relayToServer(chunk) {
  process.stdout.write('[' + ADMIN_NAME + ']' + chunk);
  CONNECTED_CLIENTS.forEach(function(socket) {
    socket.write('[' + ADMIN_NAME + ']' + chunk);
  });
}

function destroySocket(socket) {
  if (socket.username) {
  socket.socketIndex = CONNECTED_CLIENTS.indexOf(socket);
    process.stdout.write('\n' + socket.username.toString() + ' has disconnected ' + '\n');
    //Removes socket from connected clients when done
    CLIENT_ID.splice(socket.socketIndex, 1);
    console.log('CLIENT_ID', CLIENT_ID);
  CONNECTED_CLIENTS.splice(socket.socketIndex, 1);
  socket.destroy();
  }

}