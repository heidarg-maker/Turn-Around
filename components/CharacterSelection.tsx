import React from 'react';
import { Character, PowerUpType } from '../types';
import { CHARACTERS } from '../constants';
import { User, Shield, Zap, Magnet, Coins, Timer, Ghost, Wind } from 'lucide-react';

interface CharacterSelectionProps {
  onSelect: (character: Character) => void;
  selectedId: string | null;
}

const PowerUpIcon = ({ type, className }: { type: PowerUpType, className?: string }) => {
    switch(type) {
        case PowerUpType.SHIELD: return <Shield className={className} />;
        case PowerUpType.DOUBLE_SCORE: return <Zap className={className} />;
        case PowerUpType.MAGNET: return <Magnet className={className} />;
        case PowerUpType.DOUBLE_COINS: return <Coins className={className} />;
        case PowerUpType.SLOW_TIME: return <Timer className={className} />;
        case PowerUpType.PHASE_SHIFT: return <Ghost className={className} />;
        case PowerUpType.FLOATY: return <Wind className={className} />;
        case PowerUpType.SUPER_JUMP: return <div className={`font-bold text-xl ${className}`}>UP</div>;
        default: return <User className={className} />;
    }
}

// Custom SVG Portrait for Roberto
const RobertoPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full transform scale-90">
        <circle cx="20" cy="45" r="10" fill="#3e2723" />
        <circle cx="80" cy="45" r="10" fill="#3e2723" />
        <circle cx="25" cy="30" r="10" fill="#3e2723" />
        <circle cx="75" cy="30" r="10" fill="#3e2723" />
        <circle cx="50" cy="20" r="12" fill="#3e2723" />
        <circle cx="50" cy="55" r="30" fill="#dba188" />
        <rect x="5" y="40" width="15" height="35" rx="4" fill="#64748b" />
        <rect x="80" y="40" width="15" height="35" rx="4" fill="#64748b" />
        <path d="M 12 42 Q 50 -10 88 42" stroke="#64748b" strokeWidth="6" fill="none" />
        <path d="M 30 35 Q 50 30 70 35 L 70 40 L 30 40 Z" fill="#1e3a8a" />
        <path d="M 25 35 Q 50 15 75 35" fill="#1e3a8a" />
        <circle cx="50" cy="28" r="4" fill="#fbbf24" />
        <circle cx="42" cy="55" r="3" fill="#1f2937" />
        <circle cx="58" cy="55" r="3" fill="#1f2937" />
        <path d="M 45 70 Q 50 75 55 70" stroke="#1f2937" strokeWidth="2" fill="none" />
    </svg>
);

// Custom SVG Portrait for Steve (Axe Person)
const StevePortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full transform scale-90">
        <rect x="42" y="50" width="16" height="50" rx="2" fill="#8d6e63" />
        <line x1="42" y1="50" x2="42" y2="100" stroke="#5d4037" strokeWidth="2" />
        <path d="M 50 10 L 85 15 Q 95 30 85 45 L 50 50 Z" fill="#9ca3af" stroke="#4b5563" strokeWidth="2" /> 
        <path d="M 50 10 L 15 15 Q 5 30 15 45 L 50 50 Z" fill="#9ca3af" stroke="#4b5563" strokeWidth="2" />
        <rect x="40" y="10" width="20" height="40" fill="#4b5563" rx="2" />
        <circle cx="35" cy="30" r="4" fill="#fff" />
        <circle cx="35" cy="30" r="1.5" fill="#000" />
        <circle cx="65" cy="30" r="4" fill="#fff" />
        <circle cx="65" cy="30" r="1.5" fill="#000" />
        <path d="M 45 42 Q 50 45 55 42" stroke="#000" strokeWidth="2" fill="none" />
        <line x1="28" y1="24" x2="40" y2="28" stroke="#000" strokeWidth="2" />
        <line x1="72" y1="24" x2="60" y2="28" stroke="#000" strokeWidth="2" />
    </svg>
);

