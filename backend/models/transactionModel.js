const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Optional: Set to true if title is mandatory
  },
  description: {
    type: String,
    required: true, // Optional: Set to true if description is mandatory
  },
  price: {
    type: Number,
    required: true, // Ensures price is mandatory
  },
  sold: {
    type: Boolean,
    default: false, // Default value if not specified
  },
  dateOfSale: {
    type: Date,
    required: true, // Ensure this is required for filtering by month
  },
  category: {
    type: String,
    required: true, // Optional: Set to true if category is mandatory
  },
});

// Create and export the Transaction model
const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
