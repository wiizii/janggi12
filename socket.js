//////////////////////////////////////////
//								socket								//
//////////////////////////////////////////
const SocketIO = require('socket.io');

module.exports = (server, app) => {
	const io = SocketIO(server, { path: '/socket.io' });
	app.set('io', io);

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
};
