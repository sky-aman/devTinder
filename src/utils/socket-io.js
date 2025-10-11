const { Server } = require("socket.io");
const crypto = require("crypto");
const cookie = require("cookie");
const validateToken = require("./validate-token");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connect-request");

const getSecretRoomId = (userId, targetUserId) => {
	return crypto
		.createHash("sha256")
		.update([userId, targetUserId].sort().join("$"))
		.digest("hex");
};

const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:5173",
			credentials: true,
		},
	});

	io.use(async (socket, next) => {
		const { token } = cookie.parse(socket.handshake.headers.cookie || "");
		if (!token) {
			socket.emit("error_connection", { error_msg: "Token not found" });
			socket.disconnect(true);
			return;
		}

		const user = await validateToken(token);

		if (!user) {
			socket.emit("error_connection", { error_msg: "Invalid token" });
			socket.disconnect(true);
			return;
		}
		socket.user = user;
		next();
	});
	io.on("connection", async (socket) => {
		socket.on("joinChat", async ({ targetUserId }) => {
			const userId = socket.user._id.toString();

			const connectionExist = await ConnectionRequest.find({
				$or: [
					{ fromUserId: userId, toUserId: targetUserId, status: "accepted" },
					{ fromUserId: targetUserId, toUserId: userId, status: "accepted" },
				],
			});

			if (!connectionExist) {
				console.warn(`Unauthorized chat join attempt by ${userId} → ${targetUserId}`);
				socket.emit("error", { message: "You are not connected with this user." });
				return;
			}

			const firstName = socket.user.firstName;
			const roomId = getSecretRoomId(userId, targetUserId);
			console.log(`${firstName}: ${userId} joined the room: ${roomId}`);
			socket.join(roomId);
		});

		socket.on("sendMessage", async ({ targetUserId, text }) => {
			const userId = socket.user._id.toString();
			const firstName = socket.user.firstName;
			const roomId = getSecretRoomId(userId, targetUserId);
			try {
				let chat = await Chat.findOne({
					participants: {
						$all: [userId, targetUserId],
					},
				});
				if (!chat) {
					chat = new Chat({
						participants: [userId, targetUserId],
						messages: [],
					});
				}
				chat.messages.push({
					senderId: userId,
					text,
				});

				await chat.save();
			} catch (err) {
				console.log(err);
			}
			io.to(roomId).emit("messageReceived", {
				senderId: {
					firstName,
					_id: userId,
				},
				updatedAt: new Date(),
				text,
			});
		});

		socket.on("disconnectChat", () => {
			socket.disconnect(true);
		});
	});
};

module.exports = initializeSocket;
