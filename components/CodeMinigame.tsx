
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowUp, ArrowDown, ArrowLeft, ArrowRight as ArrowRightIcon } from 'lucide-react';

interface CodeMinigameProps {
  onComplete: (success: boolean) => void;
}

type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

const CodeMinigame: React.FC<CodeMinigameProps> = ({ onComplete }) => {
  const [sequence, setSequence] = useState<ArrowKey[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameState, setGameState] = useState<'PLAYING' | 'RESULT'>('PLAYING');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const keys: ArrowKey[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const newSeq = Array.from({ length: 6 }, () => keys[Math.floor(Math.random() * keys.length)]);
    setSequence(newSeq);
  }, []);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            setSuccess(false);
            setGameState('RESULT');
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          if (e.key === sequence[currentIndex]) {
              if (currentIndex === sequence.length - 1) {
                  setSuccess(true);
                  setGameState('RESULT');
              } else {
                  setCurrentIndex(prev => prev + 1);
              }
          } else {
              setSuccess(false);
              setGameState('RESULT');
          }
      }
  }, [gameState, sequence, currentIndex]);

  useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderIcon = (key: string, idx: number) => {
      const active = idx === currentIndex;
      const done = idx < currentIndex;
      const color = done ? 'text-green-500' : active ? 'text-white scale-125' : 'text-slate-600';
      
      switch(key) {
          case 'ArrowUp': return <ArrowUp size={48} className={`transition-all ${color}`} />;
          case 'ArrowDown': return <ArrowDown size={48} className={`transition-all ${color}`} />;
          case 'ArrowLeft': return <ArrowLeft size={48} className={`transition-all ${color}`} />;
          case 'ArrowRight': return <ArrowRightIcon size={48} className={`transition-all ${color}`} />;
          default: return null;
      }
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95">
        {gameState === 'PLAYING' ? (
            <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
                 <div className="text-center">
                    <h2 className="text-4xl font-black text-cyan-400 mb-2 tracking-widest uppercase">Hakkari</h2>
                    <p className="text-slate-400">Sláðu inn kóðann hratt!</p>
                </div>

                <div className="flex gap-4 p-8 bg-black/50 rounded-2xl border border-slate-700">
                    {sequence.map((key, i) => (
                        <div key={i} className="flex flex-col items-center">
                            {renderIcon(key, i)}
                        </div>
                    ))}
                </div>

                <div className="w-full h-8 bg-slate-800 rounded-full overflow-hidden border-2 border-white">
                    <div className="h-full bg-red-500" style={{ width: `${(timeLeft / 5) * 100}%` }} />
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center animate-scale-in">
                 <h1 className={`text-7xl font-black mb-8 transform -skew-x-12 ${success ? 'text-green-400' : 'text-red-500'}`}>
                    {success ? "AÐGANGUR VEITTUR" : "AÐGANGI HAFNAÐ"}
                </h1>
                <button 
                    onClick={() => onComplete(success)}
                    className="px-10 py-5 bg-white text-slate-900 text-2xl font-black rounded-xl shadow-2xl hover:scale-105 transition-transform flex items-center gap-4"
                >
                    {success ? "RAMPAGE!" : "HALDA ÁFRAM"}
                    <ArrowRight size={32} />
                </button>
            </div>
        )}
    </div>
  );
};

export default CodeMinigame;
