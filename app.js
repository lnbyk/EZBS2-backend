const express = require('express');
const mongoose = require('mongoose');

const app = express();

//ROUTEs
app.get('/',(req,res) => {
    res.send('we are on home');
});

app.listen(3000);