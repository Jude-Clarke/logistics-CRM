const Shipment = require("../models/Shipment");

class ShipmentService {
  async getAllShipments() {
    return Shipment.query()
      .withGraphFetched("[shipper, carrier]")
      .orderBy("pickupDate", "asc");
  }
  async createShipment(data) {
    return Shipment.query().insert(data);
  }
  async getShipmentDetails(id) {
    return Shipment.query()
      .findById(id)
      .withGraphFetched("[shipper, carrier]")
      .throwIfNotFound();
  }
  async updateShipment(id, data) {
    return Shipment.query()
      .patchAndFetchById(id, data)
      .withGraphFetched("[shipper, carrier]") // refresh relations in case ids changed
      .throwIfNotFound();
  }
  async softDeleteShipment(id) {
    const shipment = await this.getShipmentDetails(id);
    return shipment.$softDelete();
  }
}

module.exports = new ShipmentService();
