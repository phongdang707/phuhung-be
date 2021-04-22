const multer = require("multer");

// store excel files into one folder
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({
  storage: storage,
});
var uploadmulter = upload.single("file");

module.exports = { uploadmulter };
