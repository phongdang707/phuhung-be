const { User } = require("../../../models/users");
const { Course } = require("../../../models/courses");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
var { validationResult } = require("express-validator");
const ObjectId = require("mongodb").ObjectID;
const Excel = require("exceljs");
// var XLSX = require("xlsx");
// var request = require("request");

const getStudent = (req, res, next) => {
  const { page, rowsPerPage, searchText } = req.body;
  User.find({ user_name: { $regex: searchText }, permission: "student" })
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
    permission: "student",
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
const updateStudentById = async (req, res, next) => {
  const { id, position, division, department, location, time } = req.body;
  User.findByIdAndUpdate(id)
    .where("disable")
    .equals(false)
    .then((user) => {
      console.log("user", user);
      user.position = position;
      user.division = division;
      user.department = department;
      user.location = location;
      user.save();
      res.send({ code: 200, data: { user } });
    })
    .catch((err) => res.status(400).json(err));
};
const updatePasswordStudentById = async (req, res, next) => {
  const { id, password } = req.body;
  console.log("req.body", req.body);
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return Promise.reject(err);

    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return Promise.reject(err);
      let passwordUpdate = hash;
      console.log("hash", hash, passwordUpdate);
      try {
        User.findByIdAndUpdate(id)
          .where("disable")
          .equals(false)
          .then((user) => {
            user.password = passwordUpdate;
            user.save();
            console.log("user", user);
            res.send({ code: 200, type: "success" });
          })
          .catch((err) => {
            console.log("err", err);

            return res.send({ code: 500, type: err });
          });
      } catch (error) {
        console.log("error", error);
      }
    });
  });
  // User.findById(id)
  // .then((user) => {
  //   bcrypt.genSalt(10, (err, salt) => {
  //     if (err) return Promise.reject(err);

  //     bcrypt.hash(password, salt, (err, hash) => {
  //       if (err) return Promise.reject(err);
  //       user.password = salt;
  //       try {
  //         user
  //           .save()
  //           .then((user) => res.send({ code: 200, data: "success" })) // success
  //           .catch((err) => res.send({ code: 500, data: "error" })); // err
  //       } catch (error) {
  //         console.log("error", error);
  //       }
  //     });
  //   });
  //   // console.log("user.password", user.password);
  //   // console.log("a", a);
  //   // user.password = a;
  //   // user.save();
  //   // return res.send({ code: 200, data: { user } });
  // })
  // .catch((err) => res.status(400).json(err));
};

const addByExcel = async (req, res, next) => {
  const { data, time } = req.body;
  var countS = 0;
  var countE = 0;
  for (var i = 0; i < data.length; i++) {
    const newUser = new User({
      user_name: data[i].user_name,
      email: data[i].email,
      position: data[i].position,
      division: data[i].division,
      department: data[i].department,
      permission: "student",
      id: uuidv4(),
      course: [],
      location: data[i].location,
      create_at: time,
      update_at: time,
    });
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return Promise.reject(err);
      bcrypt.hash("123456", salt, (err, hash) => {
        if (err) return Promise.reject(err);

        newUser.password = hash;
        try {
          newUser
            .save()
            .then((user) => countS++) // success
            .catch((err) => countE++); // err
        } catch (error) {
          countE++;
        }
      });
    });
  }
  res.send({ code: 200, data: { s: countS, e: countE } });
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
const getStudentByIdForAdmin = async (req, res, next) => {
  const { id } = req.body;
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

function make_book() {
  var ws = XLSX.utils.aoa_to_sheet(data);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
  return wb;
}

const importExcel = async (req, res) => {
  //To convert xlsx to csv
  // let data = fs.readFileSync("./uploads/" + req.file.filename); //read existing contents
  // const filename = `middlewares/uploads/${req.file.filename}`;
  // const sheet = "Current List";
  // // var workbook = XLSX.readFileSync("middlewares/uploads/" + req.file.filename);
  // const workbook = new Excel.Workbook();
  // workbook.xlsx.readFile(filename).then(function () {
  //   var worksheet = workbook.getWorksheet(sheet);
  //   const row = worksheet.getRow(5,);
  //   console.log("worksheet", worksheet);
  //   // worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
  //   // console.log("rowNumber", JSON.stringify(row.values));
  //   // console.log("JSON.stringify(row.values)", JSON.stringify(row.values));
  //   // console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
  //   // });
  // });
  // res.send({ rowNumber: JSON.stringify(row.values) });
};

module.exports = {
  getStudent,
  register,
  deleteStudent,
  getStudentById,
  getStudentDashboard,
  addByExcel,
  getStudentByIdForAdmin,
  // importExcel,
  updateStudentById,
  updatePasswordStudentById,
};
