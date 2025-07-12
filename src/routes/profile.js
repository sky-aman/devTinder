const express = require('express');
const { userAuth } = require('../middleware/user');
const {
	validateProfilePatchData,
	validatePasswordPatchData,
} = require('../utils/validation');
const encryptPassword = require('../utils/encrypt-password');

const profileRouter = express.Router();

// profile API
profileRouter.get('/profile/view', userAuth, async (req, res) => {
	try {
		return res.json({ data: req.user });
	} catch (err) {
		return res.status(500).json({ message: 'Something went wrong' });
	}
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
	try {
		const user = req.user;
		const data = req.body;

		validateProfilePatchData(data);

		Object.keys(data).forEach((key) => {
			user[key] = data[key];
		});

		await user.save();

		return res.send({ message: 'User updated successfully' });
	} catch (err) {
		return res
			.status(500)
			.json({ message: err.message || 'Something went wrong' });
	}
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
	try {
		const data = req.body;

		validatePasswordPatchData(data);

		const { password, newPassword } = data;

		if (!password || !newPassword) throw new Error('Invalid input');

		const user = req.user;

		if (!(await user.validatePassword(password))) {
			throw new Error('Invalid credentials');
		}
		user.password = await encryptPassword(newPassword);

		await user.save();
		res.status(200).json({ message: 'Password updated successfully' });
	} catch (err) {
		return res
			.status(500)
			.json({ message: err.message || 'Something went wrong' });
	}
});

module.exports = profileRouter;