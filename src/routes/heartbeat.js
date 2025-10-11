const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middleware/user");
const ConnectionRequest = require("../models/connect-request");

const heartBeatRouter = express.Router();

heartBeatRouter.post('/heartbeat', userAuth, async (req, res) => {
  try {
    const user = req.user;
    user.lastSeen = new Date();
    await user.save();
    return res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

heartBeatRouter.get('/lastSeen/:userId', userAuth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const targetUserId = req.params.userId;
    
    const connectionExist = await ConnectionRequest.find({
				$or: [
					{ fromUserId: userId, toUserId: targetUserId, status: "accepted" },
					{ fromUserId: targetUserId, toUserId: userId, status: "accepted" },
				],
			});

    if (!connectionExist) {
      throw new Error("Unknown target");
    }
    
    const user = await User.findById(targetUserId);

    return res.status(200).json({
      lastSeen: user.lastSeen,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = heartBeatRouter;