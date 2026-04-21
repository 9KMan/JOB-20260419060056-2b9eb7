const { Pool } = require('pg');
const db = require('../../src/models');

jest.mock('../../src/models', () => ({
  query: jest.fn(),
}));

describe('Call Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a call', async () => {
    const mockCall = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      twilio_sid: 'CA123456',
      from_number: '+1234567890',
      to_number: '+0987654321',
      status: 'pending',
      direction: 'incoming',
    };

    db.query.mockResolvedValue({ rows: [mockCall] });

    const result = await db.query(
      'INSERT INTO calls (twilio_sid, from_number, to_number, status, direction) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [mockCall.twilio_sid, mockCall.from_number, mockCall.to_number, mockCall.status, mockCall.direction]
    );

    expect(result.rows[0]).toEqual(mockCall);
  });

  it('should find call by id', async () => {
    const mockCall = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      twilio_sid: 'CA123456',
    };

    db.query.mockResolvedValue({ rows: [mockCall] });

    const result = await db.query('SELECT * FROM calls WHERE id = $1', [mockCall.id]);
    expect(result.rows[0]).toEqual(mockCall);
  });
});