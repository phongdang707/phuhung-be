const express = require("express");
const userController = require("./user");
const { authenticating, authorizing } = require("../../../middlewares/auth");
const upload = require("../../../middlewares/uploadImage");
const { validateUser } = require("../../../validation/validateUser");

const router = express.Router();

router.get(
  "/",
  authenticating,
  authorizing(["admin"]),
  userController.getUsers
);

router.get("/profile", authenticating, userController.getUsersById);
router.post("/login", userController.login);
router.post("/register", userController.register);

// router.post("/login", userController.login);

module.exports = router;
