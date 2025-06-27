const authMiddleware = (req, res, next) => {
	let token = 'abc';

	if (token === 'abc') {
		next();
	} else {
		res.status(401).send('Unauthorized');
	}
}

module.exports = {
  authMiddleware
}