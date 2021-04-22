const { Course } = require("../../../models/courses");
const { User } = require("../../../models/users");
const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");
const ObjectId = require("mongodb").ObjectID;
const _ = require("lodash");

const newCourse = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ code: 500, errors: errors.array() });
  }
  const {
    name_course,
    teacher,
    location,
    date,
    require_course,
    students,
    description,
    time,
  } = req.body;

  const newCourse = new Course({
    name_course,
    description,
    teacher,
    location,
    date,
    require_course,
    students,
    create_at: time,
    update_at: time,
    id: uuidv4(),
  });
  newCourse
    .save()
    .then((course) => {
      students.map((student) => {
        User.findByIdAndUpdate(
          { _id: ObjectId(student) },
          { $push: { course: course._id } },
          { useFindAndModify: false }
        ).exec();
      });
      User.findByIdAndUpdate(
        { _id: ObjectId(teacher) },
        { $push: { course: course._id } }
      ).exec();

      res.send({ code: 200, type: "success" });
    }) // success

    .catch((err) => res.send({ code: 500, type: err })); // err
};

const editCourse = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ code: 500, errors: errors.array() });
  }
  const {
    name_course,
    teacher,
    location,
    date,
    require_course,
    id,
    students,
    description,
    time,
  } = req.body;
  Course.findOne({ _id: ObjectId(id) })
    .then((course) => {
      var arr = [];
      course.students.map((item) => arr.push(item + ""));
      const diffDelete = _.difference(arr, students);
      const diffAdd = _.difference(students, arr);
      diffAdd.map((add) => {
        User.findByIdAndUpdate(
          { _id: ObjectId(add) },
          { $push: { course: id } },
          { useFindAndModify: false }
        ).exec();
      });
      diffDelete.map((del) => {
        User.findByIdAndUpdate(
          { _id: ObjectId(del) },
          { $pull: { course: id } },
          { useFindAndModify: false }
        ).exec();
      });
      Course.findByIdAndUpdate(
        { _id: ObjectId(id) },
        {
          $set: {
            name_course: name_course,
            description: description,
            teacher: teacher,
            location: location,
            date: date,
            require_course: require_course,
            students: students,
            update_at: time,
          },
        },
        { useFindAndModify: false }
      ).exec();
      res.send({ code: 200, type: "success" });
    })
    .catch((err) => res.send({ code: 500, type: err }));
};

const getAllCourse = (req, res, next) => {
  const { page, rowsPerPage, searchText } = req.body;
  Course.find({ name_course: { $regex: searchText } })
    .populate({ path: "teacher", select: "user_name" })
    .where("disable")
    .equals(false)
    .exec()
    .then((courses) => {
      let sendData = {
        data: courses
          .reverse()
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        length: courses.length,
      };
      res.send({ code: 200, data: sendData });
    })
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const deleteCourse = (req, res, next) => {
  const { selected, time } = req.body;
  selected.map((select) => {
    Course.findOne({ _id: ObjectId(select) })
      .then((course) => {
        course.students.map((del) => {
          User.findByIdAndUpdate(
            { _id: ObjectId(del) },
            { $pull: { course: select } },
            { useFindAndModify: false }
          ).exec();
        });
        Course.findByIdAndUpdate(
          { _id: ObjectId(select) },
          { $set: { disable: true, update_at: time } },
          { useFindAndModify: false }
        ).exec();
      })
      .catch((err) => res.send({ code: 500, type: err }));
  });
  res.send({ code: 200, type: "success" });
};

const getCourseById = (req, res, next) => {
  const { id } = req.body;
  Course.findOne({ _id: ObjectId(id) })
    .populate({
      path: "teacher",
    })
    .then((courses) => {
      res.send({ code: 200, data: courses });
    })
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const getDetailCourseById = (req, res, next) => {
  const {
    id,
    pageTest,
    rowsPerPageTest,
    pageStudent,
    rowsPerPageStudent,
  } = req.body;
  Course.findOne({ _id: ObjectId(id) })
    .populate({
      path: "exams",
      match: { disable: false },
    })
    .populate({
      path: "students",
    })

    .exec(function (err, course) {
      if (err) return res.send({ code: 500, type: err });
      const lengthTest = course.exams.length;
      course.exams = course.exams
        .reverse()
        .slice(
          pageTest * rowsPerPageTest,
          pageTest * rowsPerPageTest + rowsPerPageTest
        );
      const lengthStudent = course.students.length;
      course.students = course.students
        .reverse()
        .slice(
          pageStudent * rowsPerPageStudent,
          pageStudent * rowsPerPageStudent + rowsPerPageStudent
        );
      let sendData = {
        data: course,
        lengthTest: lengthTest,
        lengthStudent: lengthStudent,
      };
      res.send({ code: 200, data: sendData });
    });
};

const checkInfo = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ code: 500, errors: errors.array() });
  }
  res.send({ code: 200, type: "success" });
};