// Custom SVG Portrait for El
const ElPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full transform scale-90">
        {/* Red Shirt */}
        <path d="M 10 90 Q 50 110 90 90 L 90 60 Q 50 70 10 60 Z" fill="#ef4444" />
        {/* Head */}
        <circle cx="50" cy="50" r="32" fill="#fca5a5" />
        {/* Buzzcut */}
        <path d="M 18 45 Q 50 10 82 45" fill="none" stroke="#5c4033" strokeWidth="2" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="32" fill="none" stroke="#5c4033" strokeWidth="1" strokeDasharray="1 3" opacity="0.3" />
        {/* Face */}
        <circle cx="38" cy="50" r="3" fill="#1f2937" />
        <circle cx="62" cy="50" r="3" fill="#1f2937" />
        {/* Nose bleeding */}
        <path d="M 48 55 L 52 55 L 50 58 Z" fill="#d1d5db" />
        <path d="M 45 68 Q 50 72 55 68" stroke="#1f2937" strokeWidth="2" fill="none" />
        {/* Blood Drip */}
        <path d="M 46 60 L 46 65 Q 46 67 44 65" stroke="#991b1b" strokeWidth="2" fill="none" />
    </svg>
);

// Custom SVG Portrait for Lord Amber (Yellow Vader)
const LordAmberPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full transform scale-90">
        {/* Helmet Top */}
        <path d="M 20 50 Q 50 0 80 50" fill="#fbbf24" stroke="#000" strokeWidth="2" />
        <path d="M 15 50 L 85 50 L 90 80 L 10 80 Z" fill="#fbbf24" stroke="#000" strokeWidth="2" />
        {/* Mask Face */}
        <path d="M 25 50 L 75 50 L 70 90 L 30 90 Z" fill="#000" />
        {/* Grill */}
        <line x1="40" y1="75" x2="40" y2="88" stroke="#333" strokeWidth="2" />
        <line x1="50" y1="75" x2="50" y2="88" stroke="#333" strokeWidth="2" />
        <line x1="60" y1="75" x2="60" y2="88" stroke="#333" strokeWidth="2" />
        {/* Eyes */}
        <path d="M 32 60 Q 40 55 48 60 L 45 70 L 35 70 Z" fill="#333" />
        <path d="M 52 60 Q 60 55 68 60 L 65 70 L 55 70 Z" fill="#333" />
    </svg>
);

// Custom SVG Portrait for Hopper
const HopperPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full transform scale-90">
        {/* Hat */}
        <ellipse cx="50" cy="35" rx="40" ry="10" fill="#78350f" />
        <path d="M 30 35 Q 50 10 70 35" fill="#78350f" />
        <rect x="30" y="30" width="40" height="10" fill="#5D4037" />
        {/* Head */}
        <circle cx="50" cy="55" r="28" fill="#e5e5e5" />
        <circle cx="50" cy="55" r="28" fill="#fca5a5" />
        {/* Beard */}
        <path d="M 25 55 Q 50 90 75 55 L 75 60 Q 50 100 25 60 Z" fill="#78350f" />
        {/* Mustache */}
        <path d="M 35 65 Q 50 60 65 65" stroke="#78350f" strokeWidth="6" fill="none" />
        {/* Face */}
        <circle cx="40" cy="50" r="3" fill="#1f2937" />
        <circle cx="60" cy="50" r="3" fill="#1f2937" />
    </svg>
);

// Custom SVG Portrait for 6-7
const SixSevenPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full transform scale-90 bg-emerald-900 rounded-full">
         <text x="30" y="70" fontSize="50" fontWeight="bold" fill="#34d399" fontFamily="monospace">6</text>
         <text x="60" y="70" fontSize="50" fontWeight="bold" fill="#10b981" fontFamily="monospace">7</text>
         <path d="M 20 80 Q 50 90 80 80" stroke="#fff" strokeWidth="2" fill="none"/>
    </svg>
);

