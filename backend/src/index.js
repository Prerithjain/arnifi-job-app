const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express(); // ✅ FIRST create app

const authRoutes = require('./routes/auth');
const pool = require('./config/db');

// middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);

// test route
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));