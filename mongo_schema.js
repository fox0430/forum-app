const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserModelSchema = new Schema({
  name: {
    type: String
  },
  password:{
    type: String
  }
});

const ContributionModelSchema = new Schema({
  userID: {
    type: String 
  },
  message:{
    type: String 
  },
  timestamp: {
    type: Date,
    default: new Date
  }
});

module.exports.UserModel = mongoose.model('UserModel', UserModelSchema); 
module.exports.ContributionModel = mongoose.model('ContributionModel', ContributionModelSchema); 
