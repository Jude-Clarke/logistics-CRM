const express = require("express");
const router = express.Router();
const shipperController = require("../controllers/shipperController");

// CREATE
router.post("/", shipperController.createShipper);

// READ
router.get("/", shipperController.getShippers);
router.get("/:id", shipperController.getShipperById);

// UPDATE
router.patch("/:id", shipperController.updateShipper);

// DELETE
router.delete("/:id", shipperController.deleteShipper);

module.exports = router;
