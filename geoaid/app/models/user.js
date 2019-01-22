const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// create a schema
const userSchema = new Schema({
  name: String,
  account: String,
  confirmedUserBalance: Number,
  pendingAccountBalance: Number,
  userLat: Number,
  userLng: Number
});

// create the model
const userModel = mongoose.model('User', userSchema);

// export the model
module.exports = userModel;
