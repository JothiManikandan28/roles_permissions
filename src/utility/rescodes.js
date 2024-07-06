const rescodes = {
  wentWrong: {
    codes: 'wentWrong',
    value: 'Something Went Wrong',
    html: 'Something Went Wrong',
  },
  success: {
    codes: 'success',
    value: 'Success!',
    html: 'Success!',
  },
  error: {
    codes: 'error',
    value: 'Error!',
    html: 'Error!',
  },
  notFound: {
    codes: 'notFound',
    value: 'Page not Found',
    html: 'Page not Found',
  },
  reqFields: {
    codes: 'reqFields',
    value: 'Required fields not present',
    html: 'Required fields not present',
  },
  checkCred: {
    codes: 'checkCred',
    value: 'Incorrect Credentials.',
    html: 'Incorrect Credentials.',
  },
  passNM: {
    codes: 'passNM',
    value: 'Password Not Match',
    html: 'Password Not Match',
  },
  planC: {
    codes: 'planC',
    value: 'Plan Created Successfully',
    html: 'Plan Created Successfully',
  },
  recordNM: {
    codes: 'recordNM',
    value: 'Records do not match. Please try again.',
    html: 'Records do not match.\nPlease try again.',
  },
  userC: {
    codes: 'userC',
    value: 'User added successfully',
    html: 'User added successfully',
  },
  userNC: {
    codes: 'userNC',
    value: 'User Not Created',
    html: 'User Not Created',
  },
  planNC: {
    codes: 'planNC',
    value: 'Plan Not Created',
    html: 'Plan Not Created',
  },
  Inactive: {
    codes: 'Inactive',
    value: 'Cant Send Email. Your Account is Inactive. Kindly contact the Administrator.',
    html: 'Cant Send Email\nYour Account is Inactive. Kindly contact the Administrator.',
  },
  invited: {
    codes: 'invited',
    value: 'Cant Send Email. Your Account is Invited. Kindly contact the Administrator.',
    html: 'Cant Send Email\nYour Account is Invited. Kindly contact the Administrator.',
  },
  mailSentF: {
    codes: 'mailSentF',
    value: 'Email sent successfully. Please check your Inbox for instructions.',
    html: 'Email sent successfully\nEmail sent successfully. Please check your Inbox for instructions.',
  },
  passRS: {
    codes: 'passRS',
    value: 'Password Reset Successfully',
    html: 'Password Reset Successfully',
  },
  pageInval: {
    codes: 'pageInval',
    value: 'PageId is Invalid',
    html: 'PageId is Invalid',
  },
  logout: {
    codes: 'logout',
    value: 'Logout Successfully.',
    html: 'Logout Successfully.',
  },
  tokenAldel: {
    codes: 'tokenAldel',
    value: 'Token already deleted.',
    html: 'Token already deleted.',
  },
  loginSuc: {
    codes: 'loginSuc',
    value: 'Login Successfully.',
    html: 'Login Successfully.',
  },
  firmExist: {
    codes: 'firmExist',
    value: 'Firm Already Exist',
    html: 'Firm Already Exist',
  },
  firmIdExist: {
    codes: 'firmIdExist',
    value: 'Firm Id Already Exist',
    html: 'Firm Id Already Exist',
  },
  noPlan: {
    codes: 'noPlan',
    value: 'No Plan Available',
    html: 'No Plan Available',
  },
  noCategory: {
    codes: 'noCategory',
    value: 'No Category Available',
    html: 'No Category Available',
  },
  unauthUser: {
    codes: 'unauthUser',
    value: 'Unauthorized User',
    html: 'Unauthorized User',
  },
  noUser: {
    codes: 'noUser',
    value: 'Active/no Exist User',
    html: 'Active/no Exist User',
  },
  profUpdateS: {
    codes: 'profUpdateS',
    value: 'User Profile Updated Successfully',
    html: 'User Profile Updated Successfully',
  },
  planExist: {
    codes: 'planExist',
    value: 'Plan name already exists',
    html: 'Plan name already exists',
  },
  planComExist: {
    codes: 'planComExist',
    value: 'The selected combination already has an existing plan. Please choose a different combination',
    html: 'The selected combination already\nhas an existing plan\nPlease choose a different combination',
  },
  inCorrectPass: {
    codes: 'inCorrectPass',
    value: 'Login Password entered is incorrect',
    html: 'Login Password entered is\nincorrect',
  },
  noCards: {
    codes: 'noCards',
    value: 'No Cards available for particular user',
    html: 'No Cards available for particular user',
  },
  noSupType: {
    codes: 'noSupType',
    value: 'No Support Type available',
    html: 'No Support Type available',
  },
  someSupType: {
    codes: 'someSupType',
    value: 'Some Support Types not available',
    html: 'Some Support Types not available',
  },
  noPlanType: {
    codes: 'noPlanType',
    value: 'No Plan Type available',
    html: 'No Plan Type available',
  },
  noOrg: {
    codes: 'noOrg',
    value: 'No Organization exist/active',
    html: 'No Organization exist/active',
  },
  noPlanOrg: {
    codes: 'noPlanOrg',
    value: 'No Active Plan for given organization',
    html: 'No Active Plan for given organization',
  },
  inActPlan: {
    codes: 'inActPlan',
    value: 'No Active Plan/Plan Exist',
    html: 'No Active Plan/Plan Exist',
  },
  checkDates: {
    codes: 'checkDates',
    value: 'Plan Start Date & End Date are not matching mentioned Plans',
    html: 'Plan Start Date & End Date are not matching mentioned Plans',
  },
  orgPlanExist: {
    codes: 'orgPlanExist',
    value: 'Plan Already Exist for Organization',
    html: 'Plan Already Exist for Organization',
  },
  orgPlanNA: {
    codes: 'orgPlanNA',
    value: 'No Active/Expired Plan found for given Organisation',
    html: 'No Active/Expired Plan found for given Organisation',
  },
  noBlockOrg: {
    codes: 'noBlockOrg',
    value: 'No Blocked Plan found for given Organisation',
    html: 'No Blocked Plan found for given Organisation',
  },
  cronSus: {
    codes: 'cronSus',
    value: 'Cron set Successfully at 12.05 AM IST Everyday',
    html: 'Cron set Successfully at 12.05 AM IST Everyday',
  },
  noPlanCafirm: {
    codes: 'noPlanCafirm',
    value: 'No Plan found for given organization',
    html: 'No Plan found for given organization',
  },
  inActUpgPlan: {
    codes: 'inActUpgPlan',
    value: 'No Active Plan/Plan Exist for Upgrade',
    html: 'No Active Plan/Plan Exist for Upgrade',
  },
  samePlan: {
    codes: 'samePlan',
    value: 'Current Plan & Upgrade Plan are Same',
    html: 'Current Plan & Upgrade Plan are Same',
  },
  payModeNF: {
    codes: 'payModeNF',
    value: 'Payment mode not found',
    html: 'Payment mode not found',
  },
  noPlanAvl: {
    codes: 'noPlanAvl',
    value: 'No Plan Exist for given organization',
    html: 'No Plan Exist for given organization',
  },
  noPlanEx: {
    codes: 'noPlanEx',
    value: 'Blocked/No Plan Exist for given organization. Also,Please check firm end-date.',
    html: 'Blocked/No Plan Exist for given organization. Also,Please check firm end-date.',
  },
  sameDate: {
    codes: 'sameDate',
    value: 'Current End-Date & New End-Date are Same',
    html: 'Current End-Date & New End-Date are Same',
  },
  moduleNExist: {
    codes: 'moduleNExist',
    value: 'No Such Module Exist',
    html: 'No Such Module Exist',
  },
  roleNExist: {
    codes: 'roleNExist',
    value: 'No Such Role Exist',
    html: 'No Such Role Exist',
  },
  groupNExist: {
    codes: 'groupNExist',
    value: 'No Such Group Exist',
    html: 'No Such Group Exist',
  },
  featureCombExist: {
    codes: 'featureCombExist',
    value: 'Same features already exist in diffent roles',
    html: 'Same features already exist in different roles',
  },
  featureExist: {
    codes: 'featureExist',
    value: 'Features Already Exist',
    html: 'Features Already Exist',
  },
  categoryExist: {
    codes: 'categoryExist',
    value: 'Category Already Exist',
    html: 'Category Already Exist',
  },
  ratingExist: {
    codes: 'ratingExist',
    value: 'Rating Already Exist',
    html: 'Rating Already Exist',
  },
  accessExist: {
    codes: 'AccessExist',
    value: 'Author Access Already Exist',
    html: 'Author Access Already Exist',
  },
  featuresAdd: {
    codes: 'featuresAdd',
    value: 'Features Added Successfully',
    html: 'Features Added Successfully',
  },
  categoryAdd: {
    codes: 'categoryAdd',
    value: `Category Added Successfully`,
    html: `Category Added Successfully`,
  },
  ratingAdd: {
    codes: 'ratingAdd',
    value: `Rating Added Successfully`,
    html: `Rating Added Successfully`,
  },
  accessAdd: {
    codes: 'accessAdd',
    value: `Author Access Added Successfully`,
    html: `Author Access Added Successfully`,
  },
  moduleExist: {
    codes: 'moduleExist',
    value: 'Modules Already Exist',
    html: 'Modules Already Exist',
  },
  groupExist: {
    codes: 'groupExist',
    value: 'Group Already Exist',
    html: 'Group Already Exist',
  },
  modulesAdd: {
    codes: 'modulesAdd',
    value: 'Modules Added Successfully',
    html: 'Modules Added Successfully',
  },
  groupAdd: {
    codes: 'groupAdd',
    value: 'Group Added Successfully',
    html: 'Group Added Successfully',
  },
  featureNExist: {
    codes: 'featureNExist',
    value: 'Some Features not found',
    html: 'Some Features not found',
  },
  featureMapMod: {
    codes: 'featureMapMod',
    value: 'Features Successfully Mapped',
    html: 'Features Successfully Mapped',
  },
  featureNMapMod: {
    codes: 'featureNMapMod',
    value: 'Features Not Mapped',
    html: 'Features Not Mapped',
  },
  noModules: {
    codes: 'noModules',
    value: 'No Modules Found',
    html: 'No Modules Found',
  },
  noFeatures: {
    codes: 'noFeatures',
    value: 'No Active/Exist Features Found',
    html: 'No Active/Exist Features Found',
  },
  noGroup: {
    codes: 'noGroup',
    value: 'No Group Found',
    html: 'No Group Found',
  },
  featureNUMod: {
    codes: 'featureNUMod',
    value: 'Features Coming Soon',
    html: 'Features Coming Soon',
  },
  accessDenied: {
    codes: 'accessDenied',
    value: 'Permission Denied to Access',
    html: 'Permission Denied to Access',
  },
  noActiveUser: {
    codes: 'noActiveUser',
    value: 'No Active users found',
    html: 'No Active users found',
  },
  emailNExist: {
    codes: 'emailNExist',
    value: 'No Such Email Exist',
    html: 'No Such Email Exist',
  },
  emailExist: {
    codes: 'emailExist',
    value: 'Email Already Exist',
    html: 'Email Already Exist',
  },
  updateUsr: {
    codes: 'updateUsr',
    value: 'User Updated Successfully',
    html: 'User Updated Successfully',
  },
  deleteUsr: {
    codes: 'deleteUsr',
    value: 'User deleted successfully',
    html: 'User deleted successfully',
  },
  unAuth: {
    codes: 'unAuth',
    value: 'Unauthorized User',
    html: 'Unauthorized User',
  },
  inValid: {
    codes: 'inValid',
    value: 'Invite is InValid, Please contact your Admin',
    html: 'Invite is InValid, Please contact your Admin',
  },
  updateUsrStatus: {
    codes: 'updateUsrStatus',
    value: 'Userstatus Updated Successfully',
    html: 'Userstatus Updated Successfully',
  },
  resendMail: {
    codes: 'resendMail',
    value: 'Resend Mail Sent Successfully',
    html: 'Resend Mail Sent Successfully',
  },
  inActiveUsr: {
    codes: 'inActiveUsr',
    value: 'Your account is currently inactive.Please contact administrator.',
    html: 'Your account is currently inactive.Please contact administrator.',
  },
  adminChange: {
    codes: 'adminChange',
    value: 'Admin Changed Successfully',
    html: 'Admin Changed Successfully',
  },
  inCorrectAdmPass: {
    codes: 'inCorrectAdmPass',
    value: 'Incorrect Admin Password.',
    html: 'Incorrect Admin Password.',
  },
  userNameExist: {
    codes: 'userNameExist',
    value: 'Username Already Exist.',
    html: 'Username Already Exist.',
  },
  titleExist: {
    codes: 'titleExist',
    value: 'Title Already Exist.',
    html: 'Title Already Exist.',
  },
  categoryNExist: {
    codes: 'categoryNExist',
    value: 'No Such Category Exist.',
    html: 'No Such Category Exist.',
  },
  blogNExist: {
    codes: 'blogNExist',
    value: 'No Such Blog Exist.',
    html: 'No Such Blog Exist.',
  },
  noBlog: {
    codes: 'noBlog',
    value: 'No Blog Found',
    html: 'No Blog Found',
  },
  blogNDelAcc: {
    codes: 'blogNDelAcc',
    value: 'Access Denied to Delete Blog',
    html: 'Access Denied to Delete Blog',
  },
  blogNEditAcc: {
    codes: 'blogNEditAcc',
    value: 'Access Denied to Edit Blog',
    html: 'Access Denied to Edit Blog',
  },
  blogCreate: {
    codes: 'blogCreate',
    value: 'Blog Created Successfully.',
    html: 'Blog Created Successfully.',
  },
  propDate: {
    codes: 'propDate',
    value: 'New End Date is less than current End Date or current Date',
    html: 'New End Date is less than current End Date or current Date',
  },
  noModWeb: {
    codes: 'noModWeb',
    value: 'No Modules found for Web Content',
    html: 'No Modules found for Web Content',
  },
  roleAuthorNExist: {
    codes: 'roleAuthorNExist',
    value: 'No Author Role Exist',
    html: 'No Author Role Exist',
  },
  imageUpload: {
    codes: 'imageUpload',
    value: 'Image Uploaded Successfully',
    html: 'Image Uploaded Successfully',
  },
  authorUpdate: {
    codes: 'authorUpdate',
    value: 'Author Updated Successfully',
    html: 'Author Updated Successfully',
  },
  noPublishBlog: {
    codes: 'noPublishBlog',
    value: 'Blog Not Exist / Published',
    html: 'Blog Not Exist / Published',
  },
  ratingMappedSuc: {
    codes: 'ratingMappedSuc',
    value: 'Ratings Updated Successfully',
    html: 'Ratings Updated Successfully',
  },
  noType: {
    codes: 'noType',
    value: 'No Such Menu Type Exist',
    html: 'No Such Menu Type Exist',
  },
  categoryDelete: {
    codes: 'categoryDelete',
    value: 'Category Deleted Successfully.',
    html: 'Category Deleted Successfully.',
  },
  seniorityExist: {
    codes: 'seniorityExist',
    value: 'Seniority Already Exist',
    html: 'Seniority Already Exist',
  },
  employmentExist: {
    codes: 'employmentExist',
    value: 'Employment Already Exist',
    html: 'Employment Already Exist',
  },
  seniorityAdd: {
    codes: 'seniorityAdd',
    value: `Seniority Added Successfully`,
    html: `Seniority Added Successfully`,
  },
  employmentAdd: {
    codes: 'employmentAdd',
    value: `Employment Added Successfully`,
    html: `Employment Added Successfully`,
  },
  jobsCreated: {
    codes: 'JobsCreated',
    value: 'Jobs added successfully',
    html: 'Jobs added successfully',
  },
  jobNExist: {
    codes: 'jobNExist',
    value: 'No Such Job Exist.',
    html: 'No Such Job Exist.',
  },
  noDepartment: {
    codes: 'noDepartment',
    value: 'No Such Department Exist',
    html: 'No Such Department Exist',
  },
  noSeniority: {
    codes: 'noSeniority',
    value: 'No Such Seniority Exist',
    html: 'No Such Seniority Exist',
  },
  noEmployment: {
    codes: 'noEmployment',
    value: 'No Such employment Exist',
    html: 'No Such employment Exist',
  },
  jobExist: {
    codes: 'jobExist',
    value: 'Same Job Already Exist',
    html: 'Same Job Already Exist',
  },
  jobsPosted: {
    codes: 'jobsPosted',
    value: 'Job posted successfully',
    html: 'Job posted Successfully',
  },
  jobsClosed: {
    codes: 'jobsClosed',
    value: 'Job closed successfully',
    html: 'Job closed successfully',
  },
  jobMovedDraft: {
    codes: 'jobMovedDraft',
    value: 'Job Moved to Draft.',
    html: 'Job Moved to Draft.',
  },
  jobsDeleted: {
    codes: 'jobsDeleted',
    value: 'Deleted Successfully',
    html: 'Deleted Successfully',
  },
  duplicateCreated: {
    codes: 'duplicateCreated',
    value: 'Duplicated Successfully',
    html: 'Duplicated Successfully',
  },
  jobsUpdated: {
    codes: 'jobsUpdated',
    value: 'Job Updated successfully',
    html: 'Job Updated successfully',
  },
  addApplication: {
    codes: 'addApplication',
    value: 'Job Applied successfully',
    html: 'Job Applied successfully',
  },
  sourceExist: {
    codes: 'sourceExist',
    value: 'Source Already Exist',
    html: 'Source Already Exist',
  },
  sourceAdd: {
    codes: 'sourceAdd',
    value: `Source Added Successfully`,
    html: `Source Added Successfully`,
  },
  noSource: {
    codes: 'noSource',
    value: 'No Source Available',
    html: 'No Source Available',
  },
  statusExist: {
    codes: 'statusExist',
    value: 'Status Already Exist',
    html: 'Status Already Exist',
  },
  statusAdd: {
    codes: 'statusAdd',
    value: `Status Added Successfully`,
    html: `Status Added Successfully`,
  },
  addApplicationStatus: {
    codes: 'addApplicationStatus',
    value: 'Status Updated Successfully',
    html: 'Status Updated Successfully',
  },
  applicationNExist: {
    codes: 'jobApplication',
    value: 'No Such Application Exist',
    html: 'No Such Application Exist',
  },
  applicationUpdate: {
    codes: 'applicationUpdate',
    value: 'Application Updated Successfully',
    html: 'Application Updated Successfully',
  },
  menuNExist: {
    codes: 'menuNExist',
    value: 'Menu Not Exist',
    html: 'Menu Not Exist',
  },
  statusNExist: {
    codes: 'statusNExist',
    value: 'Status Not Exist',
    html: 'Status Not Exist',
  },
  pdfUpload: {
    codes: 'pdfUpload',
    value: 'PDF Uploaded Successfully',
    html: 'PDF Uploaded Successfully',
  },
  menuExist: {
    codes: 'menuExist',
    value: 'Menu Already Exist',
    html: 'Menu Already Exist',
  },
  menuAdd: {
    codes: 'menuAdd',
    value: `Menu Added Successfully`,
    html: `Menu Added Successfully`,
  },
  mobileExist: {
    codes: 'mobileExist',
    value: 'Mobile Already Exist',
    html: 'Mobile Already Exist',
  },
  noJob: {
    codes: 'noJob',
    value: 'No Open Job Found',
    html: 'No Open Job Found',
  },
  applicantNExist: {
    codes: 'applicantNExist',
    value: 'No applicant Exist',
    html: 'No applicant Exist',
  },
  modeNExist: {
    codes: 'modeNExist',
    value: 'No Payment Mode Found',
    html: 'No Payment Mode Found',
  },
  paymentNExist: {
    codes: 'paymentNExist',
    value: 'No Payment Exist',
    html: 'No Payment Exist',
  },
  paymentNC: {
    codes: 'paymentNC',
    value: 'Payment Not Created',
    html: 'Payment Not Created',
  },
  modeExist: {
    codes: 'modeExist',
    value: 'Payment Mode Already Exist',
    html: 'Payment Mode Already Exist',
  },
  modeAdd: {
    codes: 'modeAdd',
    value: `Payment Mode Added Successfully`,
    html: `Payment Mode Added Successfully`,
  },
  paymentAdd: {
    codes: 'paymentAdd',
    value: `Payment Added Successfully`,
    html: `Payment Added Successfully`,
  },
  firmNExist: {
    codes: 'firmNExist',
    value: 'No Such Firm Exist',
    html: 'No Such Firm Exist',
  },
  planUpgraded: {
    codes: 'planUpgraded',
    value: 'Plan Upgraded Successfully',
    html: 'Plan Upgraded Successfully',
  },
  ratingNExist: {
    codes: 'ratingNExist',
    value: 'No such Rating Exist',
    html: 'No such Rating Exist',
  },
  blogratingNExist: {
    codes: 'blogratingNExist',
    value: 'No blogs found with the specified rating',
    html: 'No blogs found with the specified rating',
  },
  payDate: {
    codes: 'payDate',
    value: 'Payment Date is greater than current Date',
    html: 'Payment Date is greater than current Date',
  },
  descriptionNExist: {
    codes: 'descriptionNExist',
    value: 'Status description not Exist',
    html: 'Status description not Exist',
  },
  contactSuccess: {
    codes: 'contactSuccess',
    value: 'Contact form submiited successfully',
    html: 'Contact form submiited successfully',
  },
  featureRequestSuccess: {
    codes: 'featureRequestSuccess',
    value: 'Feature Requested successfully.',
    html: 'Feature Requested successfully.',
  },
  roleAlreadyNExist: {
    codes: 'roleAlreadyNExist',
    value: 'Role Already Exist in Other Modules',
    html: 'Role Already Exist in Other Modules',
  },
  roleNAuthor: {
    codes: 'roleNAuthor',
    value: 'Role name should be Author',
    html: 'Role name should be Author',
  },
  contactSales: {
    codes: 'contactSales',
    value: 'Contact Sales for Plan Extension',
    html: 'Contact Sales for Plan Extension',
  },
  categoryRenamed: {
    codes: 'categoryRenamed',
    value: 'Category Renamed Successfully.',
    html: 'Category Renamed Successfully.',
  },
  levelExist: {
    codes: 'levelExist',
    value: 'Level Already Exist',
    html: 'Level Already Exist',
  },
  levelAdd: {
    codes: 'levelAdd',
    value: `Level Added Successfully`,
    html: `Level Added Successfully`,
  },
  noLevel: {
    codes: 'noLevel',
    value: 'No Level Available',
    html: 'No Level Available',
  },
  noLevelExist: {
    codes: 'noLevel',
    value: 'No Such Level Exist',
    html: 'No Such Level Type Exist',
  },
  topicCreate: {
    codes: 'topicCreate',
    value: 'Topic Created Successfully.',
    html: 'Topic Created Successfully.',
  },
  noTopicExist: {
    codes: 'noTopicExist',
    value: 'No Such Topic Exist',
    html: 'No Such Topic Exist',
  },
  topicExist: {
    codes: 'topicExist',
    value: 'Topic Already Exist',
    html: 'Topic Already Exist',
  },
  topicUpdated: {
    codes: 'topicUpdated',
    value: 'Topic Updated successfully',
    html: 'Topic Updated successfully',
  },
  moduleMismatch: {
    codes: 'moduleMismatch',
    value: 'Module cannot be modified for Parent/Child relationship',
    html: 'Module cannot be modified for Parent/Child relationship',
  },
  topicOrder: {
    codes: 'topicOrder',
    value: `Topic Order has been changed Successfully`,
    html: `Topic Order has been changed Successfully`,
  },
  topicNExist: {
    codes: 'topicNExist',
    value: 'Topics Not Exist',
    html: 'Topics Not Exist',
  },
  moduleExistTopic: {
    codes: 'moduleExistTopic',
    value: 'Module Associated with other Active Primary Topics',
    html: 'Module Associated with other Active Primary Topics',
  },
  deleteModule: {
    codes: 'deleteModule',
    value: `Module Deleted Successfully`,
    html: `Module Deleted Successfully`,
  },
  topicRestored: {
    codes: 'topicRestored',
    value: `Topic Restored Successfully`,
    html: `Topic Restored Successfully`,
  },
  primaryNExist: {
    codes: 'primaryNExist',
    value: `Parent/Child Cannot be restored to Primary`,
    html: `Parent/Child Cannot be restored to Primary`,
  },
  parentNExist: {
    codes: 'primaryNExist',
    value: `Primary/Child Cannot be restored to Parent`,
    html: `Primary/Child Cannot be restored to Parent`,
  },
  childNExist: {
    codes: 'childNExist',
    value: `Primary/Parent Cannot be restored to Child`,
    html: `Primary/Parent Cannot be restored to Child`,
  },
  activePrimary: {
    codes: 'activePrimary',
    value: `Active Topics in the Lower-Hierarchy.`,
    html: `Active Topics in the Lower-Hierarchy.`,
  },
  faqCreate: {
    codes: 'faqCreate',
    value: `FAQ Created Successfully.`,
    html: `FAQ Created Successfully.`,
  },
  faqNExist: {
    codes: 'faqNExist',
    value: `No such FAQ Exist.`,
    html: `No such FAQ Exist.`,
  },
  faqUpdate: {
    codes: 'faqUpdate',
    value: `FAQ Updated Successfully.`,
    html: `FAQ Updated Successfully.`,
  },
  faqMovedDraft: {
    codes: 'faqMovedDraft',
    value: 'FAQ Moved to Draft.',
    html: 'FAQ Moved to Draft.',
  },
  publishFaq: {
    codes: 'publishFaq',
    value: 'FAQ Published Successfully.',
    html: 'FAQ Published Successfully.',
  },
  faqDelete: {
    codes: 'faqDelete',
    value: `FAQ Deleted Successfully.`,
    html: `FAQ Deleted Successfully.`,
  },
  createQuestion: {
    codes: 'createQuestion',
    value: 'User Question Created Successfully.',
    html: 'User Question Created Successfully.',
  },
  noQuestionExist: {
    codes: 'noQuestionExist',
    value: 'No Such Question Exist',
    html: 'No Such Question Exist',
  },
  UQAnswered: {
    codes: 'UQAnswered',
    value: 'User Question Answered Successfully',
    html: 'User Question Answered Successfully',
  },
  UQPublished: {
    codes: 'UQPublished',
    value: 'Published Successfully',
    html: 'Published Successfully',
  },
  UQMovedToAnswers: {
    codes: 'UQMovedToAnswers',
    value: 'Published Successfully',
    html: 'Published Successfully',
  },
  requestExceeded: {
    codes: 'requestExceeded',
    value: 'Subscription request exceeded for same IP.',
    html: 'Subscription request exceeded for same IP.',
  },
  subscribeSuccess: {
    codes: 'subscribeSuccess',
    value: 'Subscribed Successfully.',
    html: 'Subscribed Successfully.',
  },
  unSubscribe: {
    codes: 'unSubscribe',
    value: 'User Unsubscribed Successfully.',
    html: 'User Unsubscribed Successfully.',
  },
  inviteRequest: {
    codes: 'inviteRequest',
    value: 'Invite Sent Successfully.',
    html: 'Invite Sent Successfully.',
  },
  alreadyUnSubscribe: {
    codes: 'alreadyUnSubscribe',
    value: 'Email Already Unsubscribed.',
    html: 'Email Already Unsubscribed.',
  },
  subscriberStatusNExist: {
    codes: 'subscriberStatusNExist',
    value: 'Status Not Exist',
    html: 'Status Not Exist',
  },
  noOrgType: {
    codes: 'noOrgType',
    value: 'No Organization Type available',
    html: 'No Organization Type available',
  },
  noplanCategory: {
    codes: 'noplanCategory',
    value: 'No Plan Category available',
    html: 'No Plan Category available',
  },
  noplanPeriod: {
    codes: 'noplanPeriod',
    value: 'No Plan Period available',
    html: 'No Plan Period available',
  },
  orgTypeExist: {
    codes: 'orgTypeExist',
    value: 'Organization Type Already Exist',
    html: 'Organization Type Already Exist',
  },
  orgTypeAdd: {
    codes: 'orgTypeAdd',
    value: `Organization Type Added Successfully`,
    html: `Organization Type Added Successfully`,
  },
  planCatExist: {
    codes: 'planCatExist',
    value: 'Plan Category Already Exist',
    html: 'Plan Category Already Exist',
  },
  planCatAdd: {
    codes: 'planCatAdd',
    value: `Plan Category Added Successfully`,
    html: `Plan Category Added Successfully`,
  },
  orgModExist: {
    codes: 'orgModExist',
    value: 'Organization Module Already Exist',
    html: 'Organization Module Already Exist',
  },
  orgModAdd: {
    codes: 'orgModAdd',
    value: `Organization Module Added Successfully`,
    html: `Organization Module Added Successfully`,
  },
  noModule: {
    codes: 'noModule',
    value: 'No Organization Module available',
    html: 'No Organization Module available',
  },
  someModules: {
    codes: 'someModules',
    value: 'Some Organization Module not available',
    html: 'Some Organization Module not available',
  },
  topupNC: {
    codes: 'topupNC',
    value: 'Topup Not Created',
    html: 'Topup Not Created',
  },
  noSelection: {
    codes: 'noSelection',
    value: 'No Selection available',
    html: 'No Selection available',
  },
  someSelection: {
    codes: 'someSelection',
    value: 'Some Selection not available',
    html: 'Some Selection not available',
  },
  selectionNExist: {
    codes: 'selectionNExist',
    value: 'Selection and request mismatch.',
    html: 'Selection and request mismatch.',
  },
  firmNAExist: {
    codes: 'firmNAExist',
    value: 'No Active/Such Firm Exist',
    html: 'No Active/Such Firm Exist',
  },
  noTopup: {
    codes: 'noTopup',
    value: 'No Topup Available',
    html: 'No Topup Available',
  },
  topupComExist: {
    codes: 'topupComExist',
    value: 'The selected combination already has an existing Topup. Please choose a different combination',
    html: 'The selected combination already\nhas an existing Topup\nPlease choose a different combination',
  },
  noTransaction: {
    codes: 'noTransaction',
    value: 'No transactions made for this organization.',
    html: 'No transactions made for this organization.',
  },
  planEndNmatch: {
    codes: 'planEndNmatch',
    value: 'Plan end Date Not Matching.',
    html: 'Plan end Date Not Matching.',
  },
  topupNameExist: {
    codes: 'topupNameExist',
    value: 'Already Topup Exist On This Name',
    html: 'Already Topup Exist On This Name',
  },
  professionalTypeExist: {
    codes: 'professionalTypeExist',
    value: 'Professional Type Already Exist',
    html: 'Professional Type Already Exist',
  },
  professionalTypeAdd: {
    codes: 'professionalTypeAdd',
    value: `Professional Type Added Successfully`,
    html: `Professional Type Added Successfully`,
  },
  noprofessionalType: {
    codes: 'noprofessionalType',
    value: 'No Professional Type available',
    html: 'No Professional Type available',
  },
  selectTypeCategory: {
    codes: 'selectTypeCategory',
    value: 'Please Select Plan Type and Category',
    html: 'Please Select Plan Type and Category',
  },
  selectOrgType: {
    codes: 'selectOrgType',
    value: 'Please Select Organization Type',
    html: 'Please Select Organization Type',
  },
  selectionExist: {
    codes: 'selectionExist',
    value: 'Selection Already Exist',
    html: 'Selection Already Exist',
  },
  selectionAdd: {
    codes: 'selectionAdd',
    value: `Selection Added Successfully`,
    html: `Selection Added Successfully`,
  },
  selectionNotExist: {
    codes: 'selectionNotExist',
    value: 'No Selection Found',
    html: 'No Selection Found',
  },
  noInvoice: {
    codes: 'noInvoice',
    value: 'No Invoice Type Available',
    html: 'No Invoice Type Available',
  },
  noCustomers: {
    codes: 'noCustomers',
    value: 'No Customers Found',
    html: 'No Customers Found',
  },
  noTransactions: {
    codes: 'noTransactions',
    value: 'No Transactions Found',
    html: 'No Transactions Found',
  },
};
module.exports = rescodes;
