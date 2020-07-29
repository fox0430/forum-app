const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserModelSchema = new Schema({
  username: String,
  password: String,
});

const ThreadModelSchema = new Schema({
  name: String
});

module.exports.UserModel = UserModelSchema; 
module.exports.ThreadModelSchema = ThreadModelSchema; 
