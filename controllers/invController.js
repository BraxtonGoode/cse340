const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

// /* ***************************
//  *  Build inventory for vehicle view
//  * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getVehicleItemsByInvId(inv_id);
    const card = await utilities.buildVehicleCard(data);
    const nav = await utilities.getNav();
    const vYear = data[0].inv_year
    const vMake = data[0].inv_make
    const vModel = data[0].inv_model
    res.render("inventory/item", {
      title: `${vYear} ${vMake} ${vModel}`,
      nav,
      card,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    next(error);  // Pass the error to the next middleware (e.g., an error handler)
  }
};

module.exports = invCont