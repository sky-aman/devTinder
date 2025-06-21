const express = require('express');

const { authMiddleware } = require('./middleware/auth');
const { userMiddleware } = require('./middleware/user');

const app = express();

app.use('/admin', authMiddleware);

app.use('/admin/getAllData', (req, res, next) => {
	res.status(200).send('Send all data');
});

app.use('/admin/deleteUser', (req, res, next) => {
	res.status(200).send('Deleted a user');
});

app.use('/user/login', (req, res) => {
	res.status(200).send('login user');
});

app.use('/user/getData', userMiddleware, (req, res) => {
	res.status(200).send('User get all data');
});

app.use('/', (error, req, res, next) => {
	res.status(500).send('Something went wrong');
});


app.listen(7777, () => {
  console.log("server is listening on port 7777");
});