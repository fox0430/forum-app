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

const Handler = require('./handler.js'); 
const {UserModel, ContributionModel} = require('./mongo_schema');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/get', async (req, res) => {
  Handler.getContents(req, res);
});

app.post('/post', async (req, res) => {
  Handler.postContent(req, res);
});

app.post('/create', async (req, res) => {
  Handler.createUser(req, res);
});

app.post('/login', async (req, res) => {
  Handler.login(req, res);
});

module.exports = app;
