const express = require("express");
const { userAuth } = require('../middleware/user');
const Chat = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get('/chat/:targetUserId', userAuth, async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const targetUserId = req.params.targetUserId;
        const chatMessage = await Chat.findOne({
            participants: {
                $all : [userId, targetUserId]
            }
        }).populate('messages.senderId', ['firstName']);
        let messages = [];
        if(chatMessage) {
            messages = chatMessage.messages;
        }
        return res.status(200).json({data: messages});
    } catch (err) {
        return res.status(500).json({
			message: err.message,
		});
    }
});

module.exports = chatRouter;