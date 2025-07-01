const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
	try {
		const { token } = req.cookies;

		if (!token) return res.status(403).send('Invalid cookie');

		const { _id } = jwt.verify(token, 'DevTinderPrivateKey');

		const user = await User.findById(_id);

		if (!user) return res.status(404).send('User not found');

		req.user = user;
		next();
	} catch (err) {
		return res.status(400).send(err.message);
	}
};

module.exports = {
	userAuth,
};
