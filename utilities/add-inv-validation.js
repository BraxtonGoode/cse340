const manModel = require("../models/management-model");
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Add Class Validation Rules
 * ********************************* */
validate.addInvRules = () => {
  return [
    // valid classification id is required
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isInt()
      .withMessage("A Valid classification is required."),


    // valid inventory make is required
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("A Valid inventory make is required."),

    // valid inventory model is required
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("A Valid inventory model is required."),

    // valid inventory year is required
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .isLength({ min: 4 })
      .withMessage("A Valid inventory year is required."),

    // valid inventory description is required
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("A Valid inventory description is required."),

    // valid inventory image is required
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("A Valid inventory image is required."),

    // valid inventory thumbnail is required
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("A Valid inventory thumbnail is required."),

    // valid inventory price is required
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .isLength({ min: 1 })
      .withMessage("A Valid inventory price is required."),

    // valid inventory miles is required
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .isLength({ min: 1 })
      .withMessage("A Valid inventory miles is required."),
    // valid inventory color is required
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("A Valid inventory color is required."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let classList = await utilities.buildClassificationList(
        classification_id
      );
    let nav = await utilities.getNav();
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      classList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

module.exports = validate;
