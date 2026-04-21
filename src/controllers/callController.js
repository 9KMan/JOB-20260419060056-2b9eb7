const twilioService = require('../services/twilioService');
const { Call, Voicemail } = require('../models');
const logger = require('../utils/logger');

const handleWebhook = async (req, res) => {
  try {
    const { CallSid, From, To, CallStatus, RecordingUrl } = req.body;

    if (CallStatus === 'ringing' || CallStatus === 'in-progress') {
      const call = await Call.create({
        twilioSid: CallSid,
        fromNumber: From,
        toNumber: To,
        status: CallStatus,
        direction: 'incoming',
      });

      logger.info(`Incoming call: ${CallSid} from ${From}`);

      const response = twilioService.createVoiceResponse({
        callSid: CallSid,
        action: 'forward',
        forwardTo: process.env.FORWARD_PHONE_NUMBER || From,
      });

      return res.type('text/xml').send(response);
    }

    if (CallStatus === 'completed' && RecordingUrl) {
      const voicemail = await Voicemail.create({
        callSid: CallSid,
        recordingUrl: RecordingUrl,
        duration: req.body.RecordingDuration || 0,
        transcribed: false,
        processed: false,
      });

      logger.info(`Voicemail recorded: ${voicemail.id} for call ${CallSid}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCall = async (req, res) => {
  try {
    const { callId } = req.params;
    const call = await Call.findById(callId);

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    res.json(call);
  } catch (error) {
    logger.error('Get call error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const forwardCall = async (req, res) => {
  try {
    const { callId } = req.params;
    const { forwardTo } = req.body;

    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    const result = await twilioService.forwardCall(call.twilioSid, forwardTo);

    await call.update({ status: 'forwarded', forwardedTo: forwardTo });

    res.json({ success: true, forwardedTo: forwardTo, twilioResponse: result });
  } catch (error) {
    logger.error('Forward call error:', error);
    res.status(500).json({ error: 'Failed to forward call' });
  }
};

const startVoicemail = async (req, res) => {
  try {
    const { callId } = req.params;

    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    const response = twilioService.createVoicemailGreeting();

    res.type('text/xml').send(response);
  } catch (error) {
    logger.error('Start voicemail error:', error);
    res.status(500).json({ error: 'Failed to start voicemail' });
  }
};

module.exports = {
  handleWebhook,
  getCall,
  forwardCall,
  startVoicemail,
};