const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 5000;
// rename v4 function to make more sense when referenced in the code
const {v4: uuidV4} = require('uuid');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

// dynamic parameter injected into url
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room});
})

io.on('connection', socket => {
  // whenever we join a room
  socket.on('join-room', (roomId, userId) => {
    // console.log(roomId, userId);
    // current socket joins the room
    socket.join(roomId);
    // send message to a room we are in (broadcast to all)
    socket.to(roomId).broadcast.emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-dissconnected', userId);
    });
  })
});

server.listen(port, () => console.log('listening on port ' + port));