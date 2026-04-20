const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// This is my custom aggregation endpoint. REQUIREMENT!
router.get('/networth', statsController.getNetWorth);

module.exports = router;
