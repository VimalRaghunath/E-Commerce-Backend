require('dotenv').config()
const express = require('express')
const App = express();
const AdminRouter=require('./Routes/AdminRoutes')
const userRouter=require('./Routes/UserRoutes')

App.use(express.json())
App.use('/api/admin',AdminRouter)
App.use('/api/users',userRouter)


App.listen(3000,console.log("server is running"))