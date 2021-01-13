const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
/*******************************************/
// Database config
const db_config = {
  host: process.env.HOST, //'127.0.0.1',//process.env.HOST,
  user: "root", //'root',//"",
  //password: process.env.PASSWORD, //'12345',//process.env.PASSWORD,
  password: "13841396198Abc.", //'12345',//process.env.PASSWORD,
  database: "test", //'cacc_test',//process.env.DATABASE,
};

var db_connection;
function handleDisconnect() {
  console.log("Connecting to mysql...");
  db_connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  db_connection.connect(function (err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to process asynchronous requests in the meantime.
    console.log("Mysql connected...");
  });
  db_connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}
console.log("Creating mysql pool...");
var pool = mysql.createPool(db_config);

/*******************************************/

module.exports = pool;

