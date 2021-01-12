// import moogoose
const mongoose = require("mongoose"),
  bcrypt = require("bcryptjs");

// schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  create_time: { type: Number, default: Date.now },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

UserSchema.pre("save", function (next) {
  const user = this,
    SALT_FACTOR = 5;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  if (this.password === "*") {
    cb(null, false);
    return;
  }
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

UserSchema.methods.toJson = function () {
  return {
    _id: this._id,
    email: this.email,
    password: this.password,
    // provider: this.provider
  };
};

// define model
const UserModel = mongoose.model("user", UserSchema);

// export model
module.exports = UserModel;
