
import React, { useState, useEffect } from 'react';
import { ArrowRight, Calculator } from 'lucide-react';

interface MathMinigameProps {
  onComplete: (success: boolean) => void;
}

const MathMinigame: React.FC<MathMinigameProps> = ({ onComplete }) => {
  const [problem, setProblem] = useState('');
  const [answers, setAnswers] = useState<number[]>([]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameState, setGameState] = useState<'PLAYING' | 'RESULT'>('PLAYING');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    generateProblem();
  }, []);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setSuccess(false);
            setGameState('RESULT');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  const generateProblem = () => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const isPlus = Math.random() > 0.5;
    
    const result = isPlus ? a + b : a - b;
    setProblem(`${a} ${isPlus ? '+' : '-'} ${b} = ?`);
    
    const correct = Math.floor(Math.random() * 3);
    setCorrectIndex(correct);
    
    const opts = [];
    for(let i=0; i<3; i++) {
        if (i === correct) {
            opts.push(result);
        } else {
            let fake = result + Math.floor(Math.random() * 10) - 5;
            if (fake === result) fake += 1;
            opts.push(fake);
        }
    }
    setAnswers(opts);
  };

  const handleAnswer = (index: number) => {
      if (gameState !== 'PLAYING') return;
      if (index === correctIndex) {
          setSuccess(true);
      } else {
          setSuccess(false);
      }
      setGameState('RESULT');
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95">
        {gameState === 'PLAYING' ? (
            <div className="flex flex-col items-center gap-8 w-full max-w-lg">
                <div className="text-center">
                    <h2 className="text-4xl font-black text-white mb-2 tracking-widest">REIKNINGUR</h2>
                    <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${(timeLeft / 10) * 100}%` }} />
                    </div>
                </div>

                <div className="bg-slate-800 border-4 border-cyan-500 p-10 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                    <span className="text-6xl font-mono font-bold text-white">{problem}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 w-full">
                    {answers.map((ans, i) => (
                        <button 
                            key={i}
                            onClick={() => handleAnswer(i)}
                            className="p-6 bg-slate-800 border-2 border-slate-600 hover:border-white hover:bg-slate-700 rounded-xl text-3xl font-bold text-white transition-all transform hover:scale-105"
                        >
                            {ans}
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center animate-scale-in">
                 <h1 className={`text-7xl font-black mb-8 transform -skew-x-12 ${success ? 'text-green-400' : 'text-red-500'}`}>
                    {success ? "RÉTT!" : "RANGT!"}
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

export default MathMinigame;
