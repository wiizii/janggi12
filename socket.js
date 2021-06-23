//////////////////////////////////////////
//								socket								//
//////////////////////////////////////////
const SocketIO = require('socket.io');

module.exports = (server, app) => {
	const io = SocketIO(server, { path: '/socket.io' });
	app.set('io', io);

	let roomCounter = 1;
	let rooms = {};

	io.on('connection', (socket) => {
		console.log('a user connected');
		io.emit('population', io.eio.clientsCount);

		socket.on('message', (msg) => {
			io.emit('message', msg);
		});

		socket.on('room-message', (msg) => {
			io.to(msg.roomId).emit('message', msg.data);
		});

		socket.on('create-room', (roomName, callback) => {
			const room = {
				id: roomCounter,
				name: roomName,
				sockets: [],
			};
			roomCounter++;
			rooms[room.id] = room;
			callback(room.id);
		});

		socket.on('get-room-info', (callback) => {
			let roomInfo = [];
			for (const id in rooms) {
				roomInfo.push({ id: rooms[id].id, name: rooms[id].name });
			}
			callback(roomInfo);
		});

		socket.on('join-room', (roomId, callback) => {
			const room = rooms[roomId];
			joinRoom(socket, room);

			callback(socket.id);
		});

		socket.on('ready', () => {
			console.log(socket.id, 'is ready!');
			const room = rooms[socket.roomId];
			//need two players
			if (room.sockets.length == 2) {
				for (const client of room.sockets) {
					client.emit('init-game');
				}
			}
		});

		// socket.on('game-status', (status) => {
		// 	io.to(userRooms[0]).emit('next-status', status);
		// });

		socket.on('disconnect', () => {
			if (socket.roomId !== undefined) {
				const roomId = socket.roomId;
				if (rooms[roomId].sockets.length === 1) {
					console.log('have to remove room');
					delete rooms[roomId];
				}
			}
			io.emit('population', io.eio.clientsCount);
			console.log('a user disconnected');
		});
	});

	const joinRoom = (socket, room) => {
		room.sockets.push(socket);
		socket.join(room.id);
		socket.roomId = room.id;
	};
};
