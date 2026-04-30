const Joi = require('joi');

const registerSchema = Joi.object({
    surname: Joi.string().required(),
    first_name: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9]{11,14}$/).required(),
    nin: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
    address: Joi.string().required(),
    password: Joi.string().min(6).required(),
    lga_region: Joi.string().required(),
    city: Joi.string().required(),
    role: Joi.string().valid('customer', 'superadmin', 'vendor', 'rider', 'organization', 'admin')
});

module.exports = { registerSchema };
