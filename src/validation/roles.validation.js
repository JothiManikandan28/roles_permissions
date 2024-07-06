const Joi = require("joi");

const createrole = {
  body: Joi.object().keys({
    roleName: Joi.string().required(),
    moduleKey: Joi.string().required(),
    featuresKey: Joi.array().items(Joi.string().required()).required(),
    userName: Joi.array().items(Joi.string().optional()).allow("").optional(),
  }),
};

const getrole = {
  body: Joi.object().keys({
    moduleKey: Joi.string().trim().required(),
    roleNameKey: Joi.string().trim().required(),
  }),
};

const updaterole = {
  body: Joi.object().keys({
    newRoleName: Joi.string().trim().optional(),
    roleNameKey: Joi.string().trim().required(),
    moduleKey: Joi.string().trim().required(),
    featuresKey: Joi.array().items(Joi.string().required()).required(),
    userName: Joi.array().items(Joi.string().optional()).allow("").optional(),
  }),
};

const deleterole = {
  body: Joi.object().keys({
    data: Joi.array().items(Joi.object().required()).required(),
  }),
};

module.exports = {
  createrole,
  getrole,
  updaterole,
  deleterole,
};
