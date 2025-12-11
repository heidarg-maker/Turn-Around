
import React from 'react';
import { Character, PowerUpType } from '../types';
import { CHARACTERS } from '../constants';
import { CHARACTER_SVGS } from './CharacterAssets';
import { User, Shield, Zap, Magnet, Timer, Ghost, Wind, CircleDot } from 'lucide-react';

interface CharacterSelectionProps {
  onSelect: (character: Character) => void;
  selectedId: string | null;
}

const PowerUpIcon = ({ type, className }: { type: PowerUpType, className?: string }) => {
    switch(type) {
        case PowerUpType.SHIELD: return <Shield className={className} />;
        case PowerUpType.DOUBLE_SCORE: return <Zap className={className} />;
        case PowerUpType.MAGNET: return <Magnet className={className} />;
        case PowerUpType.DOUBLE_COINS: return <CircleDot className={className} />;
        case PowerUpType.SLOW_TIME: return <Timer className={className} />;
        case PowerUpType.PHASE_SHIFT: return <Ghost className={className} />;
        case PowerUpType.FLOATY: return <Wind className={className} />;
        case PowerUpType.SUPER_JUMP: return <div className={`font-bold text-xl ${className}`}>UP</div>;
        default: return <User className={className} />;
    }
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onSelect, selectedId }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 bg-slate-900 text-white overflow-hidden">
      <div className="mb-4 text-center animate-fade-in-down">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-600 mb-1 italic transform -skew-x-6">
          5. bekkur
        </h1>
        <p className="text-slate-400 text-xs">Veldu Leikmann</p>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 w-full max-w-7xl px-2">
        {CHARACTERS.map((char) => {
          const isSelected = selectedId === char.id;
          const svgString = CHARACTER_SVGS[char.id];

          return (
            <button
              key={char.id}
              onClick={() => onSelect(char)}
              className={`
                relative group flex flex-col items-center p-2 rounded-lg transition-all duration-300
                border overflow-hidden
                ${isSelected 
                  ? 'border-white bg-slate-800 scale-105 shadow-[0_0_10px_rgba(255,255,255,0.3)] z-10' 
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700'}
              `}
            >
              <div 
                className={`w-12 h-12 rounded-md mb-2 flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 overflow-hidden bg-white`}
                style={{ backgroundColor: svgString ? '#fff' : char.color }}
              >
                 {svgString ? (
                     <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: svgString }} />
                 ) : (
                     <PowerUpIcon type={char.powerUp} className="text-white w-6 h-6 opacity-90" />
                 )}
              </div>

              <h3 className="font-mono font-bold text-[10px] md:text-xs mb-1 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis w-full">{char.name}</h3>
              
              <div className="hidden md:flex text-[8px] text-slate-400 text-center mb-1 min-h-[30px] items-center justify-center px-1 leading-none opacity-80">
                <span className="line-clamp-2">{char.description}</span>
              </div>

              {isSelected && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-white opacity-50" />
              )}
            </button>
          );
        })}
      </div>
      
      {selectedId && (
        <div className="mt-4 animate-bounce">
            <span className="text-xs text-cyan-400 font-mono tracking-widest">KERFIÐ TILBÚIÐ - ÝTU Á BYRJA</span>
        </div>
      )}
    </div>
  );
};

export default CharacterSelection;
