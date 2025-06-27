const userMiddleware = (req, res, next) => {
	let token = 'xyz';

	if (token === 'xyz') {
		next();
	} else {
		res.status(401).send('Unauthorized');
	}
}

module.exports = {
  userMiddleware
}