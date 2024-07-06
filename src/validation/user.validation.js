const Joi = require('joi');

const update = {
  body: Joi.object().keys({
    userName: Joi.string().required(),
    firstName: Joi.string().required(),
    fatherName: Joi.string().allow('', null).optional(),
    lastName: Joi.string().required(),
    dob: Joi.date().max('now').iso().allow('', null).optional(),
    gender: Joi.string().valid('Male', 'Female', 'Prefer not to say').allow('', null).optional(),
    street1: Joi.string().required(),
    street2: Joi.string().required(),
    pincode: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .message('Invalid Pincode')
      .required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    imageURL: Joi.string().required(),
  }),
};

const getusername = {
  body: Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
  }),
};

const create = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().allow('').optional(),
    mobile: Joi.string().allow('').optional().min(10).max(10).pattern(/^\d+$/),
    email: Joi.string().email().required(),
    modules: Joi.array()
      .items(
        Joi.object({
          moduleKey: Joi.string().required(),
          roleKey: Joi.string().allow('').optional(),
        }).optional()
      )
      .optional(),
  }),
};



const emailexist = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const edit = {
  body: Joi.object().keys({
    userId: Joi.number().integer().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().allow('').optional(),
    mobile: Joi.string().allow('').optional().min(10).max(10).pattern(/^\d+$/),
    email: Joi.string().email().required(),
    modules: Joi.array()
      .items(
        Joi.object({
          moduleKey: Joi.string().required(),
          roleKey: Joi.string().allow('').optional(),
        }).optional()
      )
      .optional(),
  }),
};



const deleteUser = {
  body: Joi.object().keys({
    userName: Joi.array().required(),
  }),
};

const updatenameandpass = {
  body: Joi.object().keys({
    userId: Joi.number().integer().required(),
    newUserName: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};

const updatestatus = {
  body: Joi.object().keys({
    userName: Joi.string().required(),
    status: Joi.string().valid('Active', 'Inactive').required(),
  }),
};

const resendlink = {
  body: Joi.object().keys({
    userName: Joi.string().required(),
  }),
};

const getuserdetails = {
  body: Joi.object().keys({
    userName: Joi.string().optional().allow(''),
  }),
};

const changeadmin = {
  body: Joi.object().keys({
    currentAdmin: Joi.string().required(),
    newAdmin: Joi.string().required(),
    adminPassword: Joi.string().required(),
  }),
};

const usernameexist = {
  body: Joi.object().keys({
    userName: Joi.string().required(),
  }),
};

const adminemailexist = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    firmId: Joi.number().integer().required(),
  }),
};

const changeUsername = {
  body: Joi.object().keys({
    userName: Joi.string().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};

module.exports = {
  create,
  update,
  getusername,
  emailexist,
  edit,
  deleteUser,
  updatenameandpass,
  updatestatus,
  resendlink,
  getuserdetails,
  changeadmin,
  usernameexist,
  adminemailexist,
  changeUsername,
  changePassword,
};
