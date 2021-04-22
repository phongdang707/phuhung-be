const express = require("express");
const userController = require("./user");
const { authenticating, authorizing } = require("../../../middlewares/auth");
const upload = require("../../../middlewares/uploadImage");
const { validateUser } = require("../../../validation/validateUser");

const router = express.Router();

router.post("/sendMail", userController.sendMail);

// router.post("/login", userController.login);

module.exports = router;
