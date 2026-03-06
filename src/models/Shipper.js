const BaseModel = require("./BaseModel");
const { Model } = require("objection");

class Shipper extends BaseModel {
  static get tableName() {
    return "shippers";
  }

  static get relationShipMappings() {
    const Shipment = require("./Shipment");

    return {
      shipments: {
        relation: Model.HasManyRelation,
        modelClass: Shipment,
        join: {
          from: "shippers.id",
          to: "shippers.shipment_id",
        },
      },
    };
  }
}

module.exports = Shipper;
