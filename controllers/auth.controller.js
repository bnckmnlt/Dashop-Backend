const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("../utils/create.error");

const signupUser = async (req, res, next) => {
  if (!req.body.fullname || !req.body.email || !req.body.password) {
    return next(createError(422, "Missing required field"));
  }

  const hashName = bcrypt.hashSync(req.body.fullname, 10);
  const hashPass = bcrypt.hashSync(req.body.password, 10);

  const createUser = new User({
    ...req.body,
    fullname: hashName,
    password: hashPass,
  });

  try {
    const savedUser = await createUser.save();
    const createCart = new Cart({ userId: savedUser._id.toString() });
    await createCart.save();
    return res.status(201).json({
      message: "Successfully Registered",
      data: { email: savedUser.email },
    });
  } catch (err) {
    if (err.name === "MongoServerError" && err.code === 11000) {
      return next(createError(409, "Email already taken"));
    }
    return next(createError(400, err.message));
  }
};

const signinUser = async (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((userFound) => {
      const user = userFound;
      if (!user) {
        return Promise.reject(createError(400, "User not found"));
      }

      const isCorrect = bcrypt.compareSync(req.body.password, user.password);
      if (!isCorrect) {
        return Promise.reject(createError(401, "Email/Password is incorrect"));
      }

      const token = jwt.sign(
        {
          id: user._id,
          fullname: user.fullname,
          isSeller: user.isSeller,
        },
        process.env.JWT_SECRET_KEY
      );

      const { fullname, password, ...info } = user._doc;
      Promise.resolve(
        res
          .cookie("accessToken", token, { httpOnly: true })
          .status(200)
          .json({ data: info })
      );
    })
    .catch((err) => {
      return next(createError(err.status, err.message));
    });
};

const logoutUser = async (req, res, next) => {
  return res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json({ message: "Successfully logged out" });
};

module.exports = {
  signupUser,
  signinUser,
  logoutUser,
};
