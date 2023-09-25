const mongoose = require("mongoose")
const user = require("../Model/userSchema")
const product = require("../Model/productSchema")
const jwt = require("jsonwebtoken");
mongoose.connect("mongodb://0.0.0.0:27017/E-commerce",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});


module.exports = {


//  create a user with name, email, username(POST api/users/register)-------------


    createuser: async (req,res)=>{
        const {name,email,username,password} = req.body;
        await user.create({
            name:name,
            email:email,
            username:username,
            password:password
        });
        res.status(200).json({
            status:'success',
            message:'user registration successfull'
        });
    },


//  user login with username,password (POST api/users/login) -----------------------------

    userLogin: async (req,res) =>{
        const {username,password} = req.body;
        const User = user.findOne({username:username, password: password});
        if(!User){
            return res.status(404).json({error:"user not found"})
        }
        const token = jwt.sign(
            {username: User.username},
            process.env.USER_ACCESS_TOKEN_SECRET);
            res 
              .status(200)
              .json({status:'success',message:'login successfull',data:token})

    },


//  get all product details [GET api/users/products]------------------------------------


     productList: async (req,res) => {
        const productList = await product.find();
        res.status(200).json({
            status: "success",
            message: "product listed successfully",
            data: productList
        });
    },
   

// get a product details as json object[POST api/users/products/:id]----------------------


    productById: async (req,res)=>{
        const id = req.params.id;
        const productById = await product.findById(id);

        if(!productById){
            return res.status(404).json({error:"product not found"})
        }
        
        res.status(200).json({
            status:"success",
            message:"product listed successfully",
            data:productById,
        });
    },


// get list of product by categoryvice [POST api/users/products/category]


    productByCategory: async (req,res)=>{
        const category=req.params.categoryname;
        const products=await product.find({ category:category });

        if(!products){
            return res.status(404).json({error: "category not found"});
        }

        req.status(200).json({
            status:"success",
            message:"successfully listed the category",
            data:products
        });
    },

   


}