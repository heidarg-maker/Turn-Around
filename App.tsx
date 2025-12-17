
import React, { useState } from 'react';
import CharacterSelection from './components/CharacterSelection';
import GameEngine from './components/GameEngine';
import GameOver from './components/GameOver';
import CannonMinigame from './components/CannonMinigame';
import MathMinigame from './components/MathMinigame';
import CodeMinigame from './components/CodeMinigame';
import DodgeMinigame from './components/DodgeMinigame';
import { GameState, Character, GameStats, MinigameType } from './types';
import { GAME_CONFIG } from './constants';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [finalCoins, setFinalCoins] = useState(0);
  
  // State to hold stats between game and minigame
  const [currentStats, setCurrentStats] = useState<GameStats | undefined>(undefined);
  const [startWithRampage, setStartWithRampage] = useState(false);
  const [currentMinigame, setCurrentMinigame] = useState<MinigameType>(MinigameType.CANNON);

  const handleCharacterSelect = (char: Character) => {
    setSelectedCharacter(char);
  };

  const startGame = () => {
      if (selectedCharacter) {
          setCurrentStats(undefined);
          setStartWithRampage(false);
          setGameState(GameState.PLAYING);
      }
  };

  const handleGameOver = (score: number, coins: number) => {
    setFinalScore(score);
    setFinalCoins(coins);
    setGameState(GameState.GAME_OVER);
  };

  const handleMinigameTrigger = (stats: GameStats) => {
      setCurrentStats(stats);
      // Randomly select one of the available minigames
      const types = [
          MinigameType.CANNON, 
          MinigameType.MATH, 
          MinigameType.CODE, 
          MinigameType.DODGE
      ];
      const randomType = types[Math.floor(Math.random() * types.length)];
      setCurrentMinigame(randomType);
      
      setGameState(GameState.MINIGAME);
  };

  const handleMinigameComplete = (success: boolean) => {
      if (!currentStats) return;

      let newHealth = currentStats.health;

      if (success) {
          // Win: Gain a heart (up to max)
          if (newHealth < GAME_CONFIG.MAX_HEALTH) {
              newHealth += 1;
          }
      } else {
          // Lose: Lose a heart
          newHealth -= 1;
      }

      if (newHealth <= 0) {
          // Game Over if health depleted
          handleGameOver(currentStats.score, currentStats.coins);
      } else {
          // Resume game with updated health
          setCurrentStats({
              ...currentStats,
              health: newHealth
          });
          setStartWithRampage(success); // Rampage only on success
          setGameState(GameState.PLAYING);
      }
  };

  const restartGame = () => {
    setCurrentStats(undefined);
    setStartWithRampage(false);
    setGameState(GameState.PLAYING);
  };

  const returnToMenu = () => {
    setGameState(GameState.MENU);
    setSelectedCharacter(null);
    setCurrentStats(undefined);
  };

  const renderMinigame = () => {
      switch (currentMinigame) {
          case MinigameType.CANNON:
              return <CannonMinigame onComplete={handleMinigameComplete} />;
          case MinigameType.MATH:
              return <MathMinigame onComplete={handleMinigameComplete} />;
          case MinigameType.CODE:
              return <CodeMinigame onComplete={handleMinigameComplete} />;
          case MinigameType.DODGE:
              return <DodgeMinigame onComplete={handleMinigameComplete} />;
          default:
              return <CannonMinigame onComplete={handleMinigameComplete} />;
      }
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
                        BYRJA
                    </button>
                 </div>
            )}
        </>
      )}

      {gameState === GameState.PLAYING && selectedCharacter && (
        <GameEngine 
            character={selectedCharacter} 
            onGameOver={handleGameOver} 
            onMinigameTrigger={handleMinigameTrigger}
            onQuit={returnToMenu}
            gameState={gameState}
            initialStats={currentStats}
            startWithRampage={startWithRampage}
        />
      )}
      
      {gameState === GameState.MINIGAME && renderMinigame()}

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
