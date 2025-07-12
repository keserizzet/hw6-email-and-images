const Joi = require('joi');

const userSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  sendResetEmail: Joi.object({
    email: Joi.string().email().required()
  }),
  
  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required()
  })
};

const contactSchemas = {
  create: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required()
  }),
  
  update: Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional()
  })
};

module.exports = {
  userSchemas,
  contactSchemas
}; 