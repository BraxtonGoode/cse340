// Needed resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/add-inv-validation");
const manValidate = require("../utilities/add-class-validation");
const utilities = require("../utilities");

const manModel = require("../models/management-model");

/* ***********************
 * Get Statements
 *************************/
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build view by inventory Make
router.get("/detail/:invId", invController.buildByInvId);
// Route to build View for creating new classification
router.get("/", invController.buildManagement);
// Route to build View for adding new classification
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClass)
);
// Route to build View for adding new inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInv));
// Route to get inventory
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);
// Route to edit the inventory item in a view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventory)
);

/* ***********************
 * Post Statements
 *************************/
// Route to post new Classification
router.post(
  "/add-classification",
  manValidate.addClassRules(),
  manValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
);
// Route to post new Inventory item
router.post(
  "/add-inventory",
  invValidate.addInvRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
);
// Route to post updates of inventory
router.post("/update/", 
  invValidate.updateInvRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory));
module.exports = router;
