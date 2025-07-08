const express = require('express');
const { userAuth } = require('../middleware/user');
const ConnectionRequest = require('../models/connect-request');

const userRouter = express.Router();

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
	const user = req.user;

	try {
		const connectionRequests = await ConnectionRequest.find({
			toUserId: user._id,
			status: 'interested',
		}).populate('fromUserId', ['firstName', 'lastName', 'photoUrl', 'about']);

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
    .populate('fromUserId', ['firstName', 'lastName', 'photoUrl', 'age', 'skills', 'about'])
    .populate('toUserId', ['firstName', 'lastName', 'photoUrl', 'age', 'skills', 'about']);

    const filteredConnections = connections.map(connection => {
      if(connection.fromUserId._id.equals(userId)) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    })

    return res.json({
      data: filteredConnections
    })
	} catch (err) {
		return res.status(500).json({
			message: err.message,
		});
	}
});

module.exports = userRouter;
