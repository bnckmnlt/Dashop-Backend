const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwt");
const { removeUser } = require("../controllers/user.controller");

router.delete("/:id", verifyToken, removeUser);

module.exports = router;
