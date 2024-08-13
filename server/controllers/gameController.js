/**
 * @file gameController.js
 * @description This file contains the game logic and controller functions for handling user bets,
 * retrieving user history, withdrawing winnings, and resetting the user's game state.
 * It interacts with the User model to perform CRUD operations related to the user's balance and history.
 *
 * @requires ../models/User
 */

const User = require("../models/User");

/**
 * Roll a six-sided dice
 *
 * @async
 * @function
 * @name rollDice
 * @description Simulates rolling a six-sided dice and returns a random number between 1 and 6.
 *
 * @returns {Promise<number>} A promise that resolves to a random integer between 1 and 6.
 */
async function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Sleep for a specified time
 *
 * @function
 * @name sleep
 * @description Pauses the execution for a specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to pause execution.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Handle user bet
 *
 * @async
 * @function
 * @name bet
 * @description Processes a user's bet by validating the bet, rolling a dice, updating the user's balance,
 * and returning the result of the bet. It logs the bet outcome and updates the user's betting history.
 *
 * @param {Object} req - Express request object, containing the bet amount and chosen number in the body.
 * @param {Object} res - Express response object, used to send the result and updated balance back to the client.
 * @returns {Promise<void>} A promise that resolves when the bet processing is complete.
 *
 * @throws Will send a JSON response with a 500 status if the user is not initialized or another internal error occurs.
 */
async function bet(req, res) {
  try {
    let user = await User.findOne({ where: { id: 1 } });

    if (!user) {
      // Fallback: This should not happen if initialization works
      return res.status(500).json({ message: "User not initialized" });
    }

    const { amount, number } = req.body;

    // Validate the bet
    if (amount <= 0 || amount > user.balance || number < 1 || number > 6) {
      return res.status(400).json({ message: "Invalid bet" });
    }

    const diceRoll = await rollDice();
    await sleep(3000); // Simulate rolling dice

    const win = diceRoll === number;
    const result = win ? "win" : "lose";
    user.balance = win ? user.balance + 5 * amount : user.balance - amount;

    // Ensure balance doesn't go negative
    if (user.balance < 0) {
      user.balance = 0;
    }

    // Append new entry to history
    const newEntry = { amount, number, diceRoll, result, date: new Date() };
    user.history = [...user.history, newEntry];

    // Save the updated user data to the database
    await user.save();

    res.json({ balance: user.balance, diceRoll, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Retrieve user history
 *
 * @async
 * @function
 * @name getUserHistory
 * @description Fetches the user's game history, including past bets, results, and the current balance.
 * It returns the complete user data if the user exists or an empty array if no user is found.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object, used to send the user's history back to the client.
 * @returns {Promise<void>} A promise that resolves when the user's history is retrieved.
 *
 * @throws Will send a JSON response with a 500 status if an internal error occurs.
 */
async function getUserHistory(req, res) {
  try {
    const user = await User.findOne({ where: { id: 1 } });

    if (!user) {
      return res.json([]);
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Withdraw winnings
 *
 * @async
 * @function
 * @name withdraw
 * @description Resets the user's balance to 1000 and clears the betting history. It checks if the user
 * has any winning history before resetting and sends a response with the updated balance.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object, used to send the updated balance back to the client.
 * @returns {Promise<void>} A promise that resolves when the withdrawal process is complete.
 *
 * @throws Will send a JSON response with a 500 status if an internal error occurs or if no wins are available to withdraw.
 */
async function withdraw(req, res) {
  try {
    const user = await User.findOne({ where: { id: 1 } });

    if (!user || user.history.length === 0) {
      return res.status(400).json({ message: "No wins to withdraw" });
    }

    user.balance = 1000; // Reset balance
    user.history = []; // Clear history
    await user.save();

    res.json({ balance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Reset user balance and history
 *
 * @async
 * @function
 * @name reset
 * @description Resets the user's balance to 1000 and clears the betting history, regardless of current state.
 * It provides a clean slate for the user, sending a response with the reset balance.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object, used to send the reset balance back to the client.
 * @returns {Promise<void>} A promise that resolves when the reset process is complete.
 *
 * @throws Will send a JSON response with a 500 status if an internal error occurs or if the reset fails.
 */
async function reset(req, res) {
  try {
    const user = await User.findOne({ where: { id: 1 } });

    if (!user) {
      return res.status(400).json({ message: "Cannot reset" });
    }

    user.balance = 1000; // Reset balance
    user.history = []; // Clear history
    await user.save();

    res.json({ balance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Export controller functions
module.exports = { bet, getUserHistory, withdraw, reset };
