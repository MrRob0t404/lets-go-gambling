/**
 * @file database.js
 * @description This file configures the database connection for the application using Sequelize.
 * It reads database credentials from environment variables and exports the Sequelize instance
 * along with a function to establish the connection. The database connection is essential for
 * performing CRUD operations and managing application data.
 *
 * @requires dotenv
 * @requires sequelize
 */

require("dotenv").config();
const { Sequelize } = require("sequelize");

/**
 * Sequelize instance
 *
 * @constant
 * @type {Sequelize}
 * @description Configures a new Sequelize instance using environment variables for database credentials.
 * It establishes the connection details, such as host and dialect, and disables logging for production use.
 */
const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database username
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Hostname of the database server
    dialect: process.env.DB_DIALECT, // Type of SQL dialect to be used
    logging: false, // Disable logging; set to true for detailed logs
  }
);

/**
 * Establish database connection
 *
 * @async
 * @function
 * @name connectDatabase
 * @description Authenticates the database connection using Sequelize's authenticate method.
 * Logs a success message if the connection is established, or an error message if the connection fails.
 *
 * @returns {Promise<void>} A promise that resolves if the connection is successful.
 *
 * @throws Will log an error message if the connection cannot be established.
 */
const connectDatabase = async () => {
  try {
    await sequelize.authenticate(); // Attempt to authenticate with the database
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Exporting sequelize instance and connection function
module.exports = { sequelize, connectDatabase };
