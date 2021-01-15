const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var http = require("http").Server(app);

//////////////////////////////
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

/////////////////////////////
// Initializing route groups
/////////////////////////////
const apiRoutes = express.Router();
const authenticationRouter = require("./routes/authentication");



// all authorization routes are in authRoutes
apiRoutes.use("/auth", authenticationRouter);


//all api routes are in apiRoutes
app.use("/api", apiRoutes);


//ROUTEs
// render html page for routes
app.get("/api", function (req, res) {
  res.sendFile(__dirname + "/express/api.html");
});
app.get("/style", function (req, res) {
  res.sendFile(__dirname + "/express/style.css");
});

app.get("/", (req, res) => {
  res.send("we are on home");
});

module.exports = app;
