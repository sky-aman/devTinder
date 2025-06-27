const express = require('express');
const bcrypt = require('bcrypt');
const { validateSignupData } = require('./utils/validation');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();

// express middleware to parse request body from readable stream to object
app.use(express.json());

app.post('/signup', async (req, res) => {
	try {
		// validate signup data
		validateSignupData(req.body);

		// has password
		const { firstName, lastName, emailId, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = new User({
			firstName,
			lastName,
			emailId,
			password: hashedPassword,
		});
		await user.save();
		res.send('User created successfully');
	} catch (err) {
		res.status(500).send(err.message);
	}
});

// feed API get feed
app.get('/feed', async (req, res) => {
	const users = await User.find();
	res.send(users);
});

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

app.patch('/user/:id', async (req, res) => {
	try {
		const userId = req.params?.id;
		const data = req.body;

		const ALLOWED_FIELDS = ['age', 'gender', 'photoUrl', 'about', 'skills'];

		const isAllowedUpdates = Object.keys(data).every((item) =>
			ALLOWED_FIELDS.includes(item)
		);

		if (!isAllowedUpdates) {
			throw new Error('Update is not allowed');
		}
		const result = await User.findByIdAndUpdate(userId, data, {
			runValidators: true,
		});

		// if (!result) {
		// 	throw new Error('User not found');
		// }

		return res.send('User updated successfully');
	} catch (err) {
		return res.status(500).send('Something went wrong:' + err.message);
	}
});

connectDB()
	.then(() => {
		console.log('Database is connected');

		app.listen(7777, () => {
			console.log('server is listening on port 7777');
		});
	})
	.catch(() => {
		console.log('Error connecting to the database');
	});