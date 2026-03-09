const express = require("express");
const router = express.Router();
const carrierController = require("../controllers/carrierController");

// CREATE
router.post("/", carrierController.createCarrier);

// READ
router.get("/", carrierController.getCarriers);
router.get("/:id", carrierController.getCarrierById);
router.get(
  "/:id/shipments",
  carrierController.getCarrierWithShipmentsSummaries,
);

// UPDATE
router.patch("/:id", carrierController.updateCarrier);

// DELETE
router.delete("/:id", carrierController.deleteCarrier);

module.exports = router;
