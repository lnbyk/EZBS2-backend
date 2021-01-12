// import moogoose
const moogoose = require("mongoose");
const md5 = require("blueimp-md5");

// schema
const userSchema = new moogoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  create_time: { type: Number, default: Date.now },
});

// define model
const UserModel = moogoose.model("user", userSchema);

// export model
module.exports = UserModel;