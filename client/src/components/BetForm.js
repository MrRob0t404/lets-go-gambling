// client/src/components/BetForm.js
import React, { useState } from "react";
import axios from "axios";
import "./styles/BetForm.css";

const BetForm = ({ onUpdate, balance }) => {
  const [amount, setAmount] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoadingState] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingState(true);
    setMessage("");

    // Validations
    if (amount <= 0) {
      setMessage("Bet amount must be greater than zero.");
      setIsLoadingState(false);
      return;
    }

    if (amount > balance) {
      setMessage("Sorry, you cannot bet more than your balance.");
      setIsLoadingState(false);
      return;
    }

    if (number < 1 || number > 6) {
      setMessage("Please select a valid dice number (1-6).");
      setIsLoadingState(false);
      return;
    }

    // Make initial bet request
    try {
      const response = await axios.post("http://localhost:5001/api/bet", {
        amount: Number(amount),
        number: Number(number),
      });

      // Extracting roll result from response
      const rollResult = response.data.roll;

      // Check if user bet matches roll result -- Extra features
      if (rollResult === Number(number) && balance >= 5000) {
        let shouldReroll;
        balance >= 10000
          ? (shouldReroll = Math.random() < 0.5)
          : (shouldReroll = Math.random() < 0.3);

        if (shouldReroll) {
          setMessage("Lucky! Re-rolling the dice...");

          // Second API call to re-roll the dice
          const secondRollResponse = await axios.post(
            "http://localhost:5001/api/bet",
            {
              amount: 0, // There's no need to pass amount again, just re-rolling - caused a bug to add the amount twice
              number: Number(number),
            }
          );

          // Update with the new roll result
          response.data.roll = secondRollResponse.data.roll;
        }
      }

      // Make updates
      onUpdate(response.data);
      setAmount("");
      setNumber("");
    } catch (error) {
      console.error("Error placing bet:", error);
      setMessage("An error occurred while placing the bet.");
    } finally {
      setIsLoadingState(false);
    }
  };

  return (
    <div className="bet-form-container">
      <h2>Place Your Bets:</h2>
      <form onSubmit={handleSubmit} className="bet-form">
        <div className="form-group">
          <label htmlFor="betAmount">Bet Amount:</label>
          <input
            type="number"
            id="betAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Bet Amount"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="diceNumber">Dice Number (1-6):</label>
          <input
            type="number"
            id="diceNumber"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Dice Number (1-6)"
            min="1"
            max="6"
            required
          />
        </div>
        {balance > 0 ? (
          <button type="submit" disabled={isLoading} className="bet-button">
            {isLoading ? "Rolling Dice..." : "Submit Bet"}
          </button>
        ) : (
          ""
        )}
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default BetForm;
