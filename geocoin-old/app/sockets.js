var socketio = require('socket.io');
const User = require('./models/user');
const Event = require('./models/event');


module.exports.listen = function(app){
  io = socketio.listen(app)

  io.on('connection', function(socket, req){

    console.log("user "+socket.id+" has joined the server");
    socket.join(socket.id, function(data) {
      io.to(socket.id).emit('setSessionID', socket.id);
      var tempSocketID = socket.id;
      eventController.getEventsData(tempSocketID);
    });

    // new user request
    socket.on('createUser', function(data) {
      console.log('user ' + data.userName + " trying to create");
      if (data.userName.length > 0 ) userController.processNewUser(data);
    });

    // refresh event data when new event is created
    socket.on('refreshData', function(data) {
      eventController.getEventsData();
    });

    socket.on('processEventAction', function(data) {
      eventController.processEventAction(socket.id, data.userName, data.type, data.value, data.eventID);
    });

    socket.on("sendEventID", function(eventID){
      // console.log("dksndk "+eventID)
      io.emit("removeEventFromDom", eventID);
    })
    socket.on('disconnect', function(){
      console.log("user "+ socket.id +" has disconnected the server");
    });

  });
  return io;
}
