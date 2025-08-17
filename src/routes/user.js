const express = require('express');
const { userAuth } = require('../middleware/user');
const ConnectionRequest = require('../models/connect-request');
const User = require('../models/user');

const userRouter = express.Router();

const SAFE_DATA = [
	'firstName',
	'lastName',
	'photoUrl',
	'about',
	'age',
	'gender',
];

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
	const user = req.user;

	try {
		const connectionRequests = await ConnectionRequest.find({
			toUserId: user._id,
			status: 'interested',
		}).populate('fromUserId', SAFE_DATA);

		const filteredRequests = connectionRequests.map((request) => ({
			_id: request._id,
			fromUser: request.fromUserId,
		}));

		return res.json({
			data: filteredRequests,
		});
	} catch (err) {
		return res.status(500).json({
			message: err.message,
		});
	}
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
	try {
		const userId = req.user._id;
		const connections = await ConnectionRequest.find({
			status: 'accepted',
			$or: [{ fromUserId: userId }, { toUserId: userId }],
		})
			.populate('fromUserId', [
				'firstName',
				'lastName',
				'photoUrl',
				'age',
				'skills',
				'about',
			])
			.populate('toUserId', [
				'firstName',
				'lastName',
				'photoUrl',
				'age',
				'skills',
				'about',
			]);

		const filteredConnections = connections.map((connection) => {
			if (connection.fromUserId._id.equals(userId)) {
				return connection.toUserId;
			}
			return connection.fromUserId;
		});

		return res.json({
			data: filteredConnections,
		});
	} catch (err) {
		return res.status(500).json({
			message: err.message,
		});
	}
});

userRouter.get('/user/feed', userAuth, async (req, res) => {
	try {
		// ?page=1&limit=10
		let limit = parseInt(req.query.limit) || 10;
		// limit constraint
		limit = limit <= 50 ? limit : 50;
		const page = parseInt(req.query.page) || 1;

		const skip = (page - 1) * limit;

		const userId = req.user._id;

		const connectionRequests = await ConnectionRequest.find({
			$or: [{ fromUserId: userId }, { toUserId: userId }],
		}).select(['fromUserId', 'toUserId']);

		const uniqueConnectionIds = new Set();

		connectionRequests.forEach((connection) => {
			uniqueConnectionIds.add(connection.fromUserId);
			uniqueConnectionIds.add(connection.toUserId);
		});

		// add current user to the list
		uniqueConnectionIds.add(userId);

		const feedUsers = await User.find({
			_id: {
				$nin: [...Array.from(uniqueConnectionIds)],
			},
		})
			.skip(skip)
			.limit(limit)
			.select(SAFE_DATA);

		return res.json({
			data: feedUsers,
		});
	} catch (err) {
		return res.status(500).send({
			message: err.message,
		});
	}
});

module.exports = userRouter;