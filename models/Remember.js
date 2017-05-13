const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RememberSchema = new Schema({
  mobile: {
    type: String,
    trim: true
  },
  key: {
    type: String,
    trim: true
  },
  value: {
    type: String,
    trim: true
  }
});

const Remember = mongoose.model('Remember', RememberSchema);
module.exports = Remember;
