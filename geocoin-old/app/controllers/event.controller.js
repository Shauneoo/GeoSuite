const Event = require('../models/event');
const User = require('../models/user');

module.exports = {
  getEventsData: getEventsData,
  createNewEvent: createNewEvent,
  processEventAction: processEventAction,
}

function getEventsData(tempSocketID) {
  Event.find({}, (err, eventsData) => {
    if(err) console.log("Events not found!");
    if (typeof tempSocketID !== 'undefined') {
      io.to(tempSocketID).emit('newEventsData', eventsData); //send events data to everyone
    } else {
      io.emit('newEventsData', eventsData); //send events data to everyone
    }
  });
}

// process create form
function createNewEvent (req, res) {
  req.checkBody('type', 'Event type is required').notEmpty(); //check express-validator docs
  req.checkBody('value', 'Event value is required').notEmpty();
  req.checkBody('lat', 'Event lat is required').notEmpty();
  req.checkBody('lng', 'Event lng is required').notEmpty();
  req.checkBody('radius', 'Event radius is required').notEmpty();

  //redirect to homepage if erros
  const errors = req.validationErrors();
  if (errors) {
    return res.redirect('/admin');
  }

  // create new instance of event with inputed data
  const event = new Event({
    type: req.body.type,
    value: req.body.value,
    lat: req.body.lat,
    lng: req.body.lng,
    radius: req.body.radius
  });

  // save event
  event.save((err) => {
    if (err)
      throw err;
    // set a successful flash message
    req.flash('success', 'Successfuly created event!');
    // redirect to newly created event page
    console.log("success");
    getEventsData();
    res.redirect(`/admin`);
  });
}

function processEventAction(sessionID, userName, type, value, eventID) {
  switch(type) {
    case "coinCache":
      Event.findOne().remove({ _id: eventID }, (err) => {
        if (err) console.log("Event not found in DB");
        console.log("coinCache event removed");
      }).exec();
      User.update({name: userName}, { $inc: {accountBalance: +value}}).exec();
      console.log(userName+"on session: " +sessionID+" balance increased by " + value);
      getEventsData();
      break;

    case "toll":
      Event.findOne().remove({ _id: eventID }, (err) => {
        if (err) console.log("Event not found in DB");
        console.log("toll event removed");
      }).exec();
      User.update({name: userName}, { $inc: {accountBalance: -value}}).exec();
      console.log(userName+"on session: " +sessionID+" balance decressed by " + value);
      getEventsData();
      break;

    case "passiveEarn":
      User.update({name: userName}, { $inc: {accountBalance: +value}}).exec();
      console.log(userName+"on session: " +sessionID+" balance increased by " + value);
      break;

    case "passiveTax":
      User.update({name: userName}, { $inc: {accountBalance: -value}}).exec();
      console.log(userName+"on session: " +sessionID+" balance decressed by " + value);
      break;
  }

  // send data to front end to update balance element
  User.findOne({name: userName}, 'accountBalance', (err, res) =>{
    if (err) console.log(err);
    io.to(sessionID).emit('updateUserBalance', res.accountBalance);
  });
}
