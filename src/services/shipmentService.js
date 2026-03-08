const Shipment = require("../models/Shipment");
const { SHIPMENT_STATUSES } = require("../utils/constants");
const { transaction } = require("objection");

// here, I created a helper function to validate statuses before sending to the db
const validateStatus = (status) => {
  if (status && !SHIPMENT_STATUSES.includes(status)) {
    const err = new Error(
      `Invalid status: ${status}. Must be one of: ${SHIPMENT_STATUSES.join(", ")}`,
    );
    err.statusCode = 400;
    throw err;
  }
};

class ShipmentService {
  // CREATE
  async createShipment(data) {
    // validate the status before sending to the db
    validateStatus(data.status);

    // here, I'm using a transaction to make sure that all of these actions pass together or fail together.
    return transaction(Shipment.knex(), async (trx) => {
      // here I'm creating the shipment within the transaction
      const newShipment = await Shipment.query(trx)
        .insert(data)
        .withGraphFetched("[shipper, carrier]");

      // If I wanted to log the activity here, the transaction would make sure everything completes successfully before going through.

      return newShipment;
    });
  }

  // READ
  async getAllShipments(filters = {}) {
    const { search, status, carrierId } = filters;

    // input validation to enforce the enum before sending the query to the db
    validateStatus(status);

    const query = Shipment.query()
      .withGraphFetched("[shipper, carrier]")
      .orderBy("createdAt", "desc");

    // only add where clauses if the filter exists
    if (status) {
      query.where("status", status);
    }

    if (carrierId) {
      query.where("carrierId", carrierId);
    }

    if (search) {
      // use a sub-query (grouping) to handle the 'OR' logic safely
      query.where((builder) => {
        builder
          .where("trackingNumber", "like", `%${search}%`)
          .orWhere("origin", "like", `%${search}%`)
          .orWhere("destination", "like", `%${search}%`);
      });
    }

    return query;
  }

  async getShipmentDetails(id) {
    return Shipment.query()
      .findById(id)
      .withGraphFetched("[shipper, carrier]")
      .throwIfNotFound();
  }

  // UPDATE
  async updateShipment(id, data) {
    // validate status if it's being updated
    if (data.status) {
      validateStatus(data.status);
    }

    // use a transaction here to make sure the update and fetching happen in a single, isolated unit of work to avoid potential stale data.
    return transaction(Shipment.knex(), async (trx) => {
      const query = Shipment.query(trx).patchAndFetchById(id, data);
      const relationsToRefresh = [];
      if (data.shipperId) relationsToRefresh.push("shipper");
      if (data.carrierId) relationsToRefresh.push("carrier");

      if (relationsToRefresh.length > 0) {
        // here, withGraphFetched modifies the internal state of the query before I return it
        query.withGraphFetched(`[${relationsToRefresh.join(", ")}]`);
      }

      const updatedShipment = await query.throwIfNotFound();

      return updatedShipment;
    });
  }

  // DELETE
  async softDeleteShipment(id) {
    const shipment = await this.getShipmentDetails(id);
    return shipment.$softDelete();
  }
}

module.exports = new ShipmentService();
