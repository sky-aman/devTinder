const express = require('express');
const { userAuth } = require('../middleware/user');

const profileRouter = express.Router();

// profile API
profileRouter.get('/profile', userAuth, async (req, res) => {
	try {
		return res.send(req.user);
	} catch (err) {
		return res.status(500).send('Something went wrong');
	}
});

profileRouter.patch('/profile/:id', async (req, res) => {
	try {
		const userId = req.params?.id;
		const data = req.body;

		const ALLOWED_FIELDS = ['age', 'gender', 'photoUrl', 'about', 'skills'];

		const isAllowedUpdates = Object.keys(data).every((item) =>
			ALLOWED_FIELDS.includes(item)
		);

		if (!isAllowedUpdates) {
			throw new Error('Update is not allowed');
		}
		const result = await User.findByIdAndUpdate(userId, data, {
			runValidators: true,
		});

		// if (!result) {
		// 	throw new Error('User not found');
		// }

		return res.send('User updated successfully');
	} catch (err) {
		return res.status(500).send('Something went wrong:' + err.message);
	}
});

module.exports = profileRouter;