const express = require("express");
const User = require('../models/user');
const { userAuth } = require('../middleware/user');

const requestRouter = express.Router();

// feed API get feed
requestRouter.get('/feed', userAuth, async (req, res) => {
	const users = await User.find();
	res.send(users);
});

module.exports = requestRouter;