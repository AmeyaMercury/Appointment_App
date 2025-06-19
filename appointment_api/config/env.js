require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 4000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/medical_appointmentmongodb+srv://abcd:abcd@cluster0.e2kwbac.mongodb.net/',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
