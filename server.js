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
var host = null;


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var setHost = function(client) {
    console.log('Setting host to player: ' + client.player.id);
    host = client;
};

var findNewHost = function() {
    if (clients.length > 0) {
        var i = getRandomInt(0, clients.length-1);
        var client = clients[i];

        // Make sure client had time to initialize the player
        if (client) {
            setHost(client);

            console.log('New host: ' + host.player.id);
            io.sockets.emit('setHost', {player: host.player});
        }
    }
};

var getClientHost = function() {
    if (!clients.length) { return; }
    return clients.reduce(function(previousClient, currentClient) { if (previousClient.player.id === host.player.id) { return previousClient; } else if (currentClient.player.id === host.player.id) { return currentClient; }});
};

var findClientBySocket = function(socket) {
    if (!clients.length) { return; }
    return clients.reduce(function(previousClient, currentClient) { if (previousClient.socket === socket) { return previousClient; } else if (currentClient.socket === socket) { return currentClient; }});
};

var addClient = function(client) {
    console.log('Adding player: ' + client.player.id);
    clients.push(client);
};

var removeClient = function(client) {
    console.log('Removing player: ' + client.player.id);

    clients.splice(clients.indexOf(client), 1);
};

// Monitor the clients to make sure they are still defined
var monitorHost = function() {
    if (host) {
        //console.log('Host: ', host.player.id);
    } else {
        findNewHost();
    }

    setTimeout(monitorHost, 100);
};

setTimeout(monitorHost, 100);

var parseEvent = function(socket, event) {
    if (event.key === 'newPlayer') {
        console.log('Handshaking...');

        addClient({socket: socket, player: event.info.player});

        // If it's the first client or there's no hosts, lets set it as the new host
        if (!host) {
            setHost(clients[clients.length-1]);
            console.log('New host: ' + host.player.id);
        }

        socket.emit('setHost', {player: host.player});
    } else {
        //socket.broadcast.emit(event.key, event.info);
    }
};

io.sockets.on('connection', function(socket) {
    console.log('New connection.. waiting for handshake');

    // TODO: give them 10 seconds to identify as a newPlayer, or cut them off

    socket.on('events', function(data) {
        //console.log('Incoming events: ' + data);
        data = JSON.parse(data);

        data.events.forEach(function(event) { parseEvent(socket, event); });

        socket.broadcast.emit('events', data);
    });

    socket.on('disconnect', function() {
        var client = findClientBySocket(socket);

        if (!client) { return; }

        removeClient(client);

        console.log('player left', client.player.id);

        // If this client was the host,
        // and there's at least one more client connected,
        // lets choose a new random host,
        // and broadcast it to everybody
        if (client.player.id === host.player.id) {
            host = null;
            findNewHost();
        }

        io.sockets.emit('removePlayer', {player: client.player});
    });
});

monitorHost();
console.log('Open localhost:8080 on your browser.');
console.log('Listening...');

server.listen(process.env.PORT || 8080);
