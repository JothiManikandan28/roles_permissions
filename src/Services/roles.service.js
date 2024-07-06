/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable no-const-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unreachable-loop */
/* eslint-disable no-loop-func */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable array-callback-return */
const { Op } = require('sequelize');
const rescodes = require('../utility/rescodes');
const KeyConversion = require('../utility/keyconversion');
const accessPermission = require('../utility/permissionaccess');


const roleService = {};

roleService.add = async ({ isAdmin, userID, userName, roleName, module, features, userIds, models }) => {
  if (!isAdmin) {
    const checkAccess = await accessPermission?.featureAccess({
      userId: userID,
      featureKey: 'addeditRoles',
      db: models
    });
    if (!checkAccess) return { code: 401, data: { status: 'Error', message: rescodes?.accessDenied } };
  }
  const reqFields = { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  if (!roleName || !module || !features || !features?.length) return reqFields;
  const currentUser = [];
  const checkModuleExist = await models?.modules?.findOne({
    where: {
      key: module,
      isActive: true,
    },
  });
  if (!checkModuleExist) return { code: 409, data: { status: 'Error', message: rescodes?.moduleNExist } };
  const moduleId = checkModuleExist?.id;
  const isAuthorRole = roleName.toLowerCase() === 'author';
  const checkAuthorRole = features?.includes('addDraft');
  if (isAuthorRole && !checkAuthorRole) {
    features.push('addDraft');
  } else if (!isAuthorRole && checkAuthorRole) {
    features = features.filter((feature) => feature !== 'addDraft');
  }
  const checkFeatureExist = await models?.features?.findAll({
    order: [['orderId', 'ASC']],
    where: {
      key: features,
      isActive: true,
    },
  });
  if (!checkFeatureExist?.length) return { code: 409, data: { status: 'Error', message: rescodes?.noFeatures } };
  if (checkFeatureExist?.length !== features?.length)
    return { code: 409, data: { status: 'Error', message: rescodes?.featureNExist } };
  const checkModuleFeatures = await models?.moduleFeatures?.findAll({
    include: [
      {
        model: models?.features,
        as: 'features',
      },
    ],
    where: {
      module_id: moduleId,
    },
  });
  const mappedFeatures = [];
  let unmappedFeatures = [];
  checkModuleFeatures?.forEach((feature) => {
    const { key } = feature?.features;
    mappedFeatures?.push(key);
  });

  if (mappedFeatures?.length) {
    unmappedFeatures = features?.filter((feature) => !mappedFeatures?.includes(feature));
  }
  if (unmappedFeatures?.length)
    return {
      code: 404,
      data: {
        status: 'Error',
        message: {
          codes: 'featureNUMod',
          value: `[${unmappedFeatures}] features not under Respective Module`,
          html: `[${unmappedFeatures}] features not under Respective Module`,
        },
      },
    };
  if (userIds) {
    const authUser = userIds?.find((element) => element === userName);
    if (authUser)
      return {
        code: 401,
        data: {
          status: 'Error',
          message: {
            codes: 'reqUser',
            value: `User Id: ${authUser} Unauthorized User`,
            html: `User Id: ${authUser} Unauthorized User`,
          },
        },
      };
    const checkUsers = await models?.users?.findAll({
      where: {
        userName: userIds,
        userStatus: {
          [Op.ne]: 'Inactive',
        },
        isTrash: false,
      },
    });
    if (checkUsers?.length) {
      checkUsers?.map((user) => {
        currentUser?.push({ userName: user?.userName, id: user?.id });
      });
    }
    let inActiveUser = [];
    inActiveUser = userIds?.filter((user) => !currentUser?.some((name) => name?.userName?.includes(user)));
    if (inActiveUser?.length)
      return {
        code: 404,
        data: {
          status: 'Error',
          message: {
            codes: 'noUser',
            value: `[${inActiveUser}] No active/Exist User`,
            html: `[${inActiveUser}] No active/Exist User`,
          },
        },
      };
  }
  if (moduleId) {
    const checkModuleRoleExist = await models?.roles?.findAll({
      where: {
        module_id: moduleId,
      },
    });
    if (checkModuleRoleExist) {
      for (const role of checkModuleRoleExist) {
        const { name } = role;
        if (name?.trim() === roleName?.trim()) {
          return {
            code: 409,
            data: {
              status: 'Error',
              message: {
                codes: 'roleNExist',
                value: `Same Role Name Already Exist in ${checkModuleExist.dataValues.name} module`,
                html: `Same Role Name Already Exist in ${checkModuleExist.dataValues.name} module`,
              },
            },
          };
        }
      }
    }
  }
  const featuresIds = [];
  checkFeatureExist?.forEach((featureid) => {
    featuresIds?.push(featureid?.id);
  });
  const convertedkey = await KeyConversion?.convertCamelCase(roleName?.trim());
  if (userIds) {
    if (currentUser?.length) {
      for (const user of currentUser) {
        const getUserModuleRoles = await models?.userModuleRoles?.findOne({
          include: [
            {
              model: models?.modules,
              as: 'module',
            },
            {
              model: models?.users,
              as: 'user',
            },
            {
              model: models?.roles,
              as: 'role',
            },
          ],
          where: {
            user_id: user?.id,
            module_id: moduleId,
          },
        });
        if (getUserModuleRoles) {
          return {
            code: 409,
            data: {
              status: 'Error',
              message: {
                codes: 'userRoleExist',
                value: `Assigned User ${getUserModuleRoles?.user?.userName} already exist with Role ${getUserModuleRoles?.role?.name} in ${getUserModuleRoles?.module?.name} module`,
                html: `Assigned User ${getUserModuleRoles?.user?.userName} already exist with Role ${getUserModuleRoles?.role?.name} in ${getUserModuleRoles?.module?.name} module`,
              },
            },
          };
        }
      }
    }
  }
  const createRole = await models?.roles?.create({
    name: roleName?.trim(),
    key: convertedkey,
    created_by: userID,
    updated_by: userID,
    module_id: moduleId,
    isActive: true,
  });
  const roleId = createRole?.id;
  const roleFeaturesData = featuresIds?.map((featureId) => ({
    role_id: roleId,
    feature_id: featureId,
  }));
  const roleFeaturesQuery = await models?.roleFeatures?.bulkCreate(roleFeaturesData);
  const userModuleRoleQuery = [];
  if (currentUser?.length) {
    for (const userId of currentUser) {
      userModuleRoleQuery?.push(
        await models?.userModuleRoles?.create({
          user_id: userId?.id,
          module_id: moduleId,
          role_id: roleId,
          created_by: userID,
          updated_by: userID,
        })
      );
    }
  }
  if (roleFeaturesQuery?.length === features?.length) {
    return {
      code: 200,
      data: {
        status: 'Ok',
        message: {
          codes: 'roleCreated',
          value: `${roleName} Role Created Successfully.`,
          html: `${roleName} Role Created Successfully.`,
        },
      },
    };
  }
  return '';
};

roleService.listing = async ({ models } ) => {
  const list = [];
  const getModule = await models?.modules?.findAll({
    order: [['orderId', 'ASC']],
    where: {
      isActive: true,
      isCard: true,
    },
  });
  if (!getModule) return { code: 409, data: { status: 'Error', message: rescodes?.noModules } };
  if (getModule && getModule?.length) {
    for (const mod of getModule) {
      const moduleArray = { label: mod?.name, key: mod?.key };
      const getRole = await models?.roles?.findAll({
        order: [['id', 'ASC']],
        where: {
          module_id: mod?.id,
          isActive: true,
        },
      });
      if (getRole && getRole?.length) {
        for (const role of getRole) {
          const usersList = [];
          const featureList = [];
          const getUser = await models?.userModuleRoles?.findAll({
            order: [['id', 'ASC']],
            include: [{ model: models?.users, as: 'user' }],
            where: {
              module_id: mod?.id,
              role_id: role?.id,
            },
          });
          if (getUser && getUser?.length) {
            getUser?.forEach((val) => {
              const { userName } = val?.user;
              usersList?.push(userName);
            });
          }
          const getFeature = await models.roleFeatures.findAll({
            include: [{ model: models.features, as: 'features' }],
            where: {
              role_id: role.id,
            },
          });
          if (getFeature && getFeature.length) {
            getFeature.forEach((feature) => {
              featureList.push({ label: feature.features.name, key: feature.features.key });
            });
          }
          const roles = { label: role?.name, key: role?.key };
          const objList = {
            module: moduleArray,
            roles,
            users: usersList,
            features: featureList,
          };
          list.push(objList);
        }
      }
    }
    return { code: 200, data: { status: 'Ok', data: list } };
  }
  return '';
};

roleService.get = async ({ module, roleName, userID, models }) => {
  if (!module || !roleName) return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  const checkModuleQuery = await models?.modules?.findOne({
    where: {
      key: module,
      isActive: true,
      isCard: true,
    },
  });
  if (!checkModuleQuery) return { code: 404, data: { status: 'Error', message: rescodes?.moduleNExist } };
  const checkRoleQuery = await models?.roles?.findOne({
    where: {
      key: roleName,
      isActive: true,
      module_id: checkModuleQuery?.id,
    },
  });
  if (!checkRoleQuery) {
    return {
      code: 404,
      data: {
        status: 'Error',
        message: {
          codes: 'noRole',
          value: `No ${roleName} Role exist under ${module} module`,
          html: `No ${roleName} Role exist under ${module} module`,
        },
      },
    };
  }
  const getFeatures = await models?.roleFeatures?.findAll({
    include: [{ model: models?.features, as: 'features' }],
    where: {
      role_id: checkRoleQuery?.id,
    },
  });
  if (!getFeatures) {
    return {
      code: 404,
      data: {
        status: 'Error',
        message: {
          codes: 'noFeatureRole',
          value: `No Features exist under ${roleName} role`,
          html: `No Features exist under ${roleName} role`,
        },
      },
    };
  }
  const featureList = [];
  const allFeatureList = [];
  getFeatures?.forEach((valFeature) => {
    featureList.push({ label: valFeature?.features?.name, key: valFeature?.features?.key });
    return featureList;
  });
  const allFeatures = await models?.moduleFeatures?.findAll({
    include: [{ model: models?.features, as: 'features' }],
    where: {
      module_id: checkModuleQuery?.id,
    },
  });
  if (featureList?.length) {
    allFeatures?.forEach((val) => {
      allFeatureList?.push({ label: val?.features?.name, key: val?.features?.key, enable: false });
    });
  }
  const list = allFeatureList?.map((fea) => {
    const matchingfea = featureList?.find((item) => item?.key === fea?.key);
    if (matchingfea) {
      fea.enable = true;
    }
    return fea;
  });
  const activeUserQuery = await models?.users?.findAll({
    where: {
      id: {
        [Op.ne]: userID,
      },
      isAdmin: false,
      userStatus: {
        [Op.ne]: 'Inactive',
      },
      isTrash: false,
    },
  });
  const getUserRoleQuery = await models?.userModuleRoles?.findAll({
    include: [{ model: models?.users, as: 'user' }],
    where: {
      module_id: checkModuleQuery?.id,
      role_id: checkRoleQuery?.id,
    },
  });
  const activeUser = [];
  const roleUser = [];
  activeUserQuery?.forEach((ele1) => {
    activeUser?.push({ id: ele1?.id, userName: ele1?.userName, enable: false });
  });
  getUserRoleQuery?.forEach((ele2) => {
    roleUser?.push({ id: ele2?.user?.id, userName: ele2?.user?.userName });
  });
  const userlist = activeUser?.map((usr) => {
    const matchingUsr = roleUser?.find((item) => item?.userName === usr?.userName);
    if (matchingUsr) {
      usr.enable = true;
    }
    return usr;
  });
  return { code: 200, data: { status: 'Ok', data: { featureList: list, userList: userlist } } };
};


roleService.update = async ({ newRoleName, roleName, module, features, userIds, userID, isAdmin, models }) => {
  if (!isAdmin) {
    const checkAccess = await accessPermission?.featureAccess({
      userId: userID,
      featureKey: 'addeditRoles',
      db: models
    });
    if (!checkAccess) return { code: 401, data: { status: 'Error', message: rescodes?.accessDenied } };
  }
  const reqFields = { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  if (!roleName || !module || !features || !features?.length) return reqFields;
  const checkModuleQuery = await models?.modules?.findOne({
    where: {
      key: module,
      isCard: true,
      isActive: true,
    },
  });
  if (!checkModuleQuery) return { code: 404, data: { status: 'Error', message: rescodes?.moduleNExist } };
  const checkRoleQuery = await models?.roles?.findOne({
    where: {
      key: roleName,
      isActive: true,
      module_id: checkModuleQuery?.id,
    },
  });
  if (!checkRoleQuery) return { code: 404, data: { status: 'Error', message: rescodes?.roleNExist } };
  const checkNewRoleQuery = await models?.roles?.findOne({
    where: {
      name: newRoleName?.trim(),
      isActive: true,
      module_id: {
        [Op.ne]: checkModuleQuery?.id,
      },
    },
  });
  if (checkNewRoleQuery) return { code: 404, data: { status: 'Error', message: rescodes?.roleAlreadyNExist } };

  const isAuthorRole = roleName.toLowerCase() === 'author';
  const isNewAuthorRole = newRoleName.toLowerCase() === 'author';
  const checkAuthorRole = features?.includes('addDraft');

  if (isAuthorRole && !isNewAuthorRole && checkAuthorRole) {
    features = features.filter((feature) => feature !== 'addDraft');
  } else if (isAuthorRole && isNewAuthorRole && !checkAuthorRole) {
    features.push('addDraft');
  } else if (!isAuthorRole && isNewAuthorRole && !checkAuthorRole) {
    features.push('addDraft');
  }
  const checkFeaturesQuery = await models?.features?.findAll({
    order: [['orderId', 'ASC']],
    where: {
      key: features,
      isActive: true,
    },
  });
  if (!checkFeaturesQuery.length) return { code: 404, data: { status: 'Error', message: rescodes?.noFeatures } };
  if (checkFeaturesQuery) {
    if (checkFeaturesQuery?.length !== features?.length)
      return { code: 404, data: { status: 'Error', message: rescodes?.featureNExist } };
  }
  const currentfeatureIds = [];
  checkFeaturesQuery?.forEach((feaid) => {
    currentfeatureIds?.push({ id: feaid?.id, key: feaid?.key });
  });
  const checkModuleFeature = await models?.moduleFeatures?.findAll({
    include: [{ model: models?.features, as: 'features' }],
    where: {
      module_id: checkModuleQuery?.id,
    },
  });
  if (!checkModuleFeature?.length) return { code: 404, data: { status: 'Error', message: rescodes?.featureNUMod } };
  const moduleFeature = [];
  checkModuleFeature?.forEach((ele) => {
    moduleFeature?.push(ele?.features?.key);
  });
  const notMappedFeature = features?.filter((notMap) => !moduleFeature?.includes(notMap));
  const activeUser = [];
  if (notMappedFeature?.length)
    return {
      code: 404,
      data: {
        status: 'Error',
        message: {
          codes: 'featureNMMod',
          value: `${notMappedFeature} Features not under Respective ${checkModuleQuery?.name} Module`,
          html: `${notMappedFeature} Features not under Respective ${checkModuleQuery?.name} Module`,
        },
      },
    };
  if (userIds.length) {
    const checkUserQuery = await models?.users?.findAll({
      where: {
        id: {
          [Op.ne]: userID,
        },
        isAdmin: false,
        userStatus: {
          [Op.ne]: 'Inactive',
        },
        isTrash: false,
        userName: userIds,
      },
    });
    if (!checkUserQuery?.length) return { code: 404, data: { status: 'Error', message: rescodes?.noActiveUser } };
    checkUserQuery?.forEach((usr) => {
      activeUser?.push({ userName: usr?.userName, id: usr?.id });
    });
    const inactiveUser = userIds?.filter((item) => !activeUser?.some((name) => name?.userName?.includes(item)));
    if (inactiveUser?.length) {
      return {
        code: 404,
        data: {
          status: 'Error',
          message: {
            codes: 'inActiveUser',
            value: `${inactiveUser} Users Inactive / no exist`,
            html: `${inactiveUser} Users Inactive / no exist`,
          },
        },
      };
    }
  }
  const getRoleFeature = await models?.roleFeatures?.findAll({
    include: [{ model: models?.features, as: 'features' }],
    where: {
      role_id: checkRoleQuery?.id,
    },
  });
  const currentFeatureRoles = [];
  getRoleFeature?.forEach((val) => {
    currentFeatureRoles?.push({ id: val?.features?.id, key: val?.features?.key });
  });
  const deleteRoleFeaturesIds = currentFeatureRoles
    ?.filter((item) => !features?.includes(item?.key))
    .map((item) => item?.id);
  const createFeatureKey = features?.filter((key) => !currentFeatureRoles?.some((item) => item?.key === key));
  const deleteUserIds = [];
  const createUserIds = [];
  let extractedUserIds;
  const userModule = [];
  const getExistingUser = await models?.userModuleRoles?.findAll({
    include: [
      { model: models?.users, as: 'user' },
      { model: models?.modules, as: 'module' },
      { model: models?.roles, as: 'role' },
    ],
    where: {
      module_id: checkModuleQuery?.id,
    },
  });
  getExistingUser.forEach((element) => {
    userModule.push({
      id: element?.id,
      userId: element?.user?.id,
      userName: element?.user?.userName,
      module: element?.module?.key,
      role: element?.role?.key,
      roleId: element?.role_id,
    });
  });

  const userdiffModuleExist = activeUser
    .filter((itemB) => {
      return userModule?.some(
        (itemA) => itemA?.userName === itemB?.userName && itemA?.module === module && itemA?.role !== roleName
      );
    })
    .map((item) => ({
      userId: item?.id,
      userModuleId: userModule?.find((itemA) => itemA?.userName === item?.userName)?.id,
    }));

  const newUser = activeUser
    .filter((itemB) => {
      return !userModule?.some((itemA) => itemA?.userName === itemB?.userName);
    })
    .map((item) => item?.id);
  if (userdiffModuleExist?.length) {
    userdiffModuleExist?.forEach((element) => {
      deleteUserIds?.push(element?.userModuleId);
      createUserIds?.push(element?.userId);
    });
  }
  extractedUserIds = [...newUser, ...createUserIds];

  const deleteUserRole = userModule
    .filter((item) => !userIds.includes(item.userName) && item.roleId === checkRoleQuery.id)
    .map((item) => item.id);

  const convertedkey = await KeyConversion?.convertCamelCase(newRoleName?.trim());

  if (newRoleName) {
    await models?.roles?.update(
      { name: newRoleName?.trim(),  key: convertedkey, updated_by: userID },
      {
        where: {
          key: roleName,
          isActive: true,
        },
      }
    );
  }
  if (deleteRoleFeaturesIds?.length) {
    await models?.roleFeatures?.destroy({
      where: {
        feature_id: {
          [Op.in]: deleteRoleFeaturesIds,
        },
      },
    });
  }
  const createFeatureId = currentfeatureIds
    ?.filter((element) => createFeatureKey?.includes(element?.key))
    ?.map((element) => element?.id);
  if (createFeatureId?.length) {
    const roleFeaturesItems = createFeatureId?.map((featureId) => ({
      role_id: checkRoleQuery?.id,
      feature_id: featureId,
    }));
    await models?.roleFeatures?.bulkCreate(roleFeaturesItems);
  }
  if (!userIds) {
    await models?.userModuleRoles?.destroy({
      where: {
        module_id: checkModuleQuery?.id,
        role_id: checkRoleQuery?.id,
      },
    });
  }
  const finalDeleteUserIds = [...deleteUserIds, ...deleteUserRole];
  if (finalDeleteUserIds?.length) {
    await models?.userModuleRoles?.destroy({
      where: {
        id: {
          [Op.in]: finalDeleteUserIds,
        },
      },
    });
  }
  if (extractedUserIds?.length) {
    const userRoleItems = extractedUserIds?.map((userid) => ({
      user_id: userid,
      module_id: checkModuleQuery?.id,
      role_id: checkRoleQuery?.id,
      created_by: userID,
      updated_by: userID,
    }));
    await models?.userModuleRoles?.bulkCreate(userRoleItems);
  }
  return {
    code: 200,
    data: {
      status: 'Ok',
      message: {
        codes: 'roleUpdate',
        value: `${newRoleName} Role Updated Successfully.`,
        html: `${newRoleName} Role Updated Successfully.`,
      },
    },
  };
};



roleService.delete = async ({ moduleRole, userID, isAdmin, models }) => {
  if (!isAdmin) {
    const checkAccess = await accessPermission?.featureAccess({
      userId: userID,
      featureKey: 'deleteRole',
      db: models
    });
    if (!checkAccess) return { code: 401, data: { status: 'Error', message: rescodes?.accessDenied } };
  }
  if (!moduleRole || !moduleRole?.length) return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  let checkRoleExistQuery;
  for (const modRol of moduleRole) {
    const checkModuleQuery = await models?.modules?.findOne({
      where: {
        key: modRol?.moduleKey,
      },
    });
    if (!checkModuleQuery) {
      return {
        code: 404,
        data: {
          status: 'Error',
          message: {
            codes: 'moduleNExist',
            value: `${modRol?.moduleKey} Module not Exist`,
            html: `${modRol?.moduleKey} Module not Exist`,
          },
        },
      };
    }
    checkRoleExistQuery = await models?.roles?.findOne({
      where: {
        key: modRol?.roleNameKey,
        isActive: true,
        module_id: checkModuleQuery?.id,
      },
    });
    if (!checkRoleExistQuery) {
      return {
        code: 404,
        data: {
          status: 'Error',
          message: {
            codes: 'roleNExist',
            value: `${modRol?.roleNameKey} Role not Exist`,
            html: `${modRol?.roleNameKey} Role not Exist`,
          },
        },
      };
    }
    if (checkRoleExistQuery?.id && checkRoleExistQuery?.id) {
      await models?.roleFeatures?.destroy({
        where: {
          role_id: checkRoleExistQuery?.id,
        },
      });
      await models?.userModuleRoles?.destroy({
        where: {
          module_id: checkModuleQuery?.id,
          role_id: checkRoleExistQuery?.id,
        },
      });
      await models?.roles?.destroy({
        where: {
          key: modRol?.roleNameKey,
          id: checkRoleExistQuery?.id,
        },
      });
    }
  }
  return {
    code: 200,
    data: {
      status: 'Ok',
      message: {
        codes: 'roleDelete',
        value: `${checkRoleExistQuery?.name} Role Deleted Successfully`,
        html: `${checkRoleExistQuery?.name} Role Deleted Successfully`,
      },
    },
  };
};



module.exports = roleService;

