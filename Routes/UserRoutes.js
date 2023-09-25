const express = require('express');
const userRouter = express.Router();
const userController = require('../Controller/userController');
const verifytest = require('../Middleware/userAuthoriseMiddleware');
const Trycatch= require('../Middleware/tryCatchMiddleware');


userRouter.post('/register',Trycatch(userController.createuser))
userRouter.post('/login',Trycatch(userController.userLogin))
userRouter.get('/products',verifytest,Trycatch(userController.productList))
userRouter.get('/products/:id',verifytest,Trycatch(userController.productById))
userRouter.get('/products/category/:categoryname',verifytest,Trycatch(userController.productByCategory))
userRouter.post('/:id/cart',verifytest,Trycatch(userController.addToCart))
userRouter.post('/:id/wishlist',verifytest,Trycatch(userController.addTowishlist))
userRouter.get('/:id/cart',verifytest,Trycatch(userController.viewCart))
userRouter.get('/:id/wishlist',verifytest,Trycatch(userController.viewwishlist))
userRouter.delete('/:id/cart',verifytest,Trycatch(userController.deleteCart))
userRouter.delete('/:id/wishlist',verifytest,Trycatch(userController.deletewishlist))


module.exports=userRouter