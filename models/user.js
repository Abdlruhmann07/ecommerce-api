const bcrypt = require("bcryptjs");
const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Name field is required"],
    trim: true,
    maxlength: [30, "Name must be less than or equal to 30 Characters"],
    minlength: [2, "Name must be greater than or equal to 2 Characters"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Email field is required"],
    validate: {
      validator: (email) => {
        return /\S+@\S+\.\S+/.test(email);
      },
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: [true, "Password field is required"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false,
  },
  dateOfBirth: {
    type: Date,
  },
  sex: {
    type: String,
    enum: ["Male", "Female", "prefer not to say"],
  },
  phoneNumber: {
    type: String,
  },
  photo: String,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparedHashedPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = model("User", userSchema);

module.exports = User;
