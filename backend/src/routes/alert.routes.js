const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alert.controllers');

router.post('/sos', alertController.generateAlert);
router.post('/ai-webhook', alertController.handleAIPush);
router.get('/', alertController.getAlerts);
router.put('/:id/resolve', alertController.resolveAlert);

module.exports = router;
