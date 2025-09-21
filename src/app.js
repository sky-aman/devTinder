const { createServer } = require("http");
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./config/database');
const User = require('./models/user');

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const { PORT } = require('./config/config');
const initializeSocket = require("./utils/socket-io");
const chatRouter = require("./routes/chat");
// require("./utils/cron-job");

const app = express();

//  handling cors
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);
// express middleware to parse request body from readable stream to object
app.use(express.json());
// cookie parser for parsing cookies
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', chatRouter);

app.get('/user', async (req, res) => {
	try {
		const user = await User.findOne({ emailId: req.body.emailId });

		if (!user) {
			return res.status(404).send('User not found');
		}

		// const user = await User.find({ emailId: req.body.emailId });

		// if (user.length === 0) {
		// 	return res.status(404).send('User not found');
		// }
		return res.send(user);
	} catch (err) {
		return res.status(500).send('Something went wrong');
	}
});

app.use('/', (err, req, res, next) => {
	return res.status(500).send(err.message || 'Something went wrong');
});

const server = createServer(app);
initializeSocket(server);

connectDB()
	.then(() => {
		console.log('Database is connected');

		server.listen(PORT, () => {
			console.log('server is listening on port 7777');
		});
	})
	.catch(() => {
		console.log('Error connecting to the database');
	});
