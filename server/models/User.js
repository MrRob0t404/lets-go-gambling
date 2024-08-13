/**
 * @file User.js
 * @description This file defines the User model using Sequelize, which represents the users'
 * information in the database. It includes the user's unique ID, balance, and betting history.
 * This model is essential for managing user-related operations and persists user data across
 * the application.
 *
 * @requires sequelize
 * @requires ../config/database
 */

const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * User Model
 *
 * @typedef {Object} User
 * @property {number} id - A unique identifier for each user. (This should also auto increment when adding additional users)
 * @property {number} balance - The user's current balance. Default value is 1000.
 * @property {Object[]} history - An array of objects representing the user's bet history.
 * Each item contains details about bets placed, including amount, number, dice roll, and date.
 *
 * @property {Date} createdAt - Timestamp indicating when it was created.
 * @property {Date} updatedAt - Timestamp indicating the last update to the user record.
 *
 * @description This model maps to the `Users` table in the database and provides a map for
 * performing CRUD operations on the user data.
 */
const User = sequelize.define(
  "User",
  {
    /**
     * User ID
     *
     * @type {number}
     * @description A unique identifier for each user, serving as the primary key.
     * The ID is auto-incremented by the database.
     */
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    /**
     * User Balance
     *
     * @type {number}
     * @default 1000
     * @description The current balance for the user, used to place bets.
     * Init with default value of 1000, representing the starting balance.
     */
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 1000,
    },
    /**
     * Betting History
     *
     * @type {Object[]}
     * @default []
     * @description A JSON column storing the user's bet history as an array of objects.
     * Each entry captures details of individual bets, including the bet amount, selected number,
     * dice roll result, bet outcome (win/lose), and the date/time of the bet.
     */
    history: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    /**
     * Model Options
     *
     * @property {boolean} timestamps - Indicates whether Sequelize should automatically
     * manage the createdAt and updatedAt fields. By default, this is set to true, ensuring
     * timestamps are included in each user record.
     */
    timestamps: true,
  }
);

// Export the User model for use in other parts of the application
module.exports = User;
