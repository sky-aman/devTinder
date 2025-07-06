const {Schema, model} = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			minLength: 4,
			maxLength: 50,
			required: true,
		},
		lastName: {
			type: String,
			minLength: 4,
			maxLength: 50,
			required: true,
		},
		emailId: {
			type: String,
			trim: true,
			lowercase: true,
			unique: true, // since unique key is available, mongodb will create a index on this field
			required: true,
			maxLength: 50,
			validate: {
				validator: function (email) {
					return validator.isEmail(email);
				},
				message: 'Email is not valid',
			},
		},
		password: {
			type: String,
			required: true,
		},
		age: {
			type: Number,
			min: 18,
		},
		gender: {
			type: String,
			enum: ['male', 'female', 'other'],
		},
		photoUrl: {
			type: String,
			default:
				'https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png',
		},
		about: {
			type: String,
			default: 'This is default about of the user!',
			maxLength: 100,
		},
		skills: {
			type: [String],
			validate: {
				validator: function (arr) {
					return (
						arr.length <= 5 &&
						arr.every(
							(skill) => typeof skill === 'string' && skill.length <= 10
						)
					);
				},
				message:
					'Skills can not be more than 5, and Each skill should have length less than 10',
			},
		},
	},
	{
		timestamps: true,
	}
);

userSchema.methods.getJWT = function () {
	const user = this;

	const token = jwt.sign({ _id: user._id }, 'DevTinderPrivateKey', {
		expiresIn: '10d', // this will expire our token
	});

	return token;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
	const user = this;
	const hashedPassword = user.password;
	const isValidPassword = await bcrypt.compare(passwordByUser, hashedPassword);

	return isValidPassword;
};

module.exports = model("User", userSchema);