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
var io = require('socket.io')(server, {
  cors: {
    origin: "*",
  },
});

var mongoose = require('mongoose');

var axios = require('axios');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


<<<<<<< HEAD
const connection = mongoose.connect(process.env.MONGOURI, {
=======
const connection = mongoose.connect("uri", {
>>>>>>> 4e73a83a80b292429a92d18fd64fd09a4527daa6
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

io.on("connection", (socket) => {
  //when ceonnect
  //take userId and socketId from user
  socket.on("addUser", ({ username, userId, roomname }) => {
    addUser({ username, userId, roomname, socketId: socket.id })
    axios.get('https://diewithme-13.herokuapp.com/users/getMsgs/' + roomname)
      .then(res => {
        if (res.data.success) {
          io.to(socket.id).emit('newUser', res.data.data)
        }
      })
  });

  //send and get message
  socket.on('newMsg', (msgs, room) => {
    const user = getUser(socket.id)
    console.log(msgs[msgs.length - 1])
    const data = {
      userId: String(user.userId),
      data: msgs[msgs.length - 1],
      room: room,
    }
    axios.post('https://diewithme-13.herokuapp.com/users/newMsg', data)
      .then(res => {
        if (res.data.success) {
          io.in(room).emit('rcv-msg', res.data.msg);
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

  socket.on('typing', (username, room) => {
    socket.to(room).emit('isTyping', username)
  })

  socket.on('msgLike', (data) => {
    console.log(data)
    axios.patch('https://diewithme-13.herokuapp.com/users/like', data)
      .then(res => {
        const user = getUserId(res.data.user._id)
        socket.to(user.socketId).emit('likeRecieved', user);
      })
  })
});

server.listen(port);
