const jwt = require("jsonwebtoken");

const authenticating = (req, res, next) => {
  const token = req.header("Authorization");

  const KEY = process.env.SECRET_KEY;
  try {
    const decoded = jwt.verify(token, KEY);
    req.user_info = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      errors: "Token không hợp lệ!",
    });
  }
};

const authorizing = (userTypeArray) => {
  return (req, res, next) => {
    const { permission } = req.user_info.payload;
    if (userTypeArray.indexOf(permission) > -1) {
      return next();
    } else {
      res.status(403).json({ errors: "Bạn không đủ quyền !" });
    }
  };
};

module.exports = {
  authenticating,
  authorizing,
};
