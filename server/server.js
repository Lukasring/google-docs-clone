"use strict";
exports.__esModule = true;
var io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
// const io = socketIO(3001,)
// const httpServer = createServer();
// const io = new Server(3001, {
//   ,
// });
io.on("connection", function (socket) {
  console.log("connected!");
});
