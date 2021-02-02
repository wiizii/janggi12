const socket = io('/room1');

socket.on('news', (data) => {
	console.log(data.hello);
});
