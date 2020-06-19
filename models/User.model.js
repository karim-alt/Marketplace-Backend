const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "First name is required"],
      max: 50
    },
    email: {
      type: String,
      trim: true,
      default: null
    },
    password: {
      type: String,
      min: 8,
      required: [true, "Password is required"],
      max: 64
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"]
    },
    type: {
      type: String,
      required: [true, "Type is required"]
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    country: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Hash password before save
UserSchema.pre("save", function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = password => {
  return bcrypt.compareSync(password, this.password);
};

module.exports = User = mongoose.model("users", UserSchema);
