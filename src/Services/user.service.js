/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-const */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable radix */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unsafe-optional-chaining */
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const generator = require('generate-password');
const moment = require('moment');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const rescodes = require('../utility/rescodes');
// const { sequelize } = require('../../models/index');

const config = require('../config/vars');
const accessPermission = require('../utility/permissionaccess');
const Email = require('./login.service');
const S3 = require('../utility/s3Connection');


const userService = {};




userService.create = async ({ firstName, lastName, mobile, email, modules, userID, isAdmin, adminName, models }) => {
  if (!isAdmin) {
    const checkAccess = await accessPermission?.featureAccess({
      userId: userID,
      featureKey: 'addUsers',
    });
    if (!checkAccess) return { code: 401, data: { status: 'Error', message: rescodes?.accessDenied } };
  }
  const reqFields = { code: 400, data: { status: 'Error', message: rescodes.reqFields } };
  if (!firstName?.trim() || !email?.trim()) return reqFields;
  const password = generator?.generate({
    length: 10,
    numbers: true,
  });
  const isEmailAlreadyExist = await userService.checkEmailExist({ userEmail: email, models });
  if (isEmailAlreadyExist?.data?.status === 'Error') return isEmailAlreadyExist;
  const checkExistEmailQuery = await models?.users?.findAll();
  let userNameExist = false;
  let generatedUserName = email?.split('@')[0] + parseInt(Math.random() * 100000);
  checkExistEmailQuery?.forEach((usr) => {
    if (usr?.userName === generatedUserName) userNameExist = true;
  });
  if (userNameExist) {
    generatedUserName = email?.split('@')[0] + parseInt(Math.random() * 100000);
  }

  const encryptedPassword = jwt.sign({ password }, config?.app?.accesstoken);
  let checkModuleQuery;
  let checkRoleModuleQuery;
  let checkAuthorRole = false;
  if (modules?.length) {
    for (const mod of modules) {
      if (mod?.moduleKey) {
        checkModuleQuery = await models?.modules?.findOne({
          where: {
            key: mod?.moduleKey,
            isCard: true,
            isActive: true,
          },
        });
        if (!checkModuleQuery) {
          return {
            code: 404,
            data: {
              status: 'Error',
              message: {
                codes: 'noModule',
                value: `${mod?.moduleKey} Module not Exist / Active`,
                html: `${mod?.moduleKey} Module not Exist / Active`,
              },
            },
          };
        }
      }
      if (mod?.roleKey) {
        checkRoleModuleQuery = await models?.roles?.findOne({
          where: {
            key: mod?.roleKey,
            module_id: checkModuleQuery?.id,
            isActive: true,
          },
        });
        if (!checkRoleModuleQuery) {
          return {
            code: 404,
            data: {
              status: 'Error',
              message: {
                codes: 'noRole',
                value: `Invalid ${mod?.roleKey} Role / not under ${mod?.moduleKey} Module`,
                html: `Invalid ${mod?.roleKey} Role / not under ${mod?.moduleKey} Module`,
              },
            },
          };
        }
      }
      if (mod?.moduleKey === 'webContent' && mod?.roleKey === 'author') checkAuthorRole = true;
    }
  }
  const getNextOrder = await models?.users.findAll({
    order: [['id', 'DESC']],
  });

  let nextOrderId;

  if (getNextOrder[0].executiveId != null && getNextOrder?.length > 0) {
    nextOrderId = getNextOrder[0].executiveId + 1;
  } else {
    nextOrderId = 1000000;
  }
  let createUserQuery;
  let createUserRoleQuery;
  createUserQuery = await models?.users?.create({
    userName: generatedUserName,
    password: encryptedPassword,
    email: email?.trim(),
    mobile,
    firstName: firstName?.trim(),
    lastName: lastName?.trim() || '',
    isAdmin: false,
    userStatus: 'Invited',
    isTrash: false,
    inviteDate: moment()?.format(),
    resendLinkCount: 0,
    isResetByMail: false,
    executiveId: nextOrderId,
    created_by: userID,
    updated_by: userID,
    authorStatus: checkAuthorRole ? 'Active' : null,
  });

  const getStatus = await models?.subscriberStatus?.findOne({
    where: {
      key: 'earlyBird',
      isActive: true,
    },
  });

  const isEarlyBird = await models?.subscription?.findOne({
    where: {
      email: email.trim(),
      isSubscribe: true,
      status_id: getStatus?.id,
    },
  });
  if (isEarlyBird?.id) {
    const payload = {
      params: {
        subject: 'Welcome to the Early Bird Access List for Sheshi FR!',
        subscriberName: `${firstName} ${lastName || ''}`,
      },
      to: [{ email: email?.trim(), name: firstName.trim() }],
      templateId: 303,
    };
    await Email?.sendTransactionMail(payload);
  }
  const payload = {
    params: {
      firstName,
      subject: ' jk | Your account has been created.',
      userName: generatedUserName,
      password,
      your_Name: adminName,
      loginLink: config?.app?.hostname?.replace('api', 'login'),
    },
    to: [{ email: email?.trim(), name: firstName.trim() }],
    templateId: 175,
  };

  const sentEmail = await Email?.sendTransactionMail(payload);
  if (sentEmail === 'success') {
    createUserRoleQuery = await models?.userModuleRoles?.create({
      user_id: createUserQuery?.id,
      module_id: checkModuleQuery?.id,
      role_id: checkRoleModuleQuery?.id,
      created_by: userID,
      updated_by: userID,
    });
  }
  if (createUserQuery || (createUserQuery && createUserRoleQuery))
    return { code: 200, data: { status: 'Ok', message: rescodes?.userC } };
  return { code: 400, data: { status: 'Error', message: rescodes?.wentWrong } };
};


