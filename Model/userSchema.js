const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
    },
    password : {
        type: String,
        required: true,
    },
    cart : [{
        type: mongoose.Schema.ObjectId,
        ref:"Product",
        required: true,
    }],
    wishlist : [{
        type: Array,
        required: true,
    }],
    orders : {
        type: Array,
        required: true,
    },
    
});

module.exports = mongoose.model("User", userSchema);