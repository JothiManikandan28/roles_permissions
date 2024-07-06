
const featureService  = require("./Services/features.service")
const loginService = require('./Services/login.service' );
const roleService = require('./Services/roles.service' );
const userService = require('./Services/user.service');
const { createrole, getrole, updaterole , deleterole } = require('./validation/roles.validation');
const{ login, forgotpassword } = require('./validation/login.validation');
const { createmodule, modulefeaturemapping, getmodulerole } = require('./validation/modules.validation');
const {create,
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
  changePassword  } = require('./validation/user.validation')
const moduleService = require('../src/Services/modules.service')
const { createFeature, moduleFeature } = require('../src/validation/features.validation')

 
// const { request } = require('./src/app');
module.exports = {

  // login validation checking

  loginValidation:login,
  forgotValidation: forgotpassword,



  // role validation check
  addroleValidation: createrole,
  getroleValidation: getrole,
  updateroleValidation: updaterole,
  deleteroleValidation: deleterole,

  //module validation 

  addmoduleValidation: createmodule,
  mappingValidation: modulefeaturemapping,
  getModuleValidation: getmodulerole,


    //user Validation 

    userCreateValidation: create,
    userUpdateValidation: update,
    getUsernameValidation: getusername,
    emailExitValidation: emailexist,
    userEditValidation: edit,
    userDeleteValidation: deleteUser,
    userPassValidation : updatenameandpass,
    updateStatusValidation: updatestatus,
    userResendLinkValidation: resendlink,
    getUserdataValidation: getuserdetails,
    changeAdminValidation: changeadmin,
    userNameExitValidation: usernameexist,
    adminMailExitValidation: adminemailexist,
    changeUserNameValidation: changeUsername,
    changePasswordValidation: changePassword,


    //features Validation

    featureCreateValidation: createFeature,
    listmodulefeatureValidation: moduleFeature,
  

 login:async ( request ) => {
  try {
    const { code, data } = await loginService.validatelogin({
      username: request.username,
      password: request.password,
      models: request.db
    });
    const result  = {
      code,
      data,
    };
    return result
  } catch (err) {
    // logger.info(err);
    const error = {
      code: 500,
      data: { status: 'Error', message: err?.message },
    };
    return error
  }
},

forgotpassword:async( request ) => {
    try{
        const { code, data } = await loginService.forgotpasswordlink({
            username: request.username,
            email: request.email,
            models: request.db

        });
        const result = {
            code,
            data,
        };
        return result
    } catch(err) {
        const error = {
            code: 500,
            data: { status: 'Error', message: err?.message },
        };
        return error
    }
},


listingRole: async (request) => {
  try {
    const { code, data } = await roleService.listing({ models: request.db });
    const result = {
      code,
      data,
    };
    return result;
  } catch (err) {
    const error = {
      code: 500,
      data: { status: 'Error', message: err?.message || 'An error occurred' },
    };
    return error;
  }
},

//role API

addRole: async ( request ) => {
  try{
    const { code, data } = await roleService.add({
      isAdmin: request?.isAdmin,
      userID: request?.userID,
      userName: request?.userName,
      roleName: request?.roleName,
      module: request?.moduleKey,
      features: request?.featuresKey,
      userIds: request?.userIds,
      models: request.db
    });
    const result ={
      code,
      data,
    };
    return result
  } catch(err){
    const error = {
      code:500,
      data: { status: 'error', message: err?.message }
    };
    return error
  }
},


getRole: async (request ) => {
  try{
    const{ code, data } = await roleService.get({
      module: request?.moduleKey,
      roleName: request?.roleNameKey,
      userID: request?.userID,
      models: request.db
    });
    const result = { 
      code,
      data,
    };
    return result
  } catch(err){
    const error = {
      code:500,
      data: { status: 'error', message: err?.message }
    };
    return error
  }
},

deleteRole: async( request ) => {
  try{
    const{ code, data } = await roleService.delete({
      moduleRole: request?.moduleRole,
      userID: request?.userID,
      isAdmin: request?.isAdmin,
      models: request.db
    });
    const result = {
      code, 
      data,
    };
    return result
  } catch(err){
    const error = {
      code:500,
      data: { status: 'error', message: err?.message }
    };
    return error
  }
},


updateRole: async( request ) => {
  try{
    const{ code, data } = await roleService.update({
        newRoleName: request?.newRoleName,
        roleName: request?.roleName,
        module: request?.module,
        features: request?.features,
        userIds: request?.userIds,
        userID: request?.userID,
        isAdmin: request?.isAdmin,
        models: request.db
    });
    const result = {
      code,
      data,
    };
    return result
  }catch(err){
    const error = {
      code:500,
      data: { status: 'error', message: err?.message }
    };
    return error
  }
},

//module API

addModule: async( request) => {
  try{
    const { code, data } = await moduleService.create({
      userID: request?.userID,
      modules: request.modules,
      models: request?.db
    });
    const result = {
      code,
      data
    };
    return result
  } catch(err){
    const error = {
      code:500,
      data: { status: 'error', message: err?.message }
    };
    return error
  }

},


getModule: async( request ) => {
  try{
    const { code, data } = await moduleService.listing({
      models: request?.db
    });
    const result = {
      code,
      data
    };
    return result
  } catch(err){
    const error = {
      code:500,
      data: { status: 'error', message: err?.message }
    };
    return error
  }
},

featureMapping: async(request) => {
  try{ 
    const { code, data } = await moduleService.moduleBasedFeature({
      module: request?.module,
      features: request?.features,
      models: request?.db
    });
    const result = {
      code,
      data
    };
    return result
  } catch(err){
    const error = {
      code:500,
      data: { status: 'error', message: err?.message }
    };
    return error
  }
},

moduleRoleGet:async( request ) => {
  try{
    const { code, data } = await moduleService.moduleRole({
      userName: request?.userName,
      models: request?.db
    });
    const result = {
      code,
      data
    };
    return result
  } catch(err){
    const error = {
      code:500,
      data: { status: 'error', message: err?.message }
    };
    return error
  }
},


//user API 

createUser: async (request) => {
  try {
    const { code, data } = await userService.create({
      firstName: request?.firstName,
      lastName: request?.lastName,
      mobile: request?.mobile,
      email: request?.email,
      modules: request?.modules,
      userID: request?.userID,
      isAdmin: request?.isAdmin,
      adminName: request?.adminName,
      models: request?.db,
    });
    const result = {
      code,
      data,
    };
    return result;
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

editUser: async (request) => {
  try {
    const { code, data } = await userService.edit({

      userid: request?.userid,
      firstName: request?.firstName,
      lastName: request?.lastName,
      mobile: request?.mobile,
      email: request?.email,
      module: request?.module,
      userID: request?.userID,
      isAdmin: request?.isAdmin,
      models: request.db
    });
    const result = {
      code,
      data,
    };
    return result;
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

getAllUser: async (request) => {
  try {
    const { code, data } = await userService.getUser({
      userID: request?.userID,
      models: request.db
    });
    const result = {
      code,
      data,
    };
    return result
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

listingUser: async (request) => {
  try {
    const { code, data } = await userService.listing({
      models: request.db
    })
    const result = {
      code,
      data,
    };
    return result
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

UserPasswordChange: async (request) => {
  try {
    const { code, data } = await userService.passwordUpdate({
      userID: request?.userID,
      oldPassword: request?.oldPassword,
      newPassword: request?.newPassword,
      models: request.db
    })
    const result = {
      code,
      data,
    };
    return result
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }

},

userNameChange: async (reuest) => {
  try {
    const { code, data } = await userService.updateUsername({
      userID: reuest?.userID,
      userName: reuest?.userName,
      models: reuest?.db
    });
    const result = {
      code,
      data,
    };
    return result
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

getUserName: async (request) => {
  try {
    const { code, data } = await userService.uniqueUsername({
      firstname: request?.firstname,
      lastname: request?.lastname,
      sequelize: request?.db
    });
    const result = {
      code,
      data
    }
    return result
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

userNameExist: async (request) => {
  try {
    const { code, data } = await userService.checkUserNameExist({
      userName: request?.userName,
      models: request?.db
    });
    const result = {
      code,
      data
    }
    return result
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},


emailExistUser: async (request) => {
  try {
    const { code, data } = await userService.checkEmailExist({
      userEmail: request?.userEmail,
      models: request?.db
    });
    const result = {
      code,
      data
    };
    return result
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},


getUserDetails: async (request) => {
  try {
    const { code, data } = await userService.getDetails({
      userName: request?.userName,
      authUserName: request?.userName,
      models: request?.db
    });
    const result = {
      code, data
    };
    return result
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},


resendlink: async (request) => {
  try {
    const { code, data } = await userService.inviteResendLink({
      userName: request?.userName,
      userID: request?.id,
      models: request?.db
    });
    const result = {
      code, data
    };
    return result;
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},


updateStatus: async (request) => {
  try {
    const { code, data } = await userService.userStatusUpdate({
      userName: request?.userName,
      status: request?.status,
      userID: request?.userID,
      models: request?.db,
    });
    const result = {
      code, data
    };
    return result;
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

updateUserAndPass: async (request) => {
  try {
    const { code, data } = await userService.updateUsernameAndPassword({
      userId: request?.userId,
      password: request?.password,
      userName: request?.userName,
      userID: request?.userID,
      models: request?.db,
    });
    const result = {
      code, data
    };
    return result;
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

updateuser: async (request) => {
  try {
    const { code, data } = await userService.updateUserDetails({
      userName: request?.userName,
      firstName: request?.firstName,
      fatherName: request?.fatherName,
      lastName: request?.lastName,
      dob: request?.dob,
      gender: request?.gender,
      street1: request?.street1,
      street2: request?.street2,
      pincode: request?.pincode,
      country: request?.country,
      state: request?.state,
      city: request?.city,
      email: request?.email,
      mobile: request?.mobile,
      imageURL: request?.imageURL,
      userID: request?.userID,
      models: request?.db,
    });
    const result = {
      code, data
    };
    return result;
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

changeAdmin: async (request) => {
  try {
    const { code, data } = await userService.changeNewAdmin({
      currentAdmin: request?.currentAdmin,
      newAdmin: request?.newAdmin,
      adminPassword: request?.adminPassword,
      userName: request?.userName,
      userID: request?.userID,
      isAdmin: request?.isAdmin,
      userPassword: request?.userPassword,
      models: request?.db,
    });
    const result = {
      code, data
    };
    return result;
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

deleteUser: async( request ) => {
  try {
    const { code, data } = await userService.delete({
      userName: request?.userName,
      userID: request?.userID,
      isAdmin: request?.isAdmin,
      models: request?.db,
    });
    const result = {
      code, data
    };
    return result;
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

uploadImage: async( request ) => {
  try {
    const { code, data } = await userService.imageUpload({
      fileName: request?.fileName,
    });
    const result = {
      code, data
    };
    return result;
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

reUploadImage: async( request ) => {
  try {
    const { code, data } = await userService.imageReUpload({
      userName: request?.userName,
      blogId: request?.blogId,
      fileName: request?.key,
      models: request?.db      
    });
    const result = {
      code, data
    };
    return result;
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

updateEmailExist: async( request ) => {
  try {
    const { code, data } = await userService.updateEmailExist({
      userEmail: request?.userEmail, 
      userID: request?.userID,
      models: request?.db      
    });
    const result = {
      code, data
    };
    return result;
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

// Feature APIs

createFeature: async( request ) => {
  try{
    const { code, data } = await featureService.create({
      userID: request?.userID,
      features: request?.features,
      models: request?.db
    });
    const result = {
      code, data
    };
    return result;
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

getFeature: async( request ) => {
  try{
    const { code, data } = await featureService.listingFeatures({
      models: request?.db
    });
    const result = {
      code, data
    };
    return result;
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
},

moduleFeature: async( request ) => {
  try{
    const { code, data } = await featureService.moduleFeatureListing({
      isAdmin: request?.isAdmin,
      module: request?.module,
      models: request?.db
    });
    const result = {
      code, data
    };
    return result;
  } catch (err) {
    const error = {
      code: 500,
      data: { status: "error", message: err?.message },
    };
  }
}


};