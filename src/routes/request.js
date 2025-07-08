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
// 686736d6b6723ff03e4caf0b
requestRouter.post(
	'/request/review/:status/:fromUserId',
	userAuth,
	async (req, res) => {
		try {
			const fromUserId = req.params.fromUserId;
			const toUserId = req.user._id;
			const status = req.params.status;

			const allowedStatus = ['accepted', 'rejected'];
			// validate status
			if (!allowedStatus.includes(status)) throw new Error('Invalid status');
			// check if the toUserId exists
			const fromUser = await User.findById(fromUserId);
			if (!fromUser) throw new Error('Invalid sender');
			// there should be an interested connection request from fromUserId

			const connectionRequest = await ConnectionRequest.findOne({
				fromUserId,
				toUserId,
				status: 'interested',
			});

			if (!connectionRequest) throw new Error('Request does not exist');

			connectionRequest.status = status;

			// validate if toUserId and fromUserId shouldn't be the same (done in schema pre save)
			const data = await connectionRequest.save();

			return res.json({
				message: `${req.user.firstName} ${status} ${fromUser.firstName}`,
				data,
			});
		} catch (err) {
			return res.status(500).json({
				message: err.message || 'Something went wrong',
			});
		}
	}
);

module.exports = requestRouter;
