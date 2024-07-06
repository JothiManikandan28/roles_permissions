# Introdunction

This fully javaScript code used this package is using roles & Permission.

# Installation

`npm install roles_permissions`

# Usage

please flow steps

1. 9 tables depence on the table so am attached migration file and models file and seeder files.

2. this package use place require package

   `const { sample } = require('roles_permissions')`

3. your project add this routers file attached one by one 

```js

// Index Router File
const express = require('express');

const router = express.Router();

const response = require('../utility/response');


router.use('/login', require('./login.routes'), response?.default);
router.use('/user', require('./user.routes'), response.default);
router.use('/roles',require('./roles.routes'), response?.default);
router.use('/modules', require('./modules.routes'), response.default);
router.use('/features', require('./features.routes'), response.default);


module.exports = router;

// Login Router File

const express = require('express');
const validate = require('../middleware/validate');
const routes = express.Router();
const db = require('../../models');
const { login , forgotpassword ,loginValidation, forgotValidation} = require('roles_permissions');


routes.post('/login', validate(loginValidation),  async (req, res) => {
    const request = {
        username: req.body.username,
        password: req.body.password,
        db
    }

    const result = await login(request);
    res.send(result)
})


routes.post('/forgotpassword',  validate(forgotValidation),  async(req,res) => {
    const request = {
        username: req.body.username,
        email: req.body.email,
        db
    }
    const result = await forgotpassword(request);
    res.send(result)
});


module.exports = routes;


// Modules Router File


const express = require('express');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminauth');
const validate = require('../middleware/validate');
const router = express.Router();

const db = require('../../models/index')

const { addmoduleValidation, mappingValidation, getModuleValidation, addModule, getModule , featureMapping, moduleRoleGet} = require('roles_permissions')


router.post('/create', auth, adminAuth, validate(addmoduleValidation), async (req, res) => {
  const request = {
    userID: req?.user?.id,
    modules: req.body?.data,
    db
  };
  try {
      const result = await addModule(request);
      res.send(result);
  } catch (error) {
      res.status(500).send({ 
          data: {}, 
          message: {
              codes: 'error',
              value: 'Error adding module',
              html: 'Error adding module'
          }
      });
  }
});


router.get('/getall', auth, async(req, res) =>{
  const request = {
    db
  };
  try{
    const result = await getModule(request);
    res.send(result);
  } catch (error){
    res.status(500).send({ 
      data: {}, 
      message: {
          codes: 'error',
          value: 'Error get module',
          html: 'Error get module'
      }
  });
  }
});


router.post('/modulefeaturemapping', auth, adminAuth,validate(mappingValidation),  async(req, res) => {
  const request = {
    module: req?.body?.moduleKey,
    features: req?.body?.featuresKey,
    db
  };
  try{
    const result = await featureMapping( request );
    res.send( result);
  } catch (error){
    res.status(500).send({ 
      data: {}, 
      message: {
          codes: 'error',
          value: 'Error  modulefeaturemapping',
          html: 'Error modulefeaturemapping'
      }
  });
  }
}),

router.post('/getmodulerole', auth, validate(getModuleValidation), async (req, res) => {
  const request ={
    userName: req?.body?.userName,
    db
  };
  try{
    const result = await moduleRoleGet( request );
    res.send( result );
  } catch (error){
    res.status(500).send({ 
      data: {}, 
      message: {
          codes: 'error',
          value: 'Error get getmodulerole',
          html: 'Error get getmodulerole'
      }
  });
  }
});


module.exports = router;


// Roles Router File


const express = require('express');
const auth = require('../../src/middleware/auth');
const validate = require('../middleware/validate')
const router = express.Router();
const db = require('../../models/index');

const { listingRole, addRole, getRole, deleteRole, updateRole , addroleValidation, getroleValidation,  updateroleValidation, deleteroleValidation } = require('roles_permissions')

router.get('/getall', async (req, res) => {
    const request = {
        db
    };
    try {
        const result = await listingRole(request);
        res.send(result);
    } catch (error) {
        console.error("Error handling getall request:", error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.post('/create', auth, validate(addroleValidation), async (req, res) => {
    const request = {
        isAdmin: req?.user?.isAdmin,
        roleName: req?.body?.roleName,
        moduleKey: req?.body?.moduleKey,
        featuresKey: req?.body?.featuresKey,
        userName: req?.user?.userName,
        userIds: req.body.userName,
        userID: req?.user?.id,
        db
    };
    try {
        const result = await addRole(request);
        res.send(result);
    } catch (error) {
        res.status(500).send({ 
            data: {}, 
            message: {
                codes: 'error',
                value: 'Error adding role',
                html: 'Error adding role'
            }
        });
    }
});


router.post('/get', auth, validate(getroleValidation), async(req, res) => {
    const request = {
        moduleKey: req?.body?.moduleKey,
        roleNameKey: req?.body?.roleNameKey,
        userID: req?.user?.id,
        db
    };
    try{
        const result = await getRole(request);
        res.send(result);
    } catch( error ){
        res.status(500).send({
            data: {},
            message:{
                codes: 'error',
                value: 'Error geting role',
                html: 'Error geting role'
            }
        });
    }
});


router.delete('/delete', auth, validate(deleteroleValidation), async(req, res) => {
    const request = {
        moduleRole: req?.body?.data,
        userID: req?.user?.id,
        isAdmin: req?.user?.isAdmin,
        db
      };
    try{
        const result = await deleteRole(request);
        res.send(result);
    } catch( error ){
        res.status(500).send({
            data: {},
            message:{
                codes: 'error',
                value: 'Error delete role',
                html: 'Error delete role'
            }
        });
    }
});


router.put('/update',  auth, validate(updateroleValidation), async( req, res ) => {
    const request = {
        newRoleName: req?.body?.newRoleName,
        roleName: req?.body?.roleNameKey,
        module: req?.body?.moduleKey,
        features: req?.body?.featuresKey,
        userIds: req?.body?.userName,
        userID: req?.user?.id,
        isAdmin: req?.user?.isAdmin,
        db
    };
    try{
        const result = await updateRole(request);
        res.send(result);
    } catch( error ){
        res.status(500).send({
            data: {},
            message:{
                codes: 'error',
                value: 'Error update role',
                html: 'Error update role'
            }
        });
    }
});
module.exports = router;


// features routes File


const express = require('express');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminauth');
const validate = require('../middleware/validate');
const db = require('../../models');
const router = express.Router();
const { featureCreateValidation, listmodulefeatureValidation,  createFeature, getFeature, moduleFeature  } = require('roles_permissions')


router.post('/create', auth, adminAuth, validate(featureCreateValidation), async (req, res) => {
    const request = {
        userID: req?.user?.id,
        features: req.body?.data,
        db
    };
    try {
        const result = await createFeature(request);
        res.send(result);
    } catch (error) {
        res.status(500).send({
            data: {},
            message: {
                codes: 'error',
                value: 'Error create features',
                html: 'Error create features'
            }
        });
    }
});


router.get('/get', auth, async (req, res) => {
    const request = {
        db
    };
    try {
        const result = await getFeature(request);
        res.send(result);
    } catch (error) {
        res.status(500).send({
            data: {},
            message: {
                codes: 'error',
                value: 'Error get features',
                html: 'Error get features'
            }
        });
    }
});


router.post('/listmodulefeature', auth, validate(listmodulefeatureValidation), async (req, res) => {
    const request = {
        isAdmin: req?.user?.isAdmin,
        module: req?.body?.module,
        db
    };
    try {
        const result = await moduleFeature(request);
        res.send(result);
    } catch (error) {
        res.status(500).send({
            data: {},
            message: {
                codes: 'error',
                value: 'Error listing features',
                html: 'Error listing features'
            }
        });
    }
});



module.exports = router;


// User Router file 



const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const adminAuth = require('../middleware/adminauth');
const db = require('../../models/index')
const multer = require('multer');
const multerS3 = require('multer-s3');
const shortId = require('shortid');
const S3 = require('../utility/s3Connection');
const config = require('../config/vars');
// const { createUser, editUser, getAllUser, listingUser, userNameChange, getUserName, userNameExist, emailExistUser, getUserDetails, resendlink, updateStatus, updateUserAndPass, updateuser, changeAdmin, deleteUser, uploadImage, reUploadImage , updateEmailExist} = require('../../index')

const upload = multer({
  storage: multerS3({
    s3: S3,
    bucket: config?.app?.bucketName,
    contentType: multerS3?.AUTO_CONTENT_TYPE,
    key(req, file, cb) {
      cb(null, `${shortId?.generate()}-${file?.originalname}`);
    },
  }),
});

const {
  userCreateValidation,
  userEditValidation,
  changePasswordValidation,
  changeUserNameValidation,
  getUsernameValidation,
  userNameExitValidation,
  emailExitValidation,
  getUserdataValidation,
  userResendLinkValidation,
  updateStatusValidation,
  userPassValidation,
  userUpdateValidation,
  changeAdminValidation,
  userDeleteValidation,
  createUser,
  editUser, 
  getAllUser, 
  listingUser, 
  userNameChange, 
  getUserName, 
  userNameExist, 
  emailExistUser, 
  getUserDetails, 
  resendlink, 
  updateStatus, 
  updateUserAndPass, 
  updateuser, 
  changeAdmin, 
  deleteUser, 
  uploadImage, 
  reUploadImage , 
  updateEmailExist
} = require('roles_permissions');


const { emailExist } = require('../utility/rescodes');



router.post('/create', auth, validate(userCreateValidation), async (req, res) => {
  const request = {
    firstName: req?.body?.firstName,
    lastName: req?.body?.lastName,
    mobile: req?.body?.mobile,
    email: req?.body?.email,
    modules: req?.body?.modules,
    userID: req?.user?.id,
    isAdmin: req?.user?.isAdmin,
    adminName: req?.user?.userName,
    db
  };
  try {
    const result = await createUser(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error creating user',
        html: 'Error creating user'
      }
    });
  }
});


router.put('/edit', auth, validate(userEditValidation), async (req, res) => {
  const request = {
    userid: req?.body?.userId,
    firstName: req?.body?.firstName,
    lastName: req?.body?.lastName,
    mobile: req?.body?.mobile,
    email: req?.body?.email,
    module: req?.body?.modules,
    userID: req?.user?.id,
    isAdmin: req?.user?.isAdmin,
    db
  };
  try {
    const result = await editUser(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error Edit user',
        html: 'Error Edit user'
      }
    });
  }
});

router.get('/getAll', auth, async (req, res) => {
  const request = {
    userID: req?.user?.id,
    db
  };
  try {
    const result = await getAllUser(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error getAll user',
        html: 'Error getAll user'
      }
    });
  }
});

router.get('/listing', auth, async (req, res) => {
  const request = {
    db
  };
  try {
    const result = await listingUser(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error listing user',
        html: 'Error listing user'
      }
    });
  }
});


router.post('/changepassword', auth, validate(changePasswordValidation), async (req, res) => {
  const request = {
    userID: req?.user?.id,
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
    db
  };
  try {
    const result = await UserPasswordChange(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error changePassword user',
        html: 'Error changePassword user'
      }
    });
  }
});


router.post('/changeusername', auth, validate(changeUserNameValidation), async (req, res) => {
  const request = {
    userID: req?.user?.id,
    userName: req.body.userName,
    db
  };
  try {
    const result = await userNameChange(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error changeusername user',
        html: 'Error changeusername user'
      }
    });
  }
});

//this routes not resturn responce
router.post('/getusername', auth, validate(getUsernameValidation), async (req, res) => {
  const request = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    db
  };
  try {
    const result = await getUserName(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error getusername user',
        html: 'Error getusername user'
      }
    });
  }
});


router.post('/usernameexist', auth, validate(userNameExitValidation), async (req, res) => {
  const request = {
    userName: req?.body?.userName,
    db
  };
  try {
    const result = await userNameExist(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error usernameexist user',
        html: 'Error usernameexist user'
      }
    });
  }
});



router.post('/emailexist', auth, validate(emailExitValidation), async (req, res) => {
  const request = {
    userEmail: req?.body?.email,
    db
  };
  try {
    const result = await emailExistUser(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error emailExist user',
        html: 'Error emailExist user'
      }
    });
  }
});


router.post('/getuserdetails', validate(getUserdataValidation), auth, async (req, res) => {
  const request = {
    userName: req?.body?.userName,
    authUserName: req?.user?.userName,
    db
  };
  try {
    const result = await getUserDetails(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error user details',
        html: 'Error user details'
      }
    });
  }
});


router.post('/resendlink', auth, validate(userResendLinkValidation), async (req, res) => {
  const request = {
    userName: req?.body?.userName,
    userID: req?.user?.id,
    db
  };
  try {
    const result = await resendlink(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error resendlink',
        html: 'Error resendlink'
      }
    });
  }
});



router.post('/updatestatus', auth, validate(updateStatusValidation), async (req, res) => {
  const request = {
    userName: req?.body?.userName,
    status: req?.body?.status,
    userID: req?.user?.id,
    db,
  };
  try {
    const result = await updateStatus(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error updatestatus',
        html: 'Error updatestatus'
      }
    });
  }

});


router.post('/updatenameandpass', auth, validate(userPassValidation), async (req, res) => {
  const request = {
    userId: req?.body?.userId,
    password: req?.body?.newPassword,
    userName: req?.body?.newUserName,
    userID: req?.user?.id,
    db,
  };
  try {
    const result = await updateUserAndPass(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error updatenameandpass',
        html: 'Error updatenameandpass'
      }
    });
  }
});


router.put('/update', auth, validate(userUpdateValidation), async (req, res) => {
  const request = {
    userName: req?.body?.userName,
    firstName: req?.body?.firstName,
    fatherName: req?.body?.fatherName,
    lastName: req?.body?.lastName,
    dob: req?.body?.dob,
    gender: req?.body?.gender,
    street1: req?.body?.street1,
    street2: req?.body?.street2,
    pincode: req?.body?.pincode,
    country: req?.body?.country,
    state: req?.body?.state,
    city: req?.body?.city,
    email: req?.body?.email,
    mobile: req?.body?.mobile,
    imageURL: req?.body?.imageURL,
    userID: req?.user?.id,
    db,
  };
  try {
    const result = await updateuser(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error user update',
        html: 'Error user update'
      }
    });
  }

});



router.post('/changeadmin', auth, adminAuth, validate(changeAdminValidation), async (req, res) => {
  const request = {
    currentAdmin: req?.body?.currentAdmin,
    newAdmin: req?.body?.newAdmin,
    adminPassword: req?.body?.adminPassword,
    userName: req?.user?.userName,
    userID: req?.user?.id,
    isAdmin: req?.user?.isAdmin,
    userPassword: req?.user?.password,
    db
  };
  try {
    const result = await changeAdmin(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error changeadmin',
        html: 'Error changeadmin'
      }
    });
  }
});


router.delete('/delete', auth, validate(userDeleteValidation), async (req, res) => {
  const request = {
    userName: req?.body?.userName,
    userID: req?.user?.id,
    isAdmin: req?.user?.isAdmin,
    db
  };
  try {
    const result = await deleteUser(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error delete user',
        html: 'Error delete user'
      }
    });
  }
});


router.post('/upload', auth, upload.single('image'), async (req, res) => {
  const request = {
    fileName: req?.file?.key,
  };
  try {
    const result = await uploadImage(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error upload user Image',
        html: 'Error upload user Image'
      }
    });
  }
});


router.put('/reupload', auth, upload.single('image'), async (req, res) => {
  const request = {
    userName: req?.body?.userName,
    blogId: req?.body?.blogId,
    fileName: req?.file?.key,
    db
  };
  try {
    const result = await reUploadImage(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error reUpload user Image',
        html: 'Error reUpload user Image'
      }
    });
  }
});




router.post('/updateemailexist', auth, validate(emailExitValidation), async (req, res) => {
  const request = {
    userEmail: req?.body?.email, 
    userID: req?.user?.id,
    db
};
  try {
    const result = await updateEmailExist(request);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      data: {},
      message: {
        codes: 'error',
        value: 'Error reUpload user Image',
        html: 'Error reUpload user Image'
      }
    });
  }
});

module.exports = router;

```

# Contribute


If you would like to contribute, you are welcome. clone repositrory and open pull request.


