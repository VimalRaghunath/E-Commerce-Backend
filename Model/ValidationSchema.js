const Joi = require("@hapi/joi");

const joiUservalidationSchema = Joi.object({
    name: Joi.string(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});


const joiProductvalidationSchema = Joi.object({
    title: Joi.string(),
    price: Joi.number().positive(),
    image: Joi.string(),
    description: Joi.string(),
    category: Joi.string(),
});



module.exports = { joiUservalidationSchema,joiProductvalidationSchema };