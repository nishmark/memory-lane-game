import { useState } from "react";

export function useGameLogic() {
  const [gameStarted, setGameStarted] = useState(false);
  const [sequence, setSequence] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(false); // False means Player 2 starts
  const [instruction, setInstruction] = useState("Press start to play");
  const [score, setScore] = useState(0); // Score starts at 0

  // Array of funny appreciation lines (index matches score - 1)
  const appreciationLines = [
    "You can remember 1 number? A monkey could do that with its eyes closed.",
    "2 numbers? That’s natural for a 1.5-year-old kid... with a nap in between.",
    "3 numbers? Lucky? No, just a fluke for a brain like yours.",
    "4 numbers? You’re basically a human sticky note now.",
    "5 in a row! You’re outsmarting my calculator, and it’s jealous.",
    "6 numbers? Are you secretly a robot? Beep boop beep boop!",
    "7—lucky number! Or maybe you’re just cheating with a magic brain.",
    "8 sequences? You’re making my grandma’s bingo skills look weak.",
    "9 numbers? Even Sherlock Holmes is like, ‘Whoa, slow down!’",
    "10! You’ve hit double digits—time to retire as a memory champ?",
    "11 numbers? You’re basically a walking, talking spreadsheet.",
    "12 in a row! Did you borrow a brain from Einstein or what?",
    "13—unlucky for some, but you’re laughing at superstition now!",
    "14 numbers? My dog just gave up trying to keep up with you.",
    "15 sequences! You’re halfway to being a memory wizard—where’s your wand?",
    "16—sweet sixteen! Even your fridge magnets are proud of you.",
    "17 numbers? You’re making me question if I even have a brain.",
    "18 in a row! Are you sure you’re not a secret agent with a photographic memory?",
    "19 sequences? Aliens are probably studying you right now.",
    "20 numbers—you have superhuman capability! Time to join the Avengers, Memory Man!",
  ];

  const startGame = () => {
    setGameStarted(true);
    setSequence([]);
    setPlayerTurn(false); // Player 2’s turn
    setScore(0); // Reset score on new game
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
      setScore((prev) => prev + 1); // Increment score on correct sequence
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
        setScore(0); // Reset score on game over
        setInstruction("Press start to play");
      }, 2000);
    }
  };

  // Show appreciation only after a successful submission (score > 0), mapped to score - 1
  const currentAppreciation = score > 0 ? appreciationLines[Math.min(score - 1, appreciationLines.length - 1)] : "";

  return { gameStarted, sequence, playerTurn, instruction, score, currentAppreciation, startGame, submitInput };
}