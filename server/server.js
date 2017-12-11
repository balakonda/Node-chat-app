const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));
io.on('connection', (socket) => {
	console.log('New User Connected');
	// socket.emit('newMessage', {
	// 	from: 'mike@example.com',
	// 	to: 'y@gmail.com',
	// 	createAt: 1234
	// });
	socket.on('createMessage', (message) => {
		console.log('createMessage', message);
		io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		});
	});
	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});



server.listen(PORT, () => {
	console.log('App is running at ' + PORT);
});
