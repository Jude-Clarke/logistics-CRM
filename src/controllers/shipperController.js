const shipperService = require("../services/shipperService");
const ShipperService = require("../services/shipperService");

// CREATE
exports.createShipper = async (req, res, next) => {
  try {
    const shipper = await ShipperService.createShipper(req.body);
    res.status(201).json(shipper);
  } catch (error) {
    next(error);
  }
};

// READ
exports.getShippers = async (req, res, next) => {
  try {
    const shippers = await ShipperService.getAllShippers();
    res.json(shippers);
  } catch (error) {
    next(error); // here, I'm sending the error to the centralized error handler middleware.
  }
};

exports.getShipperById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shipper = await ShipperService.getShipperById(id);
    res.json(shipper);
  } catch (error) {
    next(error);
  }
};

// UPDATE
exports.updateShipper = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedShipper = await shipperService.updateShipper(id, req.body);
    res.json(updatedShipper);
  } catch (error) {
    next(error);
  }
};

// DELETE
exports.deleteShipper = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ShipperService.softDeleteShipper(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
