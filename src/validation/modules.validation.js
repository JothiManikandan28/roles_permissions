const Joi = require('joi');

const createmodule = {
  body: Joi.object().keys({
    data: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().trim().required(),
          orderId: Joi.number().optional().allow(''),
          isCard: Joi.boolean().optional().allow(''),
          cardColor: Joi.string().trim().optional().allow(''),
          cardBg: Joi.string().trim().optional().allow(''),
        })
      )
      .min(1),
  }),
};

const modulefeaturemapping = {
  body: Joi.object().keys({
    moduleKey: Joi.string().required(),
    featuresKey: Joi.array().items(Joi.string().required()).required(),
  }),
};

const getmodulerole = {
  body: Joi.object().keys({
    userName: Joi.string().optional().allow(''),
  }),
};

module.exports = {
  createmodule,
  modulefeaturemapping,
  getmodulerole,
};
