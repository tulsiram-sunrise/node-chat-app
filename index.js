const express = require('express');


const app = express();

app.use(express.static('public'));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`App is listening on port ${port}`));

const io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('Now socket connection is live', socket.id);

    socket.broadcast.emit('new_conn', {
        id: socket.id
    });

    socket.on('chat', data => {
        data.id = socket.id;
        io.sockets.emit('chat', data);
    })

    socket.on('typing', data => {
        socket.broadcast.emit('typing', data);
    });

    socket.on('not_typing', data => {
        socket.broadcast.emit('typing', data);
    });
});