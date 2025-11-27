import React, { useState } from 'react';
import CharacterSelection from './components/CharacterSelection';
import GameEngine from './components/GameEngine';
import GameOver from './components/GameOver';
import { GameState, Character } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [finalCoins, setFinalCoins] = useState(0);

  const handleCharacterSelect = (char: Character) => {
    setSelectedCharacter(char);
  };

  const startGame = () => {
      if (selectedCharacter) {
          setGameState(GameState.PLAYING);
      }
  };

  const handleGameOver = (score: number, coins: number) => {
    setFinalScore(score);
    setFinalCoins(coins);
    setGameState(GameState.GAME_OVER);
  };

  const restartGame = () => {
    setGameState(GameState.PLAYING);
  };

  const returnToMenu = () => {
    setGameState(GameState.MENU);
    setSelectedCharacter(null);
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-slate-900 text-white select-none">
      {gameState === GameState.MENU && (
        <>
            <CharacterSelection 
                onSelect={handleCharacterSelect} 
                selectedId={selectedCharacter?.id || null} 
            />
            {selectedCharacter && (
                 <div className="fixed bottom-8 left-0 right-0 flex justify-center z-10">
                    <button 
                        onClick={startGame}
                        className="px-12 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-transform animate-pulse"
                    >
                        START RUN
                    </button>
                 </div>
            )}
        </>
      )}

      {gameState === GameState.PLAYING && selectedCharacter && (
        <GameEngine 
            character={selectedCharacter} 
            onGameOver={handleGameOver} 
            gameState={gameState}
        />
      )}

      {gameState === GameState.GAME_OVER && (
        <GameOver 
            score={finalScore} 
            coins={finalCoins} 
            onRestart={restartGame} 
            onMenu={returnToMenu} 
        />
      )}
    </div>
  );
}

export default App;