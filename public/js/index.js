var socket = io();

socket.on('connect', function () {
  console.log('connected to server');
  socket.emit('createMessage', {
    from: 'bala',
    message: 'xerox',
    createAt: 1234
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
  console.log('newMessage', message);
});
