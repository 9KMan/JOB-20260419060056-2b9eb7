const db = require('../db');

class Voicemail {
  static async create(data) {
    const { callSid, recordingUrl, duration, transcribed, processed } = data;
    const result = await db.query(
      `INSERT INTO voicemails (call_id, recording_url, duration, transcribed, processed, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [callSid, recordingUrl, duration || 0, transcribed || false, processed || false]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM voicemails WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByCallId(callId) {
    const result = await db.query('SELECT * FROM voicemails WHERE call_id = $1', [callId]);
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.transcription !== undefined) {
      fields.push(`transcription = $${paramIndex++}`);
      values.push(data.transcription);
    }
    if (data.transcriptionStatus !== undefined) {
      fields.push(`transcription_status = $${paramIndex++}`);
      values.push(data.transcriptionStatus);
    }
    if (data.summary !== undefined) {
      fields.push(`summary = $${paramIndex++}`);
      values.push(data.summary);
    }
    if (data.smsReply !== undefined) {
      fields.push(`sms_reply = $${paramIndex++}`);
      values.push(data.smsReply);
    }
    if (data.smsStatus !== undefined) {
      fields.push(`sms_status = $${paramIndex++}`);
      values.push(data.smsStatus);
    }
    if (data.processed !== undefined) {
      fields.push(`processed = $${paramIndex++}`);
      values.push(data.processed);
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    const result = await db.query(
      `UPDATE voicemails SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM voicemails WHERE id = $1', [id]);
    return { deleted: true };
  }

  static async findAll(limit = 50, offset = 0) {
    const result = await db.query(
      'SELECT * FROM voicemails ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  static async findUnprocessed() {
    const result = await db.query(
      'SELECT * FROM voicemails WHERE processed = false ORDER BY created_at ASC'
    );
    return result.rows;
  }
}

module.exports = Voicemail;