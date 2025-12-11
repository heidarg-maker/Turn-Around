
import React from 'react';
import { Character, PowerUpType } from '../types';
import { CHARACTERS } from '../constants';
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
        case PowerUpType.DOUBLE_COINS: return <CircleDot className={className} />; // Represents Pizza/Double Coin
        case PowerUpType.SLOW_TIME: return <Timer className={className} />;
        case PowerUpType.PHASE_SHIFT: return <Ghost className={className} />;
        case PowerUpType.FLOATY: return <Wind className={className} />;
        case PowerUpType.SUPER_JUMP: return <div className={`font-bold text-xl ${className}`}>UP</div>;
        default: return <User className={className} />;
    }
}

// Custom SVG Portrait for Roberto (Police Officer)
const RobertoPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
            <linearGradient id="copBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
        </defs>
        
        {/* Background Aura */}
        <circle cx="50" cy="50" r="45" fill="#e0f2fe" opacity="0.2" />

        {/* Uniform Body */}
        <path d="M 20 100 L 20 70 Q 50 60 80 70 L 80 100" fill="url(#copBlue)" />
        <path d="M 40 70 L 50 100 L 60 70" fill="#cbd5e1" opacity="0.3" /> {/* Tie/Shirt detail */}
        
        {/* Badge */}
        <path d="M 25 75 L 35 75 L 30 85 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />

        {/* Head */}
        <rect x="35" y="40" width="30" height="35" rx="10" fill="url(#skin)" />
        
        {/* Curls (Hair) */}
        <circle cx="35" cy="45" r="5" fill="#3f2c22" />
        <circle cx="65" cy="45" r="5" fill="#3f2c22" />
        <circle cx="33" cy="52" r="4" fill="#3f2c22" />
        <circle cx="67" cy="52" r="4" fill="#3f2c22" />
        
        {/* Police Cap */}
        <path d="M 25 35 Q 50 20 75 35 L 75 45 Q 50 35 25 45 Z" fill="#172554" />
        <path d="M 25 45 Q 50 55 75 45" fill="#000" opacity="0.4" /> {/* Brim shadow */}
        <rect x="46" y="28" width="8" height="8" fill="#fbbf24" rx="2" /> {/* Badge on hat */}
        
        {/* Sunglasses */}
        <path d="M 38 52 Q 45 52 52 52 L 52 58 Q 45 62 38 58 Z" fill="#111" />
        <path d="M 62 52 Q 55 52 48 52 L 48 58 Q 55 62 62 58 Z" fill="#111" />
        <line x1="48" y1="54" x2="52" y2="54" stroke="#111" strokeWidth="2" />
        
        {/* Smile */}
        <path d="M 45 68 Q 50 72 55 68" stroke="#7f1d1d" strokeWidth="2" fill="none" />
    </svg>
);

// Custom SVG Portrait for Steve (Living Axe)
const StevePortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
            <linearGradient id="wood" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a16207" />
                <stop offset="100%" stopColor="#713f12" />
            </linearGradient>
            <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e5e7eb" />
                <stop offset="50%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#4b5563" />
            </linearGradient>
        </defs>

        {/* Handle Body */}
        <rect x="42" y="40" width="16" height="60" rx="4" fill="url(#wood)" stroke="#451a03" strokeWidth="1" />
        
        {/* Wood Texture */}
        <path d="M 46 50 L 46 80" stroke="#78350f" strokeWidth="1" opacity="0.5" />
        <path d="M 54 60 L 54 90" stroke="#78350f" strokeWidth="1" opacity="0.5" />

        {/* Axe Head (Face) */}
        <path d="M 42 15 L 42 45 L 85 45 Q 95 30 85 15 Z" fill="url(#metal)" stroke="#374151" strokeWidth="2" /> {/* Right Blade */}
        <path d="M 42 15 L 42 45 L 15 45 Q 5 30 15 15 Z" fill="url(#metal)" stroke="#374151" strokeWidth="2" /> {/* Left Blade */}
        
        {/* Top Spike */}
        <path d="M 42 15 L 50 5 L 58 15 Z" fill="#6b7280" />

        {/* Face on Metal */}
        <circle cx="30" cy="30" r="5" fill="#fff" stroke="#000" strokeWidth="1" />
        <circle cx="30" cy="30" r="2" fill="#000" />
        <circle cx="70" cy="30" r="5" fill="#fff" stroke="#000" strokeWidth="1" />
        <circle cx="70" cy="30" r="2" fill="#000" />
        
        {/* Angry Eyebrows */}
        <line x1="22" y1="24" x2="38" y2="28" stroke="#000" strokeWidth="2" />
        <line x1="78" y1="24" x2="62" y2="28" stroke="#000" strokeWidth="2" />
        
        {/* Mouth */}
        <rect x="45" y="35" width="10" height="4" rx="2" fill="#000" />
    </svg>
);

