var express = require('express');
var router = express.Router();

const User = require('../models/user');
const Msg = require('../models/messages');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/add', (req, res) => {
  const name = req.body.name;
  const user = new User({
    name
  });
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

router.patch('/likedMsg/:uid/:likedId', (req, res) => {
  const likedId = req.params.likedId
  const uId = req.params.uid

  User.findOneAndUpdate({ '_id': uId }, { $push: { likedMsgs: likedId } }, (err, user) => {
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
  console.log(msg)
  msg.save((err, savedmsg) => {
    if (err)
      res.json({
        err: err.name,
        success: false
      })
    else {
      Msg.find({ room: room }, (err, msgs) => {
        if (err) {
          res.json({
            err: err.name,
            success: false
          })
        }
        else
          res.json({
            msg: msgs,
            success: true
          })
      })
    }
  })
})

module.exports = router;
