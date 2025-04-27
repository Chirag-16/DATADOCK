const express = require('express');
const websiteController = require('../controllers/websiteController');

const router = express.Router();

// Website management routes
router.post('/websites', websiteController.addWebsite);
router.get('/websites', websiteController.getAllWebsites);
router.get('/websites/:id', websiteController.getWebsiteById);
router.put('/websites/:id', websiteController.updateWebsite);
router.delete('/websites/:id', websiteController.deleteWebsite);

// Website checking route
router.post('/websites/:id/check', websiteController.checkWebsite);

// Website history and metrics
router.get('/websites/:id/history', websiteController.getWebsiteHistory);
router.get('/websites/:id/metrics', websiteController.getWebsiteMetrics);

// Alerts route
router.get('/alerts', websiteController.getAlerts);

// Stats route
router.get('/stats', websiteController.getStats);

module.exports = router;