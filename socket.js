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
			io.to(rooms[msg.roomId].sockets[0].roomId).emit('room-message', msg);
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
				roomInfo.push({ id: rooms[id].id, name: rooms[id].name, population: rooms[id].sockets.length });
			}
			callback(roomInfo);
		});

		socket.on('join-room', (roomId) => {
			const room = rooms[roomId];
			if (room.sockets.length == 2) {
				//추후 alert로 수정 예정
				return;
			}
			joinRoom(socket, room);
			if (room.sockets.length == 2) {
				let randomNum = Math.round(Math.random());
				let color1 = randomNum ? 'g' : 'r';
				let color2 = randomNum ? 'r' : 'g';
				let msg = {
					data: '게임이 시작되었습니다.',
					color: 'system',
				};
				let [player1, player2] = room.sockets;
				player1.emit('room-message', msg);
				player2.emit('room-message', msg);
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
				const roomId = socket.roomId;

				//상대방 나가는 로직
				let msg = {
					data: '상대방이 나갔습니다.',
					color: 'system',
				};
				io.to(roomId).emit('room-message', msg);

				//방 제거 로직
				let idx = rooms[roomId].sockets.indexOf(socket);
				rooms[roomId].sockets.splice(idx, 1);
				if (rooms[roomId].sockets.length === 0) {
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