userService.getDetails = async ({ userName, authUserName, models }) => {
  const getUserQuery = await models?.users?.findOne({
    where: {
      userName: userName?.trim() || authUserName?.trim(),
      isTrash: false,
    },
  });
  if (!getUserQuery) return { code: 404, data: { status: 'Error', message: rescodes?.noUser } };
  const userList = getUserQuery?.dataValues;
  const getUserModuleRole = await models?.userModuleRoles?.findAll({
    order: [['module_id', 'ASC']],
    include: [
      { model: models?.modules, as: 'module' },
      { model: models?.roles, as: 'role' },
    ],
    where: {
      user_id: getUserQuery?.id,
    },
  });
  const moduleList = [];
  if (getUserModuleRole?.length) {
    getUserModuleRole?.forEach((val) => {
      moduleList?.push({
        module: { label: val?.module?.name, key: val?.module?.key },
        role: { label: val?.role?.name, key: val?.role?.key },
      });
    });
  }
  const getAuthorRole = await models?.roles?.findOne({
    where: {
      name: 'Author',
      isActive: true,
    },
  });
  userList.isAuthor = false;
  const authorAccess = [];
  const allAccessList = [];
  if (getAuthorRole) {
    const checkAuthorUserAccess = await models?.userModuleRoles?.findOne({
      where: {
        user_id: getUserQuery?.id,
        role_id: getAuthorRole?.id,
      },
    });
    if (checkAuthorUserAccess) {
      userList.isAuthor = true;
      const getAllAccess = await models?.authorAccess?.findAll({
        order: [['orderId', 'ASC']],
      });
      getAllAccess?.forEach((val) => {
        allAccessList?.push({ key: val?.dataValues?.key, label: val?.dataValues?.name, access: false });
      });
      const getUserAuthorAccess = await models?.userAuthorAccess?.findAll({
        include: [
          {
            model: models?.authorAccess,
            as: 'author',
          },
        ],
        where: {
          user_id: getUserQuery?.id,
        },
      });
      if (getUserAuthorAccess) {
        getUserAuthorAccess?.forEach((val) => {
          authorAccess?.push(val?.author?.key);
        });
        for (const item of allAccessList) {
          item.access = authorAccess?.includes(item?.key);
        }
        userList.authorAccess = allAccessList;
      }
    }
  }
  userList.modules = getUserQuery?.isAdmin ? 'Super Admin' : moduleList;
  return { code: 200, data: { status: 'Ok', data: userList } };
};

