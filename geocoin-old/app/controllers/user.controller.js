// var io = require('../sockets');
const User = require('../models/user');

module.exports = {
  processNewUser: processNewUser,
  // updateUserBalance: updateUserBalance
}
// process create form
// pass id into payload
function processNewUser (data) {
  // create new instance of User with inputed data
  console.log(data.sessionID + " requesting to make new wallet")

  const user = new User({
    name: data.userName,
    account: 'null',
    accountBalance: 0
  });

  //  check if user exsists in db
  User.find({name: user.name}, (err, res) => {
    if (err) console.log(err);
    if (res.length > 0) {
      //if username exsists load info
      console.log("User exsist");
      // return user details
      user.name = res[0].name;
      user.account = res[0].account;
      user.accountBalance = res[0].accountBalance;
      // console.log("returning user data to user: "+ JSON.stringify(data.sessionID));
      // io.sockets.sockets[sessionID].emit('returnEventsData', 'eventsData');
      io.to(data.sessionID).emit('returnUserInfo', {userName: user.name, userAccount: user.account, userBalance: user.accountBalance});
      // console.log
     } else if (res.length == 0) {
       // if user doenst then save data to db
       console.log("New User");
       // generate new account data
       user.account = parseInt((Math.random(100, 1000)*1000));
       user.accountBalance = 10;
       console.log("account", user.account);
      //  io.emit('returnUserInfo', {userName: user.name, userAccount: user.account, userBalance: user.accountBalance});
      io.to(data.sessionID).emit('returnUserInfo', {userName: user.name, userAccount: user.account, userBalance: user.accountBalance});
       // save user
       user.save((err) => {
         if (err)
           throw err;
       });
     }
  });
}
