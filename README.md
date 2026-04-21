# AI Missed Call Assistant MVP

Twilio-powered telephony system that handles missed calls with intelligent voicemail recording, transcription, summarization, and SMS replies using AI.

## Features

- **Call Forwarding**: Automatically forward calls to appropriate recipients
- **Voicemail Greeting**: Customizable voicemail messages
- **Voicemail Recording**: Record incoming voicemails
- **Transcription**: Convert voicemail audio to text using Whisper
- **AI Summarization**: Generate concise summaries via OpenAI
- **SMS Reply**: Send AI-generated SMS responses to missed callers

## Tech Stack

- Node.js with Express backend
- Twilio Voice API for telephony
- PostgreSQL for data persistence
- OpenAI Whisper for transcription
- OpenAI GPT for summarization and SMS generation
- AWS S3 for audio storage
- Event-driven architecture

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Twilio account with Voice API access
- OpenAI API key
- AWS account (for S3)

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/missed_calls

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# AWS
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name

# App
CALL_TIMEOUT_SECONDS=30
VOICEMAIL_MAX_DURATION_SECONDS=120
```

### Database Setup

```bash
npm run migrate
npm run seed
```

### Run Server

```bash
npm start
```

## Project Structure

```
src/
├── index.js              # Main entry point
├── app.js                # Express app setup
├── config/
│   └── index.js          # Configuration loader
├── routes/
│   ├── calls.js          # Call management routes
│   ├── voicemails.js     # Voicemail routes
│   └── health.js         # Health check routes
├── controllers/
│   ├── callController.js
│   └── voicemailController.js
├── services/
│   ├── twilioService.js  # Twilio integration
│   ├── transcriptionService.js
│   ├── aiService.js      # OpenAI integration
│   └── storageService.js # S3 storage
├── models/
│   └── index.js          # Database models
├── db/
│   ├── migrate.js        # Database migrations
│   └── seed.js           # Seed data
├── middleware/
│   ├── errorHandler.js
│   └── validator.js
└── utils/
    └── logger.js
```

## API Endpoints

### Health
- `GET /health` - Health check

### Calls
- `POST /api/calls/webhook` - Twilio webhook endpoint
- `GET /api/calls/:callId` - Get call details
- `POST /api/calls/:callId/forward` - Forward a call

### Voicemails
- `GET /api/voicemails` - List all voicemails
- `GET /api/voicemails/:id` - Get voicemail details
- `POST /api/voicemails/:id/process` - Process voicemail (transcribe + summarize)
- `DELETE /api/voicemails/:id` - Delete voicemail

## Webhooks

The system handles these Twilio webhook events:
- `call/incoming` - Handle incoming call
- `call/forward` - Forward to voicemail
- `voicemail/start` - Start voicemail recording
- `voicemail/complete` - Handle completed voicemail
- `voicemail/transcribed` - Transcription ready

## Testing

```bash
npm test
```

## Docker

```bash
docker build -t ai-missed-call-assistant .
docker run -p 3000:3000 --env-file .env ai-missed-call-assistant
```

## License

MIT