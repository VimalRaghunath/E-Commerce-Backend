const express = require('express');
const AdminRouter = express.Router();
const adminControllers = require('../Controller/adminController')
const verifytest = require('../Middleware/adminAuthoriseMiddleware')
const Trycatch = require('../Middleware/tryCatchMiddleware')
const upload = require("../Middleware/photoUpload")



AdminRouter.post('/login',Trycatch(adminControllers.loginAdmin))
AdminRouter.get('/users',verifytest,Trycatch(adminControllers.showAllUser))
AdminRouter.get('/users/:id',verifytest,Trycatch(adminControllers.showUserById))
AdminRouter.post('/products',verifytest,upload,Trycatch(adminControllers.addProduct))
AdminRouter.put('/products',verifytest,Trycatch(adminControllers.updateProduct))
AdminRouter.delete('/products',verifytest,Trycatch(adminControllers.deleteProduct))
AdminRouter.get('/products',verifytest,Trycatch(adminControllers.showAllProducts))
AdminRouter.get('/products/category',verifytest,Trycatch(adminControllers.showProductCategory))
AdminRouter.get('/products/:id',verifytest,Trycatch(adminControllers.showProductById))
AdminRouter.get('/stats',verifytest,Trycatch(adminControllers.stats))
AdminRouter.get('/products',verifytest,Trycatch(adminControllers.orders))



module.exports=AdminRouter;
