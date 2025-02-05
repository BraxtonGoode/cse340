const e = require("connect-flash");
const invModel = require("../models/inventory-model");
const manModel = require("../models/management-model");

const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );

    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();

    // Check if data is empty or doesn't have any entries
    if (data && data.length > 0) {
      const className = data[0].classification_name;

      res.render("./inventory/classification", {
        title: className + " Vehicles",
        nav,
        grid,
      });
    } else {
      // Handle the case where no data was returned
      res.status(404).render("./errors/error", {
        title: "Missing inventory for classification",
        nav,
        message: "No vehicles found for this classification.",
      });
    }
  } catch (error) {
    console.error("Error building Classification:", error);
    next(error); // Pass the error to the next middleware (e.g., an errorhandler)
  }
};

// /* ***************************
//  *  Build inventory for vehicle view
//  * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getVehicleItemsByInvId(inv_id);
    const card = await utilities.buildVehicleCard(data);
    const nav = await utilities.getNav();
    const vYear = data[0].inv_year;
    const vMake = data[0].inv_make;
    const vModel = data[0].inv_model;
    res.render("./inventory/detail", {
      title: `${vYear} ${vMake} ${vModel}`,
      nav,
      card,
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    next(error); // Pass the error to the next middleware (e.g., an errorhandler)
  }
};

// /* ***************************
//  *  Build management view
//  * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
      classificationSelect,
    });
  } catch (error) {
    console.error("Error building management view:", error);
    next(error); // Pass the error to the next middleware (e.g., an errorhandler)
  }
};

// /* ***************************
//  *  Build Add new Classification view
//  * ************************** */
invCont.buildAddClass = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

// /* ***************************
//  * Process add new Classification
//  * ************************** */
invCont.addClassification = async function (req, res, next) {
  // gets classification name from body
  const { classification_name } = req.body;

  // adds class name to database
  const classResult = await manModel.addClassName(classification_name);
  let nav = await utilities.getNav();
  if (classResult) {
    req.flash("notice", `Congratulations, You have added a new class`);
    console.log("added class");
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
      classification_name,
    });
    console.log("posted");
  } else {
    req.flash("notice", "Sorry, adding the new classification failed.");
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name,
    });
  }
};

// /* ***************************
//  *  Build Add new Inventory view
//  * ************************** */
invCont.buildAddInv = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      errors: null,
      classificationSelect,
    });
  } catch (error) {
    console.error("Error Creating new inventory View: ", error);
    next(error);
  }
};

// /* ***************************
//  * Process add new Inventory
//  * ************************** */
invCont.addInventory = async function (req, res, next) {
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

  // adds inventory item to database
  const invResult = await manModel.addInvItems(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );

  let nav = await utilities.getNav();
  if (invResult) {
    req.flash("notice", `Congratulations, You have added a new Inventory item`);
    console.log("added Item");
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
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
    console.log("posted");
  } else {
    req.flash("notice", "Sorry, adding the new inventory item failed.");
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      errors: null,
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
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No Data returned"));
  }
};

// /* ***************************
//  * Process the edit inventory
//  * ************************** */
invCont.editInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);

  let nav = await utilities.getNav();
  let itemData = await invModel.getVehicleItemsByInvId(inv_id);

  try {
    const classificationSelect = await utilities.buildClassificationList(
      itemData.classification_id
    );
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_description: itemData[0].inv_description,
      inv_image: itemData[0].inv_image,
      inv_thumbnail: itemData[0].inv_thumbnail,
      inv_price: itemData[0].inv_price,
      inv_miles: itemData[0].inv_miles,
      inv_color: itemData[0].inv_color,
      classification_id: itemData[0].classification_id,
    });
  } catch (error) {
    throw new Error("Could not get any inventory information:", error.message);
  }
};

// /* ***************************
//  * Process update Inventory
//  * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
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
    classification_id,
  } = req.body;

  // updates inventory item to database
  const updateResult = await manModel.updateInventory(
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
  );
  if (updateResult) {
    const itemName = updateResult.inv_make + ' ' + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated`);
    res.redirect("/inv/")

  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", `Sorry, the insert failed`);
    res.status(501).render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect : classificationSelect,
      errors: null,
      inv_id,
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

  }

};

module.exports = invCont;
