const express = require('express');
const { userAuth } = require('../middleware/user');
const User = require('../models/user');
const ConnectionRequest = require('../models/connect-request');

const requestRouter = express.Router();

// feed API get feed
requestRouter.post(
	'/request/send/:status/:toUserId',
	userAuth,
	async (req, res) => {
		try {
			const fromUserId = req.user._id;
			const toUserId = req.params.toUserId;
			const status = req.params.status;

			// validate if user is not sending request to himself (in mongoose schmea using 'pre' feature)

			// valid status, only allowed is interested, ignored,
			const allowedStatus = ['interested', 'ignored'];
			if (!allowedStatus.includes(status)) throw new Error('Invalid status');

			// validate if valid toUserId
			const toUser = await User.findById(toUserId);
			if (!toUser) throw new Error('Invalid recepient');

			// user shouldn't be able to send request more than once
			// send shouldn't abe to send request if he have a request from same toUserId
			const similarRequest = await ConnectionRequest.findOne({
				$or: [
					{ toUserId, fromUserId },
					{ toUserId: fromUserId, fromUserId: toUserId },
				],
			});

			if (similarRequest) {
				throw new Error('Similar request already exists');
			}

			const newConnection = new ConnectionRequest({
				fromUserId,
				toUserId,
				status,
			});

			const requestData = await newConnection.save();

			return res.send({
				message:
					status === 'interested'
						? 'Connection request sent.'
						: 'Connection ignored',
				data: requestData,
			});
		} catch (err) {
			return res.status(500).send({
				message: err.message || 'Something went wrong',
			});
		}
	}
);

module.exports = requestRouter;
