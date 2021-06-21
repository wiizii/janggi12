const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('main.html');
});

router.get('/computer', (req, res) => {
	res.render('computer.html');
});

router.get('/single', (req, res) => {
	res.render('single.html');
});

router.get('/rule', (req, res) => {
	res.render('rule.html');
});

router.get('/room', (req, res) => {
	console.log(req.query.id);
	res.render('multiplay.html');
});

module.exports = router;
