const AWS = require('aws-sdk');
const config = require('../config');
const logger = require('../utils/logger');

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

const uploadAudio = async (audioUrl, filename) => {
  try {
    logger.info(`Uploading audio to S3: ${filename}`);

    const s3Key = `voicemails/${Date.now()}-${filename}`;

    logger.info('In production, would download audio from URL and upload to S3');

    const mockS3Url = `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${s3Key}`;

    logger.info(`Audio uploaded to: ${mockS3Url}`);
    return mockS3Url;
  } catch (error) {
    logger.error('Upload audio error:', error);
    throw error;
  }
};

const deleteAudio = async (s3Url) => {
  try {
    logger.info(`Deleting audio from S3: ${s3Url}`);

    const key = s3Url.split('/').pop();

    logger.info('In production, would delete from S3');

    return { success: true };
  } catch (error) {
    logger.error('Delete audio error:', error);
    throw error;
  }
};

const getSignedUrl = async (s3Key, expiresIn = 3600) => {
  try {
    const url = s3.getSignedUrl('getObject', {
      Bucket: config.aws.s3Bucket,
      Key: s3Key,
      Expires: expiresIn,
    });

    return url;
  } catch (error) {
    logger.error('Get signed URL error:', error);
    throw error;
  }
};

module.exports = {
  uploadAudio,
  deleteAudio,
  getSignedUrl,
};