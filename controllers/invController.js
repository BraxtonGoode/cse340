const e = require("connect-flash");
const invModel = require("../models/inventory-model");
const manModel = require("../models/management-model");
const utilities = require("../utilities/");


// Final section assignment - 
const reviewModel = require("../models/review-model");
const reviewFinal = require('../utilities/review-final');

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
    const inv_id = parseInt(req.params.invId);
    const data = await invModel.getVehicleItemsByInvId(inv_id);
    const card = await utilities.buildVehicleCard(data);

    const nav = await utilities.getNav();
    const vYear = data[0].inv_year;
    const vMake = data[0].inv_make;
    const vModel = data[0].inv_model;

    // Final section assignment - 
    // grabbing models and builind review section
    const reviewData = await reviewModel.getReviewsByInvId(inv_id);
    const reviews = await reviewFinal.buildReviewSection(reviewData)


    res.render("./inventory/detail", {
      title: `${vYear} ${vMake} ${vModel}`,
      nav,
      card,
      reviews,
      inv_id,
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
    const classificationSelect = await utilities.buildClassificationList(classification_id
  );
  let nav = await utilities.getNav();
  if (invResult) {
    req.flash("notice", `Congratulations, You have added a new Inventory item`);
    console.log("added Item");
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
      classificationSelect,
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
//  * Process the edit inventory view
//  * ************************** */
invCont.editInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);

  let nav = await utilities.getNav();
  let itemData = await invModel.getVehicleItemsByInvId(inv_id);

  try {
    const classificationSelect = await utilities.buildClassificationList(
      itemData[0].classification_id
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
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", `Sorry, the insert failed`);
    res.status(501).render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
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

// /* ***************************
//  * Process the delete inventory view
//  * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);

  let nav = await utilities.getNav();
  let itemData = await invModel.getVehicleItemsByInvId(inv_id);
  const item = itemData[0];

  try {
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
    res.render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: item.inv_id,
      inv_make: item.inv_make,
      inv_model: item.inv_model,
      inv_year: item.inv_year,
      inv_price: item.inv_price,
    });
  } catch (error) {
    throw new Error("Could not get any inventory information:", error.message);
  }
};

// /* ***************************
//  * Process delete inventory item
//  * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id);

  // delete inventory item to database
  const deleteResult = await manModel.deleteInvItem(inv_id);
  if (deleteResult) {
    req.flash("notice", `The deletion was successful!`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", `Sorry, the delete failed`);
    res.redirect("/inv/delete/inv_id");
  }
};

// /* ***************************
//  * Process add new Review
//  * ************************** */
invCont.addReview = async function (req, res, next) {
    try {
      const {
        rating,
        review_text,
        inv_id,
        account_id,
      } = req.body;
  
  
      const revisedACC_id = parseInt(account_id);
      const revisedINV_id = parseInt(inv_id);
  
      // Add review to the database
      const revResult = await reviewModel.addReview(
        rating,
        review_text,
        revisedINV_id,
        revisedACC_id,
      );
  
      console.log('Review added:', revResult);
  
      // Get the updated vehicle data and reviews
      const nav = await utilities.getNav();
          const data = await invModel.getVehicleItemsByInvId(revisedINV_id);
          const reviewerData = await reviewModel.getReviewsByInvId(revisedINV_id);
          const card = await utilities.buildVehicleCard(data);
          const reviews = await reviewFinal.buildReviewSection(reviewerData);
          const invName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  
      // Re-render the current page with the updated data (no redirection)
      if (revResult) {

        req.flash(
          "notice",
          `Congratulations, You have added a new Review.`
        );
        res.render("./inventory/detail", {
          errors: null,
          title: invName,
          nav,
          card,
          reviews,
          inv_id,
          review_rating: rating,
          review_text,
        });
        console.log("Review successfully posted");
      } else {    
        req.flash(
          "notice",
          `Sorry, your review failed please try again.`
        );
        res.render("./inventory/detail", {
          errors: null,
          title: invName,
          nav,
          card,
          reviews,
          inv_id,
          review_rating: rating,
          review_text,
        });

      }
    } catch (error) {
      console.error("Error adding review:", error);
      next(error); // Pass the error to the next middleware
    }
  };
  

module.exports = invCont;
