"use client";

import React, { useState, useEffect } from "react";
import { useGameLogic } from "./gameLogic";

// Sequence Box Component (for Player 2’s row, display only)
function SequenceBox({ value }) {
  return (
    <div className="w-[40px] h-[40px] flex items-center justify-center bg-black text-white border border-white text-2xl font-bold">
      {value}
    </div>
  );
}

// Input Box Component (for Player 1’s row, editable)
function InputBox({ value, onChange, index, isActive }) {
  return (
    <input
      type="text"
      maxLength="1"
      value={value || ""}
      onChange={(e) => onChange(index, e.target.value)}
      disabled={!isActive}
      onKeyUp={(e) => {
        if (e.key >= "1" && e.key <= "9" && index < 19) {
          document.getElementById(`input-${index + 1}`).focus();
        } else if (e.key === "Backspace" && !value && index > 0) {
          document.getElementById(`input-${index - 1}`).focus();
        }
      }}
      id={`input-${index}`}
      className="w-[40px] h-[40px] text-center bg-black text-white border border-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl font-bold"
    />
  );
}

// Submit Button Component
function SubmitButton({ onClick }) {
  return (
    <button
      className="px-12 pt-2 pb-2 rounded-3xl text-3xl bg-zinc-300 text-black"
      onClick={onClick}
      aria-label="Submit answer"
    >
      SUBMIT
    </button>
  );
}

// Game Controls Component (Submit centered, Start on right, appreciation below)
function GameControls({ onStartGame, onSubmit, appreciation }) {
  return (
    <section className="flex flex-col justify-center items-center mt-10 w-full font-bold text-center whitespace-nowrap relative">
      <div className="flex justify-center items-center w-full relative">
        <SubmitButton onClick={onSubmit} />
        <button
          className="absolute right-0 px-12 pt-2 pb-2 text-3xl rounded-3xl bg-zinc-500 text-black -mt-2 mr-3"
          onClick={onStartGame}
          aria-label="Start the game"
        >
          START
        </button>
      </div>
      {appreciation && <p className="mt-4 text-lg text-white">{appreciation}</p>} {/* Only show if appreciation exists */}
    </section>
  );
}

// Fixed Game Grid Component (2 rows of 20 boxes)
function GameGrid({ sequence, playerTurn, playerInput, onInputChange, onSubmit }) {
  useEffect(() => {
    if (playerTurn) {
      document.getElementById("input-0")?.focus(); // Focus first box when Player 1’s turn starts
    }
  }, [playerTurn]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <section className="mt-10" onKeyDown={handleKeyDown}>
      {/* Player 2’s Row (Upper Row) */}
      <div className="grid grid-cols-20 gap-2">
        {Array.from({ length: 20 }).map((_, index) => (
          <SequenceBox
            key={`p2-${index}`}
            value={playerTurn ? (index < sequence.length ? "?" : "") : (index < sequence.length ? sequence[index] : "")}
          />
        ))}
      </div>
      {/* Player 1’s Row (Lower Row) */}
      <div className="grid grid-cols-20 gap-2 mt-2">
        {Array.from({ length: 20 }).map((_, index) => (
          <InputBox
            key={`p1-${index}`}
            value={playerTurn && index < sequence.length ? playerInput[index] : ""}
            onChange={onInputChange}
            index={index}
            isActive={playerTurn}
          />
        ))}
      </div>
    </section>
  );
}

