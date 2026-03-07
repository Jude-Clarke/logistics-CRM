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
    const query = Shipment.query().patchAndFetchById(id);
    const relationsToRefresh = [];
    if (data.shipperId) relationsToRefresh.push("shipper");
    if (data.carrierId) relationsToRefresh.push("carrier");

    if (relationsToRefresh.length > 0) {
      // here, withGraphFetched modifies the internal state of the query before I return it
      query.withGraphFetched(`[${relationsToRefresh.join(", ")}]`);
    }

    return query.throwIfNotFound();
  }
  async softDeleteShipment(id) {
    const shipment = await this.getShipmentDetails(id);
    return shipment.$softDelete();
  }
}

module.exports = new ShipmentService();
