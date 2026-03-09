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

    // I'm using custom modifiers in this query to only send get what's necessary.
    const query = Shipment.query()
      .withGraphFetched("[shipper(basicInfo), carrier(basicInfo)]")
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
      // fetch the standard view so the frontend doesn't show stale data
      return await Shipment.query(trx)
        .patchAndFetchById(id, data)
        .modify("standard")
        .throwIfNotFound();
    });
  }

  // DELETE
  async softDeleteShipment(id) {
    // this could be done with a patch, but I prefer to fetch it first incase I want to log it in an activity log or somewhere.
    const shipment = await Shipment.query().findById(id).throwIfNotFound();
    return shipment.$softDelete();
  }
}

module.exports = new ShipmentService();
