const Shipper = require("../models/Shipper");

class ShipperService {
  // CREATE
  async createShipper(data) {
    return Shipper.query().insert(data);
  }

  // READ
  async getAllShippers() {
    // Note: Soft-deleted shippers are filtered out by the global hook in BaseModel
    return Shipper.query().orderBy("name", "asc");
    // Shipper.query() ~ FROM shippers
  }

  async getShipperById(id) {
    return Shipper.query()
      .findById(id)
      .withGraphFetched("shipments.[carrier]") // this makes the shipments data available along with their respective carriers through objective's highly optimized batch queries.
      .throwIfNotFound();
  }

  // UPDATE
  async updateShipper(id, data) {
    // patchAndFetchById is better than update because it ignores missing fields and returns the updated object immediately
    return Shipper.query().patchAndFetchById(id, data).throwIfNotFound();
  }

  // DELETE
  async softDeleteShipper(id) {
    const shipper = await this.getShipperById(id);
    return shipper.$softDelete();
  }
}

module.exports = new ShipperService();
