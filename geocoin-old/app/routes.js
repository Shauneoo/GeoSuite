//create a new express router
const express = require('express'),
      router = express.Router(),
      mainController = require('./controllers/main.controller');
      userController = require('./controllers/user.controller');
      mapController = require('./controllers/map.controller');
      adminController = require('./controllers/admin.controller');
      eventController = require('./controllers/event.controller');

/////////////
///routes////
/////////////
// router.get('/', mainController.showCreateUser);
router.get('/', mainController.showMap);

/////////////
////user ////
/////////////
router.post('/user/create', userController.processNewUser);
// router.get('/user/create', userController.addEventsToMap); //should be in events or maps

/////////////
////events //
/////////////
router.get('/admin', adminController.showEvents);
router.post('/event/delete', adminController.deleteEvent);
router.post('/event/create', eventController.createNewEvent);

//export router
module.exports = router;
