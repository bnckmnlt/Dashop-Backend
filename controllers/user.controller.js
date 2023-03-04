const User = require("../models/user.model");
const createError = require("../utils/create.error");

const removeUser = async (req, res, next) => {
  const getUser = await User.findById(req.params.id);

  if (req.userId !== getUser._id.toString()) {
    return next(
      createError(
        401,
        "Unauthorized - You are not allowed to delete this account"
      )
    );
  }

  await User.findByIdAndDelete(req.params.id)
    .then(() => {
      return Promise.resolve(
        res.status(200).json({ message: "Successfully Deleted" })
      );
    })
    .catch((err) => {
      return next(createError(err.status, err.message));
    });
};

module.exports = { removeUser };
