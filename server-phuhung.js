// 3rd packages
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");

mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    retryWrites: false,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("TCL: err", err));

//process.env.API_KEY_CLOUD,
//process.env.API_SECRET_CLOUD
// tạo server bằng express
const app = express();
app.use(cors());

// Trình bắt lỗi trong quá trình chạy server
process
  .on("unhandledRejection", (reason, p) => {
    // Bắt lỗi những thứ như promise....
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/upload", express.static("upload"));

app.use("/api/users", require("./routes/api/users"));

app.use("/api/courses", require("./routes/api/courses"));

app.use("/api/students", require("./routes/api/students"));

app.use("/api/teacher", require("./routes/api/teacher"));

app.use("/api/contents", require("./routes/api/contents"));

app.use("/api/exams", require("./routes/api/exams"));

app.use("/api/quiz", require("./routes/api/quiz"));

app.use("/api/test", require("./routes/api/test"));

app.use("/api/result", require("./routes/api/results"));

app.use("/api/data", require("./routes/api/data"));

app.use("/api/attendance", require("./routes/api/attendance"));

app.use("/api/mail", require("./routes/api/sendMail"));

app.get("/", function (req, res, next) {
  res.send("phong");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port} !`);
});

//only use for unit test
// module.exports = app.listen(6000);
