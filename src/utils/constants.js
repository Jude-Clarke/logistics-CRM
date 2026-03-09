const SHIPMENT_STATUS = {
  PENDING: "pending",
  DISPATCHED: "dispatched",
  IN_TRANSIT: "in-transit",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "returned",
};

const CARRIER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

// here they are in array format for migration and validation
const SHIPMENT_STATUSES = Object.values(SHIPMENT_STATUS);
const CARRIER_STATUSES = Object.values(CARRIER_STATUS);

module.exports = {
  SHIPMENT_STATUS,
  SHIPMENT_STATUSES,
  CARRIER_STATUS,
  CARRIER_STATUSES,
};