userService.updateUserDetails = async ({
  userName,
  firstName,
  fatherName,
  lastName,
  dob,
  gender,
  street1,
  street2,
  pincode,
  country,
  state,
  city,
  email,
  mobile,
  imageURL,
  userID,
  models
}) => {
  if (
    !userName ||
    !firstName.trim() ||
    !lastName.trim() ||
    !street1 ||
    !street2 ||
    !pincode ||
    !country.trim() ||
    !state.trim() ||
    !city.trim() ||
    !email.trim() ||
    !mobile ||
    !imageURL.trim()
  )
    return { code: 404, data: { status: 'Error', message: rescodes?.reqFields } };
  const checkUserExist = await models?.users?.findOne({
    where: {
      userName,
      userStatus: 'Active',
      isTrash: false,
    },
  });
  if (!checkUserExist) return { code: 404, data: { status: 'Error', message: rescodes?.noUser } };
  const isEmailAlreadyExist = await userService.updateEmailExist({ userEmail: email?.trim(), userID, models });
  if (isEmailAlreadyExist?.data?.status === 'Error') return isEmailAlreadyExist;
  const updateUserInfo = await models?.users?.update(
    {
      email: email?.trim(),
      mobile,
      firstName: firstName?.trim(),
      fatherName: fatherName ? fatherName.trim() : null,
      lastName: lastName.trim(),
      dob: dob || null,
      gender: gender ? gender.trim() : null,
      street1,
      street2,
      pincode,
      country: country.trim(),
      state: state.trim(),
      city: city.trim(),
      imageName: imageURL,
      updated_by: userID,
    },
    {
      where: {
        userName,
        userStatus: 'Active',
        isTrash: false,
      },
    }
  );
  if (updateUserInfo) return { code: 200, data: { status: 'Ok', message: rescodes?.profUpdateS } };
  return { code: 400, data: { status: 'Error', message: rescodes?.wentWrong } };
};

userService.generatedUserName = async (firstname, lastname) => {
  const specialCharacters = '@_.';
  const randomIndex = Math.floor(Math.random() * specialCharacters.length);
  const generatedUserName = `${firstname}${lastname}${specialCharacters[randomIndex]}${parseInt(
    Math.random() * 100000,
    10
  )}`;
  return generatedUserName;
};

// const sequelize = require('../models/index')
userService.uniqueUsername = async ({firstname, lastname}) => {
  console.log("((((((", firstname, lastname);
  let getUniqueUserName;
  getUniqueUserName = await userService.generatedUserName(firstname, lastname);
  console.log("@@@@@@@@@", getUniqueUserName);
  const checkUserNameExist = await sequelize.query(`SELECT "userName" FROM roles.users WHERE "userName" = :username`, {
    replacements: {
      username: getUniqueUserName,
    },
    raw: true,
  });
  console.log("!!!!!!!!!!!!!");
  if (checkUserNameExist[0]?.length) {
    getUniqueUserName = await userService.generatedUserName(firstname, getUniqueUserName);
  }
  return { code: 200, data: { status: 'Ok', data: { userName: getUniqueUserName } } };
};


userService.getUser = async ({ userID, models }) => {
  const getUserList = await models?.users?.findAll({
    where: {
      isTrash: false,
      isAdmin: false,
      id: {
        [Op.ne]: userID,
      },
      userStatus: {
        [Op.ne]: 'Inactive',
      },
    },
  });
  const listingUsers = [];
  if (!getUserList) return { code: 404, data: { status: 'Error', message: rescodes?.noActiveUser } };
  if (getUserList) {
    getUserList?.map((user) => {
      const { email, userName } = user;
      listingUsers?.push({ username: userName, email });
      return listingUsers;
    });
  }
  return { code: 200, data: { status: 'Ok', data: listingUsers } };
};

userService.checkEmailExist = async ({ userEmail, models }) => {
  if (!userEmail) return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  const checkEmailExistQuery = await models?.users?.findAll({
    where: {
      email: userEmail,
      isTrash: false,
    },
  });
  if (checkEmailExistQuery?.length) return { code: 409, data: { status: 'Error', message: rescodes?.emailExist } };
  return { code: 200, data: { status: 'Ok', message: rescodes?.emailNExist } };
};

