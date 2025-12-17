
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface DodgeMinigameProps {
  onComplete: (success: boolean) => void;
}

const DodgeMinigame: React.FC<DodgeMinigameProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameState, setGameState] = useState<'PLAYING' | 'RESULT'>('PLAYING');
  const [success, setSuccess] = useState(false);
  
  const playerRef = useRef({ x: 50, width: 10 }); // Percentages
  const rocksRef = useRef<{x: number, y: number, speed: number}[]>([]);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            setSuccess(true);
            setGameState('RESULT');
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  useEffect(() => {
      const handleMove = (e: MouseEvent | TouchEvent) => {
          if (gameState !== 'PLAYING') return;
          const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
          const pct = (clientX / window.innerWidth) * 100;
          playerRef.current.x = Math.max(5, Math.min(95, pct));
      };
      
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('touchmove', handleMove);
      return () => {
          window.removeEventListener('mousemove', handleMove);
          window.removeEventListener('touchmove', handleMove);
      };
  }, [gameState]);

  useEffect(() => {
      const loop = () => {
          if (gameState !== 'PLAYING') return;
          const ctx = canvasRef.current?.getContext('2d');
          if (!ctx) return;
          const w = window.innerWidth;
          const h = window.innerHeight;

          // Spawn rocks
          if (Math.random() < 0.15) {
              rocksRef.current.push({
                  x: Math.random() * 100,
                  y: -10,
                  speed: 0.5 + Math.random() * 1.5
              });
          }

          // Update rocks
          rocksRef.current.forEach(rock => rock.y += rock.speed);
          
          // Collision
          const px = playerRef.current.x;
          rocksRef.current.forEach(rock => {
             if (Math.abs(rock.x - px) < 8 && rock.y > 80 && rock.y < 95) {
                 setSuccess(false);
                 setGameState('RESULT');
             }
          });
          
          // Cleanup
          rocksRef.current = rocksRef.current.filter(r => r.y < 110);

          // Draw
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, w, h);
          
          // Rocks
          ctx.fillStyle = '#64748b';
          rocksRef.current.forEach(rock => {
              const rx = (rock.x / 100) * w;
              const ry = (rock.y / 100) * h;
              ctx.beginPath(); ctx.arc(rx, ry, w * 0.04, 0, Math.PI * 2); ctx.fill();
          });
          
          // Player
          const ppx = (playerRef.current.x / 100) * w;
          const ppy = h * 0.9;
          ctx.fillStyle = '#22d3ee';
          ctx.shadowBlur = 20; ctx.shadowColor = '#22d3ee';
          ctx.beginPath(); ctx.arc(ppx, ppy, w * 0.03, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;

          frameRef.current = requestAnimationFrame(loop);
      };
      frameRef.current = requestAnimationFrame(loop);
      return () => { if(frameRef.current) cancelAnimationFrame(frameRef.current); }
  }, [gameState]);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 overflow-hidden">
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="absolute inset-0" />
        
        {gameState === 'PLAYING' && (
            <div className="absolute top-10 text-6xl font-black text-white mix-blend-difference">
                {Math.ceil(timeLeft)}
            </div>
        )}

        {gameState === 'RESULT' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50 animate-scale-in">
                 <h1 className={`text-7xl font-black mb-8 transform -skew-x-12 ${success ? 'text-green-400' : 'text-red-500'}`}>
                    {success ? "LIFÐIR!" : "DAUÐUR!"}
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

export default DodgeMinigame;
