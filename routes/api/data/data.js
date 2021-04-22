const { Exam } = require("../../../models/exams");
const { Course } = require("../../../models/courses");
const { User } = require("../../../models/users");
const ObjectId = require("mongodb").ObjectID;


const getData = (req, res, next) => {
  const {page, rowsPerPage, searchText, collectionName } = req.body;
  switch (collectionName) {
    case "courses":
      Course.find()
        .where("disable")
        .equals(true)
        .select({name_course:1,update_at:1})
        .then((courses) => {
          const newData = courses.filter(item => {
            const itemData = `${item.name_course}` ;
            const textData = searchText.toLowerCase();
            return itemData.toLowerCase().indexOf(textData) > -1;
          });
          let sendData = {
            data: newData
              .reverse()
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
            length: newData.length,
          };
          res.send({ code: 200, data: sendData });
        })
        .catch((err) => res.send({ code: 500, type: err }));
      break;
    case "exams":
      Exam.find()
        .where("disable")
        .equals(true)
        .select({name_exam:1,update_at:1})
        .then((exam) => {
          const newData = exam.filter(item => {
            const itemData = `${item.name_course}` ;
            const textData = searchText.toLowerCase();
            return itemData.toLowerCase().indexOf(textData) > -1;
          });
          let sendData = {
            data: newData
              .reverse()
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
            length: newData.length,
          };
          res.send({ code: 200, data: sendData });
        })
        .catch((err) => res.send({ code: 500, type: err }));
      break;
    case "students":
      User.find({permission: "student"})
        .where("disable")
        .equals(true)
        .select({email: 1,user_name: 1,update_at:1})
        .then((user) => {
          const newData = user.filter(item => {
            const itemData = `${item.email}` ;
            const textData = searchText.toLowerCase();
            return itemData.toLowerCase().indexOf(textData) > -1;
          });
          let sendData = {
            data: newData
              .reverse()
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
            length: newData.length,
          };
          res.send({ code: 200, data: sendData });
        })
        .catch((err) => res.send({ code: 500, type: err }));
      break;
    default:
      break;
  }
};

const getRestoreData = (req, res, next) => {
  const { collectionName, selectRow, time} = req.body;
  switch (collectionName) {
    case "courses":
      Course.findByIdAndUpdate(
        { _id: ObjectId(selectRow) },
        {  disable: false , update_at:time },
        { useFindAndModify: false }
      ).exec();
      break;
    case "exams":
      Exam.findByIdAndUpdate(
        { _id: ObjectId(selectRow) },
        {  disable: false , update_at:time },
        { useFindAndModify: false }
      ).exec();
      break;
    case "students":
      User.findByIdAndUpdate(
        { _id: ObjectId(selectRow) },
        {  disable: false , update_at:time },
        { useFindAndModify: false }
      ).exec();
      break;
    default:
      break;
  }
  res.send({ code: 200, type: "success" });
};

const getRemoveData = (req, res, next) => {
  const { collectionName, selectRow, time} = req.body;
  switch (collectionName) {
    case "courses":
      Course.deleteOne({ _id: ObjectId(selectRow) })
      .exec();
      break;
    case "exams":
      Exam.deleteOne({ _id: ObjectId(selectRow) })
      .exec();
      break;
    case "students":
      User.deleteOne({ _id: ObjectId(selectRow) })
      .exec();
      break;
    default:
      break;
  }
  res.send({ code: 200, type: "success" });
};

module.exports = {
  getData,
  getRestoreData,
  getRemoveData
};
