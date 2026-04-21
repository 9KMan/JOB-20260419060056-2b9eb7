const request = require('supertest');
const app = require('../src/app');

describe('Health Check', () => {
  it('should return healthy status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.service).toBe('ai-missed-call-assistant');
  });
});

describe('Call Routes', () => {
  it('should reject webhook without CallSid', async () => {
    const response = await request(app)
      .post('/api/calls/webhook')
      .send({ From: '+1234567890', To: '+0987654321' });
    expect(response.status).toBe(400);
  });

  it('should return 404 for non-existent call', async () => {
    const response = await request(app)
      .get('/api/calls/00000000-0000-0000-0000-000000000000');
    expect(response.status).toBe(404);
  });
});

describe('Voicemail Routes', () => {
  it('should return 404 for non-existent voicemail', async () => {
    const response = await request(app)
      .get('/api/voicemails/00000000-0000-0000-0000-000000000000');
    expect(response.status).toBe(404);
  });

  it('should list voicemails', async () => {
    const response = await request(app).get('/api/voicemails');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('pagination');
  });
});