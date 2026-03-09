const express = require("express");
const router = express.Router();
const shipmentController = require("../controllers/shipmentController");

// CREATE
router.post("/", shipmentController.createShipment);

// READ
router.get("/", shipmentController.getAllShipments);
router.get("/:id", shipmentController.getShipmentDetails);

// UPDATE
router.patch("/:id", shipmentController.updateShipment);

// DELETE
router.delete("/:id", shipmentController.deleteShipment);

module.exports = router;
