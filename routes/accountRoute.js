// Needed resources
const express = require("express");
const router = new express.Router()
const accController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const utilities = require("../utilities");

// Route to build Login View 
router.get("/login", utilities.handleErrors(accController.buildLogin))
// Route to build Registration view
router.get("/register", utilities.handleErrors(accController.buildRegister))


// Route to POST registration information to database
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount)
  )
// router.post(
//     "/login",
//     regValidate.registationRules(),
//     regValidate.checkLogData,
//     (req, res) => {
//         res.status(200).send('login process')
//       }
// )
module.exports = router;