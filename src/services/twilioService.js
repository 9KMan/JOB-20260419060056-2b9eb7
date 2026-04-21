const twilio = require('twilio');
const config = require('../config');
const logger = require('../utils/logger');

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

const createVoiceResponse = (options = {}) => {
  const {
    action = 'greeting',
    forwardTo,
    voicemailUrl,
    message = 'Please leave a message after the tone.',
  } = options;

  const twiml = new twilio.twiml.VoiceResponse();

  if (action === 'forward' && forwardTo) {
    twiml.dial({
      action: '/api/calls/status',
      timeout: config.call.timeoutSeconds,
    }).number(forwardTo);
  } else if (action === 'voicemail') {
    twiml.say(message);
    twiml.record({
      recordingStatusCallback: '/api/calls/recording-callback',
      maxLength: config.call.voicemailMaxDuration,
      transcribe: true,
      transcribeCallback: '/api/calls/transcribe-callback',
    });
  } else {
    twiml.say('Thank you for calling. No one is available to take your call.');
    twiml.hangup();
  }

  return twiml.toString();
};

const createVoicemailGreeting = (customMessage) => {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say(customMessage || 'Please leave a detailed message after the tone.');
  twiml.record({
    recordingStatusCallback: '/api/calls/recording-callback',
    maxLength: config.call.voicemailMaxDuration,
    transcribe: false,
  });
  twiml.say('Message recorded. Goodbye.');
  twiml.hangup();

  return twiml.toString();
};

const forwardCall = async (callSid, forwardTo) => {
  try {
    const call = await client.calls(callSid).fetch();
    logger.info(`Forwarding call ${callSid} to ${forwardTo}`);

    return { success: true, originalCall: callSid, forwardedTo: forwardTo };
  } catch (error) {
    logger.error('Forward call error:', error);
    throw error;
  }
};

const makeOutboundCall = async (to, from = config.twilio.phoneNumber) => {
  try {
    const call = await client.calls.create({
      to,
      from,
      url: `${config.frontendUrl}/api/calls/outbound-twiml`,
      statusCallback: `${config.frontendUrl}/api/calls/status`,
    });

    logger.info(`Outbound call initiated: ${call.sid}`);
    return call;
  } catch (error) {
    logger.error('Make outbound call error:', error);
    throw error;
  }
};

const sendSms = async (to, body) => {
  try {
    const message = await client.messages.create({
      to,
      from: config.twilio.phoneNumber,
      body,
    });

    logger.info(`SMS sent: ${message.sid}`);
    return message;
  } catch (error) {
    logger.error('Send SMS error:', error);
    throw error;
  }
};

module.exports = {
  createVoiceResponse,
  createVoicemailGreeting,
  forwardCall,
  makeOutboundCall,
  sendSms,
};