const { CARRIER_STATUS, CARRIER_STATUSES } = require("../src/utils/constants");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .alterTable("shippers", (table) => {
      table.string("email").notNullable().alter();
    })
    .alterTable("carriers", (table) => {
      table
        .enum("status", CARRIER_STATUSES)
        .defaultTo(CARRIER_STATUS.ACTIVE)
        .alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
