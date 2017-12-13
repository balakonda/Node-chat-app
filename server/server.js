const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isValidString} = require('./utils/validations');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));
var users = new Users();;
io.on('connection', (socket) => {
  console.log('New user connected');
  socket.on('join', (params, callback) => {
    if(!isValidString(params.room) || !isValidString(params.name)) {
      callback('Name and Room are required');
    }
    // var userlist = users.getUserList();
    // if(userlist.indexOf(params.name) < 0) {
    //   return callback('Name already taken');
    // }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    //room name --> 'The Office'
    //io.to('The Office').emit --> send to all in the room
    //socket.broadcast.emit('The Office') --> Send to all in room except current user
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has been joined`));
    callback();

  });

  // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
  //
  // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message, callback) => {
    //console.log('createMessage', message);
    //io.emit('newMessage', generateMessage(message.from, message.text));
    var user = users.getUser(socket.id);
    if(user && isValidString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(message.from, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if(user && isValidString(message.text)) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
    callback();
    //io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
    var user = users.removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
