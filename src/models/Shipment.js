const BaseModel = require("./BaseModel");
const { Model } = require("objection");

class Shipment extends BaseModel {
  static get tableName() {
    return "shipments";
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
