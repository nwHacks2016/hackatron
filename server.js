var express = require('express');
var http = require('http');

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
    socket.on('updateClientPosition', function(data) {
        // process.stdout.write(data);
        socket.broadcast.emit('updateClientPosition', data);
    });

    socket.on('newPlayer', function(data) {
        // process.stdout.write(data);
        console.log(JSON.parse(data));
        socket.broadcast.emit('newPlayer', data);
    });

    socket.on('welcomePlayer', function(data) {
        socket.broadcast.emit('welcomePlayer', data);
    });

    socket.on('tronKilled', function(data) {
        socket.broadcast.emit('tronKilled', data);
    });

    socket.on('blockSpawned', function(data) {
        socket.broadcast.emit('blockSpawned', data);
    });
});

console.log('\nOpen localhost:8080 on your browser.');
console.log('.\n.\n.');
console.log('Listening...');
server.listen(process.env.PORT || 8080);
