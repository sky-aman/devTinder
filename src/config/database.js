const mongoose = require('mongoose');
const { MONGODB_KEY } = require('./config');

const connectDB = async () => {
  mongoose.connect(MONGODB_KEY)
}

module.exports = connectDB;