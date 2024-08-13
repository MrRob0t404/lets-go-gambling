import React, { useEffect, useState } from "react";
import BetForm from "./components/BetForm";
import History from "./components/History";
import Result from "./components/Results";
import axios from "axios";

import "./App.css";

function App() {
  const [gameState, setGameState] = useState({
    balance: 1000,
    diceRoll: null,
    result: null,
    history: [],
  });
  const [withdrawMessage, setWithdrawMessage] = useState("");
  const [gameOver, setGameOverState] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/history");
      if (response.data) {
        setGameState((prevState) => ({
          ...prevState,
          history: response.data.history || [],
          balance:
            response.data.balance !== undefined &&
            response.data.balance !== null
              ? Number(response.data.balance)
              : Number(prevState.balance),
        }));
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  // Fetch history once on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const updateGameState = async (data) => {
    let newBet = fetchHistory();

    if (gameState.balance <= 0) {
      setGameOverState(true);
    }

    try {
      setGameState((prevState) => ({
        ...prevState,
        balance: data.balance ?? prevState.balance,
        diceRoll: data.diceRoll ?? prevState.diceRoll,
        result: data.result ?? prevState.result,
        history: [newBet, ...prevState.history],
      }));
    } catch (error) {
      console.error("Failed to update game state:", error);
    }
  };

  const handleReset = async () => {
    try {
      await axios.post("http://localhost:5001/api/reset", {});
      setGameState({
        balance: 1000,
        diceRoll: null,
        result: null,
        history: [],
      });
      setGameOverState(false);
      setWithdrawMessage("");
    } catch (error) {
      console.error("Failed to reset", error);
    }
  };

  const handleWithdraw = async () => {
    // Check for at least one win in the history to allow withdrawal
    const hasWinningBet = gameState.history.some(
      (game) => game.result === "win"
    );

    try {
      if (hasWinningBet) {
        const response = await axios.post(
          "http://localhost:5001/api/withdraw",
          {}
        );
        setGameState({
          balance: 0,
          diceRoll: null,
          result: null,
          history: [], // Reset history after withdrawal
        });
        setGameOverState(true);
        setWithdrawMessage("Successfully withdrew your winnings.");
      } else {
        setWithdrawMessage(
          "You must win at least one game before withdrawing."
        );
      }
    } catch (error) {
      console.error("Cannot withdraw", error);
    }
  };

  return (
    <div id="main">
      <h1>Gomboc Gambling Casino</h1>
      <BetForm onUpdate={updateGameState} balance={gameState.balance} />
      <Result
        balance={gameState.balance}
        diceRoll={gameState.diceRoll}
        result={gameState.result}
      />
      <History history={gameState.history} /> {/* Pass history as prop */}
      {gameOver || gameState.balance <= 0 ? null : (
        <button onClick={handleWithdraw}>Withdraw</button>
      )}
      <p>{withdrawMessage}</p>
      <button onClick={handleReset}>RESET</button>
    </div>
  );
}

export default App;
