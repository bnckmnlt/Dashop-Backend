const express = require("express");
const router = express.Router();

const {
  getCartItems,
  addCartItems,
  deleteCartItems,
} = require("../controllers/cart.controller");

router.post("/", getCartItems);
router.post("/add", addCartItems);
// router.delete("/:id", deleteCartItems);

module.exports = router;
