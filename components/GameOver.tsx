import React from 'react';
import { RefreshCw, Home } from 'lucide-react';

interface GameOverProps {
  score: number;
  coins: number;
  onRestart: () => void;
  onMenu: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, coins, onRestart, onMenu }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-md">
      <div className="flex flex-col items-center p-8 bg-slate-800 rounded-2xl border-2 border-slate-700 shadow-2xl max-w-sm w-full mx-4 animate-scale-in">
        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter italic transform -skew-x-6">WIPEOUT!</h2>
        <p className="text-slate-400 mb-8">Run complete</p>

        <div className="w-full grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-900 p-4 rounded-lg flex flex-col items-center">
                <span className="text-slate-500 text-xs font-bold uppercase mb-1">Score</span>
                <span className="text-3xl font-mono text-cyan-400">{score}</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg flex flex-col items-center">
                <span className="text-slate-500 text-xs font-bold uppercase mb-1">Coins</span>
                <span className="text-3xl font-mono text-yellow-400">{coins}</span>
            </div>
        </div>

        <button 
            onClick={onRestart}
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl mb-3 flex items-center justify-center gap-2 transition-colors"
        >
            <RefreshCw size={20} />
            RUN AGAIN
        </button>
        
        <button 
            onClick={onMenu}
            className="w-full py-3 bg-transparent border border-slate-600 hover:border-slate-500 text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
            <Home size={20} />
            MAIN MENU
        </button>
      </div>
    </div>
  );
};

export default GameOver;