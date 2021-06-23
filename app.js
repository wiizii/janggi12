const express = require('express');
const path = require('path');
const app = express();
const webSocket = require('./socket');
const route = require('./routes/routes.js');
const port = 3000;

app.set('views', __dirname + '/views');
//view engine ejs : for routing html
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(port, () => {
	console.log(`server on : http://localhost:${port}/`);
});

//////////////////////////////////////////
//								routes								//
//////////////////////////////////////////
app.use('/', route);
app.use((req, res, next) => {
	res.status(404).send('404 NOT FOUND');
});
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('server error');
});

webSocket(server, app);
