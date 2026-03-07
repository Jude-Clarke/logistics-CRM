const express = require("express");
const router = express.Router();
const carrierController = require("../controllers/carrierController");

router.get("/", carrierController.getCarriers);
router.post("/", carrierController.createCarrier);
router.get("/:id", carrierController.getCarrierById);
router.patch("/:id", carrierController.updateCarrier);
router.delete("/:id", carrierController.deleteCarrier);

module.exports = router;