// Player Section Component with Glow on Text
function PlayerSection({ playerNumber, isActive }) {
  return (
    <article className="w-6/12">
      <div className="relative flex justify-center items-center text-base font-bold text-white">
        <img
          src={
            playerNumber === 1
              ? "https://cdn.builder.io/api/v1/image/assets/TEMP/c09e1f405f1f54424b02d0d2b14859bf82806531?placeholderIfAbsent=true&apiKey=7cb6d228813a407b8edbf6f2f7f162ac"
              : "https://cdn.builder.io/api/v1/image/assets/TEMP/e512c0e206a76a013190deed57a7fec069ae1a48?placeholderIfAbsent=true&apiKey=7cb6d228813a407b8edbf6f2f7f162ac"
          }
          alt={`Player ${playerNumber} Avatar`}
          className="object-contain aspect-square w-[150px]"
        />
        <h2
          className={`absolute top-4/4 text-center ${
            isActive ? "shadow-[0_0_10px_rgba(255,255,0,0.8)]" : ""
          }`}
        >
          PLAYER {playerNumber}
        </h2>
      </div>
    </article>
  );
}

// Score Display Component
function ScoreDisplay({ score }) {
  return (
    <div className="flex flex-col items-center justify-center text-white">
      <h3 className="text-2xl font-bold uppercase">SCORE</h3>
      <p className="text-4xl font-bold">{score}</p>
    </div>
  );
}

// Game Header Component
function GameHeader({ gameStarted }) {
  return (
    <header className="flex flex-col items-center -mt-30">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3dbddcbff0fbe80f0579876d4c77870401fbb319?placeholderIfAbsent=true&apiKey=7cb6d228813a407b8edbf6f2f7f162ac"
        alt="Memory Lane Game Logo"
        className="aspect-square w-[254px]"
      />
      <p className="self-center text-base text-center text-white -mt-10">
        {gameStarted ? "Play Memory Lane game & improve memory" : "Play Memory Lane game & improve memory."}
      </p>
    </header>
  );
}

// Main Memory Lane Game Component
function MemoryLaneGame() {
  const {
    gameStarted,
    sequence,
    playerTurn,
    instruction,
    score,
    currentAppreciation,
    startGame: originalStartGame,
    submitInput,
  } = useGameLogic();

  const [playerInput, setPlayerInput] = useState(Array(20).fill(""));
  const [successAudio, setSuccessAudio] = useState(null);
  const [failureAudio, setFailureAudio] = useState(null);

  // Initialize Audio objects only in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSuccessAudio(new Audio("/allRight.mp3"));
      setFailureAudio(new Audio("/oyoy.mp3"));
    }
  }, []);

  const playSuccess = () => successAudio?.play();
  const playFailure = () => failureAudio?.play();

  const startGame = () => {
    originalStartGame();
    setPlayerInput(Array(20).fill(""));
  };

  const handleInputChange = (index, value) => {
    if (/^[1-9]?$/.test(value)) {
      setPlayerInput((prev) => {
        const newInput = [...prev];
        newInput[index] = value;
        return newInput;
      });
    }
  };

  const handleSubmit = () => {
    if (!gameStarted || !playerTurn) return;
    const inputArray = playerInput.slice(0, sequence.length).map(Number);
    if (inputArray.some(isNaN) || inputArray.some((val) => val < 1 || val > 9)) {
      alert("Please enter numbers between 1 and 9 in all fields.");
      return;
    }
    submitInput(inputArray, playSuccess, playFailure);
    setPlayerInput(Array(20).fill(""));
  };

  return (
    <section className="flex flex-col max-w-full w-[954px] text-white">
      <GameHeader gameStarted={gameStarted} />
      <div className="self-center mt-7 max-w-full w-[577px]">
        <div className="flex gap-5 max-md:flex-col items-center">
          <PlayerSection playerNumber={1} isActive={gameStarted && playerTurn} />
          <ScoreDisplay score={score} />
          <PlayerSection playerNumber={2} isActive={gameStarted && !playerTurn} />
        </div>
      </div>
      <div className="text-center mt-10 text-white">{instruction}</div>
      <GameGrid
        sequence={sequence}
        playerTurn={playerTurn}
        playerInput={playerInput}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
      <GameControls
        onStartGame={startGame}
        onSubmit={handleSubmit}
        appreciation={currentAppreciation}
      />
    </section>
  );
}

// Next.js Page Component
export default function MemoryLanePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
      <MemoryLaneGame />
    </main>
  );
}