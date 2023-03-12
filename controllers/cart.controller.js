const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const createError = require("../utils/create.error");

const getCartItems = async (req, res, next) => {
  Cart.findOne({ userId: req.body._id })
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
};

const addCartItems = async (req, res, next) => {
  const { userId, productId, name, desc, img, price, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return createError(401, "Cart not found");
    }

    const existingItem = await Cart.findOne({
      userId: userId,
      cartItems: { $elemMatch: { productId: productId } },
    });

    if (existingItem) {
      await Cart.updateOne(
        {
          userId: userId,
          cartItems: { $elemMatch: { productId: productId } },
        },
        {
          $inc: { "cartItems.$.quantity": quantity },
        }
      );
    } else {
      cart.cartItems.push({
        productId: productId,
        name: name,
        desc: desc,
        img: img,
        price: price,
        quantity: quantity,
      });
    }

    await cart
      .save()
      .then((result) => {
        Promise.resolve(res.status(200).json({ data: result }));
      })
      .catch((err) =>
        Promise.resolve(next(createError(err.status, err.message)))
      );
  } catch (err) {
    return next(createError(err.status, err.message));
  }
};

const deleteCartItems = async (req, res, next) => {
  Cart.updateOne(
    { userId: req.body.userId },
    { $pull: { cartItems: { productId: req.body.productId } } }
  )
    .then((result) => {
      Promise.resolve(res.status(200).json({ result }));
    })
    .catch((err) => {
      return next(createError(err.status, err.message));
    });
};

module.exports = {
  getCartItems,
  addCartItems,
  deleteCartItems,
};
