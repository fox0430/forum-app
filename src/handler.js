const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');

const {UserModel, ContributionModel} = require('./mongo_schema');

// secret key for token
const SECRET_KEY = 'secretkey';

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

const getContents = async (req, res) => {
  const contributions = await ContributionModel.find({}).lean().catch(err => {
    res.status(500).json({Message: err});
    throw err;
  });

  const contents = [];
  for (let i=0; i<contributions.length; i++) {
    const id = contributions[i].UserID;

    const user = await UserModel.findOne({_id: id}).catch(err => {
      res.status(500).json({Message: err});
      throw err;
    });

    contents.push({
      UserID: id,
      UserName: user.Name,
      Message: contributions[i].Message,
      S3Url: contributions[i].S3Url,
      Timestamp: contributions[i].Timestamp
    });
  }

  res.status(200).json({Contents: contents});
}

const postContent = async (req, res) => {
  let token = '';
  if (req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else {
    res.status(400).json({Message: "Authorization Token Not Found"});
    return;
  }

  const decoded = await verifyToken(token).catch(err => {
    console.log(err);
    res.status(500).json({Message: err});
    throw err;
  });
   
  const user = await UserModel.findOne({Name: decoded.user}).catch(err => {
    console.log(err);
    res.status(500).json({Message: err});
    throw err;
  });

  if (user) {
    const date = moment().tz('Asia/Tokyo').format();

    const result = await ContributionModel.create({
      UserID: user._id,
      Message: req.body.Message,
      S3Url: req.body.S3Url,
      Timestamp: date
    }).catch(err => {
      console.log(err);
      res.status(500).json({Message: err});
      throw err;
    });

    res.status(200).json({Message: 'Success'});
  } else {
    res.status(400).json({Message: 'Error Post failed'});
  }
}

const createUser = async (req, res) => {
  const username = req.body.UserName;
  const pass = req.body.Password;

  if (!username || !pass) {
    res.status(400).json({Message: 'Error: Empty data'});
    return;
  }

  const existsUser = await UserModel.count({Name: username}).catch(err => {
    console.log(err);
    res.status(500).json({Message: err});
    throw err;
  });

  let newUser;
  if (!existsUser) {
    const hashedPassword = bcrypt.hashSync(pass, 10);

    newUser = await UserModel.create({Name: username, Password: hashedPassword}).catch(err => {
      console.log(err);
      res.status(500).json({Message: err});
      throw err;
    });
  }

  if (newUser) {
    const token = getToken(newUser.Name);
    res.status(200).json({Token: token});
  } else {
    res.status(400).json({});
  }
}

const login = async(req, res) => {
  const userName = req.body.UserName;
  const password = req.body.Password;

  const user = await UserModel.findOne({Name: userName}).catch(err => {
    console.log(err);
    res.status(500).json({Message: err});
    throw err;
  });
  if (!user) {
    res.status(400).json({Message: 'Error: Login failed'});
    return;
  }

  if (bcrypt.compareSync(password, user.Password)) {
    const token = getToken(userName);
    res.status(200).json({Message: 'Login success', Token: token});
  } else {
    res.status(400).json({Message :'Error: Login failed'});
  }

}

module.exports.getContents = getContents;
module.exports.postContent = postContent;
module.exports.createUser = createUser;
module.exports.login = login;
