// Needed resources
const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");
const utilities = require("../utilities");



// Route to cause 500 type error
router.get("/", utilities.handleErrors(errorController.causeError));


module.exports = router;