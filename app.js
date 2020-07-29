const express = require('express');
const mongoose = require('mongoose');

const mongoDB = 'mongodb://127.0.0.1/forum';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

app.get('/get', (req, res) => {
  res.status(200).json({value: 'get'});
});

app.get('/post', (req, res) => {
  res.status(200).;
});

app.get('/delete', (req, res) => {
  res.status(200);
});

app.get('/register', (req, res) => {
  res.status(200);
});

module.exports = app;
