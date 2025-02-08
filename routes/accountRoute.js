// Needed resources
const express = require("express");
const router = new express.Router();
const accController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities");

// Route to build Login View
router.get("/login", utilities.handleErrors(accController.buildLogin));
// Route to build Registration view
router.get("/register", utilities.handleErrors(accController.buildRegister));
// Route to build account View
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildAccountManagement))
// Route to build ccount update View
router.get("/edit/:account_id", utilities.handleErrors(accController.buildUpdateAcc));
// Route to logout
router.get("/logout", utilities.handleErrors(accController.logout))

// Route to POST registration information to database
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount)
);
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accController.accountLogin)
);

// Process the update Account info
router.post(
  "/update_Acc",
  regValidate.updateAccRules(),
  regValidate.checkUpdateAccData,
  utilities.handleErrors(accController.processUpdateAcc)
)

// Process the change password
router.post(
  "/newPass",
  regValidate.newPassRules(),
  regValidate.newPassData,
  utilities.handleErrors(accController.processNewPass)
)
module.exports = router;
