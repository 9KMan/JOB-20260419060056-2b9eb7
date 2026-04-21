const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const callController = require('../controllers/callController');
const { validateRequest } = require('../middleware/validator');

router.post(
  '/webhook',
  [
    body('CallSid').notEmpty(),
    body('From').notEmpty(),
    body('To').notEmpty(),
  ],
  validateRequest,
  callController.handleWebhook
);

router.get(
  '/:callId',
  [param('callId').isString()],
  validateRequest,
  callController.getCall
);

router.post(
  '/:callId/forward',
  [
    param('callId').isString(),
    body('forwardTo').notEmpty().isString(),
  ],
  validateRequest,
  callController.forwardCall
);

router.post(
  '/:callId/voicemail',
  [
    param('callId').isString(),
  ],
  validateRequest,
  callController.startVoicemail
);

module.exports = router;