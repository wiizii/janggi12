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
			if (room.sockets.length == 2) {
				console.log('게임 시작');
				let randomNum = Math.round(Math.random());
				let color1 = randomNum ? 'g' : 'r';
				let color2 = randomNum ? 'r' : 'g';
				let [player1, player2] = room.sockets;
				player1.emit('init-game', color1);
				player2.emit('init-game', color2);
			}
		});

		socket.on('game-play', (status) => {
			if (status.catch === 'g0' || status.catch === 'r0') {
				status.turn = -1;
				io.to(socket.roomId).emit('next-status', status);
			} else {
				io.to(socket.roomId).emit('next-status', status);
			}
		});

		socket.on('disconnect', () => {
			if (socket.roomId !== undefined) {
				console.log('test');
				const roomId = socket.roomId;
				let idx = rooms[roomId].sockets.indexOf(socket);
				rooms[roomId].sockets.splice(idx, 1);
				if (rooms[roomId].sockets.length === 0) {
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