userService.listing = async ({ models }) => {
  const getUserList = await models?.users?.findAll({
    order: [['id', 'ASC']],
    where: {
      isTrash: false,
    },
  });
  const userDashList = [];
  if (!getUserList?.length) return { code: 404, data: { status: 'Error', message: rescodes?.noActiveUser } };
  for (const usr of getUserList) {
    const { id, userName, firstName, lastName, email, userStatus, isAdmin, fatherName, inviteDate } = usr;
    const isInviteValid = moment()?.diff(inviteDate, 'days') !== 0 && userStatus === 'Invited';
    const getModules = await models?.userModuleRoles?.findAll({
      include: [{ model: models?.modules, as: 'module' }],
      where: {
        user_id: id,
      },
    });
    const modulesList = [];
    if (getModules?.length) {
      getModules?.forEach((mod) => {
        modulesList?.push({ key: mod?.module?.key, label: mod?.module?.name });
      });
    }
    let userLinkStatus = userStatus;
    if (userStatus === 'Invited') userLinkStatus = { status: userStatus, resendlabel: 'Resend Link' };
    userDashList?.push({
      id,
      name: `${firstName?.trim()} ${lastName?.trim()}`,
      firstName,
      fatherName,
      lastName,
      userName,
      email,
      userStatus: userLinkStatus,
      resendLink: isInviteValid,
      isAdmin,
      module: modulesList,
    });
  }
  return { code: 200, data: { status: 'Ok', data: userDashList } };
};


userService.edit = async ({ userid, firstName, lastName, mobile, email, module, userID, isAdmin , models}) => {
  if (!isAdmin) {
    const checkAccess = await accessPermission?.featureAccess({
      userId: userID,
      featureKey: 'editUsers',
    });
    if (!checkAccess) return { code: 401, data: { status: 'Error', message: rescodes?.accessDenied } };
  }
  if (!userid || !firstName?.trim() || !email) return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  const getUserDetailsQuery = await models?.users?.findOne({
    where: {
      id: userid,
      isTrash: false,
    },
  });

  if (!getUserDetailsQuery) return { code: 404, data: { status: 'Error', message: rescodes?.noUser } };

  const checkUserModuleRoleQuery = await models?.userModuleRoles?.findAll({
    include: [
      { model: models?.modules, as: 'module' },
      { model: models?.roles, as: 'role' },
    ],
    where: {
      user_id: userid,
    },
  });

  const currentUserRoles = [];
  let toCreate;
  let toDelete;
  if (checkUserModuleRoleQuery?.length) {
    checkUserModuleRoleQuery?.forEach((val) => {
      currentUserRoles?.push({ id: val?.id, moduleKey: val?.module.key, roleKey: val?.role.key });
    });

    const deleteItem = currentUserRoles?.filter((item) => {
      return !module?.some((aItem) => aItem?.moduleKey === item?.moduleKey && aItem?.roleKey === item?.roleKey);
    });
    toDelete = deleteItem?.map((item) => item?.id);
  }
  if (module?.length) {
    toCreate = module?.filter((item) => {
      return !currentUserRoles?.some((bItem) => bItem?.moduleKey === item?.moduleKey && bItem?.roleKey === item?.roleKey);
    });
  }

  const updateUserQuery = await models?.users?.update(
    {
      firstName: firstName || checkUserModuleRoleQuery?.firstName,
      lastName: lastName || checkUserModuleRoleQuery?.lastName,
      email: email || checkUserModuleRoleQuery?.email,
      mobile: mobile || checkUserModuleRoleQuery?.mobile,
    },
    {
      where: {
        id: userid,
      },
    }
  );
  if (toCreate?.length) {
    for (const add of toCreate) {
      const getModule = await models?.modules?.findOne({
        where: {
          key: add?.moduleKey,
          isActive: true,
          isCard: true,
        },
      });
      if (!getModule) {
        return {
          code: 404,
          data: {
            status: 'Error',
            message: {
              codes: 'noUserMod',
              value: `${add?.moduleKey} moduleKey not exist`,
              html: `${add?.moduleKey} moduleKey not exist`,
            },
          },
        };
      }
      const getRole = await models?.roles?.findOne({
        where: {
          key: add?.roleKey,
          isActive: true,
          module_id: getModule?.id,
        },
      });
      if (!getRole) {
        return {
          code: 404,
          data: {
            status: 'Error',
            message: {
              codes: 'noUserRole',
              value: `${add?.roleKey} roleKey not exist`,
              html: `${add?.roleKey} roleKey not exist`,
            },
          },
        };
      }
      await models?.userModuleRoles?.create({
        user_id: userid,
        module_id: getModule?.id,
        role_id: getRole?.id,
        created_by: userID,
        updated_by: userID,
      });
    }
  }
  if (toDelete?.length) {
    for (const del of toDelete) {
      await models?.userModuleRoles?.destroy({
        where: {
          id: del,
        },
      });
    }
  }
  if (updateUserQuery) return { code: 200, data: { status: 'Ok', message: rescodes?.updateUsr } };
  return { code: 400, data: { status: 'Error', message: rescodes?.wentWrong } };
};

