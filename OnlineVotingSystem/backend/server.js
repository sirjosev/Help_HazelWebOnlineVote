const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./models'); // Imports from models/index.js

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Online Voting System API.' });
});

// Add API routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const voterRoutes = require('./routes/voter');
const publicRoutes = require('./routes/public');
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/voter', voterRoutes);
app.use('/api/public', publicRoutes);


const PORT = process.env.PORT || 3000;

// Connect to database and start server
db.sequelize.sync({ force: false }).then(() => { // force: false to not drop tables on restart
  console.log('Database synced.');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
