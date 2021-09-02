var express = require('express');
var router = express.Router();

const User = require('../models/user');
const Msg = require('../models/messages');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/addUser', (req, res) => {
  var user
  if (req.body.name) {
    const name = req.body.name;
    user = new User({
      name
    });
  } else {
    user = new User();
  }
  user.save((err, user) => {
    if (err)
      res.json({
        err: err.name,
        success: false
      })
    else
      res.json({
        user: user,
        success: true
      })
  })
})

router.post('/newMsg', (req, res) => {
  const data = req.body.data;
  const userId = req.body.userId;
  const room = req.body.room;
  const time = req.body.time;
  const batteryLevel = req.body.batteryLevel;

  const msg = new Msg({
    data, userId, room, time, batteryLevel
  })
  msg.save((err, savedmsg) => {
    if (err)
      res.json({
        err: err.name,
        success: false
      })
    else {
      console.log(savedmsg)
      res.json({
        success: true,
        msg: savedmsg,
      })
    }
  })
})

router.get('/getMsgs/:room', (req, res) => {
  const room = req.params.room
  Msg.find({ room }, (err, msgs) => {
    if (err)
      res.json({
        err: err.name,
        success: false
      })
    else
      res.json({
        data: msgs,
        success: true
      })

  })
})

router.patch('/like', (req, res) => {
  const userId = req.body.uid;
  const likeId = req.body.lid;

  User.findOneAndUpdate({ '_id': likeId }, { $push: { likes: userId } }, { new: true }, (err, luser) => {
    console.log(luser)
    if (err) {
      res.json({
        err: err.name,
        success: false,
      })
    } else {
      console.log(luser)
      luser.likes = [...new Set(luser.likes)]
      luser.save((err) => {
        if (err) {
          res.json({
            err: err.name
          })
          return;
        }
      })
      User.findOne({ '_id': userId }, (err, user) => {
        if (err) {
          res.json({
            err: err.name,
            success: false,
            newroom: false,
          })
        }
        else if (user.likes && likeId in user.likes) {
          res.json({
            user: luser,
            success: true,
            newroom: true,
          })
        } else {
          res.json({
            user: luser,
            success: true,
            newroom: false,
          })
        }
      })

    }
  })
})

module.exports = router;