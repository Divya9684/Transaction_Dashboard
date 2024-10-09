const express = require('express');
const { getCombinedTransactions } = require('../controllers/transactionController'); // Ensure the controller is imported
const router = express.Router();

// Route for combined transactions
router.get('/combined', getCombinedTransactions); // Call your controller function directly

module.exports = router;
