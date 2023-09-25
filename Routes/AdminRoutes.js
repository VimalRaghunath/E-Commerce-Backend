const express = require('express');
const AdminRouter = express.Router();
const adminControllers = require('../Controller/adminController')
const verifytest = require('../Middleware/adminAuthoriseMiddleware')
const Trycatch = require('../Middleware/tryCatchMiddleware')



AdminRouter.post('/login',Trycatch(adminControllers.loginAdmin))
AdminRouter.get('/users',verifytest,Trycatch(adminControllers.showAllUser))
AdminRouter.get('/users/:id',verifytest,Trycatch(adminControllers.showUserById))
AdminRouter.post('/products',verifytest,Trycatch(adminControllers.addProduct))


module.exports=AdminRouter;
