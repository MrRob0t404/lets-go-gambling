import serverless from "serverless-http";
/**
 * @file app.js
 * @description This file is the main entry point for the server application. It initializes an Express server,
 * connects to the database, sets up middleware, and handles basic application configuration.
 * The application serves as a backend for managing user data and game-related API requests.
 *
 * @requires express
 * @requires cors
 * @requires body-parser
 * @requires ./routes/gameRoutes
 * @requires ./config/database
 * @requires ./models/User
 */

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const gameRoutes = require("../../.././server/routes/gameRoutes");
const { connectDatabase } = require("../../.././server/config/database");
const User = require("../../.././server/models/User");

// Initialize Express application
const app = express();

/**
 * Middleware configuration
 *
 * @function
 * @name middlewareSetup
 * @description Sets up CORS and body parsing middleware for JSON data handling.
 */
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming JSON requests

/**
 * Route handling
 *
 * @function
 * @name routeSetup
 * @description Set up API routes for the application.
 */
app.use("/api", gameRoutes);

/**
 * @constant {number} PORT - The port number on which the server listens for incoming connections.
 */
const PORT = process.env.PORT || 5001;

/**
 * Function to create a default user if none exists
 *
 * @async
 * @function
 * @name initializeDefaultUser
 * @description Initializes a default user in the database with a predefined balance if no users exist.
 * Checks for a user with ID 1, and if not found, creates a user with an initial balance.
 *
 * @returns {Promise<void>} A promise that resolves once the default user is initialized.
 *
 * @throws Will log an error message if there's an issue accessing the database.
 */
async function initializeDefaultUser() {
  try {
    // Check if there is already a user in the database
    let user = await User.findOne({ where: { id: 1 } });

    if (!user) {
      // Create a new user with the default balance if one doesn't exist already
      user = await User.create({
        balance: 1000,
        history: [],
      });
      console.log(
        `Default user created with ID: ${user.id} and balance: ${user.balance}`
      );
    } else {
      console.log(`User with ID: ${user.id} already exists.`);
    }
  } catch (error) {
    console.error("Error initializing default user:", error);
  }
}

/**
 * Database Connection and Server Initialization
 *
 * @description Connects to the database and starts the server.
 * Synchronizes the models with the database and initializes a default user if necessary.
 */
connectDatabase()
  .then(async () => {
    await User.sync(); // syncs model to DB

    // creates a defualt user
    await initializeDefaultUser();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

export const handler = serverless(app);
