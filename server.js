var express = require('express')
  , http = require('http');

var app = express();

app.use(express.static(__dirname));
// app.configure(function() {
//     app.use(express.static(__dirname));
//     app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
// });

var server = http.createServer(app);
var io = require('socket.io').listen(server);


io.sockets.on('connection', function(socket) {
  // console.log('New client')
  //recieve client data
    socket.on('playerMove', function(data) {
        // process.stdout.write(data);

        socket.broadcast.emit('playerMove', data);
    });

    socket.on('gameStarted', function(data) {
        // process.stdout.write(data);

        socket.broadcast.emit('gameStarted', data);
    });
});

server.listen(process.env.PORT || 8080);