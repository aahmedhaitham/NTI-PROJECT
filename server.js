const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());

// Serve uploaded images statically (e.g. http://localhost:5000/uploads/<filename>)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/products', productRoutes);
app.use('/', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('PartLink Product Module API is running');
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/partlink';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });
