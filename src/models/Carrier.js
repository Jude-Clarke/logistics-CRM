const BaseModel = require("./BaseModel");
const { Model } = require("objection");
const CARRIER_STATUS = require("../utils/constants");

class Carrier extends BaseModel {
  static get tableName() {
    return "carriers";
  }

  static get modifiers() {
    return {
      basicInfo(builder) {
        builder.select("id", "name", "status", "mcNumber");
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "mcNumber"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },

        mcNumber: { type: "string", minLength: 1, maxLength: 50 },

        status: {
          type: "string",
          enum: [CARRIER_STATUS.ACTIVE, CARRIER_STATUS.INACTIVE],
        },
      },
    };
  }

  static get relationMappings() {
    const Shipment = require("./Shipment");
    return {
      shipments: {
        relation: Model.HasManyRelation,
        modelClass: Shipment,
        join: {
          from: "carriers.id",
          to: "shipments.carrierId",
        },
      },
    };
  }
}

module.exports = Carrier;
