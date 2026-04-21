const db = require('../db');
const logger = require('../utils/logger');

const initializeDatabase = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS calls (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        twilio_sid VARCHAR(255) UNIQUE NOT NULL,
        from_number VARCHAR(50) NOT NULL,
        to_number VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        direction VARCHAR(20) DEFAULT 'incoming',
        forwarded_to VARCHAR(50),
        duration INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_calls_twilio_sid ON calls(twilio_sid);
      CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
      CREATE INDEX IF NOT EXISTS idx_calls_created_at ON calls(created_at);
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS voicemails (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
        recording_url TEXT,
        duration INTEGER,
        transcription TEXT,
        transcription_status VARCHAR(50) DEFAULT 'pending',
        summary TEXT,
        sms_reply TEXT,
        sms_status VARCHAR(50) DEFAULT 'pending',
        transcribed BOOLEAN DEFAULT FALSE,
        processed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_voicemails_call_id ON voicemails(call_id);
      CREATE INDEX IF NOT EXISTS idx_voicemails_processed ON voicemails(processed);
      CREATE INDEX IF NOT EXISTS idx_voicemails_created_at ON voicemails(created_at);
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS sms_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        voicemail_id UUID REFERENCES voicemails(id) ON DELETE SET NULL,
        to_number VARCHAR(50) NOT NULL,
        body TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'sent',
        twilio_sid VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_sms_logs_voicemail_id ON sms_logs(voicemail_id);
      CREATE INDEX IF NOT EXISTS idx_sms_logs_status ON sms_logs(status);
    `);

    logger.info('Database schema initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    throw error;
  }
};

module.exports = {
  initializeDatabase,
};