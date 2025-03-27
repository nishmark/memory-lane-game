// src/app/gameLogic.js
import { useState } from "react";

export function useGameLogic() {
  const [gameStarted, setGameStarted] = useState(false);
  const [sequence, setSequence] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(false); // False means Player 2 starts
  const [instruction, setInstruction] = useState("Press start to play");

  const startGame = () => {
    setGameStarted(true);
    setSequence([]);
    setPlayerTurn(false); // Player 2’s turn
    player2Turn();
  };

  const player2Turn = () => {
    const newNumber = Math.floor(Math.random() * 9) + 1;
    setSequence((prev) => [...prev, newNumber]);
    setTimeout(() => {
      setPlayerTurn(true);
      setInstruction("Enter the sequence in the lower row");
    }, 5000);
  };

  const submitInput = (inputSequence, playSuccess, playFailure) => {
    if (!playerTurn) return;
    const expected = sequence;
    const isCorrect = inputSequence.every((val, idx) => val === expected[idx]) && inputSequence.length === expected.length;
    if (isCorrect) {
      setInstruction("ALL RIGHT ALL RIGHT");
      playSuccess(); // Play allRight.mp3
      setTimeout(() => {
        setPlayerTurn(false);
        player2Turn();
      }, 2000);
    } else {
      setInstruction("OY OY");
      playFailure(); // Play oyoy.mp3
      setTimeout(() => {
        setGameStarted(false);
        setSequence([]);
        setInstruction("Press start to play");
      }, 2000);
    }
  };

  return { gameStarted, sequence, playerTurn, instruction, startGame, submitInput };
}