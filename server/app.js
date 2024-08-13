// server/app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const gameRoutes = require("./routes/gameRoutes");
const { connectDatabase } = require("./config/database");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", gameRoutes);

const PORT = process.env.PORT || 5001;

// Function to create a default user if none exists
async function initializeDefaultUser() {
  try {
    // Check if there is already a user in the database
    let user = await User.findOne({ where: { id: 1 } });

    if (!user) {
      // Create a new user with the default balance
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

// Connect to the database and initialize the user
connectDatabase()
  .then(async () => {
    // Synchronize models with the database
    await User.sync();

    // Initialize the default user
    await initializeDefaultUser();

    // Start the server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
