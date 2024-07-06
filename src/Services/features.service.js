/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// const db = require('../../models/index');
const rescodes = require('../utility/rescodes');
const KeyConversion = require('../utility/keyconversion');

const featureService = {};

featureService.create = async ({ userID, features, models }) => {
  // Return an error if the features array is empty or not provided
  if (!features || !features.length) {
    return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  }

  const createdFeatures = [];
  const existFeatures = [];

  // Iterate over each feature in the provided features array
  for (const feature of features) {
    const { name, orderId = 0, onlyAdmin = false } = feature;

    // Convert the feature name to a camel case key
    const convertedKey = await KeyConversion?.convertCamelCase(name?.trim());

    // Find or create the feature in the features table
    const [instance, created] = await models?.features?.findOrCreate({
      where: {
        name: name?.trim(),
        key: convertedKey,
      },
      defaults: {
        name: name?.trim(),
        key: convertedKey,
        isProtected: onlyAdmin,
        orderId,
        created_by: userID,
        updated_by: userID,
        isActive: true,
      },
    });

    // Categorize the feature as created or existing
    if (created) {
      createdFeatures.push({
        label: instance?.name,
        key: instance?.key,
      });
    } else {
      existFeatures.push({
        label: instance?.name,
        key: instance?.key,
      });
    }
  }

  // Return a conflict error if no new features were created
  if (!createdFeatures.length && existFeatures.length === features.length) {
    return { code: 409, data: { status: 'Error', data: { existed: existFeatures }, message: rescodes?.featureExist } };
  }

  // Return a success response with details of created and existing features
  return {
    code: 200,
    data: { status: 'Ok', data: { existed: existFeatures, created: createdFeatures }, message: rescodes?.featuresAdd },
  };
};

featureService.listingFeatures = async ( { models }) => {
  const getFeatures = await models?.features?.findAll({
    order: [['orderId', 'ASC']],
    where: {
      isActive: true,
    },
  });
  const features = [];
  getFeatures?.map((fea) => {
    const { name, key } = fea;
    features?.push({ label: name, key });
    return features;
  });
  if (!features?.length) return { code: 404, data: { status: 'Error', message: rescodes?.noFeatures } };
  return { code: 200, data: { status: 'Ok', data: features } };
};

featureService.moduleFeatureListing = async ({ isAdmin, module, models }) => {
  let moduleId;
  if (module) {
    const getmoduleId = await models?.modules?.findOne({
      where: {
        key: module,
        isActive: true,
        isCard: true,
      },
    });
    if (!getmoduleId) return { code: 404, data: { status: 'Error', message: rescodes?.moduleNExist } };
    moduleId = getmoduleId?.id;
  }
  let whereCondition = {};
  if (moduleId) {
    whereCondition = {
      module_id: moduleId,
    };
  }
  const getFeatures = await models?.moduleFeatures?.findAll({
    include: [
      {
        model: models?.features,
        as: 'features',
      },
      {
        model: models?.modules,
        as: 'modules',
      },
    ],
    where: whereCondition,
  });
  if (!getFeatures || !getFeatures?.length) {
    if (module) return { code: 404, data: { status: 'Error', message: rescodes?.featureNUMod } };
    return { code: 404, data: { status: 'Error', message: rescodes?.noFeatures } };
  }
  const list = [];
  getFeatures?.map((feature) => {
    const { name, key, isProtected } = feature?.features;
    let allowAccess = true;
    if (isProtected) {
      if (!isAdmin) {
        allowAccess = false;
      }
    }
    list?.push({
      moduleLabel: feature?.modules?.name,
      moduleKey: feature?.modules?.key,
      featureLabel: name,
      featureKey: key,
      enable: allowAccess,
    });
    return list;
  });
  return { code: 200, data: { status: 'Ok', data: list } };
};

module.exports = featureService;