// Custom SVG Portrait for El (11yo girl, buzzcut)
const ElPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
         <defs>
            <radialGradient id="elSkin" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fecaca" />
                <stop offset="100%" stopColor="#f87171" />
            </radialGradient>
        </defs>

        {/* Red Shirt */}
        <path d="M 15 100 L 15 75 Q 50 85 85 75 L 85 100" fill="#dc2626" />
        <path d="M 35 78 Q 50 90 65 78" stroke="#b91c1c" strokeWidth="2" fill="none" /> {/* Collar shadow */}

        {/* Head */}
        <ellipse cx="50" cy="50" rx="28" ry="32" fill="url(#elSkin)" />

        {/* Buzzcut Hair Texture */}
        <path d="M 22 40 Q 50 10 78 40" fill="#573a2e" opacity="0.8" />
        <path d="M 22 40 Q 50 10 78 40" fill="none" stroke="#3e2418" strokeWidth="2" strokeDasharray="3 3" />

        {/* Intense Eyes */}
        <path d="M 35 48 Q 40 45 45 48" stroke="#374151" strokeWidth="1" fill="none" />
        <circle cx="40" cy="52" r="3" fill="#1f2937" />
        <path d="M 55 48 Q 60 45 65 48" stroke="#374151" strokeWidth="1" fill="none" />
        <circle cx="60" cy="52" r="3" fill="#1f2937" />

        {/* Nose Bleed */}
        <path d="M 52 58 L 54 58 L 53 60 Z" fill="#ef4444" />
        <path d="M 53 60 Q 54 65 52 70" stroke="#b91c1c" strokeWidth="2" fill="none" />
        <circle cx="52" cy="72" r="1.5" fill="#b91c1c" />

        {/* Mouth */}
        <path d="M 45 70 Q 50 72 55 70" stroke="#7f1d1d" strokeWidth="1" fill="none" />
    </svg>
);

// Custom SVG Portrait for Lord Amber (Yellow Vader)
const LordAmberPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
         <defs>
            <linearGradient id="goldHelm" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
        </defs>

        {/* Helmet Dome */}
        <path d="M 20 45 Q 50 -10 80 45" fill="url(#goldHelm)" stroke="#78350f" strokeWidth="1" />
        <path d="M 15 45 L 85 45 L 90 70 L 10 70 Z" fill="url(#goldHelm)" stroke="#78350f" strokeWidth="1" />

        {/* Face Mask */}
        <path d="M 25 45 L 75 45 L 70 90 L 30 90 Z" fill="#171717" />

        {/* Eyes (Visor) */}
        <path d="M 30 55 L 45 60 L 35 65 Z" fill="#404040" />
        <path d="M 70 55 L 55 60 L 65 65 Z" fill="#404040" />
        
        {/* Grill / Breather */}
        <path d="M 40 75 L 60 75 L 58 90 L 42 90 Z" fill="#262626" stroke="#525252" strokeWidth="1" />
        <line x1="45" y1="75" x2="45" y2="90" stroke="#525252" strokeWidth="1" />
        <line x1="50" y1="75" x2="50" y2="90" stroke="#525252" strokeWidth="1" />
        <line x1="55" y1="75" x2="55" y2="90" stroke="#525252" strokeWidth="1" />

        {/* Shiny Highlight */}
        <ellipse cx="35" cy="25" rx="5" ry="10" fill="#fff" opacity="0.3" transform="rotate(-30 35 25)" />
    </svg>
);

// Custom SVG Portrait for Hopper (Sheriff)
const HopperPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
         <defs>
            <linearGradient id="hat" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a16207" />
                <stop offset="100%" stopColor="#713f12" />
            </linearGradient>
        </defs>

        {/* Hat Brim */}
        <ellipse cx="50" cy="35" rx="42" ry="10" fill="#78350f" />
        {/* Hat Top */}
        <path d="M 28 35 L 32 15 Q 50 5 68 15 L 72 35 Z" fill="url(#hat)" />
        <path d="M 30 30 Q 50 25 70 30" stroke="#451a03" strokeWidth="2" fill="none" opacity="0.5" />

        {/* Face */}
        <rect x="30" y="35" width="40" height="40" rx="15" fill="#fecaca" />

        {/* Beard */}
        <path d="M 30 60 Q 30 85 50 85 Q 70 85 70 60 L 70 55 L 30 55 Z" fill="#78350f" />

        {/* Mustache */}
        <path d="M 35 60 Q 50 50 65 60" fill="none" stroke="#451a03" strokeWidth="5" strokeLinecap="round" />

        {/* Eyes */}
        <circle cx="40" cy="50" r="3" fill="#000" />
        <circle cx="60" cy="50" r="3" fill="#000" />
        
        {/* Cigarette/Toothpick (optional detail) */}
        <line x1="55" y1="65" x2="65" y2="68" stroke="#fff" strokeWidth="2" />
    </svg>
);

