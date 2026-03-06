/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return (
    knex.schema

      // SHIPPERS TABLE
      .createTable("shippers", (table) => {
        table.increments("id").primary(); // auto-incrementing ID
        table.string("name").notNullable(); // required
        table.string("email").unique().index(); // indexed for fast lookup
        table.string("address");
        // Here, I chose to use the soft delete pattern so that when a shipper is deleted, we can keep a record of them for audits, but our app will treat the data as if it's deleted using a modifier.
        table.timestamp("deleted_at").nullable();
        table.timestamps(true, true); // adds created_at and updated_at
      })

      // CARRIERS TABLE
      .createTable("carriers", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("mc_number").unique().notNullable(); // Motor Carrier number
        table.enum("status", ["active", "inactive"]).defaultTo("active");
        table.timestamp("deleted_at").nullable();
        table.timestamps(true, true);
      })

      // SHIPMENTS TABLE
      .createTable("shipments", (table) => {
        table.increments("id").primary();
        table.string("tracking_number").unique().notNullable();

        // Foreign Keys
        table
          .integer("shipper_id")
          .unsigned() // always use unsigned() with foreign keys to ensure type match. increments() creates an unsigned integer (meaning it will never be negative). MySQL sees signed and unsigned integers as different datatypes.
          .notNullable()
          .references("id")
          .inTable("shippers")
          .onDelete("CASCADE"); // if the shipper is hard-deleted, kill their shipments
        table
          .integer("carrier_id")
          .unsigned()
          .nullable()
          .references("id")
          .inTable("carriers")
          .onDelete("SET NULL"); // if a carrier goes out of business, keep the shipments record. the carrier id can be reassigned.

        table.decimal("rate", 10, 2).defaultTo(0.0);
        table.string("origin").notNullable();
        table.string("destination").notNullable();
        table.datetime("pickup_date").index();
        table.datetime("delivery_date");
        table.timestamp("deleted_at").nullable();
        table.timestamps(true, true);
      })
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("shipments")
    .dropTableIfExists("carriers")
    .dropTableIfExists("shippers");
};
