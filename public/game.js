import { GameManager } from './utility.js';

let socket = io();
let url = window.location.href;
let roomId = url.split('=')[1];
let gameManager;

socket.emit('join-room', roomId, (id) => {
	console.log(`${id}님이 입장하셨습니다.`);
});

socket.on('init-game', (color) => {
	gameManager = new GameManager(socket, color);
	gameManager.initGame();
});

socket.on('next-status', (status) => {
	if (status.turn === -1) {
		let color = status.catch[0];
		console.log(`${color}승리. 게임 종료`);
	}
	gameManager.render(status);
	gameManager.setStatus(status);
});

/*

socket.on('message', (msg) => {
	var item = document.createElement('li');
	item.textContent = msg;
	messages.appendChild(item);
});

form.addEventListener('submit', function (e) {
	e.preventDefault();
	var msg = { roomId: id, data: input.value };
	if (input.value) {
		socket.emit('room-message', msg);
		input.value = '';
	}
});
*/
