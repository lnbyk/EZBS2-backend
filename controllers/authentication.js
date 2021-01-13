const mysqlDb = require("../dbService"),
  bcrypt = require("bcrypt"),
  Joi = require("joi"),
  jwt = require("jsonwebtoken");

const saltRounds = 10; // for bcrypt;
// generate token
let generateToken = function (user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
};



/*****************************************************************************/
/**
 * @api {post} /auth/register Register new account
 * @apiName register
 * @apiGroup auth
 *
 * @apiParam {email} email User's unique email.
 * @apiParam {password} password user choose.
 *
 * @apiSuccess {boolean} success code identify if the api call is success.
 * @apiSuccess {JSON} data : {user: {email, password}}.
 */

// register
exports.register = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  // const confirm_email = req.body.confirm_password;

  /*
    if (!adminRouleAuth.authorizeAdminRole(req.body.curAdminRole, "register")){
        console.log(`The Access is Restricted for Admin of ${req.body.curAdminRole}`);
        res.status(400).send({error: `The Access is Restricted for Admin of ${req.body.curAdminRole} is Unable to authorize`});
        return;
    }
    */

  // use joi to check req validation
  console.log(1)
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
    //confirm_password: Joi.any().valid(Joi.ref('password')).required(),
    //role: Joi.string().required(),
    //curAdminRole: Joi.string().required()
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send({
      success: false,
      message: "Register body not valid",
      error: result.error.details[0].message,
    });
    return;
  }

  // encrypt password
  bcrypt.hash(password, saltRounds, (err, hashed) => {
    if (err) {
      res.status(400).send({ error: err.message });
      return;
    }
    let users = {
      email: email,
      password: hashed,
    };

    // check existence
    mysqlDb.query(
      "SELECT * FROM users WHERE email = ?",
      [users.email],
      (err, results) => {
        if (err) {
          res.status(500).send({
            success: false,
            message: "Database query error occurs",
            error: err,
          });
        } else {
          // if user exist return error
          if (results.length > 0) {
            res.status(400).send({
              success: false,
              error: "email is registered",
            });
          } else {
            //  write query
            mysqlDb.query(
              "INSERT INTO users SET ?",
              users,
              (err, results, fields) => {
                if (err) {
                  res.status(500).send({
                    success: false,
                    message: "Error occur when insert user into table",
                    error: err,
                  });
                } else {
                  res.status(200).send({
                    success: true,
                    message: "user registered sucessfully !",
                    data: {
                      user: users,
                    },
                  });
                }
              }
            );
          }
        }
      }
    );
  });
};

// login
exports.login = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  // use joi to check req validation
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send({
      success: false,
      message: "Login body not valid",
      error: result.error.details[0].message,
    });
    return;
  }

  // write query
  let query = "SELECT * FROM users WHERE email = ?";
  mysqlDb.query(query, [email], (err, results, fields) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: "Database query error occurs",
        error: err,
      });
    } else {
      if (results.length > 0) {
        const compare = bcrypt.compareSync(password, results[0].password);
        let user = {
          id: results[0].id,
          email: results[0].email,
          password: results[0].password,
          role: results[0].role,
        };
        if (compare) {
          res.status(200).send({
            success: true,
            message: "Login successfully",
            data: {
              access_token: generateToken(user),
              user: {
                email: email,
              },
            },
          });
        } else {
          res.status(400).send({
            success: false,
            error: "Email or password incorrect",
          });
        }
      } else {
        res.status(400).send({
          success: false,
          error: "Email does not exist",
        });
      }
    }
  });
};
