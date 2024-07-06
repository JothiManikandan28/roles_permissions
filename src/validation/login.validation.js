const Joi = require('joi');

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const forgotpassword = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
};



module.exports = {
  login,
  forgotpassword,
};
