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

module.exports = {
  validateSignupData
};