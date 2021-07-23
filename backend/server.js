const http = require("http");
const express = require("express");
const cors = require("cors");
const path = require("path");
const router = require("./router");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 80;
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://chit-chat-socket.herokuapp.com/",
    ],
  },
});

// const io = require("socket.io")(PORT, {
//   cors: {
//     origin: ["http://localhost:3000"],
//   },
// });
const db = require("./db");

db.connect();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/api", router);

app.use("/uploads", express.static(path.join(__dirname, "/../uploads")));
app.use(express.static(path.join(__dirname, "/../frontend/build")));

app.get("*", (req, res) => {
  try {
    res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
  } catch (e) {
    res.send("Welcome to Socket-Chat-App");
  }
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("sendMessage", (message, id, name, callback) => {
    io.emit("message", { text: message, userId: id, userName: name });
    console.log(message, id);
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", {
      text: `user disconnected : ${socket.id}`,
    });
  });
});

app.use(cors());
server.listen(PORT, () => {
  console.log(`Chat API is running on PORT NO - ${PORT}`);
});