userService.delete = async ({ userName, userID, isAdmin, models }) => {
  if (!isAdmin) {
    const checkAccess = await accessPermission?.featureAccess({
      userId: userID,
      featureKey: 'editUsers',
    });
    if (!checkAccess) return { code: 401, data: { status: 'Error', message: rescodes?.accessDenied } };
  }
  const checkUserQuery = await models?.users?.findAll({
    where: {
      userName,
      isTrash: false,
      isAdmin: false,
    },
  });
  if (!checkUserQuery.length) return { code: 404, data: { status: 'Error', message: rescodes?.noUser } };
  const existUserName = [];
  const existUserId = [];
  checkUserQuery?.forEach((val) => {
    existUserId?.push(val?.id);
    existUserName.push(val?.userName);
  });
  if (checkUserQuery?.length !== userName?.length) {
    const noUser = userName?.filter((element) => !existUserName?.includes(element));
    return {
      code: 404,
      data: {
        status: 'Error',
        message: {
          codes: 'noUser',
          value: `[${noUser}] User not Exist / Active`,
          html: `[${noUser}] User not Exist / Active`,
        },
      },
    };
  }
  const deleteUserModuleRole = await models?.userModuleRoles?.destroy({
    where: {
      user_id: existUserId,
    },
  });
  const deleteUserQuery = await models?.users?.update(
    {
      isTrash: true,
      updated_by: userID,
    },
    {
      where: {
        userName,
        isAdmin: false,
      },
    }
  );
  if (deleteUserModuleRole || deleteUserQuery) return { code: 200, data: { status: 'Ok', message: rescodes?.deleteUsr } };
  return { code: 400, data: { status: 'Error', message: rescodes?.wentWrong } };
};

userService.updateUsernameAndPassword = async ({ userId, password, userName, userID, models }) => {
  if (!userId || !password || !userName?.trim())
    return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  if (userId !== userID) return { code: 401, data: { status: 'Error', message: rescodes?.unAuth } };
  const checkUserExistQuery = await models?.users?.findOne({
    where: {
      id: userId,
      isAdmin: false,
      userStatus: 'Invited',
      isTrash: false,
    },
  });
  if (!checkUserExistQuery) return { code: 404, data: { status: 'Error', message: rescodes?.noUser } };
  const checkUserNameExist = await models?.users?.findAll({
    where: {
      userName,
    },
  });
  if (checkUserNameExist?.length) return { code: 404, data: { status: 'Error', message: rescodes?.userNameExist } };
  const currentDate = new Date();
  const timeDifference = Math?.abs(currentDate - checkUserExistQuery?.inviteDate);
  const inValid = timeDifference <= 86400000;
  if (!inValid) return { code: 404, data: { status: 'Error', message: rescodes?.inValid } };
  const encryptedPassword = jwt?.sign({ password }, config?.app?.accesstoken);
  const updateUserQuery = await models?.users?.update(
    {
      userName: userName?.trim(),
      password: encryptedPassword,
      updated_by: userID,
      updatedAt: currentDate,
      userStatus: 'Active',
    },
    {
      where: {
        id: userId,
        userName: checkUserExistQuery?.userName?.trim(),
        isAdmin: false,
        userStatus: 'Invited',
        isTrash: false,
      },
    }
  );
  const user = { name: userName, id: userId };
  const accessToken = jwt?.sign(user, config?.app?.accesstoken, { expiresIn: '60m' });
  const refreshToken = jwt?.sign(user, config?.app?.refreshtoken);
  const createRefreshToken = await models?.refreshToken?.create({
    userId,
    token: refreshToken,
  });
  if (updateUserQuery && createRefreshToken && accessToken)
    return {
      code: 200,
      data: {
        status: 'Ok',
        data: {
          userId,
          accessToken,
          refreshToken,
          userStatus: 'Active',
          expiresIn: 3600000,
        },
        message: rescodes?.updateUsr,
      },
    };
  return { code: 400, data: { status: 'Error', message: rescodes?.wentWrong } };
};

