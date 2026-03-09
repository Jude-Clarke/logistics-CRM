const Shipper = require("../models/Shipper");

class ShipperService {
  // CREATE
  async createShipper(data) {
    return Shipper.query().insert(data);
  }

  // READ
  async getAllShippers(filters = {}) {
    const page = parseInt(filters.page) || 0;
    const limit = parseInt(filters.limit) || 20;

    // Note: Soft-deleted shippers are filtered out by the global hook in BaseModel
    return Shipper.query()
      .select(
        "id",
        "name",
        "address",
        "email",
        // Show the total shipments
        Shipper.relatedQuery("shipments")
          .count()
          .castTo("integer")
          .as("totalShipments"),
      )
      .orderBy("name", "asc")
      .page(page, limit);
  }

  async getShipperById(id) {
    return (
      Shipper.query()
        .findById(id)
        // using modifiers I built for selectivity
        .withGraphFetched("shipments(summary).[carrier(basicInfo)]") // this makes the shipments data available along with their respective carriers through objective's highly optimized batch queries.
        .modifyGraph("shipments", (builder) => {
          // limit to 10 most recent
          builder.orderBy("createdAt", "desc").limit(10);
        })
        .throwIfNotFound()
    );
  }

  // UPDATE
  async updateShipper(id, data) {
    // patchAndFetchById is better than update because it ignores missing fields and returns the updated object immediately
    return Shipper.query().patchAndFetchById(id, data).throwIfNotFound();
  }

  // DELETE
  async softDeleteShipper(id) {
    const shipper = await Shipper.query().findById(id).throwIfNotFound();
    return shipper.$softDelete();
  }
}

module.exports = new ShipperService();
