const validate = require('validator');

function validateSignupData (data) {

  if(!data.firstName || !data.lastName || !data.emailId || !data.password) {
    throw new Error("Not valid data");
  }

  if(!validate.isLength(data.firstName, {
    min: 2,
    max: 50,
  })) {
    throw new Error("Not valid firstName length");
  }

  if(!validate.isLength(data.lastName, {
    min: 2,
    max: 50,
  })) {
    throw new Error("Not valid lastName length");
  }

  if(!validate.isEmail(data.emailId)) {
    throw new Error("Not a valid email");
  }

  if (!validate.isStrongPassword(data.password)) {
    throw new Error("Not a strong password");
  }

}

function validateProfilePatchData(data) {
	const ALLOWED_FIELDS = [
		'firstName',
		'lastName',
		'age',
		'gender',
		'photoUrl',
		'about',
		'skills',
	];

	if (Object.keys(data).length === 0) throw new Error('No data is provided');

	const isAllowedUpdates = Object.keys(data).every((item) =>
		ALLOWED_FIELDS.includes(item)
	);

	if (!isAllowedUpdates) {
		throw new Error('Update is not allowed');
	}

	if (data.age && (isNaN(data.age) || data.age < 18))
		throw new Error('Age is not correct');

	if (
		data.gender &&
		(!validate.isAlpha(data.gender) ||
			!validate.isLength(data.gender, {
				min: 2,
				max: 10,
			}))
	)
		throw new Error('Gender is not correct');

	if (data.photoUrl && !validate.isURL(data.photoUrl))
		throw new Error('Photo URL is not correct');

	if (
		data.about &&
		!validate.isLength(data.about, {
			min: 5,
			max: 50,
		})
	)
		throw new Error('About length is not correct');

	if (
		data.skills &&
		(!Array.isArray(data.skills) ||
			!data.skills.every((skill) =>
				validate.isLength(skill, { min: 2, max: 10 })
			))
	)
		throw new Error('Invalid skills');
}

function validatePasswordPatchData(data) {
	if (!data.password || !data.newPassword) throw new Error('Invalid input');

	if (!validate.isStrongPassword(data.newPassword))
		throw new Error('Not strong password');

	if (data.password === data.newPassword)
		throw new Error('New password cannot be same as old password');
}

module.exports = {
	validateSignupData,
	validateProfilePatchData,
	validatePasswordPatchData,
};