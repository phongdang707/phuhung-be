const { User } = require("../../../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
var { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const register = async (req, res, next) => {
  // const { isValid, errors } = await validationResult(req.body);
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   res.status(422).json({ errors: errors.array() });
  //   return;
  // }
  // if (!isValid) return res.status(400).json(errors);

  const {
    name,
    user_name,
    school,
    class_room,
    password,
    phong_number_student,
    phong_number_family,
    grade,
    address,
    year_of_birth,
  } = req.body;

  const newUser = new User({
    name,
    school,
    class_room,
    user_name,
    password,
    permission: "admin",
    id: uuidv4(),
    phong_number_student,
    phong_number_family,
    grade,
    address,
    year_of_birth,
    course: [],
  });
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return Promise.reject(err);

    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return Promise.reject(err);

      newUser.password = hash;
      try {
        newUser
          .save()
          .then((user) => res.status(200).json(user)) // success
          .catch((err) => res.status(400).json(err)); // err
      } catch (error) {
        console.log("error", error);
      }
    });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  console.log("email", email, password);
  User.findOne({ email })
    .where("disable")
    .equals(false)
    .then((user) => {
      if (!user)
        return res
          .status(400)
          .send({ error: "Tên tài khoản hoặc mật khẩu không hợp lệ" });
      bcrypt.compare(password, user.password).then((isMath) => {
        console.log("password", password, user.password);
        if (!isMath)
          return res
            .status(400)
            .send({ error: "Tên tài khoản hoặc mật khẩu không hợp lệ" });
        const payload = {
          email: user.email,
          permission: user.permission,
          id: user._id,
        };
        const KEY = process.env.SECRET_KEY;
        jwt.sign(
          {
            payload,
          },
          KEY,
          { expiresIn: "50h" },
          (err, token) => {
            if (err) return res.status(400).json(err);
            return res.status(200).json({
              sucess: true,
              token: token,
              id: user._id,
              permission: user.permission,
            });
          }
        );
      });
    })
    .catch((err) => res.status(400).json(err)); // err
};

const getUsers = async (req, res, next) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => res.status(400).json(err)); // err
};

const getUsersById = async (req, res, next) => {
  const { payload } = req.user_info;
  User.findById(payload.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => console.log(err));
};

module.exports = { register, login, getUsers, getUsersById };
