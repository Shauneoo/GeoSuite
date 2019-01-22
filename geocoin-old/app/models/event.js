const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// create a schema
const eventSchema = new Schema({
  "type": String,
  "value": Number,
  "lat": Number,
  "lng": Number,
  "radius": Number
});

// create the model
const eventModel = mongoose.model('Event', eventSchema);

// export the model
module.exports = eventModel;
