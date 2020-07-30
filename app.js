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

app.get('/get', async (req, res) => {
  const contributions = await ContributionModel.find({}).lean().catch(err => {
    res.status(500).json({Message: err});
    throw err;
  });

  const contents = [];
  for (let i=0; i<contributions.length; i++) {
    contents.push({
      UserID: contributions[i]._id.toString(),
      Message: contributions[i].Message,
      Timestamp: contributions[i].Timestamp
    });
  }

  res.status(200).json({Contents: JSON.stringify(contents)});
});

app.post('/post', async (req, res, next) => {
  let token = '';
  if (req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else {
    res.status(400).json(err);
    next();
  }

  const decoded = await verifyToken(token).catch(err => {
    console.log(err);
    res.status(500).json({Message: err});
    throw err;
  });
   
  const user = await UserModel.findOne({name: decoded.user}).catch(err => {
    console.log(err);
    res.status(500).json({Message: err});
    throw err;
  });

  if (user) {
    const result = await ContributionModel.create({
      UserID: user._id,
      Message: req.body.Message,
    }).catch(err => {
      console.log(err);
      res.status(500).json({Message: err});
      throw err;
    });

    res.status(200).json({Message: 'Success'});
  } else {
    res.status(400).json({Message: 'Error Post failed'});
  }
});

app.post('/create', async (req, res, next) => {
  const username = req.body.UserName;
  const pass = req.body.Password;

  if (!username || !pass) {
    res.status(400).json({Message: 'Error: Empty data'});
    next();
  }

  const existsUser = await UserModel.count({name: username}).catch(err => {
    console.log(err);
    res.status(500).json({Message: err});
    throw err;
  });

  let newUser = {};
  if (!existsUser) {
    newUser = await UserModel.create({name: username, Password: pass}).catch(err => {
      console.log(err);
      res.status(500).json({Message: err});
      throw err;
    });
  }

  if (newUser) {
    const token = getToken(newUser.name);
    res.status(200).json({Token: token});
  } else {
    res.status(400).json({});
  }
});

app.post('/login', async (req, res, next) => {
  const userName = req.body.UserName;
  const password = req.body.Password;

  const user = await UserModel.findOne({Name: userName}).catch(err => {
    console.log(err);
    res.status(500).json({Message: err});
    throw err;
  });
  if (!user) {
    res.status(400).json({Message: 'Error: Login failed'});
    next();
  }

  if (user.Password === password) {
    const token = getToken(userName);
    res.status(200).json({Message: 'Login success', Token: token});
  } else {
    res.status(400).json({Message :'Error: Login failed'});
  }
});

module.exports = app;
