const InitializeTables = require("../controllers/initializeTables"),
  express = require("express");

const initializeTableRoutes = express.Router();

// /api/initializeTableRouter
initializeTableRoutes.post(
  "/initializeTableRouter",
  InitializeTables.initializeTables
);

module.exports = initializeTableRoutes;
