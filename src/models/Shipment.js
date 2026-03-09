const { SHIPMENT_STATUSES } = require("../utils/constants");
const BaseModel = require("./BaseModel");
const { Model } = require("objection");

class Shipment extends BaseModel {
  static get tableName() {
    return "shipments";
  }

  // standard query
  static get modifiers() {
    return {
      // summary of shipment data for the dashboard
      summary(builder) {
        builder.select(
          "id",
          "status",
          "trackingNumber",
          "origin",
          "destination",
          "createdAt",
          "shipperId",
          "carrierId",
        );
      },
      // basic info for a "full detail" view
      standard(builder) {
        builder
          .modify("summary")
          .withGraphFetched("[shipper(basicInfo), carrier(basicInfo)]");
      },
    };
  }

  // Some pre-db validation
  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "status",
        "shipperId",
        "trackingNumber",
        "origin",
        "destination",
      ],
      properties: {
        id: { type: "integer" },
        status: { type: "string", enum: SHIPMENT_STATUSES },
        trackingNumber: { type: "string", minLength: 1, maxLength: 255 },

        // foreign keys
        shipperId: { type: "integer" },
        carrierId: { type: ["integer", "null"] },

        rate: { type: "number", minimum: 0 },

        origin: { type: "string", minLength: 1, maxLength: 255 },
        destination: { type: "string", minLength: 1, maxLength: 255 },

        pickupDate: { type: ["string", "null"], format: "date-time" },
        deliveryDate: { type: ["string", "null"], format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const Shipper = require("./Shipper");
    const Carrier = require("./Carrier");

    return {
      shipper: {
        relation: Model.BelongsToOneRelation,
        modelClass: Shipper,
        join: {
          from: "shipments.shipperId",
          to: "shippers.id",
        },
      },
      carrier: {
        relation: Model.BelongsToOneRelation,
        modelClass: Carrier,
        join: {
          from: "shipments.carrierId",
          to: "carriers.id",
        },
      },
    };
  }
}

module.exports = Shipment;
