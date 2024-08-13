// client/src/components/Result.js
import React, { useState, useEffect } from "react";
import "./styles/Results.css";

const Result = ({ balance, diceRoll, result }) => {
  const [resultMessage, setResultMessage] = useState("TEST YOUR LUCK!");

  useEffect(() => {
    handleResultMessage(result);
  }, [result]);

  const handleResultMessage = (result) => {
    if (result === "win") {
      setResultMessage("🎉 YOU WIN! WANT TO PUSH YOUR LUCK AGAIN? 🎲");
    } else if (result === "lose") {
      setResultMessage("😢 YOU LOSE. TRY AGAIN! 🍀");
    } else {
      setResultMessage("PLACE YOUR BET TO SEE THE RESULT.");
    }
  };

  return (
    <div className="result-container">
      <h2>Result</h2>
      <div className="result-message">
        <p>
          Dice Roll: <span className="dice-roll">{diceRoll || "-"}</span>
        </p>
        <p>
          Result:{" "}
          <span className={result === "win" ? "win" : "lose"}>
            {resultMessage}
          </span>
        </p>
        <p>
          Balance: <span className="balance">${balance.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};

export default Result;
