const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/*
 * id: A unique identifier for each user.
 * balance: The user's current balance.
 * history: A JSON column to store the user's bet history as an array of objects.
 */
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 1000,
    },
    history: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

module.exports = User;
