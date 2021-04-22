const validator = require("validator");
const _ = require("lodash");
const { User } = require("../models/users");

// Đây là hàm bất đồng bộ nên chỗ nào xài nó phải sử dụng async await
validateRegisterInput = async (data) => {
  let errors = {};

  // data.first_and_last_name = _.get(data, "first_and_last_name", "");
  // console.log("data.first_and_last_name", data.first_and_last_name);
  // data.user_name = _.get(data, "user_name", "");
  // data.password = _.get(data, "password", "");
  // data.permission = _.get(data, "permission", "");

  // const first_and_last_name = await User.findOne({ first_and_last_name: data.first_and_last_name });
  // if (first_and_last_name) errors.first_and_last_name = "Tai khoan da ton tai !";
  
  // // if (first_and_last_name.length <= 0) errors.first_and_last_name = "Vui long dien thong tin tai khoan";

  // return {
  //   isValid: _.isEmpty(errors),
  //   errors,
  // };
};

module.exports = validateRegisterInput;
