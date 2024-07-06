/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-param-reassign */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable security/detect-possible-timing-attacks */
/* eslint-disable consistent-return */
// const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const moment = require('moment');
// const { sequelize } = require('../../models/index');
// const db = require('../../models/index');
const rescodes = require('../utility/rescodes');
const config = require('../config/vars');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const loginService = {};

function generateAccessToken(user) {
  return jwt.sign(user, config.app.accesstoken, { expiresIn: '60m' });
}
loginService.validatelogin = async ({ username, password, models }) => {
  try {
    if (!username?.trim() || !password?.trim()) {
      return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
    }

    const userExist = await models?.users?.findOne({
      where: {
        userName: username,
        isTrash: false,
      },
    });

    // Log the user data to check if it's found
    if (!userExist) {
      return { code: 401, data: { status: 'Error', message: rescodes?.checkCred } };
    }
    if (userExist?.userStatus === 'Inactive' || userExist?.authorStatus === 'Inactive') {
      return { code: 404, data: { status: 'Error', message: rescodes?.inActiveUsr } };
    }

    const isInviteValid = moment()?.diff(userExist?.inviteDate, 'days') === 0;
    if (userExist?.userStatus === 'Invited' && !isInviteValid) {
      return { code: 404, data: { status: 'Error', message: rescodes?.inValid } };
    }

    const isPasswordValid = async (password) => {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
  };
    if (!isPasswordValid) {
      return { code: 401, data: { status: 'Error', message: rescodes?.checkCred } };
    }

    const user = { name: username, id: userExist?.id };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt?.sign(user, config?.app?.refreshtoken);

    await models?.refreshToken?.create({
      userId: userExist?.id,
      token: refreshToken,
    });

    const allList = [];
    const getModuleFeature = await models?.modules?.findAll({
      include: [{ model: models?.features, through: models?.moduleFeatures, as: 'features' }],
      order: [['orderId', 'ASC']],
      where: {
        isActive: true,
      },
    });

    let adminEnable;
    if (userExist?.isAdmin) adminEnable = true;
    if (getModuleFeature?.length) {
      getModuleFeature?.forEach((val) => {
        const modules = {
          moduleLabel: val?.name,
          moduleKey: val?.key,
          enable: adminEnable ? true : false,
        };
        const feature = [];
        if (val?.features) {
          val?.features?.forEach((ele) => {
            feature?.push({
              featureLabel: ele?.name,
              featureKey: ele?.key,
              enable: adminEnable ? true : false,
            });
          });
        }
        allList?.push({ module: modules, features: feature });
      });
    }

    const getUserModuleFeature = await models?.userModuleRoles?.findAll({
      order: [['id', 'ASC']],
      include: [
        { model: models?.roles, as: 'role' },
        { model: models?.modules, as: 'module' },
      ],
      where: {
        user_id: userExist?.id,
      },
    });

    const userList = [];
    if (getUserModuleFeature?.length) {
      for (const roleFeature of getUserModuleFeature) {
        const userFeatureList = [];
        const userModuleList = { moduleLabel: roleFeature?.module?.name, moduleKey: roleFeature?.module?.key };
        const getFeature = await models?.roleFeatures?.findAll({
          order: [['id', 'ASC']],
          include: [{ model: models?.features, as: 'features' }],
          where: {
            role_id: roleFeature?.role_id,
          },
        });
        if (getFeature?.length) {
          getFeature?.forEach((fea) => {
            userFeatureList?.push({ featureLabel: fea?.features?.name, featureKey: fea?.features?.key });
          });
        }
        userList?.push({ module: userModuleList, features: userFeatureList });
      }
    }

    if (!userExist?.isAdmin) {
      function getFeatureEnable(featuresB, featureKey) {
        const featureItem = featuresB?.find((feature) => feature?.featureKey === featureKey);
        return featureItem ? true : false;
      }
      allList.forEach((moduleA) => {
        const moduleItemB = userList?.find((moduleB) => moduleB?.module?.moduleKey === moduleA?.module?.moduleKey);
        if (moduleItemB) {
          moduleA.module.enable = true;
          if (moduleA?.features) {
            moduleA?.features?.forEach((featureA) => {
              featureA.enable = getFeatureEnable(moduleItemB?.features, featureA?.featureKey);
            });
          }
        }
      });
    }

    return {
      code: 200,
      data: {
        status: 'Ok',
        data: {
          id: userExist?.id,
          userName: userExist?.userName,
          executiveId: userExist?.executiveId,
          accesstoken: accessToken,
          refreshtoken: refreshToken,
          isAdmin: userExist?.isAdmin,
          userStatus: userExist?.userStatus,
          isInviteValid: !!isInviteValid,
          expiresIn: 3600000,
          moudleFeatureAccess: allList,
        },
        message: rescodes?.loginSuc,
      },
    };
  } catch (error) {
    console.error(error);
    return { code: 500, data: { status: 'Error', message: rescodes?.serverError } };
  }
};



loginService.forgotpasswordlink = async ({ username, email, models }) => {
  if (!username || !email || !username.trim() || !email.trim()) {
    return { code: 400, data: { status: 'Error', message: rescodes?.reqFields } };
  }

  // Check if the user exists
  const userExist = await models?.users?.findOne({
    where: {
      userName: username,
      email,
      isTrash: false,
    },
  });

  if (!userExist) {
    return { code: 404, data: { status: 'Error', message: rescodes?.recordNM } };
  }

  if (userExist.userStatus.toLowerCase().trim() === 'inactive') {
    return { code: 400, data: { status: 'Error', message: rescodes?.Inactive } };
  }
  
  if (userExist.userStatus.toLowerCase().trim() === 'invited') {
    return { code: 400, data: { status: 'Error', message: rescodes?.invited } };
  }

  const uuid = uuidv4();
  const passTrigger = await models?.passwordChangeRequests?.create({
    userId: userExist.id,
    code: uuid,
    tiggertime: new Date(),
  });

  if (!passTrigger || !passTrigger.code) {
    return { code: 500, data: { status: 'Error', message: 'Failed to create password change request' } };
  }

  // Send forgot password mail
  const payload = {
    params: {
      forgotpasswordlink: config?.app?.hostname?.replace(
        'api',
        `resetpassword?id=${passTrigger.code}`
      ),
      expiretime: '24 hours',
      subject: 'Forgot Password',
    },
    to: [{ email, name: username }],
    templateId: 60,
  };

  const sentEmail = await loginService?.sendTransactionMail(payload);
  
  if (sentEmail === 'success') {
    return { code: 200, data: { status: 'Ok', message: rescodes?.mailSentF } };
  } else {
    return { code: 500, data: { status: 'Error', message: 'Failed to send email' } };
  }
};

loginService.sendTransactionMail = async (postdata) => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = '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';

  const { params, to, templateId, attachment } = postdata;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = params.subject;
  sendSmtpEmail.to = to;
  sendSmtpEmail.params = params;
  sendSmtpEmail.templateId = templateId;

  // Adding attachment
  if (attachment) {
    const base64Content = attachment.content.toString('base64');
    const attachmentObject = new SibApiV3Sdk.SendSmtpEmailAttachment();
    attachmentObject.name = attachment.filename;
    attachmentObject.content = base64Content;
    attachmentObject.type = attachment.contentType;
    sendSmtpEmail.attachment = [attachmentObject];
  }

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return data.messageId ? 'success' : 'Failed';
  } catch (error) {
    console.error('Error sending email:', error);
    return 'Failed';
  }
};


module.exports = loginService;
