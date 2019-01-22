var socketio = require('socket.io');
const User = require('./models/user');
const Event = require('./models/event');

module.exports.listen = function(app){
  io = socketio.listen(app);

  io.on('connection', function(socket){
    console.log("user "+socket.id+" has joined the server");

    socket.join(socket.id, function(data) {
      io.to(socket.id).emit('setSessionID', socket.id);
      var tempSocketID = socket.id;
      // initiate getting events data from db
      eventController.getEventsData(tempSocketID);
    });

    // create/return user request
    socket.on('createUser', function(data) {
      console.log('A user ' + data.userName + " trying to create/request account details");
      if (data.userName.length > 0 ) userController.processNewUser(data);
    });

    // refresh event data when new event is created
    socket.on('refreshData', function(data) {
      eventController.getEventsData();
    });

    // create event request
    socket.on('createEvent', function(msgPayload) {
      eventController.createNewEvent(msgPayload);
    });

    socket.on('processEventAction', function(data) {
      eventController.processEventAction(socket.id, data.userName, data.type, data.value, data.eventID);
    });

    socket.on('sendEventDonationToDB', function (msgPayload) {
      // update event amount
      eventController.sendEventDonationToDB(msgPayload._id, msgPayload.amount);
      // update user balance
      userController.updateUserBalance(msgPayload.sessionID, msgPayload.userName, msgPayload.amount);
    });

    socket.on('withdrawFromEvent', function (msgPayload) {
      // update event amount
      eventController.sendEventWithdrawToDB(msgPayload._id, msgPayload.amount);
      // update user balance
      userController.updateUserBalance(msgPayload.sessionID, msgPayload.userName, msgPayload.amount);
    });

    socket.on('disconnect', function(){
      console.log("user "+ socket.id +" has disconnected the server");
    });
  });
  return io;
}
