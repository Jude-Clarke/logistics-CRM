const carrierService = require("../services/carrierService");

// CREATE
exports.createCarrier = async (req, res, next) => {
  try {
    const carrier = await carrierService.createCarrier(req.body);
    res.status(201).json(carrier);
  } catch (error) {
    next(error);
  }
};

// READ
exports.getCarriers = async (req, res, next) => {
  try {
    const carriers = await carrierService.getAllCarriers();
    res.json(carriers);
  } catch (error) {
    next(error);
  }
};

exports.getCarrierById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const carrier = await carrierService.getCarrierById(id);
    res.json(carrier);
  } catch (error) {
    next(error);
  }
};

exports.getCarrierWithShipmentsSummaries = async (req, res, next) => {
  try {
    const { id } = req.params;
    const carrier = await carrierService.getCarrierWithShipmentsSummaries(id);
    res.json(carrier);
  } catch (error) {
    next(error);
  }
};

// UPDATE
exports.updateCarrier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedCarrier = await carrierService.updateCarrier(id, req.body);
    res.json(updatedCarrier);
  } catch (error) {
    next(error);
  }
};

// DELETE
exports.deleteCarrier = async (req, res, next) => {
  try {
    const { id } = req.params;
    await carrierService.softDeleteCarrier(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
