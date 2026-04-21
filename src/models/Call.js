const db = require('../db');

class Call {
  static async create(data) {
    const { twilioSid, fromNumber, toNumber, status, direction } = data;
    const result = await db.query(
      `INSERT INTO calls (twilio_sid, from_number, to_number, status, direction, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [twilioSid, fromNumber, toNumber, status, direction]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM calls WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByTwilioSid(twilioSid) {
    const result = await db.query('SELECT * FROM calls WHERE twilio_sid = $1', [twilioSid]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { status, forwardedTo, duration } = data;
    const result = await db.query(
      `UPDATE calls
       SET status = COALESCE($2, status),
           forwarded_to = $3,
           duration = COALESCE($4, duration),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, status, forwardedTo, duration]
    );
    return result.rows[0];
  }

  static async findAll(limit = 50, offset = 0) {
    const result = await db.query(
      'SELECT * FROM calls ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }
}

module.exports = Call;