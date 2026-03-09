const {
  SHIPMENT_STATUS,
  SHIPMENT_STATUSES,
  CARRIER_STATUS,
} = require("../src/utils/constants");

exports.seed = async function (knex) {
  // 1. Clean the slate (Order matters due to Foreign Keys!)
  await knex("shipments").del();
  await knex("carriers").del();
  await knex("shippers").del();

  console.log("🌱 Seeding 200-record demo dataset...");

  // 2. Insert 10 Shippers (The "Clients")
  const shippersData = [
    {
      name: "Apple Inc.",
      email: "logistics@apple.com",
      address: "1 Infinite Loop, Cupertino, CA",
    },
    {
      name: "Tesla Motors",
      email: "shipping@tesla.com",
      address: "3500 Deer Creek Rd, Palo Alto, CA",
    },
    {
      name: "Whole Foods",
      email: "distro@wholefoods.com",
      address: "550 Bowie St, Austin, TX",
    },
    {
      name: "Nike Logistics",
      email: "shipping@nike.com",
      address: "One Bowerman Dr, Beaverton, OR",
    },
    {
      name: "Samsung Electronics",
      email: "us_logistics@samsung.com",
      address: "85 Challenger Rd, Ridgefield Park, NJ",
    },
    {
      name: "Amazon Fulfillment",
      email: "fba-inbound@amazon.com",
      address: "410 Terry Ave N, Seattle, WA",
    },
    {
      name: "Home Depot",
      email: "supplychain@homedepot.com",
      address: "2455 Paces Ferry Rd, Atlanta, GA",
    },
    {
      name: "Target Corp",
      email: "t-logistics@target.com",
      address: "1000 Nicollet Mall, Minneapolis, MN",
    },
    {
      name: "Dell Technologies",
      email: "shipping@dell.com",
      address: "1 Dell Way, Round Rock, TX",
    },
    {
      name: "PepsiCo",
      email: "fleet@pepsico.com",
      address: "700 Anderson Hill Rd, Purchase, NY",
    },
  ];

  const shipperIds = await knex("shippers")
    .insert(shippersData)
    .then(() => knex("shippers").pluck("id"));

  // 3. Insert 5 Carriers (The "Trucking Companies")
  const carriersData = [
    {
      name: "Swift Transportation",
      mcNumber: "MC123456",
      status: CARRIER_STATUS.ACTIVE,
    },
    {
      name: "FedEx Custom Critical",
      mcNumber: "MC987654",
      status: CARRIER_STATUS.ACTIVE,
    },
    {
      name: "Old Dominion",
      mcNumber: "MC456789",
      status: CARRIER_STATUS.ACTIVE,
    },
    { name: "J.B. Hunt", mcNumber: "MC223344", status: CARRIER_STATUS.ACTIVE },
    {
      name: "Schneider National",
      mcNumber: "MC556677",
      status: CARRIER_STATUS.INACTIVE,
    },
  ];

  const carrierIds = await knex("carriers")
    .insert(carriersData)
    .then(() => knex("carriers").pluck("id"));

  // 4. Generate 200 Shipments
  const cities = [
    "Chicago, IL",
    "New York, NY",
    "Los Angeles, CA",
    "Austin, TX",
    "Seattle, WA",
    "Miami, FL",
    "Denver, CO",
    "Atlanta, GA",
    "Phoenix, AZ",
    "Boston, MA",
  ];

  const shipments = Array.from({ length: 200 }).map((_, i) => {
    const status =
      SHIPMENT_STATUSES[Math.floor(Math.random() * SHIPMENT_STATUSES.length)];
    const origin = cities[Math.floor(Math.random() * cities.length)];
    let destination = cities[Math.floor(Math.random() * cities.length)];

    // Ensure origin and destination aren't the same
    while (origin === destination) {
      destination = cities[Math.floor(Math.random() * cities.length)];
    }

    return {
      trackingNumber: `SD-${10000 + i}`,
      shipperId: shipperIds[Math.floor(Math.random() * shipperIds.length)],
      // Give some shipments no carrier (Pending loads)
      carrierId:
        Math.random() > 0.15
          ? carrierIds[Math.floor(Math.random() * carrierIds.length)]
          : null,
      origin,
      destination,
      rate: parseFloat((Math.random() * 3000 + 400).toFixed(2)),
      status: status,
      // Random pickup date within the last 45 days
      pickupDate: new Date(
        Date.now() - Math.floor(Math.random() * 45) * 24 * 60 * 60 * 1000,
      ),
      deliveryDate: status === SHIPMENT_STATUS.DELIVERED ? new Date() : null,
    };
  });

  await knex("shipments").insert(shipments);
  console.log("✅ 200 Shipments seeded successfully!");
};
