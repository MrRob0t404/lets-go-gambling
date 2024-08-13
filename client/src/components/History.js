// client/src/components/History.js
import React, { useState } from "react";
import "./styles/History.css";

const History = ({ history }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [buttonMessage, setButtonMessage] = useState("Show");

  const handleShowHistory = () => {
    setButtonMessage(showHistory ? "Show" : "Hide");
    setShowHistory(!showHistory);
  };

  return (
    <div className="history-container">
      <h2>Bet History</h2>
      <button onClick={handleShowHistory} className="history-button">
        {buttonMessage} History
      </button>
      {showHistory && (
        <ul className="history-list">
          {history.length > 0 ? (
            history.map((entry, index) => (
              <li key={index} className="history-item">
                <span className="entry-date">
                  {new Date(entry.date).toLocaleString()}:
                </span>{" "}
                Bet: ${entry.amount}, Number: {entry.number}, Dice Roll:{" "}
                {entry.diceRoll}, Result:{" "}
                <span className={entry.result === "win" ? "win" : "lose"}>
                  {entry.result}
                </span>
              </li>
            ))
          ) : (
            <li>No history available.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default History;
