// Needed resources
const express = require("express");
const router = new express.Router()
const invController = require("../controllers/invController")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build view by inventory Make
router.get("/:classificationId/:invId", invController.buildByInvId);
module.exports = router;