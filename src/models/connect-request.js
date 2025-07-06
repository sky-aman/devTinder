const mongoose = require('mongoose');

const ConnectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Types.ObjectId
  },
  toUserId: {
    type: mongoose.Types.ObjectId,
  },
  status: {
    type: String,
    enum: {
      values: ['interested', 'ignored', 'accepted', 'rejected'],
      message: '{VALUE} is not supported'
    }
  }
});

// compound index
ConnectionRequestSchema.index({
	fromUserId: 1,
	toUserId: 1,
});

ConnectionRequestSchema.pre("save", function (next) {
  const connectionData = this;

  if(connectionData.fromUserId.equals(connectionData.toUserId))
    throw new Error("Sender and receiver cannot be the same");

  next();
});

const ConnectionRequest = mongoose.model("ConnectionRequest", ConnectionRequestSchema);

module.exports = ConnectionRequest;