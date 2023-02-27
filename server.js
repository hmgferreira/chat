const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ["GET", 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS']
    }
})

app.use('/css', express.static('css'))

app.get('/', function(req, res) {
    res.sendFile(__dirname+'/index.html');
});

let messages = [
    {
        text: 'Olá, Philip',
        destination: 'server',
    },
    {
        text: 'Olá, José',
        destination: 'client',
    }
];

io.on('connection', (socket) => {
    console.log(socket.id);
    socket.emit('previousMessages', messages);

    socket.on('server', function(message) {
        messages.push({
            text: message,
            destination: 'server',
        });

        socket.emit('client', {
            text: message,
            destination: 'server',
        });

        socket.broadcast.emit('server', {
            text: message,
            destination: 'server',
        });

        socket.broadcast.emit('client', {
            text: message,
            destination: 'server',
        });
    });

    socket.on('client', function(message) {
        messages.push({
            text: message,
            destination: 'client',
        });

        socket.emit('server', {
            text: message,
            destination: 'client',
        });

        socket.broadcast.emit('client', {
            text: message,
            destination: 'client',
        });

        socket.broadcast.emit('server', {
            text: message,
            destination: 'client',
        });

        
    });
});

http.listen(3000, function() {
    console.log("Listening on port 3000");
});