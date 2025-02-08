const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}
/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

/* *****************************
 * Return account data using account_id
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id,account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1 ",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching id found");
  }
}

/* *****************************
 *   update Account Information
 * *************************** */
async function updateAccInfo(account_firstname, account_lastname, account_email,account_id) {
  try {
    const sql =
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3  WHERE account_id = $4 ";

    // Query to update the password
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    console.log(result.account_firstname)
    return result.rows;  
  } catch (error) {
    return error.message; // Handle errors appropriately
  }
}

/* *****************************
 *   update New password
 * *************************** */
async function updateNewPassword(hashedPassword, account_id) {
  // Convert account_id to an int
  const account_id_int = parseInt(account_id, 10);

  // Ensure account_id is valid
  if (isNaN(account_id_int)) {
    throw new Error('Invalid account ID');
  }

  const sql = `
    UPDATE account
    SET account_password = $1
    WHERE account_id = $2
    RETURNING *`;

  try {
    const result = await pool.query(sql, [hashedPassword, account_id_int]);
    if (result.rowCount > 0) {
      return result.rows[0]; // Successfully updated
    } else {
      return null; // No rows updated
    }
  } catch (error) {
    return console.error('Error updating password:', error);
  }
}


module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateNewPassword, updateAccInfo };
