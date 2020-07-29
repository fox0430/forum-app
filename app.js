const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const mongoDB = 'mongodb://127.0.0.1/forum';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// secret key for token
const SECRET_KEY = 'secretkey';

const {UserModel, ContributionModel} = require('./mongo_schema');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const getToken = (user) => {
  const payload = {user: user};
  const option = {expiresIn: '24h'};

  const token = jwt.sign(payload, SECRET_KEY, option);
  return token;
}

const verifyToken = (token) => (
  new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  })
);

app.get('/get', (req, res) => {
  res.status(200).json({value: 'get'});
});

app.post('/post', async (req, res, next) => {
  let token = '';
  if (req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else {
    res.status(400).json('');
    next();
  }

  const decoded = await verifyToken(token).catch(err => {
    res.status(500).json('');
    throw err;
  });
   
  const user = await UserModel.findOne({name: decoded.user}).catch(err => {
    res.status(500).json('');
    throw err;
  });

  if (user) {
    const result = await ContributionModel.create({
      userID: user._id,
      message: req.body.message,
    }).catch(err => {
      res.status(500).json('');
      throw err;
    });

    res.status(200).json('');
  } else {
    res.status(400).json('');
  }
});

app.post('/create', async (req, res) => {
  const username = req.body.name;
  const pass = req.body.password;

  if (!username || !pass) {
    res.status(400).json('');
  }

  const existsUser = await UserModel.count({name: username}).catch(err => {
    res.status(500).json('');
    throw err;
  });

  let newUser = {};
  if (!existsUser) {
    newUser = await UserModel.create({name: username, password: pass}).catch(err => {
      res.status(500).json('');
      throw err;
    });
  }

  if (newUser) {
    const token = getToken(newUser.name);
    res.status(200).json({Token: token});
  } else {
    res.status(500).json('');
  }
});

module.exports = app;
