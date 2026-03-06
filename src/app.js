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

module.exports = app;
