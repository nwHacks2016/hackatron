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
var clients = [];
var hostClientId = null;


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var findNewHost = function() {
    if (clients.length > 0) {
        hostClientId = getRandomInt(0, clients.length-1);

        // Make sure client had time to initialize the player
        if (clients[hostClientId]) {
            var playerId = clients[hostClientId].playerId;
            console.log('New host: ' + playerId);
            io.socket.emit('setHost', JSON.stringify({playerId: playerId}));
        }
    }
};

// Monitor the clients to make sure they are still defined
setTimeout(function() {
    if (!clients[hostClientId]) {
        hostClientId = null;
        findNewHost();
    }
}, 40);

var parseEvent = function(socket, event) {
    if (event.key === 'newPlayer') {
        socket.playerId = event.info.playerId;
        clients.push(socket);

        console.log('New player: ' + socket.playerId);

        // If it's the first client, then lets set it as the new host
        if (hostClientId === null) {
            hostClientId = 0;
            console.log('New host: ' + clients[hostClientId].playerId);
        }

        if (!clients[hostClientId]) {
            hostClientId = null;
            findNewHost();
        }

        socket.emit('setHost', {playerId: clients[hostClientId].playerId});
        socket.broadcast.emit('newPlayer', event.info);
    } else {
        socket.broadcast.emit(event.key, event.info);
    }
};

io.sockets.on('connection', function(socket) {
    console.log('New client');

    socket.on('events', function(data) {
        console.log('Incoming events: ' + data);
        data = JSON.parse(data);

        data.events.forEach(function(event) { parseEvent(socket, event); });
    });

    socket.on('disconnect', function() {
        var clientId = clients.indexOf(socket);
        clients.splice(clientId, 1);
        console.log('aaaa', clientId);

        // If this client was the host,
        // and there's at least one more client connected,
        // lets choose a new random host,
        // and broadcast it to everybody
        if (clientId === hostClientId) {
            hostClientId = null;
            findNewHost();
        }
    });
});

console.log('\nOpen localhost:8080 on your browser.');
console.log('.\n.\n.');
console.log('Listening...');

server.listen(process.env.PORT || 8080);
