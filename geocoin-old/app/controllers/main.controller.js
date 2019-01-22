module.exports = {
  showMap: showMap,
  // showCreateUser: showCreateUser
}

function showMap (req, res) {
  // const sessionID = req.session.sessionID;
  res.render('pages/map');
  // console.log(sessionID);
}

// function showCreateUser (req, res) {
//   res.render('pages/createUser');
// }
