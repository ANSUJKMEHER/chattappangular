const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", ({ userId, room }) => {
    socket.data.userId = userId;
    socket.data.room = room;
    socket.join(room);
    io.to(room).emit("message", { user: "System", text: `${userId} joined room ${room}` });
  });

  socket.on("sendMessage", (data) => {
    io.to(data.room).emit("message", { user: data.user, text: data.text });
  });

  socket.on("disconnect", () => {
    const room = socket.data.room;
    const userId = socket.data.userId;
    if (room && userId) {
      io.to(room).emit("message", { user: "System", text: `${userId} left the room` });
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