// Custom SVG Portrait for Specter (Ghost)
const SpecterPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full transform scale-90">
        <path d="M 20 90 L 20 50 Q 50 0 80 50 L 80 90 L 70 80 L 60 90 L 50 80 L 40 90 L 30 80 Z" fill="#cbd5e1" opacity="0.8" />
        <circle cx="35" cy="45" r="5" fill="#0f172a" />
        <circle cx="65" cy="45" r="5" fill="#0f172a" />
        <ellipse cx="50" cy="60" rx="8" ry="12" fill="#0f172a" />
        <path d="M 20 60 Q 10 50 10 40" stroke="#cbd5e1" strokeWidth="3" fill="none" />
        <path d="M 80 60 Q 90 50 90 40" stroke="#cbd5e1" strokeWidth="3" fill="none" />
    </svg>
);

// Custom SVG Portrait for Shotgun-Bomb (Pig with Bazooka)
const ShotgunBombPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full transform scale-90">
        {/* Bazooka (Behind) */}
        <rect x="60" y="20" width="20" height="60" fill="#374151" rx="2" transform="rotate(30 70 50)" />
        <path d="M 70 20 L 80 15 L 90 25 L 80 30 Z" fill="#ef4444" transform="rotate(30 70 50)" />
        
        {/* Pig Head */}
        <circle cx="50" cy="50" r="32" fill="#f472b6" />
        
        {/* Ears */}
        <path d="M 25 25 L 35 40 L 25 50 Z" fill="#f472b6" />
        <path d="M 75 25 L 65 40 L 75 50 Z" fill="#f472b6" />
        
        {/* Snout */}
        <ellipse cx="50" cy="58" rx="10" ry="8" fill="#fbcfe8" />
        <circle cx="47" cy="58" r="2.5" fill="#be185d" />
        <circle cx="53" cy="58" r="2.5" fill="#be185d" />
        
        {/* Eyes */}
        <circle cx="40" cy="45" r="4" fill="#000" />
        <circle cx="60" cy="45" r="4" fill="#000" />
        
        {/* Headband / Warpaint */}
        <rect x="25" y="30" width="50" height="6" fill="#155e75" />
    </svg>
);


const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onSelect, selectedId }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-900 text-white">
      <div className="mb-8 text-center animate-fade-in-down">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-600 mb-2 italic transform -skew-x-6">
          TURN AROUND
        </h1>
        <p className="text-slate-400">Select Pilot Module</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
        {CHARACTERS.map((char) => {
          const isSelected = selectedId === char.id;
          
          let Portrait = null;
          if (char.id === 'char_1') Portrait = RobertoPortrait;
          else if (char.id === 'char_2') Portrait = StevePortrait;
          else if (char.id === 'char_3') Portrait = ElPortrait;
          else if (char.id === 'char_4') Portrait = LordAmberPortrait;
          else if (char.id === 'char_5') Portrait = HopperPortrait;
          else if (char.id === 'char_6') Portrait = SixSevenPortrait;
          else if (char.id === 'char_7') Portrait = SpecterPortrait;
          else if (char.id === 'char_8') Portrait = ShotgunBombPortrait;

          return (
            <button
              key={char.id}
              onClick={() => onSelect(char)}
              className={`
                relative group flex flex-col items-center p-4 rounded-xl transition-all duration-300
                border-2 overflow-hidden
                ${isSelected 
                  ? 'border-white bg-slate-800 scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700'}
              `}
            >
              {/* Character Visual Placeholder */}
              <div 
                className={`w-20 h-20 rounded-lg mb-4 flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 overflow-hidden`}
                style={{ backgroundColor: (Portrait) ? '#fff' : char.color }}
              >
                 {Portrait ? (
                     <div className="w-full h-full"><Portrait /></div>
                 ) : (
                     <PowerUpIcon type={char.powerUp} className="text-white w-8 h-8 opacity-90" />
                 )}
              </div>

              <h3 className="font-mono font-bold text-base mb-1 tracking-wider">{char.name}</h3>
              
              <div className="text-xs text-slate-400 text-center mb-2 min-h-[40px] leading-tight flex items-center justify-center px-1">
                <span>{char.description}</span>
              </div>

              {isSelected && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-white opacity-50" />
              )}
            </button>
          );
        })}
      </div>
      
      {selectedId && (
        <div className="mt-8 animate-bounce">
            <span className="text-sm text-cyan-400 font-mono tracking-widest">SYSTEM READY - PRESS START</span>
        </div>
      )}
    </div>
  );
};

export default CharacterSelection;