userService.userStatusUpdate = async ({ userName, status, userID, models }) => {
  if (!userName?.trim() || !status) return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  const checkUserQuery = await models?.users?.findOne({
    where: {
      userName,
      isAdmin: false,
      userStatus: {
        [Op.ne]: 'Invited',
      },
      isTrash: false,
    },
  });
  if (!checkUserQuery) return { code: 404, data: { status: 'Error', message: rescodes?.noUser } };
  if (checkUserQuery?.id === userID) return { code: 401, data: { status: 'Error', message: rescodes?.unAuth } };
  if (checkUserQuery?.userStatus === status)
    return {
      code: 409,
      data: {
        status: 'Error',
        message: {
          codes: 'existStatus',
          value: `No Update, Already Userstatus is in ${status} only`,
          html: `No Update, Already Userstatus is in ${status} only`,
        },
      },
    };
  const updateStatusQuery = await models?.users?.update(
    {
      userStatus: status,
      updated_by: userID,
      updatedAt: new Date(),
    },
    {
      where: {
        id: checkUserQuery?.id,
        userName: userName?.trim(),
        isTrash: false,
      },
    }
  );
  if (updateStatusQuery) return { code: 200, data: { status: 'Ok', message: rescodes?.updateUsrStatus } };
  return { code: 400, data: { status: 'Error', message: rescodes?.wentWrong } };
};

userService.inviteResendLink = async ({ userName, userID, models }) => {
  if (!userName?.trim()) return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  const checkUserExist = await models?.users?.findOne({
    where: {
      userName: userName?.trim(),
      isAdmin: false,
      userStatus: 'Invited',
      isTrash: false,
    },
  });
  if (!checkUserExist) return { code: 404, data: { status: 'Error', message: rescodes?.noUser } };
  if (checkUserExist?.id === userID) return { code: 401, data: { status: 'Error', message: rescodes?.unAuth } };
  const password = generator?.generate({
    length: 10,
    numbers: true,
  });
  const encryptedPassword = jwt.sign({ password }, config?.app?.accesstoken);
  const userUpdate = await models?.users?.update(
    {
      inviteDate: moment()?.format(),
      password: encryptedPassword,
      resendLinkCount: parseInt(checkUserExist?.resendLinkCount) + 1,
      updated_by: userID,
      updatedAt: new Date(),
    },
    {
      where: {
        id: checkUserExist?.id,
        userName: userName?.trim(),
        isTrash: false,
        isAdmin: false,
      },
    }
  );
  const payload = {
    params: {
      expiretime: '24 hours',
      subject: 'Resend Link',
      loginlink: config?.app?.hostname?.replace('api', 'login'),
      username: checkUserExist?.userName,
      password,
    },
    to: [{ email: checkUserExist?.email?.trim(), name: checkUserExist?.firstName?.trim() }],
    templateId: 61,
  };
  const sentEmail = await Email?.sendTransactionMail(payload);
  if (userUpdate && sentEmail) return { code: 200, data: { status: 'Ok', message: rescodes?.resendMail } };
  return { code: 400, data: { status: 'Error', message: rescodes?.wentWrong } };
};

