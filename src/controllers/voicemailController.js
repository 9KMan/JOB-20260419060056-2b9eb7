const { Voicemail, Call } = require('../models');
const transcriptionService = require('../services/transcriptionService');
const aiService = require('../services/aiService');
const storageService = require('../services/storageService');
const logger = require('../utils/logger');

const listVoicemails = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '50', 10);
    const offset = parseInt(req.query.offset || '0', 10);

    const voicemails = await Voicemail.findAll({ limit, offset });

    res.json({
      data: voicemails,
      pagination: {
        limit,
        offset,
        count: voicemails.length,
      },
    });
  } catch (error) {
    logger.error('List voicemails error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getVoicemail = async (req, res) => {
  try {
    const { id } = req.params;
    const voicemail = await Voicemail.findById(id);

    if (!voicemail) {
      return res.status(404).json({ error: 'Voicemail not found' });
    }

    res.json(voicemail);
  } catch (error) {
    logger.error('Get voicemail error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const processVoicemail = async (req, res) => {
  try {
    const { id } = req.params;
    const voicemail = await Voicemail.findById(id);

    if (!voicemail) {
      return res.status(404).json({ error: 'Voicemail not found' });
    }

    if (voicemail.processed) {
      return res.json({
        message: 'Already processed',
        voicemail,
      });
    }

    const call = await Call.findById(voicemail.callId);

    logger.info(`Processing voicemail ${id}`);

    const s3Url = await storageService.uploadAudio(voicemail.recordingUrl, `voicemail-${id}.mp3`);

    const transcription = await transcriptionService.transcribe(s3Url);
    voicemail.transcription = transcription.text;
    voicemail.transcriptionStatus = 'completed';

    logger.info(`Transcription completed for voicemail ${id}`);

    const summary = await aiService.summarize(transcription.text);
    voicemail.summary = summary;

    const smsReply = await aiService.generateSmsReply(transcription.text);
    voicemail.smsReply = smsReply;
    voicemail.smsStatus = 'pending';

    voicemail.processed = true;
    await voicemail.save();

    logger.info(`Voicemail ${id} processed successfully`);

    res.json({
      success: true,
      voicemail: {
        id: voicemail.id,
        transcription: voicemail.transcription,
        summary: voicemail.summary,
        smsReply: voicemail.smsReply,
      },
    });
  } catch (error) {
    logger.error('Process voicemail error:', error);
    res.status(500).json({ error: 'Failed to process voicemail' });
  }
};

const deleteVoicemail = async (req, res) => {
  try {
    const { id } = req.params;
    const voicemail = await Voicemail.findById(id);

    if (!voicemail) {
      return res.status(404).json({ error: 'Voicemail not found' });
    }

    if (voicemail.recordingUrl) {
      await storageService.deleteAudio(voicemail.recordingUrl);
    }

    await voicemail.delete();

    res.json({ success: true, message: 'Voicemail deleted' });
  } catch (error) {
    logger.error('Delete voicemail error:', error);
    res.status(500).json({ error: 'Failed to delete voicemail' });
  }
};

module.exports = {
  listVoicemails,
  getVoicemail,
  processVoicemail,
  deleteVoicemail,
};