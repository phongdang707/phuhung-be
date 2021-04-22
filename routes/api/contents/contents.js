const { Course } = require("../../../models/courses");
const { Content } = require("../../../models/contents");
const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");
const ObjectId = require("mongodb").ObjectID;


const getContentById = (req, res, next) => {
  const { id } = req.body;
  Course.
    findOne({ _id: ObjectId(id) }).
    populate({
        path: 'contents',
        match: {disable:false}
    }).
    exec(function (err, course) {
      if (err) res.send({ code: 500, type: err }); // err
      res.send({ code: 200, data: course });
    });
};

const newContent = (req, res, next) => {
  const { id, title, content, link_file ,time} = req.body;
  const newContent = new Content({
    title,
    content,
    link_file,
    create_at: time,
    update_at:time,
    id: uuidv4(),
  });
  newContent
    .save()
    .then((content) => {
      Course.findByIdAndUpdate({ _id: ObjectId(id)}, { $push: { contents: content._id } }, {useFindAndModify: false}).exec();
      res.send({ code: 200, type: "success" })
    }) // success
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const editContent = (req, res, next) => {
  const { id, id_content, title, content, link_file, time } = req.body;
  Content.updateOne(
    { _id: ObjectId(id_content) },
    {
      $set: {
        title: title,
        content: content,
        link_file: link_file,
        update_at:time,
      },
    }
  )
    .then((course) => {
      res.send({ code: 200, type: "success" })
    })
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const deleteContent = (req, res, next) => {
  const { id , time } = req.body;
  Content.updateOne(
    { _id: ObjectId(id) },
    { $set: { disable: true, update_at: time} }
  )
    .then(() => {
      res.send({ code: 200, type: "success" })
    })
    .catch((err) => res.send({ code: 500, type: err })); // err

};

module.exports = {
  getContentById,
  newContent,
  editContent,
  deleteContent
};
