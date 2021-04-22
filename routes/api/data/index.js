const express = require("express");
const dataController = require("./data");
const { authenticating, authorizing } = require("../../../middlewares/auth");
const router = express.Router();

router.post("/getData",authenticating, authorizing(["admin"]), dataController.getData);
router.post("/getRestoreData",authenticating, authorizing(["admin"]), dataController.getRestoreData);
router.post("/getRemoveData",authenticating, authorizing(["admin"]), dataController.getRemoveData);
module.exports = router;
