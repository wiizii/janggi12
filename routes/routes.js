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

router.get('/multiplay', (req, res) => {
	res.render('multiplay.html');
});

router.get('/rule', (req, res) => {
	res.render('rule.html');
});

module.exports = router;