// Custom SVG Portrait for 6-7 (Numbers)
const SixSevenPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full bg-slate-900">
         {/* Digital Grid Background */}
         <path d="M 0 50 L 100 50 M 50 0 L 50 100" stroke="#10b981" strokeWidth="0.5" opacity="0.2" />
         
         {/* Number 6 */}
         <text x="25" y="70" fontSize="60" fontWeight="900" fill="#34d399" fontFamily="monospace" stroke="#064e3b" strokeWidth="2" filter="drop-shadow(0 0 5px #34d399)">6</text>
         
         {/* Number 7 (Interlocking) */}
         <text x="55" y="70" fontSize="60" fontWeight="900" fill="#10b981" fontFamily="monospace" stroke="#064e3b" strokeWidth="2" filter="drop-shadow(0 0 5px #10b981)">7</text>
         
         {/* Connection Circuit */}
         <path d="M 40 40 L 60 40" stroke="#ecfdf5" strokeWidth="2" strokeDasharray="4 2" />
         <circle cx="40" cy="40" r="3" fill="#fff" />
         <circle cx="60" cy="40" r="3" fill="#fff" />
    </svg>
);

// Custom SVG Portrait for Specter (Ghost)
const SpecterPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
         <defs>
             <radialGradient id="ghostGlow" cx="50%" cy="50%" r="50%">
                 <stop offset="0%" stopColor="#e2e8f0" stopOpacity="1" />
                 <stop offset="80%" stopColor="#94a3b8" stopOpacity="0.8" />
                 <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
             </radialGradient>
         </defs>

        {/* Ghost Body */}
        <path d="M 20 90 L 20 50 Q 50 0 80 50 L 80 90 Q 70 80 60 90 Q 50 80 40 90 Q 30 80 20 90" fill="url(#ghostGlow)" filter="drop-shadow(0 0 8px #cbd5e1)" />
        
        {/* Hollow Eyes */}
        <ellipse cx="35" cy="45" rx="6" ry="8" fill="#0f172a" />
        <ellipse cx="65" cy="45" rx="6" ry="8" fill="#0f172a" />
        
        {/* Glowing Pupils */}
        <circle cx="35" cy="45" r="2" fill="#38bdf8" opacity="0.8" />
        <circle cx="65" cy="45" r="2" fill="#38bdf8" opacity="0.8" />

        {/* Wailing Mouth */}
        <ellipse cx="50" cy="65" rx="8" ry="12" fill="#0f172a" />
        
        {/* Ectoplasm drips */}
        <circle cx="30" cy="80" r="3" fill="#e2e8f0" opacity="0.6" />
        <circle cx="70" cy="75" r="2" fill="#e2e8f0" opacity="0.6" />
    </svg>
);

// Custom SVG Portrait for Shotgun-Bomb (Pig with Bazooka)
const ShotgunBombPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
            <linearGradient id="pigSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbcfe8" />
                <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
        </defs>

        {/* Pig Head */}
        <circle cx="50" cy="55" r="30" fill="url(#pigSkin)" />

        {/* Ears */}
        <path d="M 25 30 L 35 45 L 20 50 Z" fill="#f472b6" />
        <path d="M 75 30 L 65 45 L 80 50 Z" fill="#f472b6" />

        {/* Army Bandana */}
        <path d="M 20 35 Q 50 25 80 35 L 80 45 Q 50 35 20 45 Z" fill="#14532d" />
        <circle cx="50" cy="38" r="4" fill="#ef4444" /> {/* Sun symbol */}

        {/* Snout */}
        <ellipse cx="50" cy="65" rx="12" ry="9" fill="#f9a8d4" stroke="#db2777" strokeWidth="1" />
        <circle cx="46" cy="65" r="3" fill="#831843" />
        <circle cx="54" cy="65" r="3" fill="#831843" />

        {/* Eyes */}
        <circle cx="40" cy="50" r="4" fill="#000" />
        <circle cx="60" cy="50" r="4" fill="#000" />
        <path d="M 35 45 L 45 48" stroke="#000" strokeWidth="2" /> {/* Angry brows */}
        <path d="M 65 45 L 55 48" stroke="#000" strokeWidth="2" />

        {/* Bazooka Barrel peaking out */}
        <rect x="70" y="55" width="30" height="15" fill="#374151" transform="rotate(-15 70 55)" />
        <rect x="90" y="50" width="5" height="25" fill="#1f2937" transform="rotate(-15 90 50)" />
    </svg>
);

