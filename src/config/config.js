// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  MONGODB_KEY: process.env.MONGODB_KEY,
  PORT: process.env.PORT,
  TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY
};