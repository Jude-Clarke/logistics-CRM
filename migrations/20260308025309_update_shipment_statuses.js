const { SHIPMENT_STATUSES } = require("../src/utils/constants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("shipments", (table) => {
    table
      .enum("status", SHIPMENT_STATUSES)
      .notNullable()
      .defaultTo("pending")
      .alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("shipments", (table) => {
    table
      .enum("status", [
        "pending",
        "dispatched",
        "in-transit",
        "delivered",
        "cancelled",
      ])
      .notNullable()
      .alter();
  });
};
