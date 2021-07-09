import { GameManager } from './utility.js';

let socket = io();
let url = window.location.href;
let roomId = url.split('=')[1];
let gameManager;
let input = document.getElementById('input');
let messages = document.getElementById('messages');

socket.emit('join-room', roomId);

socket.on('init-game', (color) => {
	gameManager = new GameManager(socket, color);
	gameManager.initGame();
	let item = document.createElement('li');
	let turnMsg = document.createElement('li');
	if (gameManager.color === 'g') {
		item.textContent = 'system : 당신은 {초록색} 입니다.';
		item.classList.add('text-success');
	} else {
		item.textContent = 'system : 당신은 {빨간색} 입니다.';
		item.classList.add('text-danger');
	}
	turnMsg.textContent = 'system : {초록색} 차례입니다.';

	messages.appendChild(item);
	messages.appendChild(turnMsg);

	messages.scrollTop = messages.scrollHeight;
});

socket.on('next-status', (status) => {
	if (status.turn === -1) {
		let color = status.catch[0];
		if (color === 'g') {
			alert('빨간색 승리. 게임 종료');
		} else if (color === 'r') {
			alert('초록색 승리. 게임 종료');
		}

		if (gameManager.color === 'r' && color === 'g') gameManager = new GameManager(socket, 'r');
		else if (gameManager.color === 'r' && color === 'r') gameManager = new GameManager(socket, 'g');
		else if (gameManager.color === 'g' && color === 'r') gameManager = new GameManager(socket, 'r');
		else if (gameManager.color === 'g' && color === 'g') gameManager = new GameManager(socket, 'g');

		gameManager.initGame();
		let item = document.createElement('li');
		let turnMsg = document.createElement('li');
		if (gameManager.color === 'g') {
			item.textContent = 'system : 당신은 {초록색} 입니다.';
			item.classList.add('text-success');
		} else {
			item.textContent = 'system : 당신은 {빨간색} 입니다.';
			item.classList.add('text-danger');
		}
		turnMsg.textContent = 'system : {초록색} 차례입니다.';

		messages.appendChild(item);
		messages.appendChild(turnMsg);

		messages.scrollTop = messages.scrollHeight;
		return;
	}
	let item = document.createElement('li');
	if (status.turn === 'g') {
		item.textContent = 'system : {초록색} 차례입니다.';
	} else {
		item.textContent = 'system : {빨간색} 차례입니다.';
	}
	messages.appendChild(item);
	messages.scrollTop = messages.scrollHeight;

	gameManager.render(status);
	gameManager.setStatus(status);
});

form.addEventListener('submit', function (e) {
	e.preventDefault();
	if (input.value) {
		let msg = {
			roomId: roomId,
			data: input.value,
			color: gameManager.color,
		};
		socket.emit('room-message', msg);
		input.value = '';
	}
});

socket.on('room-message', function (msg) {
	let item = document.createElement('li');
	if (msg.color === 'system') {
		item.textContent = 'system : ' + msg.data;
		messages.appendChild(item);
		messages.scrollTop = messages.scrollHeight;
		return;
	}
	if (gameManager.color === 'r') {
		if (msg.color === 'r') {
			item.textContent = '나 : ' + msg.data;
			item.classList.add('text-danger');
		} else {
			item.textContent = '상대 : ' + msg.data;
			item.classList.add('text-success');
		}
	} else if (gameManager.color === 'g') {
		if (msg.color === 'g') {
			item.textContent = '나 : ' + msg.data;
			item.classList.add('text-success');
		} else {
			item.textContent = '상대 : ' + msg.data;
			item.classList.add('text-danger');
		}
	}

	messages.appendChild(item);
	messages.scrollTop = messages.scrollHeight;
});
