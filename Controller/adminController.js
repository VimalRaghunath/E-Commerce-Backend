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


 // Updating a product [PUT api/admin/products]--------------------------


 updateProduct: async(req,res)=>{
    const {title,description,image,price,category,id}=req.body;
    const Product= await product.findById(id);

    if(!Product){
        return res.status(404).json({error:"product not found"});
    }
    await product.updateOne({_id:id},{$set:{title:title,description:description,price:price,image:image,category:category}});
    
    res.status(201).json({
        status:"success",
        message:"successfully updated the product",
    });

  },


  // Deleting a product [DELETE api/admin/products]---------------------------

   deleteProduct: async (req,res) => {
    const { id } = req.body;
    await product.findByIdAndDelete(id);
    res.status(201).json({
        status:"success",
        message:"Successfully deleted the product",
    });

  },


  // showing all products list in admin page [GET api/admin/products]-----------------

   
   showAllProducts: async (req,res) => {
    const allproducts = await product.find();
    res.status(200).json({
        status:"success",
        message:"successfully fetched product detail",
        data:allproducts,
    });

  },

 
  // showing a products list based on category in admin page [GET api/admin/products?category=name]----------------------


   showProductCategory: async (req,res) => {
    const category = req.query.name;

    const products = await product.find({ category: category })

    if(!products){
         
        return res.status(404).json({error:"category not found"})
    }
    
    res.status(200).json({
        status:"success",
        message:"successfully fetched product details",
        data:products,
    });

   },



 // showing a products list based on ID in Admin page [GET api/admin/products/:id]-------------------------
 

 
  showProductById: async (req,res) => {
    const productId = req.params.id;
    const product = await product.findById(productId);
    if(!product) {
        return res.status(404).json({ error: "user not found" });
    }
    res.status(200).json({
        status:"success",
        message:"successfully fetched product details",
        data:product,
    });
  },
 

 
 // showing stats (totalRevenue,totalitemspurchased) [GET api/admin/stats]-----------------------


   stats: async (req,res) => {
    const aggregation = user.aggregate([
       {
        $unwind: "$orders",
       },
       {
         $group: {
            _id: null,
            totalRevenue: { $sum: "$orders.totalamount" },
            totalProductPurchased: { $sum: { $size: "$orders.product" } },
         },
       },
    ]);
    
    const result = await aggregation.exec();
    const totalRevenue = result[0].totalRevenue;
    const totalProductPurchased = result[0].totalItemsSold;
     
    res.status(200).json({
        status: "success",
        message: "successfully fetched stats.",
        data: {
            "Total Revenue": totalRevenue,
            "Total Items Sold": totalProductPurchased,
        },
    });

  },



 // Showing stats (totalRevenue,totalItemspurchased) [GET api/admin/orders]--------------------


 orders: async(req,res) => {
    const order = await user.find({orders: {$exists:true} },{orders:1});
    const orders = order.filter((item)=>{
        return item.orders.length>0
    });

   res.json({
    status: "success",
    message: "Successfully fetched order detail.",
    data: orders,
   });
 },
  


}

