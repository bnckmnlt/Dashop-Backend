const User = require("../models/user.model");
const createError = require("../utils/create.error");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  if (req.params.id.length !== 24) {
    return next(createError(400, "Invalid ID Format"));
  }

  const getUser = await User.findById(req.params.id);
  if (!getUser) {
    return next(createError(404, "Resource not found"));
  }

  const token = await req.cookies.accessToken;
  if (!token) {
    return next(createError(401, "Unauthorized - Access Denied"));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return next(
        createError(401, "Invalid or expired token - please log in again")
      );
    }
    req.userId = payload.id;
    next();
  });
};

module.exports = verifyToken;
