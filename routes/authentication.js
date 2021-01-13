const AuthenticationController = require("../controllers/authentication"),
  express = require("express"),
  passportService = require("../security/passport");

// Initializing route groups
const apiRoutes = express.Router(),
  authRoutes = express.Router(),
  otherRoutes = express.Router();
// /api/auth/register
authRoutes.post("/register", AuthenticationController.register);
// /api/auth/login
authRoutes.post("/login", AuthenticationController.login);

otherRoutes.get(
  "/info",
  passportService.requireAuth,
  function (req, res, next) {
    res.json({ user: req.user.toJson() });
  }
);
apiRoutes.use("/stuff", otherRoutes);
module.exports = authRoutes;
