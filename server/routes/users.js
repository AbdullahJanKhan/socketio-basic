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
  const msg = new Msg({
    data, userId, room
  })
  msg.save((err, savedmsg) => {
    if (err)
      res.json({
        err: err.name,
        success: false
      })
    else {
      res.json({
        succes: true,
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

  User.findOne({ '_id': likeId }, (err, user) => {
    if (err) {
      res.json({
        err: err.name,
        success: false
      })
    } else {
      user.likes.push(userId)
      user.save((err, user) => {
        if (err) {
          res.json({
            err: err.name,
            success: false
          })
        } else {
          res.json({
            user,
            success: true
          })
        }
      })
    }
  })

})

module.exports = router;
