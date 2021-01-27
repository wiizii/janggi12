const socket = io('http://localhost:3000/', {
	withCredentials: true,
	extraHeaders: {
		'my-custom-header': 'abcd',
	},
});

socket.emit('joinroom', window.location.pathname);
socket.on('new user', (data) => {
	console.log('New user. Total users: ', data);
});
