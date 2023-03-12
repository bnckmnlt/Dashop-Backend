const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const createError = require("../utils/create.error");

const getCartItems = async (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((userFound) => {
      const user = userFound;
      if (!user) {
        return Promise.reject(createError(400, "User not found"));
      }

      Cart.findOne({ user: user._id })
        .then((cart) => {
          if (!cart) {
            return Promise.reject(createError(401, "Invalid credentials"));
          }

          const cartItems = cart.cartItems;
          Promise.resolve(res.status(200).json({ cartItems }));
        })
        .catch((err) => {
          return next(createError(err.status, err.message));
        });
    })
    .catch((err) => {
      return next(createError(err.status, err.message));
    });
};

const addCartItems = async (req, res, next) => {
  const { userId, productId, name, desc, img, price, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return createError(401, "Cart not found");
    }

    cart.cartItems.push({
      productId: productId,
      name: name,
      desc: desc,
      img: img,
      price: price,
      quantity: quantity,
    });

    await cart.save();
  } catch (err) {
    return next(createError(err.status, err.message));
  }
};

const deleteCartItems = async () => {};

module.exports = {
  getCartItems,
  addCartItems,
  deleteCartItems,
};
