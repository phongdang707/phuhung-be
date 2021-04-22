const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./upload/");
  },
  filename: function(req, file, cb) {
    let type = "";
    //application/octet-stream : khi file ko có đuôi thì nó sẽ ra chuỗi đó tại mimetype
    if (file.mimetype === "application/octet-stream" || !file.mimetype) {
      type = ".jpg";
      cb(null, file.originalname + "-" + Date.now() + type);
    } else {
      // name = file.originalname.split(".")
      cb(null, Date.now() + "-" + file.originalname);
    }
  }
});

const upload = multer({ storage });

module.exports = upload;