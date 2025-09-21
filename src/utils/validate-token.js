const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { TOKEN_SECRET_KEY } = require('../config/config');

const validateToken = async (token) => {
    const { _id } = jwt.verify(token, TOKEN_SECRET_KEY);

    const user = await User.findById(_id);

    return user;
}

module.exports = validateToken;