const express = require("express");
const Knex = require("knex");
const { Model } = require("objection");
const knexConfig = require("../knexfile");

// Initialize knex
const knex = Knex(knexConfig.development);

// Bind all Models to the knex instance
Model.knex(knex);

const app = express();
app.use(express.json());

// Routes
const shipperRoutes = require("./routes/shipperRoutes");
const carrierRoutes = require("./routes/carrierRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");

app.use("/api/v1/shippers", shipperRoutes);
app.use("/api/v1/carriers", carrierRoutes);
app.use("/api/v1/shipments", shipmentRoutes);

// NOT FOUND Route
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ERROR HANDLER Middleware
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

module.exports = app;
