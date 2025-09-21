const validateToken = require("../utils/validate-token");

const userAuth = async (req, res, next) => {
	try {
		const { token } = req.cookies;

		if (!token) return res.status(401).json({ message: 'Unauthorized' });

		const user = await validateToken(token);

		if (!user) return res.status(404).send({ message: 'User not found' });

		req.user = user;
		next();
	} catch (err) {
		return res.status(400).send(err.message);
	}
};

module.exports = {
	userAuth,
};
