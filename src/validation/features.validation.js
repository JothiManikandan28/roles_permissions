const Joi = require('joi');

const createFeature = {
  body: Joi.object().keys({
    data: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().trim().required(),
          groupKey: Joi.string().trim().required(),
          orderId: Joi.number().optional(),
          onlyAdmin: Joi.boolean().optional(),
        })
      )
      .min(1),
  }),
};

const moduleFeature = {
  body: Joi.object().keys({
    module: Joi.string().optional(),
  }),
};

module.exports = {
  createFeature,
  moduleFeature,
};
