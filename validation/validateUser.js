// const validator = require("validator");
// const _ = require("lodash");
// const { User } = require("../models/users");
// const { check, body } = require("express-validator");

// // Đây là hàm bất đồng bộ nên chỗ nào xài nó phải sử dụng async await
// validateUser = async (data) => {
//   let errors = {};

//   data.user_name = _.get(data, "user_name", "");
//   data.permission = _.get(data, "permission", "");
//   data.password = _.get(data, "password", "");
//   data.confirm_password = _.get(data, "confirm_password", "");
//   data.phong_number_student = _.get(data, "phong_number_student", "");
//   data.phong_number_family = _.get(data, "phong_number_family", "");

//   const user_name = await User.findOne({ user_name: data.user_name });
//   if (user_name) errors.user_name = "Tên tài khoản đã tồn tại !";
//   if (data.password !== data.confirm_password)
//     errors.password = "Mật khẩu không trùng với mật khẩu xác nhận !";

//   validator.isMobilePhone(data.phong_number_student)
//     ? null
//     : (errors.phong_number_student = "Số điện thoại không đúng định dạng");

//   validator.isMobilePhone(data.phong_number_family)
//     ? null
//     : (errors.phong_number_family = "Số điện thoại không đúng định dạng");

//   return {
//     isValid: _.isEmpty(errors),
//     errors,
//   };
// };

// // let validateRegisterUser = () => {
// //   return [
// //     body("user_name", "username does not Empty").not().isEmpty(),
// //     body("user_name", "username must be Alphanumeric").isAlphanumeric(),
// //     body("user_name", "username more than 6 degits").isLength({ min: 6 }),
// //     // check("user.email", "Invalid does not Empty").not().isEmpty(),
// //     // check("user.email", "Invalid email").isEmail(),
// //     // check("user.birthday", "Invalid birthday").isISO8601("yyyy-mm-dd"),
// //     // check("user.password", "password more than 6 degits").isLength({ min: 6 }),
// //   ];
// // };

// module.exports = { validateUser };

const { body, validationResult } = require("express-validator");
const { User } = require("../models/users");

let validateUser = () => {
  return [
    body("email").custom((value, { req }) => {
      return User.findOne({ email: value })
        .where("disable")
        .equals(false)
        .then((student) => {
          if (student) {
            if (req.params.id == student._id) return;
            return Promise.reject("Email đã tồn tại!");
          }
        });
    }),
  ];
};

module.exports = { validateUser };