// Custom SVG Portrait for Bragnaldo (Soccer Star)
const BragnaldoPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Green Jersey */}
        <path d="M 15 100 L 15 70 Q 50 60 85 70 L 85 100" fill="#15803d" />
        <rect x="45" y="70" width="10" height="30" fill="#b91c1c" /> {/* Red Stripe */}
        <path d="M 40 70 L 60 70" stroke="#fff" strokeWidth="1" /> {/* Collar */}

        {/* Neck */}
        <rect x="40" y="55" width="20" height="15" fill="#fca5a5" />

        {/* Head */}
        <ellipse cx="50" cy="45" rx="25" ry="30" fill="#fca5a5" />

        {/* Blonde Curls */}
        <circle cx="50" cy="15" r="10" fill="#fcd34d" />
        <circle cx="35" cy="20" r="10" fill="#fcd34d" />
        <circle cx="65" cy="20" r="10" fill="#fcd34d" />
        <circle cx="25" cy="35" r="8" fill="#fcd34d" />
        <circle cx="75" cy="35" r="8" fill="#fcd34d" />
        <circle cx="25" cy="50" r="6" fill="#fcd34d" />
        <circle cx="75" cy="50" r="6" fill="#fcd34d" />

        {/* Face */}
        <circle cx="40" cy="45" r="3" fill="#1f2937" />
        <circle cx="60" cy="45" r="3" fill="#1f2937" />
        <path d="M 40 60 Q 50 65 60 60" stroke="#be123c" strokeWidth="2" fill="none" /> {/* Smile */}
        
        {/* Soccer Ball (Small icon) */}
        <circle cx="80" cy="80" r="12" fill="#fff" stroke="#000" strokeWidth="1" />
        <path d="M 80 80 L 80 72 M 80 80 L 87 84 M 80 80 L 73 84" stroke="#000" strokeWidth="1" />
        <path d="M 73 84 L 75 90 L 85 90 L 87 84" fill="none" stroke="#000" strokeWidth="1" />
    </svg>
);

// Custom SVG Portrait for Cyclo (Half Man Half Motorcycle)
const CycloPortrait = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
         <defs>
             <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" stopColor="#e2e8f0" />
                 <stop offset="50%" stopColor="#94a3b8" />
                 <stop offset="100%" stopColor="#475569" />
             </linearGradient>
         </defs>

         {/* Mechanical Body */}
         <path d="M 20 60 L 80 60 L 90 80 L 10 80 Z" fill="#334155" />
         <rect x="30" y="60" width="40" height="20" fill="#1e293b" />
         
         {/* Wheels */}
         <circle cx="20" cy="80" r="12" fill="#0f172a" stroke="url(#chrome)" strokeWidth="4" />
         <circle cx="80" cy="80" r="12" fill="#0f172a" stroke="url(#chrome)" strokeWidth="4" />
         <circle cx="20" cy="80" r="4" fill="#94a3b8" />
         <circle cx="80" cy="80" r="4" fill="#94a3b8" />

         {/* Rider Torso */}
         <path d="M 35 60 L 65 60 L 60 30 L 40 30 Z" fill="#475569" />
         <rect x="40" y="35" width="20" height="25" fill="#0f172a" rx="5" /> {/* Jacket */}
         
         {/* Helmet Head */}
         <circle cx="50" cy="25" r="14" fill="#fca5a5" /> {/* Skin under helmet? */}
         <path d="M 35 15 Q 50 5 65 15 L 65 30 Q 50 35 35 30 Z" fill="#0284c7" /> {/* Helmet */}
         <path d="M 38 18 L 62 18 L 60 26 L 40 26 Z" fill="#38bdf8" /> {/* Visor */}
         
         {/* Handlebars */}
         <path d="M 25 45 L 40 40" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
         <path d="M 75 45 L 60 40" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

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
          
          let Portrait = null;
          if (char.id === 'char_1') Portrait = RobertoPortrait;
          else if (char.id === 'char_2') Portrait = StevePortrait;
          else if (char.id === 'char_3') Portrait = ElPortrait;
          else if (char.id === 'char_4') Portrait = LordAmberPortrait;
          else if (char.id === 'char_5') Portrait = HopperPortrait;
          else if (char.id === 'char_6') Portrait = SixSevenPortrait;
          else if (char.id === 'char_7') Portrait = SpecterPortrait;
          else if (char.id === 'char_8') Portrait = ShotgunBombPortrait;
          else if (char.id === 'char_9') Portrait = BragnaldoPortrait;
          else if (char.id === 'char_10') Portrait = CycloPortrait;

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
              {/* Character Visual Placeholder */}
              <div 
                className={`w-12 h-12 rounded-md mb-2 flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 overflow-hidden`}
                style={{ backgroundColor: (Portrait) ? '#fff' : char.color }}
              >
                 {Portrait ? (
                     <div className="w-full h-full"><Portrait /></div>
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
