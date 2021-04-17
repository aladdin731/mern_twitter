// model files in Mongoose are singular and start with a capital letter

// import Mongoose and Mongoose Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  handle: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
      type: Date,
      default: Date.now
  }
})
// {timestamps: true}


// export model
// first arg is the name the model to be called
const User = mongoose.model('users', UserSchema);
module.exports = User;