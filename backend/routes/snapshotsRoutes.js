const express = require('express');
const router = express.Router();
const snapshotsController = require('../controllers/snapshotsController');

router.get('/', snapshotsController.getByAccount); // GET /api/snapshots?accountId=xxx
router.post('/', snapshotsController.create);

module.exports = router;