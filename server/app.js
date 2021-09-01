var createError = require('http-errors');
var express = require('express');
var app = express();

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var http = require('http');
var dotenv = require('dotenv').config();

var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app)
var io = require("socket.io")(server);

var mongoose = require('mongoose');

var axios = require('axios');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


const connection = mongoose.connect("mongodb+srv://abdullah-isee:admin@isee.qxzb7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
connection.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/', (req, res) => res.send('Hello World'))

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


let users = [];

const addUser = (payload) => {
  !users.some((user) => user.userId === payload.userId) &&
    users.push(payload);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
  console.log(users)
};

const getUser = (socketId) => {
  return users.find((user) => user.socketId === socketId);
};

const getUserId = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", onConnect);
function onConnect(socket) {
  //when ceonnect
  //take userId and socketId from user
  socket.on("addUser", ({ username, userId, roomname }) => {
    addUser({ username, userId, roomname, socketId: socket.id })
    console.log(users)
    axios.get('https://diewithme-13.herokuapp.com/users/getMsgs/' + roomname)
      .then(res => {
        if (res.data.success) {
          io.to(socket.id).emit('newUser', res.data.data)
          io.to(roomname).emit('newUserAdded', username + ' join the chat');
        }
      })
  });

  //send and get message
  socket.on('newMsg', ({ msgs, room, time, batteryLevel }) => {
    const user = getUser(socket.id)
    const data = {
      userId: String(user.userId),
      data: msgs,
      room: room,
      time: String(time),
      batteryLevel: batteryLevel,
    }
    // io.to(socket.id).emit('newUser', "res.data.data")
    console.log(data)
    axios.post('https://diewithme-13.herokuapp.com/users/newMsg', data)
      .then(res => {
        if (res.data.success) {
          io.in(room).emit("messagercv", res.data.msg)
          // socket.to(room).emit("messagercv1", res.data.msg)
          console.log("after reciveve message")
        }
      })

  })
  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
  });

  // when call to join room
  socket.on('join-room', room => {
    socket.join(room)
    // room can be any name 
  })
  socket.on('leave-room', room => {
    socket.leave(room)
    // room can be any name 
  })

  socket.on('typing', ({ username, room }) => {
    socket.to(room).emit('isTyping', username)
  })

  socket.on('msgLike', (data) => {
    console.log(data)
    axios.patch('https://diewithme-13.herokuapp.com/users/like', data)
      .then(res => {
        if (res.data.success) {
          const user = getUserId(res.data.user._id)
          if (user)
            socket.to(user.socketId).emit('likeRecieved', { likes: res.data.user.likes, newroom: res.data.newroom });
        }
      })
  })
}

server.listen(port);
