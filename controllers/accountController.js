// required items
const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;
  // hash the pasword before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automaticaly)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations you\'re registered ${account_firstname}. Please Login in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, The registration failed.");
    res.status(501).render("account/register", {
      title: "Registartion",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver updateAcc view
 * *************************************** */
async function buildUpdateAcc(req, res, next) {
  let nav = await utilities.getNav();
  let account_id = parseInt(req.params.account_id)
  let Data = await accountModel.getAccountById(account_id)
  console.log(Data)
  res.render("account/edit", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: account_id,
    account_firstname: Data.account_firstname,
    account_lastname: Data.account_lastname,
    account_email: Data.account_email,
    account_password: Data.account_password,
  });
}

// /* ****************************************
//  *  Process Update Account
//  * *************************************** */
async function processUpdateAcc(req, res, next) {
  try {
    let nav = await utilities.getNav()
  
  const 
  { 
    account_firstname, 
    account_lastname, 
    account_email,
    account_id 
  } = req.body
  
  const accResult = await accountModel.updateAccInfo(account_firstname, account_lastname, account_email, account_id)
  if (accResult) {
    res.clearCookie("jwt")
    // get account information
    const accountData = await accountModel.getAccountById(account_id)

    // use .env secret key to sign in, expires with in one hour
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

    req.flash("success", `Congratulations, ${accountData.account_firstname} you\'ve succesfully updated your account info.`)
    res.status(201).render("account/accountManagement", {
      title: "Account Manager",
      nav,
      errors:null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  } else {
    // error flash message
    req.flash("error", "Sorry, the update failed.")
    res.status(501).render("account/edit", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
      account_id: account_id,
    })
  }
  } catch (error) {
     return error.message;
  }
};

// /* ****************************************
//  *  Process New Password
//  * *************************************** */
async function processNewPass(req, res, next) {
  try {
    let nav = await utilities.getNav();

    const { 
      account_firstname, 
      account_lastname, 
      account_email, 
      account_password, 
      account_id 
    } = req.body;

    let hashedPassword;
    
    // Hashing password for new password
    try {
      hashedPassword = await bcrypt.hash(account_password, 10);
    } catch (error) {
      req.flash(
        "notice",
        "Sorry, there was an error hashing your password."
      );
      return res.status(500).render("account/edit", {
        title: "Edit Account",
        nav,
        errors: null,
      });
    }

    // Update new password in the database
    const newPassResult = await accountModel.updateNewPassword(hashedPassword, account_id);


    if (newPassResult) {
      console.log("Password update successful");

      res.clearCookie("jwt");
      const accountData = await accountModel.getAccountById(account_id);

      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

      // Flash success message and render the account management page
      req.flash("success", `Congratulations, ${accountData.account_firstname} you've successfully changed your password.`);
      return res.status(201).render("account/accountManagement", {
        title: "Account Manager",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
      });
    } else {
      // Flash error message if update fails
      req.flash("error", "Sorry, the password change failed.");
      return res.status(501).render("account/edit", {
        title: "Edit Account",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
      });
    }
  } catch (error) {
    console.error('Error during password update process:', error);
    return res.status(500).send('Internal Server Error');
  }
}

// /* ****************************************
//  *  Process Logout feature
//  * *************************************** */
async function logout(req, res, next) {
  try {
    // Clear JWT cookie
    res.clearCookie('jwt');

    // You have logged out
    req.flash('success', 'You have successfully logged out.');
    res.redirect('/');

  } catch (error) {
    req.flash('error', 'There was an issue logging you out.');
    res.redirect('/account/login');
  }
  return
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildUpdateAcc,
  processUpdateAcc,
  processNewPass,
  logout
};
