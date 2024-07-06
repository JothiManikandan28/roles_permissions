/* eslint-disable radix */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

const rescodes = require('../utility/rescodes');
const config = require('../config/vars');
const KeyConversion = require('../utility/keyconversion');

const moduleService = {};

moduleService.create = async ({ userID, modules, models }) => {
  if (!modules || !modules?.length) return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  const createdModule = [];
  const existModule = [];
  if (modules?.length) {
    for (const module of modules) {
      const { name, orderId = 0, isCard = true, cardColor = '', cardBg = '' } = module;
      const convertedKey = await KeyConversion?.convertCamelCase(name?.trim());
      const [instance, created] = await models?.modules?.findOrCreate({
        where: {
          name: name?.trim(),
          key: convertedKey,
        },
        defaults: {
          name: name?.trim(),
          key: convertedKey,
          created_by: userID,
          updated_by: userID,
          isActive: true,
          orderId,
          isCard,
          cardColor,
          cardBg,
          redirectURL: `${config?.app?.redirectURL}/modules/${convertedKey}`,
        },
      });
      if (created) {
        createdModule?.push({
          label: instance?.name,
          key: instance?.key,
        });
      }
      if (!created) {
        existModule?.push({
          label: instance?.name,
          key: instance?.key,
        });
      }
    }
  }
  if (!createdModule?.length && existModule?.length === modules?.length)
    return { code: 409, data: { status: 'Error', data: { existed: existModule }, message: rescodes?.moduleExist } };
  return {
    code: 200,
    data: { status: 'Ok', data: { existed: existModule, created: createdModule }, message: rescodes?.modulesAdd },
  };
};

moduleService.listing = async ({ models}) => {
  const getModules = await models?.modules?.findAll({
    order: [['orderId', 'ASC']],
    where: {
      isActive: true,
      isCard: true,
    },
  });
  const modules = [];
  getModules?.map((module) => {
    const { name, key } = module;
    modules?.push({ label: name, key });
    return modules;
  });
  if (!modules?.length) return { code: 404, data: { status: 'Error', message: rescodes?.noModules } };
  return { code: 200, data: { status: 'Ok', data: modules } };
};



moduleService.moduleBasedFeature = async ({ module, features, models }) => {
  if (!module || !features || !features?.length)
    return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  const checkModuleQuery = await models?.modules?.findOne({
    where: {
      key: module,
      isActive: true,
    },
  });
  if (!checkModuleQuery) return { code: 404, data: { status: 'Error', message: rescodes?.moduleNExist } };
  const moduleId = checkModuleQuery?.id;
  const checkFeaturesExist = await models?.features?.findAll({
    where: {
      key: features,
      isActive: true,
    },
  });
  const featureIds = [];
  if (checkFeaturesExist && checkFeaturesExist?.length) {
    if (checkFeaturesExist?.length !== features?.length)
      return { code: 404, data: { status: 'Error', message: rescodes?.featureNExist } };
    checkFeaturesExist?.forEach((val) => {
      const { id, key } = val;
      featureIds?.push({ id, key });
    });
  }
  let mappedFeature = 0;
  const alreadyMappedFeature = [];
  for (const feature of featureIds) {
    const [instance, created] = await models?.moduleFeatures?.findOrCreate({
      include: [{ model: models?.features, as: 'features' }],
      where: {
        module_id: moduleId,
        feature_id: feature?.id,
      },
      default: {
        module_id: moduleId,
        feature_id: feature?.id,
      },
    });
    if (created) {
      mappedFeature += 1;
    }
    if (!created) {
      alreadyMappedFeature?.push({
        label: instance?.features?.name,
        key: instance?.features?.key,
      });
    }
  }
  if (!mappedFeature && alreadyMappedFeature?.length === features?.length)
    return {
      code: 409,
      data: { status: 'Error', data: { alreadyMapped: alreadyMappedFeature }, message: rescodes?.moduleExist },
    };
  return {
    code: 200,
    data: {
      status: 'Ok',
      message: rescodes?.modulesAdd,
    },
  };
};



moduleService.moduleRole = async ({ userName , models }) => {
  const getModules = await models?.modules?.findAll({
    order: [['orderId', 'ASC']],
    where: {
      isActive: true,
      isCard: true,
    },
  });
  let checkExistUser;
  if (userName) {
    checkExistUser = await models?.users?.findOne({
      where: {
        userName,
        isTrash: false,
      },
    });
    if (!checkExistUser) return { code: 404, data: { status: 'Error', message: rescodes?.noUser } };
  }
  const moduleRoleList = [];
  if (getModules?.length) {
    for (const mod of getModules) {
      const roleList = [];
      const moduleList = { label: mod?.name, key: mod?.key };
      const getModuleRoleQuery = await models?.roles?.findAll({
        order: [['id', 'ASC']],
        where: {
          isActive: true,
          module_id: mod?.id,
        },
      });
      let userRole;
      if (userName) {
        const getUserModule = await models?.userModuleRoles?.findOne({
          include: [{ model: models?.roles, as: 'role' }],
          where: {
            user_id: checkExistUser?.id,
            module_id: mod?.id,
          },
        });
        if (getUserModule) userRole = getUserModule?.role.key;
      }
      if (getModuleRoleQuery?.length) {
        getModuleRoleQuery?.forEach((role) => {
          if (userName) {
            const roleObj = {
              label: '',
              key: '',
              enable: '',
            };
            roleObj.label = role?.name;
            roleObj.key = role?.key;
            roleObj.enable = false;
            if (role?.key === userRole) roleObj.enable = true;
            roleList?.push(roleObj);
          }
          if (!userName) roleList?.push({ label: role?.name, key: role?.key });
        });
      }
      if (moduleList && roleList?.length) {
        moduleRoleList?.push({ module: moduleList, roles: roleList });
      }
    }
  }
  return { code: 200, data: { status: 'Ok', data: moduleRoleList } };
};

module.exports = moduleService;
