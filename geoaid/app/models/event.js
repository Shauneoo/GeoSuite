const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// create a schema
const eventSchema = new Schema({
  "type": String,
  "lat": Number,
  "lng": Number,
  "title": String,
  "radius": Number,
  "cause": String,
  "walletID": Number,
  "walletBalance": Number
});

// create the model
const eventModel = mongoose.model('Event', eventSchema);

// export the model
module.exports = eventModel;
