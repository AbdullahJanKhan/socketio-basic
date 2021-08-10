var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var io = require('socket.io')(8900, {
  cors: {
    origin: "http://localhost:19006",
  },
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

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

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect

  //take userId and socketId from user
  socket.on("addUser", ({ username, userId, roomname }) => {
    addUser({ username, userId, roomname, socketId: socket.id })
    console.log(users)
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on('newMsg', (msgs, room) => {
    console.log(room, msgs)
    socket.to(room).emit('rcv-msg', msgs);
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
});

module.exports = app;