userService.changeNewAdmin = async ({ currentAdmin, newAdmin, adminPassword, userName, userID, isAdmin, userPassword, models }) => {
  if (!isAdmin) return { code: 401, data: { status: 'Error', message: rescodes?.accessDenied } };
  if (!currentAdmin || !currentAdmin?.trim() || !newAdmin || !newAdmin?.trim() || !adminPassword)
    return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  if (currentAdmin?.trim() !== userName?.trim())
    return { code: 401, data: { status: 'Error', message: rescodes?.unauthUser } };
  const passwordCheck = jwt?.verify(userPassword, config?.app?.accesstoken, (err, user) => {
    if (err) return false;
    return user;
  });
  if (adminPassword !== passwordCheck?.password)
    return { code: 401, data: { status: 'Error', message: rescodes?.inCorrectAdmPass } };
  const checkNewAdminUser = await models?.users?.findOne({
    where: {
      userName: newAdmin,
      isAdmin: false,
      userStatus: 'Active',
      isTrash: false,
    },
  });
  if (!checkNewAdminUser)
    return {
      code: 404,
      data: {
        status: 'Error',
        message: {
          codes: 'noUser',
          value: `${newAdmin?.trim()} User not Exist / Active`,
          html: `${newAdmin?.trim()} User not Exist / Active`,
        },
      },
    };
  const userRoleUser = [userID, checkNewAdminUser?.id];
  await models?.userModuleRoles?.destroy({
    where: {
      user_id: userRoleUser,
    },
  });
  const changeAdminUser = await models?.users?.update(
    {
      isAdmin: false,
      updated_by: userID,
      updatedAt: new Date(),
    },
    {
      where: {
        id: userID,
        userName: currentAdmin,
        isAdmin: true,
        userStatus: 'Active',
        isTrash: false,
      },
    }
  );
  const assignAdminUser = await models?.users?.update(
    {
      isAdmin: true,
      updated_by: userID,
      updatedAt: new Date(),
    },
    {
      where: {
        id: checkNewAdminUser?.id,
        userName: newAdmin,
        isAdmin: false,
        userStatus: 'Active',
        isTrash: false,
      },
    }
  );
  if (changeAdminUser && assignAdminUser) return { code: 200, data: { status: 'Ok', message: rescodes?.adminChange } };
  return { code: 400, data: { status: 'Error', message: rescodes?.wentWrong } };
};

userService.checkUserNameExist = async ({ userName, models }) => {
  if (!userName || !userName.trim()) return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  const checkUserNameExist = await models?.users?.findAll({
    where: {
      userName: userName?.trim(),
    },
  });
  if (checkUserNameExist?.length) return { code: 409, data: { status: 'Error', message: rescodes?.userNameExist } };
  return { code: 200, data: { status: 'Ok' } };
};

userService.checkAdminEmail = async ({ email, firmId }) => {
  if (!email) return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  const checkCafirmEmailExist = await sequelize?.query(
    `select email from sukruthi.cafirm where email = (:email) and cafirm.id = (:id)`,
    {
      replacements: {
        email,
        id: firmId,
      },
    }
  );
  const checkUserEmailExist = await sequelize?.query(
    `select email from sukruthi.users where email = (:email) and cafirmid = (:cafirmid)`,
    {
      replacements: {
        email,
        cafirmid: firmId,
      },
    }
  );
  if ((checkCafirmEmailExist && checkCafirmEmailExist[0]?.length) || (checkUserEmailExist && checkUserEmailExist[0]?.length))
    return { code: 409, data: { status: 'Error', message: rescodes?.emailExist } };
  return { code: 200, data: { status: 'Ok' } };
};

userService.imageUpload = async ({ fileName }) => {
  if (fileName) {
    return {
      code: 200,
      data: {
        status: 'Ok',
        data: { imageURL: `d2t5hgiouuhmes.cloudfront.net/${fileName}` },
        message: rescodes?.imageUpload,
      },
    };
  }
  return { code: 400, data: { status: 'Error', message: rescodes?.wentWrong } };
};

