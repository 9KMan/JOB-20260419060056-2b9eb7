# SPEC.md — AI Missed Call Assistant MVP

## 1. Project Overview

**Project:** AI Missed Call Assistant MVP
**Job ID:** JOB-20260419060056-2b9eb7
**Tier:** MICRO
**Stack:** Node.js/Express + Twilio + PostgreSQL + Docker/Jest
**Repository:** https://github.com/9KMan/JOB-20260419060056-2b9eb7

Twilio-powered telephony system that handles missed calls with intelligent voicemail recording, transcription, summarization, and SMS replies using AI.

---

## 2. Tech Stack

| Layer      | Technology                                    |
|-----------|-----------------------------------------------|
| Backend   | Node.js, Express 4.x                         |
| Telephony | Twilio SDK (twilio 4.19)                    |
| Database  | PostgreSQL (pg 8.11, raw SQL)               |
| Security  | Helmet, CORS, Morgan                        |
| Testing   | Jest                                         |
| DevOps    | Docker                                       |

---

## 3. Data Models

### Call (raw SQL)
- twilio_sid, from_number, to_number, status, direction, created_at, updated_at

### Voicemail (raw SQL)
- call_id, recording_url, duration, transcribed (boolean), summary (text), sms_reply_sent (boolean), processed (boolean), created_at

---

## 4. Services

- TwilioService: call forwarding, voicemail recording, SMS replies
- TranscriptionService: voicemail audio → text
- AIService: voicemail summary + SMS reply generation
- StorageService: recording storage

---

## 5. API Routes

- POST /calls/webhook → Twilio incoming call webhook
- POST /calls/status → Twilio call status callback
- GET /voicemails → list voicemails
- POST /voicemails/:id/process → trigger AI processing
- GET /health → health check

---

## 6. File Structure

JOB-20260419060056-2b9eb7/
├── README.md
├── package.json          Express, Twilio, pg, Helmet, Jest
├── jest.config.js
├── src/
│   ├── index.js         Express app entry
│   ├── app.js           Express configuration
│   ├── config/index.js  Environment config
│   ├── db/
│   │   ├── index.js     PostgreSQL connection (pg)
│   │   ├── migrate.js   Schema migration script
│   │   └── seed.js      Seed data script
│   ├── models/
│   │   ├── index.js
│   │   ├── Call.js      Call SQL model
│   │   └── Voicemail.js Voicemail SQL model
│   ├── controllers/
│   │   ├── callController.js      Handle Twilio webhook
│   │   └── voicemailController.js  Voicemail CRUD + AI processing
│   ├── routes/
│   │   ├── calls.js     /calls/* routes
│   │   ├── health.js    /health route
│   │   └── voicemail.js /voicemails routes
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── services/
│   │   ├── twilioService.js
│   │   ├── transcriptionService.js
│   │   ├── aiService.js
│   │   └── storageService.js
│   └── utils/
│       └── logger.js
├── tests/
│   ├── call.test.js
│   └── voicemail.test.js
└── docker/
    ├── Dockerfile
    └── docker-compose.yml
