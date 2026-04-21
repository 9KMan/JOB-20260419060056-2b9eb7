const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const voicemailController = require('../controllers/voicemailController');
const { validateRequest } = require('../middleware/validator');

router.get('/', voicemailController.listVoicemails);

router.get(
  '/:id',
  [param('id').isUUID()],
  validateRequest,
  voicemailController.getVoicemail
);

router.post(
  '/:id/process',
  [param('id').isUUID()],
  validateRequest,
  voicemailController.processVoicemail
);

router.delete(
  '/:id',
  [param('id').isUUID()],
  validateRequest,
  voicemailController.deleteVoicemail
);

module.exports = router;