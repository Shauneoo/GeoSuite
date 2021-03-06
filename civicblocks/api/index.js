import express from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import assert from 'assert';
import config from '../config';

let mdb;
MongoClient.connect(config.mongodbUri, (err, db) => {
  assert.equal(null, err);
  mdb = db;
});

const router = express.Router();

router.post('/create/user', (req, res) => {
  console.log('RECEVING NEW USER REQUEST');

  const user = req.body.newUser;
  // console.log(user);

  const newUserSchema = {
    name: user,
    account: Math.floor((Math.random() * 1000) + 1),
    confirmedBalance: 10,
    pendingBalance: 0,
  };
  // validation if the user exsists

  //check if user exsists, if so return data
  mdb.collection('users').findOne({ name: user })
   .then(result => {
     console.log(result);
     if (result != null) {
       console.log('user found',result);
       res.send(result);
     } else {
       console.log('no user found');
       //user doesnt, create, return
       mdb.collection('users').insertOne(newUserSchema).then(result =>
         res.send({ _id: result.insertedId, name: newUserSchema.name, account: newUserSchema.account, confirmedBalance: newUserSchema.confirmedBalance, pendingBalance: newUserSchema.pendingBalance })
       );
     }
   }).catch(error => {
     console.error(error);
     res.status(404).send('Bad Request');
   });
});

router.post('/user/balance', (req, res) => {
  mdb.collection('users').findOne({_id: ObjectID(req.body.userID)})
  .then(result => {
    // console.log("result",result);
    res.send(result)
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});

router.get('/events', (req, res) => {
  let eventsData = [];
  mdb.collection('events').find({})
   .each((err, event) => {
     assert.equal(null, err);
     if (err) console.error(err);
     if (!event) { // no more events
       res.send(eventsData);
       return;
     }
    //  events[event._id] = event;
     eventsData.push(event);
   });
});


router.post('/create/event', (req, res) => {
  console.log("RECEVING NEW EVENT");
  const event = req.body.newEvent;
  console.log(event);

  const newEventSchema = {
    position: {lat: event.position.lat, lng: event.position.lng},
    title: event.title,
    radius: event.radius,
    cause: event.cause,
    key: event.key,
    defaultAnimation: event.defaultAnimation,
    infoContent: event.infoContent,
    walletID: Math.floor((Math.random() * 1000) + 1),
    walletBalance: 0,
  };

  mdb.collection('events').insertOne(newEventSchema).then(result =>
    res.send({
      newEvent: { _id: result.insertedId, event }
    })
  ).catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});

router.post('/deposit/event', (req, res) => {
  console.log('RECEVING NEW EVENT DEPOSIT');

  // console.log(req.body);

  const eventDepositSchema = {
    userID: req.body.payload.userID,
    eventID: req.body.payload.eventID,
    donateAmount: req.body.payload.donateAmount,
    supportingReason: req.body.payload.supportingReason,
    donationCondition: req.body.payload.donationCondition
  };

  mdb.collection('events').findAndModify(
    { _id: ObjectID(eventDepositSchema.eventID) },
    [],
    { $inc: { walletBalance : parseInt(eventDepositSchema.donateAmount) }},
    { new: true }
  ).then(doc =>
    // res.send({})
    console.log(doc)
  )
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });

  mdb.collection('users').findAndModify(
    { _id: ObjectID(eventDepositSchema.userID) },
    [],
    { $inc: { confirmedBalance : -parseInt(eventDepositSchema.donateAmount) }},
    { new: true }
  ).then(doc =>
    // res.send({})
    console.log(doc)
  )
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});

router.post('/withdraw/event', (req, res) => {
  console.log('RECEVING NEW EVENT WITHDRAW REQ');

  // console.log(req.body);

  const eventWithdrawSchema = {
    userID: req.body.payload.userID,
    eventID: req.body.payload.eventID,
    withdrawAmount: req.body.payload.withdrawAmount,
    withdrawReason: req.body.payload.withdrawReason,
    withdrawVerification: req.body.payload.withdrawVerification
  };

  console.log(eventWithdrawSchema);

  mdb.collection('events').findAndModify(
    { _id: ObjectID(eventWithdrawSchema.eventID) },
    [],
    { $inc: { walletBalance : -parseInt(eventWithdrawSchema.withdrawAmount) }},
    { new: true }
  ).then(doc =>
    // res.send({})
    console.log(doc)
  )
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });

  mdb.collection('users').findAndModify(
    { _id: ObjectID(eventWithdrawSchema.userID) },
    [],
    { $inc: { confirmedBalance : parseInt(eventWithdrawSchema.withdrawAmount) }},
    { new: true }
  ).then(doc =>
    // res.send({})
    console.log(doc)
  )
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});


export default router;
