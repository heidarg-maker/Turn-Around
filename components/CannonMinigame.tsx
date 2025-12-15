import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowRight, Crosshair } from 'lucide-react';

interface CannonMinigameProps {
  onComplete: (success: boolean) => void;
}

const CannonMinigame: React.FC<CannonMinigameProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  // Game State
  const [power, setPower] = useState(0);
  const [angle, setAngle] = useState(0); 
  const [isCharging, setIsCharging] = useState(false);
  const [gameState, setGameState] = useState<'AIMING' | 'FIRING' | 'RESULT'>('AIMING');
  const [showButton, setShowButton] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const stateRef = useRef({
      angle: 0,
      power: 0,
      powerDir: 1,
      targetX: 0,
      targetSpeed: 3,
      projectile: { x: 0, y: 0, vx: 0, vy: 0, active: false }
  });

  const fireCannon = () => {
      setGameState('FIRING');
      const { angle, power } = stateRef.current;
      const fireAngleRad = (angle - 90) * (Math.PI / 180);

      // Velocity calculation
      stateRef.current.projectile = {
          x: window.innerWidth / 2,
          y: window.innerHeight - 120, // Fire from cannon mouth
          vx: Math.cos(fireAngleRad) * (power * 0.45), 
          vy: Math.sin(fireAngleRad) * (power * 0.45),
          active: true
      };
  };

  // Controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
      if (gameState !== 'AIMING') return;

      if (e.key === 'ArrowLeft') {
          stateRef.current.angle = Math.max(-60, stateRef.current.angle - 4);
          setAngle(stateRef.current.angle);
      } else if (e.key === 'ArrowRight') {
          stateRef.current.angle = Math.min(60, stateRef.current.angle + 4);
          setAngle(stateRef.current.angle);
      } else if (e.key === ' ') {
          if (e.repeat) return;
          
          if (!isCharging) {
              setIsCharging(true);
              stateRef.current.power = 0;
              stateRef.current.powerDir = 1;
          } else {
              setIsCharging(false);
              fireCannon();
          }
      }
  }, [gameState, isCharging]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
      // No action needed on key up for this control scheme
  }, []);

  useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
      };
  }, [handleKeyDown, handleKeyUp]);

  const handleContinue = () => {
      // Clean up before exiting
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      onComplete(success);
  };

  const gameLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const state = stateRef.current;

      // --- LOGIC ---

      // Update Target
      if (gameState === 'AIMING') {
          state.targetX += state.targetSpeed;
          // Bounce target
          if (state.targetX > w/2 - 50 || state.targetX < -w/2 + 50) {
              state.targetSpeed *= -1;
          }
      }

      // Update Power
      if (isCharging && gameState === 'AIMING') {
          state.power += 2.0 * state.powerDir;
          if (state.power >= 100) {
              state.power = 100;
              state.powerDir = -1;
          } else if (state.power <= 0) {
              state.power = 0;
              state.powerDir = 1;
          }
          setPower(state.power);
      }

      // Update Projectile
      if (gameState === 'FIRING' && state.projectile.active) {
          state.projectile.x -= state.projectile.vx;
          state.projectile.y += state.projectile.vy;
          state.projectile.vy += 0.25; // Gravity

          // Bounds Check (Miss)
          if (state.projectile.y > h || state.projectile.x < 0 || state.projectile.x > w) {
              state.projectile.active = false;
              setSuccess(false);
              setGameState('RESULT');
              setTimeout(() => setShowButton(true), 500);
          }

          // Collision Check (Hit)
          const targetY = 200;
          const targetX = w / 2 + state.targetX;
          const dist = Math.hypot(state.projectile.x - targetX, state.projectile.y - targetY);
          
          if (dist < 60) { 
              state.projectile.active = false;
              setSuccess(true);
              setGameState('RESULT');
              setTimeout(() => setShowButton(true), 500);
          }
      }

      // --- RENDER ---

      // 1. Hangar Background
      // Walls
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#1e293b'); // Dark Slate
      gradient.addColorStop(1, '#0f172a'); // Blacker
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Floor
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(w, h);
      ctx.lineTo(w, h - 150);
      ctx.lineTo(0, h - 150);
      ctx.fill();

      // Floor Grid/Plates
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for(let i=0; i<w; i+=100) {
          ctx.moveTo(i, h); ctx.lineTo(i + 50, h - 150);
      }
      ctx.stroke();

      // Window to Space
      ctx.fillStyle = '#020617';
      ctx.fillRect(w/2 - 200, 50, 400, 200);
      // Stars
      ctx.fillStyle = '#fff';
      if (Math.random() > 0.5) ctx.fillRect(w/2 - 150, 80, 2, 2);
      if (Math.random() > 0.5) ctx.fillRect(w/2 + 100, 150, 2, 2);
      // Window Frame
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 10;
      ctx.strokeRect(w/2 - 200, 50, 400, 200);

      // 2. Target
      const tx = w / 2 + state.targetX;
      const ty = 200;
      
      // Target Drop Line Guide
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tx, ty + 50);
      ctx.lineTo(tx, h - 150);
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Target Cord
      ctx.beginPath();
      ctx.moveTo(tx, 0);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Target Body
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#f87171';
      ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.arc(tx, ty, 50, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(tx, ty, 35, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(tx, ty, 15, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      // 3. Projectile
      if (state.projectile.active) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#facc15';
          ctx.fillStyle = '#facc15';
          ctx.beginPath(); ctx.arc(state.projectile.x, state.projectile.y, 12, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
      }

      // 4. Cannon
      const cx = w / 2;
      const cy = h - 100;
      
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((state.angle) * Math.PI / 180);
      
      // Trajectory Guide (Laser Sight)
      if (gameState === 'AIMING') {
          ctx.beginPath();
          ctx.moveTo(0, -100);
          ctx.lineTo(0, -1000);
          ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)'; // Faint Cyan
          ctx.lineWidth = 2;
          ctx.setLineDash([10, 10]);
          ctx.stroke();
          ctx.setLineDash([]);
      }

      // Barrel
      ctx.fillStyle = '#475569';
      ctx.fillRect(-25, -100, 50, 100);
      // Metallic Shine
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-15, -100, 10, 100);
      // Rings
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-28, -90, 56, 10);
      ctx.fillRect(-28, -20, 56, 10);
      
      ctx.restore();

      // Base (Wheel)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.arc(cx, cy, 50, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.fill();

      // Next Frame
      if (gameState !== 'RESULT') {
        requestRef.current = requestAnimationFrame(gameLoop);
      } else {
        requestRef.current = requestAnimationFrame(gameLoop);
      }
  };

  useEffect(() => {
      requestRef.current = requestAnimationFrame(gameLoop);
      return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [gameState, isCharging]);

  return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-between pointer-events-none select-none">
          <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="absolute inset-0" />
          
          {/* Header UI */}
          <div className="z-10 mt-10 p-6 bg-slate-900/90 border-2 border-cyan-500 rounded-xl text-center shadow-2xl transform skew-x-[-5deg]">
              <h2 className="text-4xl font-black text-cyan-400 mb-2 tracking-tighter">SKOTÆFING</h2>
              <p className="text-slate-300 text-sm font-bold tracking-widest">ÖRVAR: MIÐA • SPACE: HLAÐA / SKJÓTA</p>
          </div>

          {/* Result Overlay */}
          {gameState === 'RESULT' && (
             <div className="z-20 absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                <h1 className={`text-7xl font-black mb-8 transform -skew-x-12 ${success ? 'text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]' : 'text-red-500'}`}>
                    {success ? "HITTIR!" : "LOKIÐ"}
                </h1>
                
                {showButton && (
                    <button 
                        onClick={handleContinue}
                        className="pointer-events-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-2xl font-black rounded-xl shadow-2xl hover:scale-105 transition-transform flex items-center gap-4 border-2 border-white/20 animate-bounce"
                    >
                        {success ? "BYRJA RAMPAGE" : "HALDA ÁFRAM"}
                        <ArrowRight size={32} />
                    </button>
                )}
             </div>
          )}

          {/* Power and Angle HUD */}
          <div className="z-10 mb-10 w-96 flex flex-col gap-4">
              {/* Angle Indicator */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 flex justify-between items-center px-6">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <Crosshair size={20} />
                      <span>HORNA</span>
                  </div>
                  <span className="text-2xl font-mono text-white">{Math.round(angle)}°</span>
              </div>

              {/* Power Meter */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
                  <div className="flex justify-between text-white font-bold mb-2">
                      <span className="text-cyan-400">KRAFTUR</span>
                      <span>{Math.round(power)}%</span>
                  </div>
                  <div className="w-full h-8 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-600">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 transition-all duration-75 relative"
                        style={{ width: `${power}%` }}
                      >
                          {/* Striped pattern overlay */}
                          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)]" />
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default CannonMinigame;