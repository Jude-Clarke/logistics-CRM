const express = require("express");
const router = express.Router();
const shipperController = require("../controllers/shipperController");

router.get("/", shipperController.getShippers);
router.post("/", shipperController.createShipper);
router.get("/:id", shipperController.getShipperById);
router.patch("/:id", shipperController.updateShipper);
router.delete("/:id", shipperController.deleteShipper);

module.exports = router;
