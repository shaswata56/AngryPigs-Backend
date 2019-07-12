var app =  require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var players = [];
var port = process.env.PORT || 8080;
var host = process.env.host || '0.0.0.0';

server.listen(port, host, () => {
    console.log("Server is up...");
});

io.on('connection', (socket) => {
    console.log("Player Connected!");
    socket.emit('socketID', { id: socket.id });
    socket.emit('getPlayers', players);
    socket.broadcast.emit('newPlayer', { id: socket.id });
    socket.on('playerMoved', (data) => {
        data.id = socket.id;
        socket.broadcast.emit('playerMoved', data);

        for(let i = 0; i < players.length; i++) {
            if(players[i].id == data.id) {
                players[i].x = data.x;
                players[i].y = data.y;
                players[i].touchX = data.touchX;
                players[i].touchY = data.touchY;
            }
        }
    })
    socket.on('disconnect', () => {
        console.log("Player Disconnected!");
        socket.broadcast.emit('playerDisconnected', { id: socket.id });
        for(let i = 0; i < players.length; i++) {
            if(players[i].id == socket.id) {
                players.splice(i, 1);
            }
        }
    });
    players.push(new player(socket.id, 0, 0, 0, 0));
});

class player {
    constructor(id, x, y, touchX, touchY) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.touchX = touchX;
        this.touchY = touchY;
    }
}
