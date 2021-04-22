const express = require("express");
const contentsController = require("./contents");
const { authenticating, authorizing } = require("../../../middlewares/auth");
const router = express.Router();

router.post("/getContentById", contentsController.getContentById);
router.post("/newContent",authenticating, authorizing(["admin"]), contentsController.newContent);
router.post("/editContent",authenticating, authorizing(["admin"]), contentsController.editContent);
router.post("/deleteContent",authenticating, authorizing(["admin"]), contentsController.deleteContent);
module.exports = router;
