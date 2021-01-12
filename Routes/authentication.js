const express = require('express');

const router = express.Router();

router.post('/rigister', (req, res) => {
    res.send('register');
});

router.post('/login', (req, res) => {
    res.send('login');
});

module.exports =router;