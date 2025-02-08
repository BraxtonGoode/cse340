// Required statements
const pool = require("../database/");

// model object for holding functions
const manModel = {};

/* *****************************
 *   Checking for existing Classification name
 * *************************** */
manModel.checkExistingClassName = async (classification_name) => {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1";
    const clasName = await pool.query(sql, [classification_name]);
    return clasName.rowCount;
  } catch (error) {
    return error.message;
  }
};

/* *****************************
 *   Adding new Classification
 * *************************** */
manModel.addClassName = async (classification_name) => {
  try {
    const sql =
      "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
};

/* *****************************
 *   Adding new Inventory item
 * *************************** */
manModel.addInvItems = async (
  classification_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  invmiles,
  inv_color
) => {
  try {
    const sql =
      "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, c.classification_id FROM classification c WHERE c.classification_id = $10 RETURNING *";
    return await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      invmiles,
      inv_color,
      classification_id,
    ]);
  } catch (error) {
    return error.message;
  }
};

/* *****************************
 *   Updating Inventory item
 * *************************** */
manModel.updateInventory = async (
  inv_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) => {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
};

/* *****************************
 *   delete inventory item
 * *************************** */
manModel.deleteInvItem = async (
  inv_id
) => {
  try {
    const sql =
      "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [
      inv_id
    ]);
    return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
};

module.exports = manModel;
