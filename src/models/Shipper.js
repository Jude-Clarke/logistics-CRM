const BaseModel = require("./BaseModel");
const { Model } = require("objection");

class Shipper extends BaseModel {
  static get tableName() {
    return "shippers";
  }

  static get modifiers() {
    return {
      basicInfo(builder) {
        builder.select("id", "name", "email");
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "email"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        email: { type: "string", format: "email" },
        address: { type: "string", maxLength: 255 },
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
          from: "shippers.id",
          to: "shipments.shipperId",
        },
      },
    };
  }
}

module.exports = Shipper;
