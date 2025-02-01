const manModel = require("../models/management-model")
const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

  
/*  **********************************
  *  Add Class Validation Rules
  * ********************************* */
validate.addClassRules = () => {
    return [
      // valid classification name is required and cannot already exist in the database
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 1 })
        .withMessage("A Valid classification is required.")
        .custom(async (classification_name) => {
          const classExists = await manModel.checkExistingClassName(classification_name)
          if (classExists){
            throw new Error("Classification name exists. Please try a new Classification or check one already in use!")
          }
        }),

    ]
  }
  
  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }

  module.exports = validate