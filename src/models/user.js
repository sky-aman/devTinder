const {Schema, model} = require("mongoose");
const validator = require("validator");

const userSchema = new Schema({
  firstName: {
    type: String,
    minLength: 4,
    maxLength: 50,
    required: true
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
    unique: true,
    required: true,
    maxLength: 50,
    validate: {
      validator: function (email) {
        return validator.isEmail(email);
      },
      message: "Email is not valid"
    }
  },
  password: {
    type: String,
    required: true
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
    default: "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png"
  },
  about: {
    type: String,
    default: "This is default about of the user!",
    maxLength: 100
  },
  skills: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.length <= 5 && arr.every(skill => typeof skill === 'string' && skill.length <= 10);
      },
      message: "Skills can not be more than 5, and Each skill should have length less than 10"
    }
  }
}, {
  timestamps: true
});

module.exports = model("User", userSchema);