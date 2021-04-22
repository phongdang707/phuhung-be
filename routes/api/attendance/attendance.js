const { Attendance } = require("../../../models/attendance");
const { Course } = require("../../../models/courses");
const ObjectId = require("mongodb").ObjectID;
const { v4: uuidv4 } = require("uuid");

const submit = (req, res, next) => {
  const {id, selected, time } = req.body;
  const newAtt = new Attendance({
    id_course:id,
    students:selected,
    create_at: time,
    update_at: time,
    id: uuidv4(),
  });
  newAtt
    .save()
    .then((att) => {
        Course.findByIdAndUpdate(
          { _id: ObjectId(id) },
          { $push: { attendance: att._id } },
          { useFindAndModify: false }
        ).exec();
      res.send({ code: 200, type: "success" });
    }) // success
    .catch((err) => res.send({ code: 500, type: err })); // err
};

module.exports = {
  submit,
};
