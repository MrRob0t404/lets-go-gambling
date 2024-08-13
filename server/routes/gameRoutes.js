/**
 * @file gameRoutes.js
 * @description This file defines the Express router for the game-related routes,
 * connecting client requests to the appropriate controller functions in the gameController.
 * It sets up endpoints for placing bets, retrieving user history, withdrawing winnings,
 * and resetting the game state.
 *
 * @requires express
 * @requires ../controllers/gameController
 */

const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

/**
 * POST /bet
 *
 * @name Bet Route
 * @route {POST} /api/bet
 * @description Handles placing a bet by the user. It validates the request,
 * simulates the dice roll, and updates the user's balance and history.
 * The result of the bet, including the updated balance and dice roll outcome,
 * is returned to the client.
 *
 * @param {number} req.body.amount - The bet amount placed by the user.
 * @param {number} req.body.number - The chosen number by the user for the bet (1-6).
 *
 * @returns {Object} JSON response containing the updated balance, dice roll result,
 * and bet outcome.
 *
 * @throws {400} "Invalid bet" - If the bet amount or number is out of valid range.
 * @throws {500} "Internal server error" - If there is an issue processing the bet.
 *
 * @example
 * // Example request
 * POST /api/bet
 * {
 *   "amount": 50,
 *   "number": 3
 * }
 *
 * // Example response
 * {
 *   "balance": 950,
 *   "diceRoll": 2,
 *   "result": "lose"
 * }
 */
router.post("/bet", gameController.bet);

/**
 * GET /history
 *
 * @name User History Route
 * @route {GET} /api/history
 * @description Retrieves the user's betting history, including details of all past
 * bets such as amounts, numbers, dice rolls, outcomes, and dates. This provides
 * users with a record of their previous bets and outcomes.
 *
 * @returns {Array<Object>} JSON response containing the user's betting history.
 * Each entry includes the amount, number, diceRoll, result, and date of the bet.
 *
 * @throws {500} "Internal server error" - If there is an issue retrieving the history.
 *
 * @example
 * // Example response
 * [
 *   {
 *     "amount": 50,
 *     "number": 3,
 *     "diceRoll": 3,
 *     "result": "win",
 *     "date": "2024-08-07T12:34:56.789Z"
 *   },
 *   ...
 * ]
 */
router.get("/history", gameController.getUserHistory);

/**
 * POST /withdraw
 *
 * @name Withdraw Route
 * @route {POST} /api/withdraw
 * @description Resets the user's balance to the initial amount and clears their betting
 * history. This action is only possible if there are recorded wins. The updated balance
 * is returned to the client.
 *
 * @returns {Object} JSON response containing the updated balance after resetting.
 *
 * @throws {400} "No wins to withdraw" - If there are no wins available to withdraw.
 * @throws {500} "Internal server error" - If there is an issue processing the withdrawal.
 *
 * @example
 * // Example request
 * POST /api/withdraw
 *
 * // Example response
 * {
 *   "balance": 1000
 * }
 */
router.post("/withdraw", gameController.withdraw);

/**
 * POST /reset
 *
 * @name Reset Route
 * @route {POST} /api/reset
 * @description Completely resets the user's balance and clears the betting history,
 * regardless of the current state. This provides a fresh start for the user,
 * with the balance restored to the initial amount.
 *
 * @returns {Object} JSON response containing the reset balance.
 *
 * @throws {400} "Cannot reset" - If the user cannot be reset.
 * @throws {500} "Internal server error" - If there is an issue processing the reset.
 *
 * @example
 * // Example request
 * POST /api/reset
 *
 * // Example response
 * {
 *   "balance": 1000
 * }
 */
router.post("/reset", gameController.reset);

// Export the router for use in the main application
module.exports = router;
