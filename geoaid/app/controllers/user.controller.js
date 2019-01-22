const User = require('../models/user');

module.exports = {
  processNewUser: processNewUser,
  updateUserBalance: updateUserBalance
};
// process create form
function processNewUser (data) {
  // create new instance of User with inputed data
  console.log(data.sessionID + " requesting to make new/recover wallet");

  const user = new User({
    name: data.userName,
    account: 'null',
    confirmedUserBalance: 0,
    pendingAccountBalance: 0
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
      user.confirmedUserBalance = res[0].confirmedUserBalance;
      user.pendingAccountBalance = res[0].pendingAccountBalance;

      io.to(data.sessionID).emit('returnUserInfo', {userName: user.name, userAccount: user.account, confirmedUserBalance: user.confirmedUserBalance, pendingAccountBalance: user.pendingAccountBalance});
    } else if (res.length === 0) {
      // if user doesnt exsist
      console.log("New User");
      // generate new account data
      user.account = (function() {
        return (Math.random()*100);
      })();
      user.pendingAccountBalance = 0;
      user.confirmedUserBalance = 10;

      io.to(data.sessionID).emit('returnUserInfo', {userName: user.name, userAccount: user.account, confirmedUserBalance: user.confirmedUserBalance, pendingAccountBalance: user.pendingAccountBalance});
      user.save((err) => {
        if (err)
          throw err;
      });

      // client.call('personal_newAccount', ['jsdhjd1222ewd'], function(err,result){
        // user.account = String(result);
        // console.log("New account made at "+user.account);
        //unlock account
        // client.call('personal_unlockAccount', [user.account, 'jsdhjd1222ewd'], function(err,result){
          // if (result == true) {
            // console.log("Account unlocking successful, transering funds");
            // send 10 ether to last account in array. //unlock main account after each geth session end //personal.unlockAccount("0xafb94632128cd593a446b5cd47969ab54385ffc5", "887536", 0)
            // web3.eth.sendTransaction({from:web3.eth.accounts[0], to:user.account, value: web3.toWei(10, "ether")});
            // console.log("transaction pending, please mine for proceesing");
            // console.log("sending account data to db");
            // console.log("account", user.account);
            // user.pendingAccountBalance = 10
            // user.confirmedUserBalance = web3.eth.getBalance(user.account).toNumber();

            // io.to(data.sessionID).emit('returnUserInfo', {userName: user.name, userAccount: user.account, confirmedUserBalance: user.confirmedUserBalance, pendingAccountBalance: user.pendingAccountBalance});
            // user.save((err) => {
            //   if (err)
            //     throw err;
            // });
          // } else if (result == false) {
          //   console.log("failure in unlocking account");
          // }
        // });
      // });
     }
  });
}

function updateUserBalance(sessionID, userName, amount) {
  //update users confirmedBalance
  if (amount < 0) {
    User.update({name: userName}, { $inc: {confirmedUserBalance: + Math.abs(amount)}}, (err) =>{
      if (err) console.log(err);
      User.findOne({name: userName}, (err, res) =>{
        if (err) console.log(err);
        io.to(sessionID).emit('updateUserBalance', res);
      });
    });
  } else {
    User.update({name: userName}, { $inc: {confirmedUserBalance: -Math.abs(amount)}}, (err) =>{
      if (err) console.log(err);
      User.findOne({name: userName}, (err, res) =>{
        if (err) console.log(err);
        //Send transaction to blockchain
        // web3.eth.sendTransaction({from:String(res.account), to:web3.eth.accounts[0], value: web3.toWei(amount, "ether")});
        //update balance DOM element
        io.to(sessionID).emit('updateUserBalance', res);
      });
    });
  }
}
