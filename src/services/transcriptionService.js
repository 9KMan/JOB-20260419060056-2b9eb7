const path = require('path');
const fs = require('fs');
const https = require('https');
const config = require('../config');
const logger = require('../utils/logger');

const transcribe = async (audioUrl) => {
  try {
    logger.info(`Transcribing audio from: ${audioUrl}`);

    const tempPath = path.join('/tmp', `voicemail-${Date.now()}.mp3`);
    await downloadFile(audioUrl, tempPath);

    logger.info('Audio downloaded, would send to Whisper API for transcription');

    const result = {
      text: 'Sample transcription - In production, this would use OpenAI Whisper API to transcribe the voicemail audio.',
      duration: 30,
      language: 'en',
    };

    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    return result;
  } catch (error) {
    logger.error('Transcription error:', error);
    throw error;
  }
};

const downloadFile = (url, destPath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (error) => {
      fs.unlink(destPath, () => {});
      reject(error);
    });
  });
};

module.exports = {
  transcribe,
};