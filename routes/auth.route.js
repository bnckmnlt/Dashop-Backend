const express = require("express");
const router = express.Router();
const {
  signupUser,
  signinUser,
  logoutUser,
} = require("../controllers/auth.controller");

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.post("/logout", logoutUser);

module.exports = router;
