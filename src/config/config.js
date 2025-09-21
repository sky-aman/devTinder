// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  MONGODB_KEY: process.env.MONGODB_KEY,
  PORT: process.env.PORT,
  TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY,
  SES_ACCESS_KEY: process.env.SES_ACCESS_KEY,
  SES_SECRET_ACCESS_KEY: process.env.SES_SECRET_ACCESS_KEY
};