const mongoose = require('mongoose')
const user = require('../Model/userSchema')
const product = require('../Model/productSchema')
const jwt = require('jsonwebtoken')
mongoose.connect('mongodb://0.0.0.0:27017/E-commerce',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})



module.exports = {


// login admin with username,password[postapi/admin/login]--------------------


     
    loginAdmin:async(req,res)=>{
    
        const {username,password} =req.body;   
        console.log(process.env.USERNAME);

        if(username===process.env.USERNAME_SECRET && password===process.env.PASSWORD_SECRET){
            
            const token = jwt.sign(
                {username:username},
                process.env.ADMIN_ACCESS_TOKEN_SECRET
            );

            res.status(200).json({
                status: 'success',
                message: 'successfully logged In',
                data: {jwt_token: token}
            });

        } else {
            res.status(404).json({error:'Not a Admin'})
        }
    },


//  showing all user list in admin page[GET api/admin/users]--------------------

    showAllUser: async(req,res)=>{
        const alluser = await user.find();

        res.status(200).json({
            status:'success',
            message:"successfully fetched user data's",
            data: alluser
        })
    },


//  showing a specific user based on ID in admin page[POST api/admin/users]-----------

   showUserById: async(req,res)=>{
    const userId = req.params.id;
    const User = await user.findById(userId);

    if(!User){
        return res.status(404).json({error:"user not found"})
    }

    res.status(200).json({
        status: "success",
        message: "successfully fetched user data",
        data: User
    })

   },


//  Adding product [POST api/admin/products]---------------------------   


   addProduct: async(req,res)=>{

    const {title,description,image,price,category}=req.body;

    const products = await product.create({
        title,description,image,price,category
    });
     
    if(!products){
        return res.status(404).json({error:"product not created"})
    }
    
    res.status(201).json({
        status:"success",
        message:"successfully added a product",
    })
    

   },


}

