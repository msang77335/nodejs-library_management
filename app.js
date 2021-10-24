const express = require("express");
const morgan = require("morgan");
const socket = require("./src/socket");
const http = require("http");
require("express-async-errors");
require("dotenv").config();
connectDB = require("./src/utils/dbConnect");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
socket.init(server);

app.get("/", function (req, res) {
   res.send("Hello Library Manage Backend!");
});

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", require("./src/routes/auth.route"));
app.use("/api/staff", require("./src/routes/staff.route"));
app.use("/api/staff-position", require("./src/routes/position.route"));
app.use("/api/staff-part", require("./src/routes/part.route"));
app.use("/api/staff-degree", require("./src/routes/degree.route"));
app.use("/api/reader", require("./src/routes/reader.route"));
app.use("/api/book", require("./src/routes/book.route"));
app.use("/api/category", require("./src/routes/category.route"));
app.use("/api/reader-category", require("./src/routes/reader_category.route"));
app.use("/api/borrow", require("./src/routes/borrow_receipt.route"));
app.use("/api/fine", require("./src/routes/fine_receipt.route"));
app.use("/api/messages", require("./src/routes/message.router"));

app.use(function (req, res, next) {
   res.status(404).json({
      error_message: "Not found",
   });
});

app.use(function (err, req, res, next) {
   res.status(500).json({
      error_message: "Something broke!",
   });
});

const PORT = 8000;

server.listen(PORT);

console.log(`Server listen port: ${PORT}`);
