const express = require("express");
const router = express.Router();
const shipmentController = require("../controllers/shipmentController");

router.get("/", shipmentController.getAllShipments);
router.post("/", shipmentController.createShipment);
router.get("/:id", shipmentController.getShipmentDetails);
router.patch("/:id", shipmentController.updateShipment);
router.delete("/:id", shipmentController.deleteShipment);

module.exports = router;
