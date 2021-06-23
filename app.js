const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const port = 3000;

app.set('views', __dirname + '/views');

//view engine ejs : for routing html
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'public')));

http.listen(port, () => {
	console.log(`server on : http://localhost:${port}/`);
});

//////////////////////////////////////////
//								routes								//
//////////////////////////////////////////
const route = require('./routes/routes.js');
app.use('/', route);
// app.use((req, res, next) => {
// 	res.status(404).send('404 NOT FOUND');
// });
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('server error');
});

//////////////////////////////////////////
//								socket								//
//////////////////////////////////////////
const io = require('socket.io')(http);

let userRooms = {
	roomId: 1,
	makeRoom: function () {
		userRooms[this.roomId++] = {
			users: [],
		};
		return this.roomId - 1;
	},
	joinUser: function (roomId, user) {
		userRooms[roomId].users.push(user);
	},
};

io.on('connection', (socket) => {
	console.log('a user connected');
	io.emit('population', io.eio.clientsCount);

	io.emit('room-init', userRooms);

	socket.on('message', (msg) => {
		io.emit('message', msg);
	});

	socket.on('room-message', (msg) => {
		io.to(msg.roomId).emit('message', msg.data);
	});

	socket.on('create-room', (id) => {
		let roomId = userRooms.makeRoom();
		userRooms.joinUser(roomId, id);
		io.to(id).emit('redirect', roomId);
		socket.join(roomId);
		io.emit('update-room', roomId);
	});

	socket.on('join', (roomId) => {
		socket.join(roomId);
		io.to(roomId).emit('join-room', socket.id);
	});

	socket.on('game-status', (status) => {
		io.to(userRooms[0]).emit('next-status', status);
	});

	socket.on('disconnect', () => {
		io.emit('population', io.eio.clientsCount);
		console.log('a user disconnected');
	});
});
