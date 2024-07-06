/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-missing-require */
/* eslint-disable import/no-unresolved */
const { S3Client } = require('@aws-sdk/client-s3');
const config = require('../config/vars');

const s3 = new S3Client({
  region: config.app.region,
  credentials: {
    accessKeyId: config.app.accesskey,
    secretAccessKey: config.app.secretkey,
  },
});

module.exports = s3;
