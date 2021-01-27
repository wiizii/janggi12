const socket = io('http://localhost:3000', {
	withCredentials: true,
	extraHeaders: {
		'my-custom-header': 'abcd',
	},
});
