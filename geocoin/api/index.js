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
     // events[event._id] = event;
     eventsData.push(event);
   });
});


router.post('/create/event', (req, res) => {
  console.log("RECEVING NEW EVENT");
  const event = req.body.newEvent;
  console.log(res)
  // console.log(event);

  const newEventSchema = {
    // position: {lat: event.position.lat, lng: event.position.lng},
    // title: event.title,
    // radius: event.radius,
    // cause: event.cause,
    // key: event.key,
    // defaultAnimation: event.defaultAnimation,
    // infoContent: event.infoContent,
    // walletID: Math.floor((Math.random() * 1000) + 1),
    // walletBalance: 0,

    type: event.type,
    value: event.value,
    // position: {lat: event.position.lat, lng: event.position.lng},
    radius: event.radius,
    // key: event.key,
    // defaultAnimation: event.defaultAnimation,
    walletID: Math.floor((Math.random() * 1000) + 1),
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

export default router;
