const express = require('express');
const mongoose = require('mongoose');
const cors = require('./config/cors'); // Adjust the path based on your folder structure
const transactionRoutes = require('./routes/transactionRoutes');
require('dotenv').config(); // Ensure dotenv is required to use environment variables

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Use CORS middleware
app.use(cors);

// Use the transaction routes for the API
app.use('/api/transactions', transactionRoutes);

// Set up MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Set the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
