const BaseModel = require("./BaseModel");
const { Model } = require("objection");

class Carrier extends BaseModel {
  static get tableName() {
    return "carriers";
  }
  static get relationMappings() {
    const Shipment = require("./Shipment");
    return {
      shipments: {
        relation: Model.HasManyRelation,
        modelClass: Shipment,
        join: {
          from: "carrier.id",
          to: "shipments.carrier_id",
        },
      },
    };
  }
}

module.exports = Carrier;
