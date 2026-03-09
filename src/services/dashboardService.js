const Shipment = require("../models/Shipment");
const Carrier = require("../models/Carrier");
const { SHIPMENT_STATUS } = require("../utils/constants");

class DashboardService {
  // Things to fetch:
  // 1. total counts of shipments grouped by thier status.
  // 2. total revenue (Sum of all shipment rates).
  // 3. total count of active carriers
  // 4. active shipments and their details

  async getOverviewStats(filters = {}) {
    const limit = parseInt(filters.limit) || 10;

    const activeStatuses = [
      SHIPMENT_STATUS.PENDING,
      SHIPMENT_STATUS.DISPATCHED,
      SHIPMENT_STATUS.IN_TRANSIT,
    ];

    // here, I'm using promise.all to run multiple queries in parallel for efficiency instead of using a sequence of awaits.
    const [statusCounts, totalRevenue, carrierCount, activeShipments] =
      await Promise.all([
        // Group by status
        Shipment.query()
          .select("status")
          .count("id as count")
          .groupBy("status"),
        // translates to:
        // SELECT "status", count("id") AS "count"
        // FROM "shipments"
        // GROUP BY "status";

        // Sum of all shipment rates
        Shipment.query().sum("rate as total").first(), // this returns an array, so I call .first() on it to get the first result.
        // SELECT sum("rate") AS "total"
        // FROM "shipments"
        // LIMIT 1;

        // Count of all the carriers (excluding soft-deleted ones)
        Carrier.query().count("id as count").first(),
        // SELECT count("id") AS "count"
        // FROM "carriers"
        // WHERE "deleted_at" IS NULL (handled by my global modifier)
        // LIMIT 1;

        // Active Shipments (Recent Activity)
        Shipment.query()
          .modify("summary")
          .withGraphFetched("[shipper(basicInfo), carrier(basicInfo)]")
          .whereIn("status", activeStatuses)
          .orderBy("updatedAt", "desc")
          .limit(limit),
      ]);
    return {
      shipmentsByStatus: statusCounts, // returns an array of objects
      totalRevenue: parseFloat(totalRevenue.total) || 0, // database will likely return a string, so I make it a float (decimal number) so I can do math with it.
      activeCarriers: parseInt(carrierCount.count) || 0, // same here, but this time I make it an integer. the 0 is the fallback incase the value is null.
      recentActivity: activeShipments,
      generatedAt: new Date().toISOString(), // timestamp to display "Last updated:"
    };
  }
}

module.exports = new DashboardService();
