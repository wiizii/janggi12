const btn = document.getElementById('multibtn');
const socket = io.connect('http://localhost:3000/');

function getParameterByName(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
		results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

btn.addEventListener('click', () => {
	console.log('test');
	socket.emit('join', {
		room: socket.id,
	});
});

var room = getParameterByName('room');

socket.emit('join', {
	room: room,
});
