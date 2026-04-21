const { OpenAI } = require('openai');
const config = require('../config');
const logger = require('../utils/logger');

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

const summarize = async (transcriptionText) => {
  try {
    logger.info('Generating summary with OpenAI');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional assistant that summarizes voicemail transcriptions into concise, clear summaries.',
        },
        {
          role: 'user',
          content: `Summarize the following voicemail transcription in 2-3 sentences:\n\n${transcriptionText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const summary = completion.choices[0].message.content;
    logger.info('Summary generated successfully');

    return summary;
  } catch (error) {
    logger.error('Summarize error:', error);
    throw error;
  }
};

const generateSmsReply = async (transcriptionText, callerName = 'the caller') => {
  try {
    logger.info('Generating SMS reply with OpenAI');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional assistant that generates polite, concise SMS replies for missed call scenarios.',
        },
        {
          role: 'user',
          content: `Generate a single SMS reply (under 160 characters) to inform ${callerName} that their call was received and someone will call them back soon. Be polite and professional.\n\nVoicemail transcription:\n${transcriptionText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const smsReply = completion.choices[0].message.content.trim();
    logger.info('SMS reply generated successfully');

    return smsReply;
  } catch (error) {
    logger.error('Generate SMS reply error:', error);
    throw error;
  }
};

module.exports = {
  summarize,
  generateSmsReply,
};