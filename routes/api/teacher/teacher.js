const { User } = require("../../../models/users");
const { Course } = require("../../../models/courses");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
var { validationResult } = require("express-validator");
const ObjectId = require("mongodb").ObjectID;

const getTeacher = (req, res, next) => {
  const { page, rowsPerPage, searchText } = req.body;
  User.find({ user_name: { $regex: searchText }, permission: "teacher" })
    .where("disable")
    .equals(false)
    .then((user) => {
      let sendData = {
        data: user
          .reverse()
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        length: user.length,
      };
      res.status(200).send(sendData);
    })
    .catch((err) => res.status(400).json(err)); // err
};

const getTeacherListByNameAndId = (req, res, next) => {
  User.find({
    permission: "teacher",
  })
    .select("user_name")
    .where("disable")
    .equals(false)
    .then((user) => {
      console.log("user", user);
      // let sendData = {
      //   data: user,
      // };
      const data = [];
      user.forEach((each) => {
        console.log("each", each);
        // const item = {
        //   value,
        //   lable,
        // };
        // item.value = each._id;
        // item.lable = each.user_name;
        data.push({ lable: each.user_name, value: each._id });
      });
      res.status(200).send(data);
    })
    .catch((err) => res.status(400).json(err)); // err
};
const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ code: 500, errors: errors.array() });
  }

  const {
    user_name,
    password,
    email,
    position,
    division,
    department,
    location,
    time,
  } = req.body;

  const newUser = new User({
    user_name,
    password,
    email,
    position,
    division,
    department,
    permission: "teacher",
    id: uuidv4(),
    course: [],
    location,
    create_at: time,
    update_at: time,
  });
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return Promise.reject(err);

    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return Promise.reject(err);

      newUser.password = hash;
      try {
        newUser
          .save()
          .then((user) => res.send({ code: 200, data: "success" })) // success
          .catch((err) => res.send({ code: 500, data: "error" })); // err
      } catch (error) {
        console.log("error", error);
      }
    });
  });
};
const deleteStudent = (req, res, next) => {
  const { selected, time } = req.body;
  selected.map((select) => {
    User.findOne({ _id: ObjectId(select) })
      .then((user) => {
        user.course.map((del) => {
          Course.findByIdAndUpdate(
            { _id: ObjectId(del) },
            { $pull: { students: select } },
            { useFindAndModify: false }
          ).exec();
        });
        User.findByIdAndUpdate(
          { _id: ObjectId(select) },
          { $set: { disable: true, update_at: time } },
          { useFindAndModify: false }
        ).exec();
      })
      .catch((err) => res.send({ code: 500, type: err }));
  });
  res.status(200).send("Success");
};
const getStudentById = async (req, res, next) => {
  const token = req.headers.authorization;
  let id;
  jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
    id = decoded.payload.id;
  });
  User.findById(id)
    .where("disable")
    .equals(false)
    .then((user) => {
      res.send({ code: 200, data: { user } });
    })
    .catch((err) => res.status(400).json(err));
};
const getStudentDashboard = async (req, res, next) => {
  User.findById(req.user_info.payload.id)
    .where("disable")
    .equals(false)
    .populate({
      path: "course",
      match: { disable: false },
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => res.status(400).json(err));
};
const getTeacherAll = (req, res, next) => {
  const { page, rowsPerPage, searchText } = req.body;
  User.find({ permission: "teacher" })
    .where("disable")
    .equals(false)
    .select({
      user_name: 1,
      email: 1,
      position: 1,
      division: 1,
      department: 1,
      location: 1,
      create_at: 1,
    })
    .then((user) => {
      const newData = user.filter((item) => {
        console.log("item", item);
        const itemData = `${item.user_name}`;
        const textData = searchText.toLowerCase();
        return itemData.toLowerCase().indexOf(textData) > -1;
      });
      let sendData = {
        data: newData
          .reverse()
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        length: newData.length,
      };
      res.status(200).send(sendData);
    })
    .catch((err) => res.status(400).json(err)); // err
};
module.exports = {
  register,
  deleteStudent,
  getStudentById,
  getStudentDashboard,
  getTeacher,
  getTeacherAll,
  getTeacherListByNameAndId,
};
