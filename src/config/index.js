require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/missed_calls',
  },

  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.S3_BUCKET,
  },

  call: {
    timeoutSeconds: parseInt(process.env.CALL_TIMEOUT_SECONDS || '30', 10),
    voicemailMaxDuration: parseInt(process.env.VOICEMAIL_MAX_DURATION_SECONDS || '120', 10),
  },

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

module.exports = config;