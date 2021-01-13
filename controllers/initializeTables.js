const mysqlDb = require("../dbService");

exports.initializeTables = function(req, res, next){
  mysqlDb.query(`CREATE TABLE users (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`, (err, results, fields) => {
        if (err) {
            res.status(400).send({
                "error": err
            })
        } else {
            res.status(200).send({
                "success": "user registered sucessfully"
            });
        }
    });
};
