const { knexSnakeCaseMappers } = require("objection");

require("dotenv").config();

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./migrations",
    },
    // automatically convert snake_case in DB to camelCase in javascript
    ...knexSnakeCaseMappers(),
  },
};
