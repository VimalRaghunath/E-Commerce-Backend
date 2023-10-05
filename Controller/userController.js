const mongoose = require("mongoose");
const User = require("../Model/userSchema");
const product = require("../Model/productSchema");
const jwt = require("jsonwebtoken");
const { joiUservalidationSchema } = require("../Model/ValidationSchema");
const bcrypt = require("bcrypt");
const stripe = require("stripe")(process.env.SECRET_KEY_PAYMENT);

mongoose.connect("mongodb://0.0.0.0:27017/E-commerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  //  create a user with name, email, username(POST api/users/register)-------------

  createuser: async (req, res) => {
    const { value, error } = joiUservalidationSchema.validate(req.body);

    if (error) {
      return res.json(error.message);
    }

    const { name, email, username, password } = value;

    await User.create({
      name: name,
      email: email,
      username: username,
      password: password,
    });
    res.status(200).json({
      status: "success",
      message: "user registration successfull",
    });
  },

  //  user login with username,password (POST api/users/login) -----------------------------

  userLogin: async (req, res) => {
    const { value, error } = joiUservalidationSchema.validate(req.body);

    if (error) {
      return res.json(error.message);
    }
    const { username, password } = value;

    const user = User.findOne({ username: username, password: password });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const token = jwt.sign(
      { username: User.username },
      process.env.USER_ACCESS_TOKEN_SECRET
    );
    res
      .status(200)
      .json({ status: "success", message: "login successfull", data: token });
  },

  //  get all product details [GET api/users/products]------------------------------------

  productList: async (req, res) => {
    const productList = await product.find();
    res.status(200).json({
      status: "success",
      message: "product listed successfully",
      data: productList,
    });
  },

  // get a product details as json object[POST api/users/products?]----------------------

  productById: async (req, res) => {
    const id = req.query.id;
    const productById = await product.findById(id);

    if (!productById) {
      return res.status(404).json({ error: "product not found" });
    }

    res.status(200).json({
      status: "success",
      message: "product listed successfully",
      data: productById,
    });
  },

  // get list of product by categoryvice [POST api/users/products/category]-------------------------

  productByCategory: async (req, res) => {
    const category = req.params.categoryname;
    const products = await product.find({ category: category });

    if (!products) {
      return res.status(404).json({ error: "category not found" });
    }

    req.status(200).json({
      status: "success",
      message: "successfully listed the category",
      data: products,
    });
  },

  // adding products to the cart user [POST api/users/:id/cart]------------------------

  addToCart: async (req, res) => {
    const userId = req.params.id;
    const productId = req.body.productId;

    await User.updateOne({ _id: userId }, { $push: { cart: productId } });
    res.status(200).json({
      status: "success",
      message: "successfully added product to the cart",
    });
  },

  // adding products to the wishlist by user [post api/users/:id/wishlist]-------------------

  addTowishlist: async (req, res) => {
    const userId = req.params.id;
    const productId = req.body.productId;

    await User.updateOne({ _id: userId }, { $push: { wishlist: productId } });
    res.status(200).json({ 
      status: "success",
      message: "product added to wishlist successfully",
    });
  },

  // showing all products in the cart to the user [GET api/users/:id/cart]---------------------------

  viewCart: async (req, res) => {
    const userId = req.params.id;
    const Cart = await User.findOne({ _id: userId }).populate("cart");
    if (!Cart) {
      return res.status(404).json({ error: "cart is empty" });
    }
    res.status(200).json({
      status: "success",
      message: "product successfully fetched",
      data: Cart.cart,
    });
  },

  // showing all products in the wishlist to the user [GET api/users/:id/wishlist]----------------------------

  viewwishlist: async (req, res) => {
    const userId = req.params.id;
    const wishlist = await User.find({ _id: userId }).populate("wishlist");
    if (!wishlist) {
      return res.status(404).json({ error: "wishlist is empty" });
    }
    res.status(200).json({
      status: "success",
      message: "product successfully fetched",
      data: wishlist,
    });
  },

  // removing products in the cart by the user [DELETE api/users/:id/cart]----------------------------------

  deleteCart: async (req, res) => {
    const userId = req.params.id;
    const productId = req.body.productId;
    await User.updateOne({ _id: userId }, { $pull: { cart: productId } });
    res.status(200).json({
      status: "success",
      message: "successfully deleted product from cart",
    });
  },

  // removing products in the wishlist by the user [DELETE api/users/:id/wishlist]-------------------------------

  deletewishlist: async (req, res) => {
    const userId = req.params.id;
    const productId = req.body.productId;
    await User.updateOne({ _id: userId }, { $pull: { wishlist: productId } });
    res.status(200).json({
      status: "success",
      message: "successfully deleted product from wishlist",
    });
  },

  // Payment by user [POST api/users/:id/payment]----------------------------

  payment: async (req, res) => {
    const user = await User.find({ _id: req.params.id }).populate("cart");
    const cartitem = user[0].cart.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      };
    });

    console.log(cartitem);
    if (cartitem.length > 0) {
      const session = await stripe.checkout.sessions.create({
        line_items: cartitem,
        mode: "payment",
        success_url: "http://127.0.0.1:3000/api/users/payment/success",
        cancel_url: "http://127.0.0.1:3000/api/users/payment/cancel",
      });
      temp = {
        cartitem: user[0].cart.map((item) => item._id),
        id: req.params.id,
        paymentid: session.id,
        amount: session.amount_total / 100,
      };

      res.send({ url: session.url });
    } else {
      res.send("there is no cart item");
    }
  },

  // Payment by user success [GET api/users/payment/success]-----------------------------------

  paymentSuccess: async (req, res) => {
    console.log(temp);
    const user = await User.find({ _id: temp.id });
    if (user.length != 0) {
      await User.updateOne(
        { _id: temp.id },
        {
          $push: {
            orders: {
              product: temp.cartitem,
              date: new Date(),
              orderid: Math.random(),
              paymentid: temp.paymentid,
              totalamount: temp.amount,
            },
          },
        }
      );
      await User.updateOne({ _id: temp.id }, { cart: [] });
    }

    res.status(200).json({
      status: "success",
      message: "successfully added in order",
    });
  },

  // payment by user cancel [POST api/users/payment/cancel]-----------------------------------

  paymentCancel: async (req, res) => {
    res.json("payment cancelled");
  },
};
