const Event = require('../models/event');

module.exports = {
  showEvents: showEvents,
  deleteEvent: deleteEvent
}

// show all events
function showEvents (req, res) {
  // get all events
  Event.find({}, (err, events) => {
    if(err) {
      res.status(404);
      res.send("Events not found!");
    }
    // return a view with data
    res.render('pages/admin', { events: events });
  });
}

function deleteEvent (req, res) {
  // delete event
  Event.findOne().remove({ _id: req.body.deleteEvent }, (err) => {
    if (err) res.send("Event not found in DB");
    console.log("event removed");
    // redirect to admin
    res.redirect('/admin');
  }).exec(); //.exec() is needed to delete without callback
}
