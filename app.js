const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = 3000;

app.set('views', __dirname + '/views');

//view engine ejs : for routing html
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));

http.listen(port, () => {
	console.log(`server on : http://localhost:${port}/`);
});

//////////////////////////////////////////
//								routes								//
//////////////////////////////////////////
const route = require('./routes/routes.js');
app.use('/', route);
// app.use((req, res, next) => {
// 	res.status(404).send('404 NOT FOUND');
// });
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('server error');
});

//////////////////////////////////////////
//								socket								//
//////////////////////////////////////////
const io = require('socket.io')(http);
const room = io.of('/room');

io.on('connection', (socket) => {
	console.log('socket 접속');

	var room = null;

	socket.on('join', (data) => {
		room = data.room;
		socket.join(room);
		console.log(socket.rooms);
		//socket.set('room', data.roomName);
	});

	socket.on('message', (data) => {
		io.in(room).emit('message', data);
		console.log(data);
	});

	socket.on('disconnect', () => {
		console.log('room namespace 해제');
	});
});
