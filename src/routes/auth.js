const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const { validateSignupData } = require('../utils/validation');
const encryptPassword = require('../utils/encrypt-password');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
	try {
		// validate signup data
		validateSignupData(req.body);

		// has password
		const { firstName, lastName, emailId, password } = req.body;
		const hashedPassword = await encryptPassword(password);

		const user = new User({
			firstName,
			lastName,
			emailId,
			password: hashedPassword,
		});
		const savedUser = await user.save();

		const token = user.getJWT();

		// this will expire on user browser
		res.cookie('token', token, {
			expires: new Date(Date.now() + 7 * 24 * 3600000),
			httpOnly: true,
		});

		res.send({ data: savedUser, message: 'User created successfully' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) throw new Error('Invalid credentials');

    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) throw new Error('Invalid credentials');

    const token = user.getJWT();

    // this will expire on user browser
    res.cookie('token', token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000),
      httpOnly: true,
    });

    return res.status(200).json({ data: user, message: 'User Login success' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

authRouter.post('/logout', async (req, res) => {
	return res
		.cookie('token', null, {
			expires: new Date(Date.now()),
		})
		.send('User logged out');
});

module.exports = authRouter;