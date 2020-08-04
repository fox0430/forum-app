const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserModelSchema = new Schema({
  Name: {
    type: String
  },
  Password:{
    type: String
  }
});

const ContributionModelSchema = new Schema({
  UserID: {
    type: String 
  },
  Message:{
    type: String 
  },
  S3Url: {
    type: String
  },
  Timestamp: {
    type: String,
  }
});

module.exports.UserModel = mongoose.model('UserModel', UserModelSchema); 
module.exports.ContributionModel = mongoose.model('ContributionModel', ContributionModelSchema); 
