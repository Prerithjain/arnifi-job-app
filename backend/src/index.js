const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const pool = require('./config/db');

// ✅ check DB connection
pool.connect()
  .then(() => console.log("Connected to database ✅"))
  .catch(err => console.error("DB connection error:", err));

// middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// test route
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));