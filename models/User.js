const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  mobile: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  slack: {
    type: String,
    default: ""
  },
  facebook: {
    type: String,
    default: ""
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
