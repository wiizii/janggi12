const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});
const port = 3000;

app.use(express.static('public'));

http.listen(port, () => {
	console.log(`server on : http://localhost:${port}/`);
});

var rooms = {};

io.on('connection', (socket) => {
	console.log('user connected: ', socket.id);

	socket.on('disconnect', () => {
		console.log('disconnected');
	});
});
