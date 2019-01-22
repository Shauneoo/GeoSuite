const Event = require('../models/event');

module.exports = {
  getEventsData: getEventsData,
  createNewEvent: createNewEvent,
  sendEventDonationToDB: sendEventDonationToDB,
  sendEventWithdrawToDB: sendEventWithdrawToDB
};

function getEventsData() {
  // retrieve events from db
  Event.find({}, (err, eventsData) => {
    if(err) console.log("Events not found!");
    // sending new events data
    io.emit('newEventsData', eventsData);
    // console.log("sending new events data");
  });
}

// process create form
function createNewEvent (req, res) {
  // console.log("Recieving New Event" + req);

  // create new instance of event with inputed data
  const event = new Event({
    type: "charity",
    lat: req.lat,
    lng: req.lng,
    title: req.title,
    radius: req.radius,
    cause: req.cause,
    walletID: 20102021,
    walletBalance: 0
  });

  // save event
  event.save((err) => {
    if (err) throw err;
    // console.log(event);
    // refresh eventsData
    getEventsData();
  });
}

function sendEventDonationToDB(_id, amount) {
  console.log("adding event balance");
  Event.update({_id: _id}, { $inc: {walletBalance: +amount}}).exec();
}

function sendEventWithdrawToDB(_id, amount) {
  console.log("withdrawing event balance");
  console.log(amount);
  Event.update({_id: _id}, { $inc: {walletBalance: - Math.abs(amount)}}).exec();
}
