const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash user password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare user password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Model
const User = mongoose.model("User", userSchema);

module.exports = User;
