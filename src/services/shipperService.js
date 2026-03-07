const Shipper = require("../models/Shipper");

class ShipperService {
  async getAllShippers() {
    // Note: Soft-deleted shippers are filtered out by the global hook in BaseModel
    return Shipper.query().orderBy("name", "asc");
    // Shipper.query() ~ FROM shippers
  }
  async createShipper(data) {
    return Shipper.query().insert(data);
  }
  async getShipperById(id) {
    return Shipper.query()
      .findById(id)
      .withGraphFetched("shipments.[carrier]") // this makes the shipments data available along with their respective carriers through objective's highly optimized batch queries.
      .throwIfNotFound();
  }

  async softDeleteShipper(id) {
    const shipper = await this.getShipperById(id);
    return shipper.$softDelete();
  }

  async updateShipper(id, data) {
    // patchAndFetchById is better than update because it ignores missing fields and returns the updated object immediately
    return Shipper.query().patchAndFetchById(id, data).throwIfNotFound();
  }
}

module.exports = new ShipperService();