const getDetailCourseStudent = (req, res, next) => {
  const { id } = req.body;
  Course.findOne(
    { _id: ObjectId(id) },
    {
      name_course: 1,
      contents: 1,
      description: 1,
      exams: 1,
      teacher: 1,
      status: 1,
      students: 1,
    }
  )
    .populate({
      path: "exams",
      match: { disable: false },
    })
    .populate({
      path: "contents",
      match: { disable: false },
    })
    .populate({
      path: "students",
      match: { disable: false },
    })
    .exec(function (err, course) {
      if (err) return res.send({ code: 500, type: err });
      res.send({ code: 200, data: course });
    });
};

const changeStatus = (req, res, next) => {
  const { status, id, time } = req.body;
  Course.findByIdAndUpdate(
    { _id: ObjectId(id) },
    { $set: { status: status, update_at: time } },
    { useFindAndModify: false }
  ).exec();
  res.send({ code: 200, type: "success" });
};

const getCourseAndTest = (req, res, next) => {
  Course.find()
    .where("disable")
    .equals(false)
    .populate({
      path: "exams",
      match: { disable: false },
      select: { name_exam: 1 },
    })
    .select({ name_course: 1, exams: 1 })
    .then((courses) => {
      res.send({ code: 200, data: courses });
    })
    .catch((err) => res.send({ code: 500, type: err }));
};

const addByExcel = async (req, res, next) => {
  const { data, time } = req.body;
  var countS = 0;
  var countE = 0;
  for (var i = 0; i < data.length; i++) {
    const newCourse = new Course({
      name_course: data[i].name_course,
      description: data[i].description,
      teacher: data[i].teacher_id,
      location: data[i].location,
      date: data[i].date,
      id: uuidv4(),
      create_at: time,
      update_at: time,
    });
    try {
      newCourse
        .save()
        .then((user) => countS++) // success
        .catch((err) => countE++); // err
    } catch (error) {
      countE++;
    }
  }
  res.send({ code: 200, data: { s: countS, e: countE } });
};
const getCourseAssign = (req, res, next) => {
  const { page, rowsPerPage } = req.body;
  Course.find({ status:true })
    .populate({ path: "teacher", select: "user_name" })
    .where("disable")
    .equals(false)
    .exec()
    .then((courses) => {
      const newData = courses.filter(item => {
        var check = false;
        item.students.map(x=>{
          if(x==req.user_info.payload.id)
            return check = true;
        })
        return !check;
      });
      let sendData = {
        data: newData
          .reverse(),
          // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        length: newData.length,
      };
      res.send({ code: 200, data: sendData });
    })
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const assignCourse = (req, res, next) => {
  const { data } = req.body;
    User.findByIdAndUpdate(
      { _id: ObjectId(req.user_info.payload.id) },
      { $push: { course: data } },
      { useFindAndModify: false }
    ).exec();
    Course.findByIdAndUpdate(
      { _id: ObjectId(data) },
      { $push: { students: req.user_info.payload.id } },
      { useFindAndModify: false }
    ).exec();
    res.send({ code: 200, type: "success" });
};

module.exports = {
  newCourse,
  editCourse,
  getAllCourse,
  deleteCourse,
  getCourseById,
  checkInfo,
  getDetailCourseById,
  getDetailCourseStudent,
  changeStatus,
  getCourseAndTest,
  addByExcel,
  getCourseAssign,
  assignCourse
};
