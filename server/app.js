const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const formatMessage = require("./utils/formatMSG");
const {
  saveUser,
  getDisconnectUser,
  getSameRoomUsers,
} = require("./utils/user");

const Message = require("./models/Message");
const messageController = require("./controllers/message");

const app = express();
app.use(cors());
app.get("/chat/:roomName", messageController.getOldMessage);

mongoose.connect(process.env.MONGO_URL).then((_) => {
  console.log("Connected to database");
});

const server = app.listen(4000, (_) => {
  console.log("Server is runnig at port : 4000");
});

const io = socketIO(server, {
  cors: "*",
});

//run when client-server connected
io.on("connection", (socket) => {
  console.log("client connected!");

  const BOT = "ROOM MANAGER BOT";

  //fired when user joined room
  socket.on("joined_room", (data) => {
    const { username, room } = data;
    const user = saveUser(socket.id, username, room);
    socket.join(user.room);

    //send welcome message to all joined users
    socket.emit("message", formatMessage(BOT, "Welcome to the room."));

    //send joined message to all other users except joined user
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(BOT, `${user.username} joined the room.`));

    //listen messages from client
    socket.on("message_send", (data) => {
      //send baack message to client
      io.to(user.room).emit("message", formatMessage(user.username, data));

      //store message in database
      Message.create({
        username: user.username,
        message: data,
        room: user.room,
      });
    });

    //send room users on join room
    io.to(user.room).emit("room_users", getSameRoomUsers(user.room));
  });

  //send disconnect message to all users
  socket.on("disconnect", (_) => {
    const user = getDisconnectUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(BOT, `${user.username} left the room.`)
      );
      //update room users when disconnect
      io.to(user.room).emit("room_users", getSameRoomUsers(user.room));
    }
  });
});
