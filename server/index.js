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

  socket.on("join", (userId) => {
    socket.data.userId = userId;
    io.emit("message", { user: "System", text: `${userId} joined the chat` });
  });

  socket.on("sendMessage", (data) => {
    io.emit("message", { user: data.user, text: data.text });
  });

  socket.on("disconnect", () => {
    if (socket.data.userId)
      io.emit("message", { user: "System", text: `${socket.data.userId} left the chat` });
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});


