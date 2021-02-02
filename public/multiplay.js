const btn = document.getElementById('generateBtn');

btn.addEventListener('click', () => {
	const socket = io('/room1');

	socket.on('news', (data) => {
		console.log(data);
	});
});