userService.imageReUpload = async ({ userName, blogId, fileName, module }) => {
  let imageName;
  if (userName) {
    const checkExistImage = await module?.users?.findOne({
      where: {
        userName,
        isTrash: false,
      },
    });
    if (!checkExistImage) return { code: 404, data: { status: 'Error', message: rescodes?.noUser } };
    imageName = checkExistImage?.imageName;
  }
  if (blogId) {
    const checkExistImage = await module?.blog?.findOne({
      where: {
        id: blogId,
      },
    });
    if (!checkExistImage) return { code: 404, data: { status: 'Error', message: rescodes?.blogNExist } };
    imageName = checkExistImage?.imageURL;
  }
  if (imageName) {
    const parts = imageName?.split('/');
    const filename = parts[parts?.length - 1];
    const input = {
      Bucket: config?.app?.bucketName,
      Key: filename,
    };
    const command = new DeleteObjectCommand(input);
    await S3?.send(command);
  }
  if (fileName) {
    return {
      code: 200,
      data: {
        status: 'Ok',
        data: { imageURL: `d2t5hgiouuhmes.cloudfront.net/${fileName}` },
        message: rescodes?.imageUpload,
      },
    };
  }
  return { code: 400, data: { status: 'Error', message: rescodes?.wentWrong } };
};

userService.updateEmailExist = async ({ userEmail, userID, models }) => {
  if (!userEmail) return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  const checkEmailExistQuery = await models?.users?.findAll({
    where: {
      id: {
        [Op.ne]: userID,
      },
      email: userEmail,
      isTrash: false,
    },
  });
  if (checkEmailExistQuery?.length) return { code: 409, data: { status: 'Error', message: rescodes?.emailExist } };
  return { code: 200, data: { status: 'Ok', message: rescodes?.emailNExist } };
};

userService.updateUsername = async ({ userID, userName, models }) => {
  const checkUserExist = await models?.users?.findOne({
    where: {
      id: userID,
      userStatus: 'Active',
      isTrash: false,
    },
  });
  if (!checkUserExist) return { code: 400, data: { status: 'Error', message: rescodes?.noUser } };
  const checkUserNameExist = await models?.users?.findAll({
    where: {
      userName,
    },
  });
  if (checkUserNameExist?.length)
    return {
      code: 404,
      data: {
        status: 'Error',
        message: {
          codes: 'nameExist',
          value: `${userName?.trim()} already exist`,
          html: `${userName?.trim()} already exist`,
        },
      },
    };
  const updateUsername = await models?.users?.update(
    { userName: userName.trim() },
    {
      where: {
        id: userID,
        userStatus: 'Active',
        isTrash: false,
      },
    }
  );
  if (updateUsername[0] === 0) return { code: 400, data: { status: 'Error', message: rescodes?.wentWrong } };
  return {
    code: 200,
    data: {
      status: 'Ok',
      message: {
        codes: 'nameChange',
        value: `${userName?.trim()} changed successfully`,
        html: `${userName?.trim()} changed successfully`,
      },
    },
  };
};


userService.passwordUpdate = async ({ userID, oldPassword, newPassword, models }) => {
  const checkCred = { code: 401, data: { status: 'Error', message: rescodes?.passNM } };
  const checkUserExist = await models?.users?.findOne({
    where: {
      id: userID,
      userStatus: 'Active',
      isTrash: false,
    },
  });
  if (!checkUserExist) return { code: 400, data: { status: 'Error', message: rescodes?.noUser } };
  const decryptPass = jwt?.verify(checkUserExist?.password, config?.app?.accesstoken, (err, user) => {
    if (err) return false;
    return user;
  });
  if (decryptPass?.password !== oldPassword) {
    return checkCred;
  }
  const newEncryptedPassword = jwt?.sign({ password: newPassword }, config?.app?.accesstoken);
  const updatePassword = await models?.users?.update(
    { password: newEncryptedPassword },
    {
      where: {
        id: userID,
        userStatus: 'Active',
        isTrash: false,
      },
    }
  );
  if (!updatePassword[0] === 0) return { code: 400, data: { status: 'Error', message: rescodes?.wentWrong } };
  return { code: 200, data: { status: 'Ok', message: rescodes?.passUpdate } };
};




module.exports = userService;
