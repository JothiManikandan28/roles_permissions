# Introdunction

This fully javaScript code used this package is using roles & Permission.

# Installation

`npm install roles_permissions`

# Usage

please flow steps

 `this package MVC Pattern based working`

1. 9 tables depence on the table so am attached migration file and models file and seeder files.
   support file git link use your project 

   https://github.com/JothiManikandan28/RP_Support_files.git

2. this package use place require package

   `const { sample } = require('roles_permissions')`

3. your project add this routers file attached one by one 

```js

// Index Router File must add your project and uses

const express = require('express');

const router = express.Router();

const response = require('../utility/response');

// login module  router
router.use('/login', require('./login.routes'), response?.default);

// user module router, already some user present table if you add use it.
router.use('/user', require('./user.routes'), response.default);

// roles module router, you add to possible add roles
router.use('/roles',require('./roles.routes'), response?.default);

// modules module router
router.use('/modules', require('./modules.routes'), response.default);

// feature module router 
router.use('/features', require('./features.routes'), response.default);

// 5 modules presend this package check support file 
// path is RP_support_files/src/router

```

# Contribute


If you would like to contribute, you are welcome. clone repositrory and open pull request.

  https://github.com/JothiManikandan28/roles_permissions.git

