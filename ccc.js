const express = require("express");
const app = express();
const cors = require("cors"); // not sure if we need, if it is uncommon and npm install cors
//const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config();

const dbService = require("./dbService");
const passportService = require("./security/passport");

app.use(passportService.passport.initialize());

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// static files

/*
app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 2 * 1024 * 1024 * 1024, //2MB max file(s) size
    },
  })
);

*/

const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use("/static", cors(corsOptions), express.static("uploads"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
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

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  console.log(
    `URL: ${
      process.env.PORT ? "http://localhost:3000/" : "http://localhost:3000/"
    }`
  );
});

// serving static files
app.use(express.static("images"));

/*******************************************/
// Initializing route group
/*******************************************/
const apiRoutes = express.Router();
const authenticationRouter = require("./routes/authentication");
const initializeTableRoutes = require("./routes/initializeTables");


// all authorization routes are in authRoutes
apiRoutes.use("/auth", authenticationRouter);
apiRoutes.use("/",initializeTableRoutes);
// all api routes are in apiRoutes
app.use("/api", apiRoutes);

//ROUTEs
// render html page for routes
app.get("/api", function (req, res) {
  res.sendFile(__dirname + "/express/api.html");
});

app.get("/", (req, res) => {
  res.send("we are on home");
});

module.exports = app;
