const shipmentService = require("../services/shipmentService");

exports.getAllShipments = async (req, res, next) => {
  try {
    // req.query captures things like ?search=123&status=pending
    const shipments = await shipmentService.getAllShipments(req.query);
    res.json(shipments);
  } catch (error) {
    next(error);
  }
};

exports.createShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.createShipment(req.body);
    // 201 Created
    res.status(201).json(shipment);
  } catch (error) {
    next(error);
  }
};

exports.getShipmentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shipment = await shipmentService.getShipmentDetails(id);
    res.json(shipment);
  } catch (error) {
    next(error);
  }
};

exports.updateShipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shipment = await shipmentService.updateShipment(id, req.body);
    res.json(shipment);
  } catch (error) {
    next(error);
  }
};

exports.deleteShipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await shipmentService.softDeleteShipment(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
