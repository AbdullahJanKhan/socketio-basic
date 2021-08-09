const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:19006",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((id) => id !== socketId);
  console.log('users')
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    users.push(socket.id)
    console.log(users, userId)
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on('newMsg', (msgs) => {
    console.log(msgs)
    io.emit('rcv-msg', msgs);
  })
  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
  });
});
