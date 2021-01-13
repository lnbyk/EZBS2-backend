require("dotenv").config();
const mongoose = require("mongoose");
const config = require("./config/config");

// mongoose.connect(process.env.DATABASE, {useCreateIndex: true, useNewUrlParser:true, useUnifiedTopology: true});

// use to connect local database
mongoose.connect(config.database, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
mongoose.connection
  .on("connected", () => {
    console.log(`Mongoose connection open on ${process.env.DATABASE}`);
  })
  .on("error", (err) => {
    console.log(`Connection error: ${err.message}`);
  });

require("./models/User");

const app = require("./app");

const server = app.listen(3000, () => {
  console.log(`Express is running on port ${server.address().port}`);
});
