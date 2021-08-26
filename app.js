const express = require("express");
const morgan = require("morgan");
require("express-async-errors");
require("dotenv").config();
connectDB = require("./src/utils/dbConnect");

const app = express();
const cors = require("cors");

app.get("/", function (req, res) {
   res.send("Hello Library Manage Backend!");
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", require("./src/routes/auth.route"));
app.use("/api/employee", require("./src/routes/employee.route"));

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
app.listen(PORT);
console.log(`Server listen port: ${PORT}`);
