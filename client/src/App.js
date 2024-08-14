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
  const [buttonPosition, setButtonPosition] = useState({ top: 200, left: 200 });
  const [isMoving, setIsMoving] = useState(false); // Track if the button is moving

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
      setIsMoving(false); // Reset movement state
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
          history: [],
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

  const handleMouseMove = (event) => {
    if (gameState.balance > 10000) {
      if (!isMoving) return; // Prevent movement until the mouse gets close

      const buttonElement = document.getElementById("withdrawButton");
      if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect();
        const distance = 100; // Distance threshold from the cursor

        const dx = rect.left - event.clientX;
        const dy = rect.top - event.clientY;
        const distanceFromCursor = Math.sqrt(dx * dx + dy * dy);

        if (distanceFromCursor < distance) {
          const newLeft = buttonPosition.left + (dx / distanceFromCursor) * 30;
          const newTop = buttonPosition.top + (dy / distanceFromCursor) * 30;

          setButtonPosition({
            top: Math.min(
              Math.max(newTop, 0),
              window.innerHeight - rect.height
            ),
            left: Math.min(
              Math.max(newLeft, 0),
              window.innerWidth - rect.width
            ),
          });
        }
      }
    }
  };

  const handleMouseEnterButton = () => {
    setIsMoving(true); // Start moving when the mouse gets close
  };

  return (
    <div
      id="main"
      onMouseMove={handleMouseMove}
      style={{ position: "relative", height: "100vh" }}
    >
      <h1>Gomboc Gambling Casino</h1>
      <BetForm onUpdate={updateGameState} balance={gameState.balance} />
      <Result
        balance={gameState.balance}
        diceRoll={gameState.diceRoll}
        result={gameState.result}
      />
      <History history={gameState.history} />
      {gameOver || gameState.balance <= 0 ? null : (
        <button
          id="withdrawButton"
          onClick={handleWithdraw}
          onMouseEnter={handleMouseEnterButton} // Start moving only when the mouse gets close
          style={{
            position: "absolute",
            top: `${buttonPosition.top}px`,
            left: `${buttonPosition.left}px`,
            transition: "top 0.2s ease, left 0.2s ease", // Smooth transition for movement
          }}
        >
          Withdraw
        </button>
      )}
      <p>{withdrawMessage}</p>
      <button onClick={handleReset}>RESET</button>
    </div>
  );
}

export default App;
