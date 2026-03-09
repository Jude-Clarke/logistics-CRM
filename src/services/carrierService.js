const Carrier = require("../models/Carrier");

class CarrierService {
  // CREATE
  async createCarrier(data) {
    return Carrier.query().insert(data);
  }

  // READ
  async getAllCarriers(filters = {}) {
    // i added pagination to make working with large amounts of carriers more manageable
    const page = parseInt(filters.page) || 0;
    const limit = parseInt(filters.limit) || 20;

    return Carrier.query()
      .select(
        "id",
        "name",
        "status",
        // here's I'm adding a subquery that displays the total shipments for each carrier
        Carrier.relatedQuery("shipments")
          .count()
          .castTo("integer")
          .as("shipmentCount"),
      )
      .orderBy("name", "asc")
      .page(page, limit); // objection makes pagination really easy
  }

  async getCarrierById(id) {
    return Carrier.query()
      .findById(id)
      .modify("basicInfo") // only pulls what's needed for the frontend
      .throwIfNotFound();
  }

  async getCarrierWithShipmentsSummaries(id) {
    return (
      Carrier.query()
        .findById(id)
        // here, I'm using modifiers to limit the data to what's necessary
        .withGraphFetched("shipments(summary).[shipper(basicInfo)]") // this gets the shipments and their respective shippers
        // Show most recent 10 shipments
        .modifyGraph("shipments", (builder) => {
          builder.orderBy("createdAt", "desc").limit(10);
        })
        .throwIfNotFound()
    );
  }

  // UPDATE
  async updateCarrier(id, data) {
    return Carrier.query().patchAndFetchById(id, data).throwIfNotFound();
  }

  // DELETE
  async softDeleteCarrier(id) {
    const carrier = await this.getCarrierById(id);
    return carrier.$softDelete();
  }
}

module.exports = new CarrierService();
