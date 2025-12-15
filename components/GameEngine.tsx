
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Character, GameState, Lane, ObstacleType, PowerUpType, Entity, GameStats } from '../types';
import { GAME_CONFIG } from '../constants';
import { Pause, Zap, Crosshair, Flame, LogOut, Code } from 'lucide-react';
import { CHARACTER_SVGS } from './CharacterAssets';

interface GameEngineProps {
  character: Character;
  onGameOver: (score: number, coins: number) => void;
  onMinigameTrigger: (currentStats: GameStats) => void;
  onQuit: () => void;
  gameState: GameState;
  initialStats?: GameStats;
  startWithRampage?: boolean;
}

const GameEngine: React.FC<GameEngineProps> = ({ character, onGameOver, onMinigameTrigger, onQuit, gameState, initialStats, startWithRampage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // HUD State
  const [hudScore, setHudScore] = useState(initialStats?.score || 0);
  const [hudCoins, setHudCoins] = useState(initialStats?.coins || 0);
  // Change default ammo to 3, but respect 0 if passed from minigame (using ?? instead of ||)
  const [hudAmmo, setHudAmmo] = useState(initialStats?.ammo ?? 3);
  const [isPaused, setIsPaused] = useState(false);
  const [showSpeedBoost, setShowSpeedBoost] = useState(false);
  const [showAmmoReload, setShowAmmoReload] = useState(false);
  const [rampageTime, setRampageTime] = useState(0); 
  
  // Logic Refs
  const statsRef = useRef({ 
      score: initialStats?.score || 0, 
      coins: initialStats?.coins || 0, 
      distance: initialStats?.distance || 0, 
      speed: initialStats?.speed || GAME_CONFIG.INITIAL_SPEED, 
      collectedPowerups: 0 
  });
  
  const playerRef = useRef({
    lane: Lane.CENTER,
    x: 0,
    y: 0,
    vy: 0,
    z: GAME_CONFIG.PLAYER_Z,
    state: 'RUNNING' as 'RUNNING' | 'JUMPING' | 'ROLLING',
    targetX: 0, 
    invincible: character.powerUp === PowerUpType.SHIELD,
    magnetTimer: 0,
    lastProjectileTime: 0,
    // Change default ammo to 3 here as well
    ammo: initialStats?.ammo ?? 3,
    rampageTimer: startWithRampage ? GAME_CONFIG.RAMPAGE_DURATION : 0,
  });
  
  const entitiesRef = useRef<Entity[]>([]);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  // Prevent immediate re-trigger if we resume with 10 coins
  const minigameTriggeredRef = useRef(initialStats ? true : false);
  
  // Helper ref to avoid stale closure issues in loop for state updates
  const lastRampageSecondRef = useRef(0);
  
  // Image Asset for Player
  const playerImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
      // Load Character SVG
      const svgString = CHARACTER_SVGS[character.id] || CHARACTER_SVGS['generic'];
      if (svgString) {
          const img = new Image();
          const blob = new Blob([svgString], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          img.onload = () => {
              playerImageRef.current = img;
          };
          img.src = url;
      }
  }, [character.id]);
  
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
        if (!initialStats) {
            resetGame();
        } else {
            // Resume Game logic
            minigameTriggeredRef.current = false;
            lastTimeRef.current = performance.now();
            requestRef.current = requestAnimationFrame(gameLoop);
        }
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  const resetGame = () => {
    statsRef.current = { score: 0, coins: 0, distance: 0, speed: GAME_CONFIG.INITIAL_SPEED, collectedPowerups: 0 };
    playerRef.current = {
      lane: Lane.CENTER,
      x: 0,
      y: 0,
      vy: 0,
      z: GAME_CONFIG.PLAYER_Z,
      state: 'RUNNING',
      targetX: 0,
      invincible: character.powerUp === PowerUpType.SHIELD,
      magnetTimer: 0,
      lastProjectileTime: 0,
      ammo: 3, // Start with 3 ammo
      rampageTimer: 0
    };
    entitiesRef.current = [];
    setHudScore(0);
    setHudCoins(0);
    setHudAmmo(3); // Reset HUD to 3 ammo
    setRampageTime(0);
    lastRampageSecondRef.current = 0;
    setIsPaused(false);
    minigameTriggeredRef.current = false;
    
    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const handleDevMinigame = () => {
      // Trigger minigame immediately for testing
      onMinigameTrigger({
         ...statsRef.current,
         ammo: playerRef.current.ammo
      });
  };

  const fireProjectile = (subType: string) => {
      const player = playerRef.current;
      entitiesRef.current.push({
         x: player.x,
         y: 1.0, 
         z: player.z + 1,
         width: 0.8,
         height: 0.8,
         type: 'PROJECTILE',
         subType: subType,
         active: true
     });
  };

  const handleInput = useCallback((key: string) => {
    if (isPaused) return;
    const player = playerRef.current;
    
    switch (key) {
      case 'ArrowLeft':
      case 'a':
        if (player.lane > Lane.FAR_LEFT) {
          player.lane--;
          player.targetX = player.lane * GAME_CONFIG.LANE_WIDTH;
        }
        break;
      case 'ArrowRight':
      case 'd':
        if (player.lane < Lane.FAR_RIGHT) {
          player.lane++;
          player.targetX = player.lane * GAME_CONFIG.LANE_WIDTH;
        }
        break;
      case 'ArrowUp':
      case 'w':
      case ' ':
        if (player.y === 0) {
          // Uniform levitation/jump logic for all characters
          player.vy = character.powerUp === PowerUpType.SUPER_JUMP 
            ? GAME_CONFIG.SUPER_JUMP_FORCE 
            : GAME_CONFIG.JUMP_FORCE;
          player.state = 'JUMPING';
        }
        break;
      case 'ArrowDown':
      case 's':
        if (player.y > 0) {
           player.vy = -GAME_CONFIG.JUMP_FORCE; // Fast drop
        } else {
            player.state = 'ROLLING';
            setTimeout(() => { 
                if(playerRef.current.state === 'ROLLING') playerRef.current.state = 'RUNNING'; 
            }, 800);
        }
        break;
      case 'Control':
        if (player.ammo > 0) {
            const now = performance.now();
            if (now - player.lastProjectileTime > 250) {
                player.lastProjectileTime = now;
                player.ammo--;
                setHudAmmo(player.ammo);
                let projType = 'HANDCUFF'; 
                if (character.id === 'char_2') projType = 'FIREBALL';
                else if (character.id === 'char_3') projType = 'BLOOD';
                else if (character.id === 'char_4') projType = 'LIGHT_STAR';
                else if (character.id === 'char_5') projType = 'NEON_CAT';
                else if (character.id === 'char_6') projType = 'NUMBER_BOLT';
                else if (character.id === 'char_7') projType = 'ECTO_BLAST';
                else if (character.id === 'char_8') projType = 'ROCKET';
                else if (character.id === 'char_9') projType = 'SOCCER_BALL'; 
                else if (character.id === 'char_10') projType = 'WATER_BOTTLE';
                else if (['char_11', 'char_12', 'char_13', 'char_14', 'char_15', 'char_16'].includes(character.id)) projType = 'GENERIC';
                fireProjectile(projType);
            }
        }
        break;
    }
  }, [character, isPaused]);

  // Touch handling
  const touchStartRef = useRef<{x: number, y: number} | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
      touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
      };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
      
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) handleInput('Control');
      if (Math.abs(dx) > Math.abs(dy)) {
          if (Math.abs(dx) > 30) handleInput(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
      } else {
          if (Math.abs(dy) > 30) handleInput(dy > 0 ? 'ArrowDown' : 'ArrowUp');
      }
      touchStartRef.current = null;
  };

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => handleInput(e.key);
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [handleInput]);

  // GAME LOOP
  const gameLoop = (time: number) => {
      if (isPaused) {
          lastTimeRef.current = time;
          requestRef.current = requestAnimationFrame(gameLoop);
          return;
      }

      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const player = playerRef.current;
      const stats = statsRef.current;

      if (player.rampageTimer > 0) {
          player.rampageTimer -= deltaTime;
          const currentSec = Math.ceil(player.rampageTimer / 1000);
          if (currentSec !== lastRampageSecondRef.current) {
               lastRampageSecondRef.current = currentSec;
               setRampageTime(currentSec);
          }
      } else {
          if (lastRampageSecondRef.current !== 0) {
              lastRampageSecondRef.current = 0;
              setRampageTime(0);
          }
      }

      if (stats.speed < GAME_CONFIG.MAX_SPEED) {
          stats.speed += GAME_CONFIG.SPEED_INCREMENT;
      }

      stats.distance += stats.speed;
      stats.score = Math.floor(stats.distance * (character.powerUp === PowerUpType.DOUBLE_SCORE ? 2 : 1));
      setHudScore(stats.score);

      player.x += (player.targetX - player.x) * 0.2;
      
      // Physics Update
      if (player.y > 0 || player.vy > 0) {
          player.y += player.vy;
          // Use global constant for "levitating" feel
          player.vy -= GAME_CONFIG.GRAVITY;
          
          if (player.y < 0) {
              player.y = 0;
              player.vy = 0;
              if (player.state === 'JUMPING') player.state = 'RUNNING';
          }
      }

      if (player.magnetTimer > 0) {
          player.magnetTimer -= deltaTime;
      }

      if (Math.random() < 0.035) {
          const typeRand = Math.random();
          let type: any = ObstacleType.LOW_BARRIER;
          let y = 0;
          let width = 1;
          
          if (typeRand > 0.95) {
               type = 'SPEED_BOOST'; 
               width = 0.8;
          } else if (typeRand > 0.55) { 
              type = 'PIZZA';
              width = 0.6;
              y = 0.5;
          } else if (typeRand > 0.35) { 
              type = ObstacleType.HIGH_BARRIER;
              y = 2.5; 
          } else if (typeRand > 0.15) { 
              type = ObstacleType.TRAIN;
          }
          const lane = Math.floor(Math.random() * 5) - 2;
          
          entitiesRef.current.push({
              x: lane * GAME_CONFIG.LANE_WIDTH,
              y: y,
              z: player.z + GAME_CONFIG.DRAW_DISTANCE,
              width,
              height: 1,
              type,
              active: true
          });
      }

      for (let i = entitiesRef.current.length - 1; i >= 0; i--) {
          const entity = entitiesRef.current[i];
          
          if (entity.type === 'PROJECTILE') {
              entity.z += 1.5; 
              if (entity.z > player.z + GAME_CONFIG.DRAW_DISTANCE) entity.active = false;
              
              for (let j = 0; j < entitiesRef.current.length; j++) {
                  const target = entitiesRef.current[j];
                  if (!target.active || target === entity || target.type === 'PROJECTILE' || target.type === 'SPEED_BOOST') continue;
                  
                  if (Math.abs(entity.x - target.x) < 1 && Math.abs(entity.z - target.z) < 2) {
                      if (target.type === 'PIZZA') {
                          target.active = false;
                          stats.coins += 1;
                          setHudCoins(stats.coins);
                          
                          // Ammo reload logic for projectile collection
                          if (stats.coins % 10 === 0 && stats.coins > 0) {
                               player.ammo += 3;
                               setHudAmmo(player.ammo);
                               setShowAmmoReload(true);
                               setTimeout(() => setShowAmmoReload(false), 2000);
                          }
                      } else {
                          // Destroy Obstacles
                          target.active = false; 
                          stats.score += 50; 
                          // NOTE: We do NOT set entity.active = false here, so it penetrates.
                      }
                  }
              }

          } else {
              entity.z -= stats.speed * 20; 
          }

          if (entity.z < player.z - 5) entity.active = false;

          if (entity.active && entity.type !== 'PROJECTILE') {
              if (Math.abs(entity.z - player.z) < 1.5) {
                  if (Math.abs(entity.x - player.x) < 0.8) {
                       const playerBottom = player.y;
                       let collision = false;
                       
                       if (entity.type === 'PIZZA') {
                           stats.coins += 1;
                           stats.speed += GAME_CONFIG.SPEED_BOOST_AMOUNT;
                           
                           setHudCoins(stats.coins);
                           entity.active = false;

                           if (stats.coins % 10 === 0 && stats.coins > 0) {
                               player.ammo += 3;
                               setHudAmmo(player.ammo);
                               setShowAmmoReload(true);
                               setTimeout(() => setShowAmmoReload(false), 2000);

                               if (!minigameTriggeredRef.current) {
                                   minigameTriggeredRef.current = true;
                                   onMinigameTrigger({
                                       ...statsRef.current,
                                       ammo: playerRef.current.ammo
                                   });
                                   return; 
                               }
                           } else {
                               minigameTriggeredRef.current = false;
                           }
                           continue;
                       }
                       
                       if (entity.type === 'SPEED_BOOST') {
                           stats.speed += GAME_CONFIG.SPEED_BOOST_AMOUNT;
                           stats.collectedPowerups++;
                           entity.active = false;
                           setShowSpeedBoost(true);
                           setTimeout(() => setShowSpeedBoost(false), 1500);
                           continue;
                       }

                       if (entity.type === ObstacleType.LOW_BARRIER) {
                           if (playerBottom < 0.5) collision = true;
                       } else if (entity.type === ObstacleType.HIGH_BARRIER) {
                           if (player.state !== 'ROLLING') collision = true;
                       } else if (entity.type === ObstacleType.TRAIN) {
                           if (character.powerUp !== PowerUpType.PHASE_SHIFT) collision = true;
                       }

                       if (collision) {
                           if (player.rampageTimer > 0 || player.invincible) {
                               entity.active = false;
                               stats.score += 200;
                           } else {
                               onGameOver(stats.score, stats.coins);
                               return;
                           }
                       }
                  }
              }
          }
      }
      
      entitiesRef.current = entitiesRef.current.filter(e => e.active);

      if (character.powerUp === PowerUpType.MAGNET) {
           entitiesRef.current.forEach(e => {
               if (e.type === 'PIZZA' && e.active) {
                   if (e.z > player.z && e.z < player.z + 15) {
                       e.x += (player.x - e.x) * 0.1; 
                   }
               }
           });
      }

      draw();
      requestRef.current = requestAnimationFrame(gameLoop);
  };

  const project = (x: number, y: number, z: number, canvasWidth: number, canvasHeight: number) => {
      const focalLength = 300;
      const cameraY = 1.5; 
      const cameraZ = -5;  
      const horizonY = canvasHeight * 0.35; 

      const relZ = z - cameraZ;
      const scale = focalLength / (focalLength + relZ);
      const xFactor = canvasWidth / 12; 
      const projX = (canvasWidth / 2) + (x * xFactor * scale);
      const projY = horizonY + ((cameraY - y) * 100 * scale);
      const groundY = canvasHeight * 0.9;
      const runnerY = horizonY + (groundY - horizonY) * scale - (y * 50 * scale);

      return { x: projX, y: runnerY, scale };
  };

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, speed: number) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#020617'); 
      gradient.addColorStop(0.3, '#1e1b4b'); 
      gradient.addColorStop(0.6, '#4c1d95'); 
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const horizonY = height * 0.35;
      const sunX = width / 2;
      const sunY = horizonY - 20;
      const sunSize = height * 0.15;
      
      ctx.save();
      ctx.shadowBlur = 80;
      ctx.shadowColor = '#f472b6'; 
      const sunGrad = ctx.createLinearGradient(sunX, sunY - sunSize, sunX, sunY + sunSize);
      sunGrad.addColorStop(0, '#fcd34d'); 
      sunGrad.addColorStop(1, '#be185d'); 
      ctx.fillStyle = sunGrad;
      ctx.beginPath(); ctx.arc(sunX, sunY, sunSize, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#4c1d95';
      for(let i=0; i<10; i++) ctx.fillRect(sunX - sunSize, sunY + (i*8) - 20, sunSize*2, 2);
      ctx.restore();

      ctx.save();
      const floorGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      floorGrad.addColorStop(0, '#000000');
      floorGrad.addColorStop(1, '#312e81');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      ctx.strokeStyle = '#c026d3'; 
      ctx.lineWidth = 1;
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#d946ef';

      for (let i = -3; i <= 3; i++) {
          const laneBoundary = (i + 0.5) * GAME_CONFIG.LANE_WIDTH;
          const pNear = project(laneBoundary, 0, 0, width, height);
          const pFar = project(laneBoundary, 0, GAME_CONFIG.DRAW_DISTANCE, width, height);
          ctx.beginPath(); ctx.moveTo(pNear.x, pNear.y); ctx.lineTo(pFar.x, pFar.y); ctx.stroke();
      }

      const phase = (statsRef.current.distance * 10) % 20;
      // Increased z loop limit to cover larger draw distance (40 * 5 = 200 > 150)
      for (let z = 0; z < 40; z++) {
          const worldZ = (z * 5) - phase;
          if (worldZ < -2) continue;
          const edge = 2.5 * GAME_CONFIG.LANE_WIDTH;
          const pLeft = project(-edge, 0, worldZ, width, height);
          const pRight = project(edge, 0, worldZ, width, height);
          const alpha = Math.max(0, 1 - (worldZ / GAME_CONFIG.DRAW_DISTANCE));
          ctx.globalAlpha = alpha;
          ctx.beginPath(); ctx.moveTo(pLeft.x, pLeft.y); ctx.lineTo(pRight.x, pRight.y); ctx.stroke();
      }
      ctx.restore();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawBackground(ctx, canvas.width, canvas.height, statsRef.current.speed);

    const renderList = [...entitiesRef.current];
    renderList.sort((a, b) => b.z - a.z);

    renderList.forEach(entity => {
         const relZ = entity.z - playerRef.current.z;
         if (relZ > -2) {
             const proj = project(entity.x, entity.y, relZ, canvas.width, canvas.height);
             drawEntity(ctx, entity, proj.x, proj.y, proj.scale);
         }
    });

    const player = playerRef.current;
    const proj = project(player.x, player.y, 0, canvas.width, canvas.height);
    drawPlayer(ctx, proj.x, proj.y, proj.scale);
  };

  const drawEntity = (ctx: CanvasRenderingContext2D, entity: Entity, x: number, y: number, scale: number) => {
      const baseSize = 50; 
      const width = entity.width * baseSize * scale;
      const height = entity.height * baseSize * scale;
      
      ctx.save();
      
      if (entity.type === 'PIZZA') {
          const size = width;
          ctx.shadowColor = '#22c55e'; 
          ctx.shadowBlur = 20;
          ctx.fillStyle = '#22c55e'; 
          ctx.beginPath(); ctx.arc(x, y - size/2, size/2, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#bbf7d0'; 
          ctx.beginPath(); ctx.arc(x, y - size/2, size/2.5, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#166534';
          ctx.beginPath(); ctx.arc(x - size/6, y - size/2 - size/6, size/8, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + size/6, y - size/2 + size/6, size/8, 0, Math.PI*2); ctx.fill();
          
      } else if (entity.type === 'SPEED_BOOST') {
          const size = width;
          ctx.shadowColor = '#06b6d4'; 
          ctx.shadowBlur = 20;
          ctx.fillStyle = '#22d3ee';
          ctx.beginPath(); ctx.moveTo(x, y - size); ctx.lineTo(x + size/2, y - size/2); ctx.lineTo(x, y); ctx.lineTo(x - size/2, y - size/2); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = `bold ${size/1.5}px monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('⚡', x, y - size/2);
      } else if (entity.type === 'PROJECTILE') {
          const size = width * 0.5;
          ctx.shadowBlur = 15; ctx.shadowColor = '#fff';
          if (entity.subType === 'SOCCER_BALL') {
               ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y - size, size, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = '#000'; ctx.stroke();
          } else {
              ctx.fillStyle = '#a855f7'; 
              if (entity.subType === 'FIREBALL') ctx.fillStyle = '#f97316';
              if (entity.subType === 'ECTO_BLAST') ctx.fillStyle = '#22d3ee';
              ctx.beginPath(); ctx.arc(x, y - size, size, 0, Math.PI*2); ctx.fill();
              ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y - size, size/2, 0, Math.PI*2); ctx.fill();
          }
      } else if (entity.type === ObstacleType.TRAIN) {
          // Improved TRAIN graphics
          // Body
          ctx.shadowColor = '#000'; ctx.shadowBlur = 10;
          const gradient = ctx.createLinearGradient(x - width/2, y - height, x + width/2, y);
          gradient.addColorStop(0, '#334155');
          gradient.addColorStop(0.5, '#475569');
          gradient.addColorStop(1, '#1e293b');
          ctx.fillStyle = gradient;
          ctx.fillRect(x - width/2, y - height, width, height);
          
          // Border
          ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
          ctx.strokeRect(x - width/2, y - height, width, height);

          // Windshield
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(x - width * 0.4, y - height * 0.8, width * 0.8, height * 0.4);
          
          // Lights
          ctx.shadowColor = '#facc15'; ctx.shadowBlur = 20;
          ctx.fillStyle = '#facc15';
          ctx.beginPath(); ctx.arc(x - width * 0.25, y - height * 0.2, width * 0.1, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + width * 0.25, y - height * 0.2, width * 0.1, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;

          // Grill / Stripes
          ctx.fillStyle = '#000';
          for(let i=0; i<3; i++) {
              ctx.fillRect(x - width * 0.2, y - height * 0.35 + (i * height * 0.05), width * 0.4, height * 0.02);
          }

      } else if (entity.type === ObstacleType.HIGH_BARRIER) {
          // Improved HIGH_BARRIER (Gantry/Billboard)
          ctx.shadowColor = '#000'; ctx.shadowBlur = 5;
          
          // Poles
          ctx.fillStyle = '#475569';
          ctx.fillRect(x - width/2, y - height, width * 0.1, height); // Left pole
          ctx.fillRect(x + width/2 - width * 0.1, y - height, width * 0.1, height); // Right pole
          
          // Sign Board
          ctx.fillStyle = '#1e1b4b';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.fillRect(x - width/2, y - height, width, height * 0.4);
          ctx.strokeRect(x - width/2, y - height, width, height * 0.4);
          
          // Neon Text Effect
          ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 10;
          ctx.fillStyle = '#ef4444';
          ctx.font = `bold ${height * 0.2}px monospace`;
          ctx.textAlign = 'center';
          ctx.fillText("DANGER", x, y - height * 0.7);
          ctx.shadowBlur = 0;

      } else {
          // Improved LOW_BARRIER (Concrete Barrier)
          ctx.shadowColor = '#000'; ctx.shadowBlur = 10;
          
          // Concrete Base
          ctx.fillStyle = '#94a3b8'; // Slate 400
          ctx.beginPath();
          ctx.moveTo(x - width/2, y);
          ctx.lineTo(x - width/2 + width*0.1, y - height);
          ctx.lineTo(x + width/2 - width*0.1, y - height);
          ctx.lineTo(x + width/2, y);
          ctx.closePath();
          ctx.fill();
          
          // Stripes
          ctx.save();
          ctx.clip();
          ctx.fillStyle = '#facc15'; // Yellow
          ctx.beginPath();
          for(let i = -width; i < width; i+= width*0.4) {
             ctx.moveTo(x + i, y);
             ctx.lineTo(x + i + width*0.2, y - height);
             ctx.lineTo(x + i + width*0.3, y - height);
             ctx.lineTo(x + i + width*0.1, y);
             ctx.closePath();
          }
          ctx.fill();
          ctx.restore();
          
          // Top Line
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x - width/2 + width*0.1, y - height);
          ctx.lineTo(x + width/2 - width*0.1, y - height);
          ctx.stroke();
      }
      ctx.restore();
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) => {
      const player = playerRef.current;
      const baseSize = 50;
      const size = baseSize * scale;

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      const shadowScale = Math.max(0.5, 1 - (player.y * 0.2));
      ctx.ellipse(x, y, (size/2) * shadowScale, (size/4) * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      const visualY = y - (player.y * 100 * scale);

      if (player.rampageTimer > 0) {
          ctx.shadowBlur = 40;
          ctx.shadowColor = '#facc15'; 
      } else if (player.ammo > 0) {
          ctx.shadowBlur = 30;
          ctx.shadowColor = '#22c55e';
      } else {
          ctx.shadowBlur = 15;
          ctx.shadowColor = character.accentColor;
      }

      ctx.save();
      ctx.translate(x, visualY - size/2);

      if (playerImageRef.current) {
          ctx.drawImage(playerImageRef.current, -size/2, -size/2, size, size);
      } else {
          // Fallback box if image fails or loading
          ctx.fillStyle = character.color;
          ctx.fillRect(-size/2, -size/2, size, size);
      }

      ctx.restore();
      ctx.shadowBlur = 0;
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden font-mono">
      <canvas 
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="block"
      />
      
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-3">
            <div className="bg-slate-900/60 backdrop-blur-md px-6 py-2 border-l-4 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] transform skew-x-[-12deg]">
                <div className="transform skew-x-[12deg]">
                    <span className="text-[10px] text-cyan-300 block font-bold uppercase tracking-widest mb-1">Stig</span>
                    <span className="text-2xl text-white font-black drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">{hudScore.toString().padStart(6, '0')}</span>
                </div>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-md px-6 py-2 border-l-4 border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.4)] transform skew-x-[-12deg]">
                 <div className="transform skew-x-[12deg] flex items-center gap-2">
                    <span className="text-xl filter drop-shadow grayscale-0">🍕</span> 
                    <span className="text-2xl text-green-100 font-bold">{hudCoins}</span>
                </div>
            </div>
            {rampageTime > 0 && (
                <div className="bg-yellow-900/60 backdrop-blur-md px-6 py-2 border-l-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] transform skew-x-[-12deg] animate-pulse">
                     <div className="transform skew-x-[12deg] flex items-center gap-2">
                        <Flame size={20} className="text-yellow-400" />
                        <span className="text-xl text-yellow-100 font-black">{rampageTime}s</span>
                    </div>
                </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-4 pointer-events-auto">
              <div className="flex gap-3">
                 <button 
                    className="p-3 bg-purple-600/80 border border-purple-400 hover:border-white text-white rounded-none transform rotate-45 hover:rotate-0 transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                    onClick={handleDevMinigame}
                    title="DEV: Trigger Minigame"
                >
                    <div className="transform -rotate-45 hover:rotate-0 transition-all duration-300"><Code size={20} /></div>
                </button>
                <button 
                    className="p-3 bg-red-600/80 border border-red-400 hover:border-white text-white rounded-none transform rotate-45 hover:rotate-0 transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0.2)]"
                    onClick={onQuit}
                >
                    <div className="transform -rotate-45 hover:rotate-0 transition-all duration-300"><LogOut size={20} /></div>
                </button>
                <button 
                    className="p-3 bg-slate-800/80 border border-slate-600 hover:border-white text-white rounded-none transform rotate-45 hover:rotate-0 transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                    onClick={() => setIsPaused(!isPaused)}
                >
                    <div className="transform -rotate-45 hover:rotate-0 transition-all duration-300"><Pause size={20} /></div>
                </button>
              </div>
              
              <div className={`pointer-events-none transition-all duration-300 px-6 py-3 border-r-4 transform skew-x-[12deg] backdrop-blur-md ${hudAmmo > 0 ? 'bg-green-900/60 border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]' : 'bg-slate-900/60 border-slate-600 opacity-80'}`}>
                  <div className="transform skew-x-[-12deg] flex items-center gap-3">
                      <Crosshair size={24} className={hudAmmo > 0 ? 'text-green-400 animate-pulse' : 'text-slate-500'} />
                      <div className="flex flex-col items-end">
                          <span className="text-[10px] text-green-300 uppercase font-bold tracking-widest">Skot</span>
                          <span className={`text-2xl font-black ${hudAmmo > 0 ? 'text-white' : 'text-slate-500'}`}>{hudAmmo}</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col gap-6">
          {rampageTime > 0 && (
             <div className="text-6xl font-black italic text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,1)] animate-bounce skew-x-[-12deg]">
                 RAMPAGE!
             </div>
          )}
          {showSpeedBoost && !rampageTime && (
              <div className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-pulse skew-x-[-10deg]">
                  HRÖÐUN!
              </div>
          )}
          {showAmmoReload && (
              <div className="text-3xl font-black text-white bg-green-600/90 px-8 py-4 border-2 border-white shadow-[0_0_30px_rgba(34,197,94,0.8)] skew-x-[-10deg] animate-bounce">
                  SKOT HLAÐIN!
              </div>
          )}
          {hudAmmo > 0 && !isPaused && !rampageTime && (
              <div className="absolute top-1/4 animate-pulse text-green-400 font-black tracking-[0.5em] text-xl drop-shadow-[0_0_10px_rgba(74,222,128,0.8)] bg-black/40 px-4 py-1 skew-x-[-20deg] border-l-2 border-r-2 border-green-500">
                  BYSSA HLAÐIN
              </div>
          )}
           {isPaused && (
              <div className="bg-black/80 p-10 border-2 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.5)] skew-x-[-5deg]">
                  <h2 className="text-5xl font-black text-white tracking-widest mb-2 text-center">PÁSA</h2>
                  <p className="text-cyan-400 text-xs tracking-[0.3em] text-center">KERFI Í BIÐSTÖÐU</p>
              </div>
          )}
      </div>
      
      <div className="absolute top-32 w-full text-center pointer-events-none">
         <div className="inline-block bg-black/60 backdrop-blur-sm px-8 py-2 border border-white/10 skew-x-[-20deg]">
             <div className="skew-x-[20deg] text-cyan-500 text-[10px] font-bold tracking-widest">
                 ARROWS: MOVE • SPACE: JUMP • CTRL: SHOOT
             </div>
         </div>
      </div>
    </div>
  );
};

export default GameEngine;
