var express = require('express');
var router = express.Router();

const User = require('../models/user');
const Msg = require('../models/messages');
const Room = require('../models/rooms');

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

  User.findById(likeId, (err, likedUser) => {
    if (err) {
      res.json({
        success: false,
        err: err.name
      })
    }
    else if (likedUser.likes.includes(userId)) {
      // both have liked each other
      // or like already exists
      res.json({
        success: true,
        user: likedUser,
      })
    } else {
      likedUser.likes.push(userId)
      likedUser.save((err, data) => {
        if (err)
          res.json({
            success: false,
            err: err.name
          })
        else {
          User.findById(userId, (err, srcUser) => {
            if (err) {
              res.json({
                success: false,
                err: err.name
              })
            } else if (srcUser.likes.includes(likeId)) {
              const room = new Room({
                users: [userId, likeId]
              })
              room.save((err, roomId) => {
                if (err) {
                  res.json({
                    err: err.name,
                    success: false,
                    newRoom: true,
                  })
                } else {
                  res.json({
                    success: true,
                    user: data,
                    newRoom: true,
                    roomname: roomId._id
                  })
                }
              })
            } else {
              res.json({
                success: true,
                user: data,
                newRoom: false
              })
            }
          })
        }
      })
    }
  })
})

router.get("allRooms", (req, res) => {
  Room.find({}, (err, rooms) => {
    if (err) {
      res.json({
        err: err.name,
        success: false,
      })
    } else {
      res.json({
        rooms,
        success: true,
      })
    }
  })
})

module.exports = router;