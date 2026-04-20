const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Routes adhering strictly to Router -> Controller -> Model pattern
router.get('/', accountController.getAll);
router.post('/', accountController.create);

module.exports = router;
