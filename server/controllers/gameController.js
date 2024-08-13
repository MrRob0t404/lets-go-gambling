// server/controllers/gameController.js
const User = require("../models/User");

async function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function bet(req, res) {
  try {
    let user = await User.findOne({ where: { id: 1 } });

    if (!user) {
      // Fallback: This should not happen if initialization works
      return res.status(500).json({ message: "User not initialized" });
    }

    const { amount, number } = req.body;
    console.log("BACKEND: ", amount, number);

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

async function withdraw(req, res) {
  console.log("WITHDRAWING");
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

async function reset(req, res) {
  console.log("RESETTING");
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

module.exports = { bet, getUserHistory, withdraw, reset };
