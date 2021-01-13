const passport = require('passport'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    mysqlDb = require('../dbService')

const dotenv = require('dotenv');
dotenv.config();

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
};

// initialize passport

// setting up login strategy
const JWTLoginStrategy = new JwtStrategy(jwtOptions, function (payload, next) {
    let id = payload.id;
    console.log(`admins id: ${id}`);

    // find user by id
    let sql = `SELECT * FROM admins WHERE id = ${id}`;
    mysqlDb.query(sql, (err, results)=> {
        if (err){
            console.log(err.message);
            return next(err, false);
        }

        if (results.length > 0){
            console.log(results[0]);
            next(null, results[0]);
        }else {
            next(null, false);
        }
    });
});

passport.use(JWTLoginStrategy);

exports.requireAuth = passport.authenticate('jwt', { session: false });
exports.passport =passport; 
