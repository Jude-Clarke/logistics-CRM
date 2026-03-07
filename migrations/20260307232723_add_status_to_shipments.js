/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("shipments", (table) => {
    // here I add a status column to the shipments table.
    // I give it a default so the existing shipments don't break.
    // I'm choosing to use an enum here for data-integrity and performance
    table
      .enum("status", [
        "pending",
        "dispatched",
        "in-transit",
        "delivered",
        "cancelled",
      ])
      .notNullable()
      .defaultTo("pending");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("shipments", (table) => {
    // this is the rollback function to undo changes if needed.
    table.dropColumn("status");
  });
};
