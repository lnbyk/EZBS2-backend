const payment = require("../controllers/payment"),
  express = require("express");

const paymentRoutes = express.Router();

// /api/checkout
paymentRoutes.post("/checkout", payment.checkout);

module.exports = paymentRoutes;
