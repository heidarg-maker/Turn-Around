
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Character, GameState, Lane, ObstacleType, PowerUpType, Entity, GameStats } from '../types';
import { GAME_CONFIG } from '../constants';
import { Pause, Crosshair, Flame, LogOut, Code, Shield, Heart } from 'lucide-react';
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
  const [hudAmmo, setHudAmmo] = useState(initialStats?.ammo ?? 3);
  const [hudHealth, setHudHealth] = useState(initialStats?.health ?? GAME_CONFIG.MAX_HEALTH);
  const [isPaused, setIsPaused] = useState(false);
  const [showSpeedBoost, setShowSpeedBoost] = useState(false);
  const [showAmmoReload, setShowAmmoReload] = useState(false);
  const [rampageTime, setRampageTime] = useState(0); 
  // State for visual feedback of post-minigame invincibility
  const [isResuming, setIsResuming] = useState(false);
  // Visual feedback for damage
  const [isDamaged, setIsDamaged] = useState(false);
  
  // Logic Refs
  const statsRef = useRef({ 
      score: initialStats?.score || 0, 
      coins: initialStats?.coins || 0, 
      distance: initialStats?.distance || 0, 
      speed: initialStats?.speed || GAME_CONFIG.INITIAL_SPEED, 
      collectedPowerups: 0,
      health: initialStats?.health ?? GAME_CONFIG.MAX_HEALTH
  });
  
  // 2 Second invincibility after minigame
  const postMinigameTimerRef = useRef(initialStats ? 2000 : 0);
  
  // Damage cooldown (Invincibility Frames)
  const damageCooldownRef = useRef(0);

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
            // Ensure we have 2 seconds of safety
            postMinigameTimerRef.current = 2000; 
            setIsResuming(true);
            lastTimeRef.current = performance.now();
            requestRef.current = requestAnimationFrame(gameLoop);
        }
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  const resetGame = () => {
    statsRef.current = { score: 0, coins: 0, distance: 0, speed: GAME_CONFIG.INITIAL_SPEED, collectedPowerups: 0, health: GAME_CONFIG.MAX_HEALTH };
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
      ammo: 3, 
      rampageTimer: 0
    };
    entitiesRef.current = [];
    setHudScore(0);
    setHudCoins(0);
    setHudAmmo(3); 
    setHudHealth(GAME_CONFIG.MAX_HEALTH);
    setRampageTime(0);
    lastRampageSecondRef.current = 0;
    postMinigameTimerRef.current = 0;
    damageCooldownRef.current = 0;
    setIsResuming(false);
    setIsPaused(false);
    setIsDamaged(false);
    minigameTriggeredRef.current = false;
    
    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const handleDevMinigame = () => {
      onMinigameTrigger({
         ...statsRef.current,
         ammo: playerRef.current.ammo
      });
  };

  const spawnExplosion = (x: number, y: number, z: number, color: string) => {
      // 1. Central Blast Wave
      entitiesRef.current.push({
          x,
          y,
          z,
          width: 1.5,
          height: 1.5,
          type: 'EXPLOSION',
          active: true,
          createdAt: performance.now()
      });

      // 2. Debris Particles
      const particleCount = 8 + Math.floor(Math.random() * 6); // 8-14 particles
      for (let i = 0; i < particleCount; i++) {
          const vx = (Math.random() - 0.5) * 0.4; 
          const vy = (Math.random() * 0.5) + 0.3; // Always pop up initially
          const vz = (Math.random() - 0.5) * 0.4;
          const size = 0.2 + Math.random() * 0.3;

          entitiesRef.current.push({
              x,
              y, 
              z,
              width: size,
              height: size,
              type: 'PARTICLE',
              active: true,
              createdAt: performance.now(),
              vx, 
              vy, 
              vz,
              rot: Math.random() * Math.PI * 2,
              vRot: (Math.random() - 0.5) * 0.4,
              color: color
          });
      }
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
          player.vy = character.powerUp === PowerUpType.SUPER_JUMP 
            ? GAME_CONFIG.SUPER_JUMP_FORCE 
            : GAME_CONFIG.JUMP_FORCE;
          player.state = 'JUMPING';
        }
        break;
      case 'ArrowDown':
      case 's':
        if (player.y > 0) {
           player.vy = -GAME_CONFIG.JUMP_FORCE; 
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
                else if (character.id === 'char_16') projType = 'MUSTACHE';
                else if (['char_11', 'char_12', 'char_13', 'char_14', 'char_15'].includes(character.id)) projType = 'GENERIC';
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

      // Handle Post-Minigame Invincibility Timer
      if (postMinigameTimerRef.current > 0) {
          postMinigameTimerRef.current -= deltaTime;
          if (postMinigameTimerRef.current <= 0) {
              postMinigameTimerRef.current = 0;
              setIsResuming(false);
          }
      }

      // Handle Damage Cooldown
      if (damageCooldownRef.current > 0) {
          damageCooldownRef.current -= deltaTime;
          if (damageCooldownRef.current <= 0) {
              damageCooldownRef.current = 0;
              setIsDamaged(false);
          }
      }

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
          let height = 1;
          
          if (typeRand > 0.95) {
               type = 'SPEED_BOOST'; 
               width = 0.8;
          } else if (typeRand > 0.60) { 
              type = 'PIZZA';
              width = 0.6;
              y = 0.5;
          } else if (typeRand > 0.50) {
               type = ObstacleType.TRAIN;
          } else if (typeRand > 0.45) {
               type = ObstacleType.WALL;
               height = 2.5;
          } else if (typeRand > 0.35) { 
               type = ObstacleType.HIGH_BARRIER;
               y = 2.5; 
          } else if (typeRand > 0.25) {
               type = ObstacleType.DRONE;
               y = 2.0;
               height = 0.8;
          } else if (typeRand > 0.10) { 
               type = ObstacleType.LOW_BARRIER;
          } else {
               type = ObstacleType.SPIKES;
               height = 0.5;
          }

          const lane = Math.floor(Math.random() * 5) - 2;
          
          entitiesRef.current.push({
              x: lane * GAME_CONFIG.LANE_WIDTH,
              y: y,
              z: player.z + GAME_CONFIG.DRAW_DISTANCE,
              width,
              height,
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
                  if (!target.active || target === entity || target.type === 'PROJECTILE' || target.type === 'SPEED_BOOST' || target.type === 'EXPLOSION' || target.type === 'PARTICLE') continue;
                  
                  if (Math.abs(entity.x - target.x) < 1 && Math.abs(entity.z - target.z) < 2) {
                      if (target.type === 'PIZZA') {
                          target.active = false;
                          stats.coins += 1;
                          setHudCoins(stats.coins);
                          
                          if (stats.coins % 10 === 0 && stats.coins > 0) {
                               player.ammo += 3;
                               setHudAmmo(player.ammo);
                               setShowAmmoReload(true);
                               setTimeout(() => setShowAmmoReload(false), 2000);
                          }
                      } else {
                          target.active = false; 
                          stats.score += 50; 
                          
                          // Determine particle color
                          let pColor = '#94a3b8'; // Default grey
                          if (target.type === ObstacleType.DRONE) pColor = '#1e293b';
                          else if (target.type === ObstacleType.HIGH_BARRIER) pColor = '#ef4444';
                          else if (target.type === ObstacleType.LOW_BARRIER) pColor = '#facc15';
                          else if (target.type === ObstacleType.SPIKES) pColor = '#cbd5e1';
                          else if (target.type === ObstacleType.WALL) pColor = '#64748b';
                          else if (target.type === ObstacleType.TRAIN) pColor = '#334155';

                          spawnExplosion(target.x, target.y + target.height / 2, target.z, pColor);
                      }
                  }
              }

          } else if (entity.type === 'PARTICLE') {
               // Update Particle Physics
               if (entity.vx !== undefined && entity.vy !== undefined && entity.vz !== undefined && entity.rot !== undefined && entity.vRot !== undefined) {
                   entity.x += entity.vx;
                   entity.y += entity.vy;
                   entity.z += entity.vz;
                   entity.vy -= GAME_CONFIG.GRAVITY * 0.5; // Gravity
                   entity.rot += entity.vRot; // Rotation
                   
                   // Move with world
                   entity.z -= stats.speed * 20;

                   // Floor bounce
                   if (entity.y < 0) {
                       entity.y = 0;
                       entity.vy *= -0.6; // Loss of energy on bounce
                       entity.vx *= 0.8; // Friction
                       entity.vz *= 0.8;
                   }
                   
                   // Remove old particles
                   if ((performance.now() - (entity.createdAt || 0)) > 1500) {
                       entity.active = false;
                   }
               }

          } else {
              entity.z -= stats.speed * 20; 
          }

          if (entity.type === 'EXPLOSION') {
              if (performance.now() - (entity.createdAt || 0) > 500) {
                  entity.active = false;
              }
          }

          if (entity.z < player.z - 5) entity.active = false;

          if (entity.active && entity.type !== 'PROJECTILE' && entity.type !== 'EXPLOSION' && entity.type !== 'PARTICLE') {
              // Reduced hitbox size for Z to forgive "visual gap" deaths
              // Tighter collision detection to prevent phantom hits
              // Widen for Pizza to make collecting easier
              const zHitDist = entity.type === 'PIZZA' ? 0.8 : 0.4;
              const xHitDist = entity.type === 'PIZZA' ? 0.8 : 0.6;

              if (Math.abs(entity.z - player.z) < zHitDist) {
                  if (Math.abs(entity.x - player.x) < xHitDist) {
                       const playerBottom = player.y;
                       let collision = false;
                       
                       if (entity.type === 'PIZZA') {
                           stats.coins += 1;
                           
                           // Speed up every 5 pizzas by 3%
                           if (stats.coins % 5 === 0) {
                               stats.speed *= 1.03;
                           }
                           
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

                       // COLLISION LOGIC
                       
                       // 1. Ground Hazards (Jump over)
                       if (entity.type === ObstacleType.LOW_BARRIER || entity.type === ObstacleType.SPIKES) {
                           if (playerBottom < 0.5) collision = true;
                       }
                       // 2. Overhead Hazards (Roll under)
                       else if (entity.type === ObstacleType.HIGH_BARRIER) {
                           // If jumping, you hit it (y > 0.1 is airborne)
                           // If standing (not rolling), you hit it.
                           // So you must be rolling AND on the ground.
                           if (player.state !== 'ROLLING' || playerBottom > 0.5) collision = true;
                       }
                       // 3. Drone Hazards (Anti-Jump)
                       // You can run under them (y=0 is safe). You die if you jump (y > 0.1).
                       else if (entity.type === ObstacleType.DRONE) {
                           if (playerBottom > 0.1) collision = true;
                       }
                       // 4. Full Blockers (Side dodge or super high jump)
                       else if (entity.type === ObstacleType.TRAIN || entity.type === ObstacleType.WALL) {
                           if (character.powerUp === PowerUpType.PHASE_SHIFT && entity.type === ObstacleType.TRAIN) {
                               collision = false;
                           } else {
                               // Assuming Train height is ~2.0. Standard jump might clear if well timed?
                               // Let's say y < 1.5 hits.
                               if (playerBottom < 1.5) collision = true;
                           }
                       }

                       if (collision) {
                           // Invincibility Checks
                           if (player.rampageTimer > 0 || player.invincible || postMinigameTimerRef.current > 0) {
                               entity.active = false;
                               stats.score += 200;
                           } else if (damageCooldownRef.current <= 0) {
                               // Damage Logic
                               entity.active = false; // Destroy obstacle on impact to prevent double hits
                               stats.health -= 1;
                               setHudHealth(stats.health);
                               
                               if (stats.health <= 0) {
                                   onGameOver(stats.score, stats.coins);
                                   return;
                               } else {
                                   // Trigger Invincibility Frames
                                   damageCooldownRef.current = 1500; // 1.5 seconds
                                   setIsDamaged(true);
                               }
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
      const horizonY = height * 0.35;

      // SKY
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#020617'); 
      gradient.addColorStop(0.2, '#1e1b4b'); 
      gradient.addColorStop(0.35, '#000000');
      gradient.addColorStop(1, '#000000');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // SUN
      const sunX = width / 2;
      const sunY = horizonY - 20;
      const sunSize = height * 0.15;
      
      ctx.save();
      ctx.shadowBlur = 100;
      ctx.shadowColor = '#be185d'; 
      const sunGrad = ctx.createLinearGradient(sunX, sunY - sunSize, sunX, sunY + sunSize);
      sunGrad.addColorStop(0, '#fcd34d'); 
      sunGrad.addColorStop(1, '#be185d'); 
      ctx.fillStyle = sunGrad;
      ctx.beginPath(); ctx.arc(sunX, sunY, sunSize, 0, Math.PI * 2); ctx.fill();
      
      ctx.fillStyle = '#000000';
      for(let i=0; i<10; i++) ctx.fillRect(sunX - sunSize, sunY + (i*8) - 20, sunSize*2, 2 + (i*0.5));
      ctx.restore();

      // FLOOR
      ctx.save();
      const floorGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      floorGrad.addColorStop(0, '#000000'); 
      floorGrad.addColorStop(0.25, '#0f172a'); 
      floorGrad.addColorStop(1, '#312e81'); 
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // GRID
      ctx.strokeStyle = '#c026d3'; 
      ctx.lineWidth = 1;
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#d946ef';

      for (let i = -3; i <= 3; i++) {
          const laneBoundary = (i + 0.5) * GAME_CONFIG.LANE_WIDTH;
          const pNear = project(laneBoundary, 0, 0, width, height);
          const pFar = project(laneBoundary, 0, GAME_CONFIG.DRAW_DISTANCE, width, height);
          
          const lineGrad = ctx.createLinearGradient(pNear.x, pNear.y, pFar.x, pFar.y);
          lineGrad.addColorStop(0, '#c026d3');
          lineGrad.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.strokeStyle = lineGrad;
          ctx.beginPath(); ctx.moveTo(pNear.x, pNear.y); ctx.lineTo(pFar.x, pFar.y); ctx.stroke();
      }

      const phase = (statsRef.current.distance * 10) % 20;
      for (let z = 0; z < 40; z++) {
          const worldZ = (z * 5) - phase;
          if (worldZ < -2) continue;
          const edge = 2.5 * GAME_CONFIG.LANE_WIDTH;
          const pLeft = project(-edge, 0, worldZ, width, height);
          const pRight = project(edge, 0, worldZ, width, height);
          
          const distRatio = worldZ / GAME_CONFIG.DRAW_DISTANCE;
          const alpha = Math.max(0, Math.pow(1 - distRatio, 2)); 
          
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = '#c026d3'; 
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
      
      if (entity.type === 'PARTICLE') {
           const rot = entity.rot || 0;
           const color = entity.color || '#fff';
           
           ctx.translate(x, y);
           ctx.rotate(rot);
           
           ctx.fillStyle = color;
           ctx.shadowColor = color;
           ctx.shadowBlur = 5;
           
           // Draw shard shape (triangle-ish polygon)
           ctx.beginPath();
           ctx.moveTo(-width/2, -height/2);
           ctx.lineTo(width/2, -height/4);
           ctx.lineTo(0, height/2);
           ctx.closePath();
           ctx.fill();
           
           // Light highlight on edge
           ctx.strokeStyle = 'rgba(255,255,255,0.4)';
           ctx.lineWidth = 1;
           ctx.stroke();

           ctx.shadowBlur = 0;
           ctx.rotate(-rot);
           ctx.translate(-x, -y);

      } else if (entity.type === 'EXPLOSION') {
            const age = performance.now() - (entity.createdAt || 0);
            const maxAge = 500;
            const p = age / maxAge; 

            const radius = width * (0.5 + p * 1.5); 
            
            // Shockwave
            ctx.beginPath();
            ctx.arc(x, y, radius * 1.2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - p})`;
            ctx.lineWidth = 4 * scale;
            ctx.stroke();

            // Inner Blast
            const colors = ['#fef08a', '#f97316', '#ef4444', '#57534e']; // Yellow -> Orange -> Red -> Grey
            const colorIndex = Math.floor(p * colors.length);
            
            ctx.fillStyle = colors[Math.min(colorIndex, colors.length - 1)];
            ctx.globalAlpha = 1 - p;
            
            // Jagged shape
            ctx.beginPath();
            const spikes = 8;
            for(let i=0; i<spikes*2; i++) {
                const angle = (Math.PI * 2 * i) / (spikes * 2);
                const r = (i % 2 === 0) ? radius : radius * 0.6;
                const px = x + Math.cos(angle) * r;
                const py = y + Math.sin(angle) * r;
                if (i===0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            
            ctx.globalAlpha = 1.0;
      } else if (entity.type === 'PIZZA') {
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
          } else if (entity.subType === 'MUSTACHE') {
               ctx.fillStyle = '#000';
               ctx.shadowColor = '#fff'; ctx.shadowBlur = 5;
               const mSize = size * 1.5;
               ctx.beginPath();
               // Simple mustache shape centered at x,y
               ctx.moveTo(x, y - mSize/4);
               ctx.bezierCurveTo(x - mSize/2, y - mSize/2, x - mSize, y, x - mSize/2, y - mSize/8);
               ctx.quadraticCurveTo(x, y + mSize/4, x + mSize/2, y - mSize/8);
               ctx.bezierCurveTo(x + mSize, y, x + mSize/2, y - mSize/2, x, y - mSize/4);
               ctx.fill();
               ctx.shadowBlur = 0;
          } else {
              ctx.fillStyle = '#a855f7'; 
              if (entity.subType === 'FIREBALL') ctx.fillStyle = '#f97316';
              if (entity.subType === 'ECTO_BLAST') ctx.fillStyle = '#22d3ee';
              ctx.beginPath(); ctx.arc(x, y - size, size, 0, Math.PI*2); ctx.fill();
              ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y - size, size/2, 0, Math.PI*2); ctx.fill();
          }
      } else if (entity.type === ObstacleType.TRAIN) {
          ctx.shadowColor = '#000'; ctx.shadowBlur = 10;
          const gradient = ctx.createLinearGradient(x - width/2, y - height, x + width/2, y);
          gradient.addColorStop(0, '#334155');
          gradient.addColorStop(0.5, '#475569');
          gradient.addColorStop(1, '#1e293b');
          ctx.fillStyle = gradient;
          ctx.fillRect(x - width/2, y - height, width, height);
          ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
          ctx.strokeRect(x - width/2, y - height, width, height);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(x - width * 0.4, y - height * 0.8, width * 0.8, height * 0.4);
          ctx.shadowColor = '#facc15'; ctx.shadowBlur = 20;
          ctx.fillStyle = '#facc15';
          ctx.beginPath(); ctx.arc(x - width * 0.25, y - height * 0.2, width * 0.1, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + width * 0.25, y - height * 0.2, width * 0.1, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#000';
          for(let i=0; i<3; i++) {
              ctx.fillRect(x - width * 0.2, y - height * 0.35 + (i * height * 0.05), width * 0.4, height * 0.02);
          }

      } else if (entity.type === ObstacleType.HIGH_BARRIER) {
          ctx.shadowColor = '#000'; ctx.shadowBlur = 5;
          ctx.fillStyle = '#475569';
          ctx.fillRect(x - width/2, y - height, width * 0.1, height); 
          ctx.fillRect(x + width/2 - width * 0.1, y - height, width * 0.1, height); 
          ctx.fillStyle = '#1e1b4b';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.fillRect(x - width/2, y - height, width, height * 0.4);
          ctx.strokeRect(x - width/2, y - height, width, height * 0.4);
          ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 10;
          ctx.fillStyle = '#ef4444';
          ctx.font = `bold ${height * 0.2}px monospace`;
          ctx.textAlign = 'center';
          ctx.fillText("DANGER", x, y - height * 0.7);
          ctx.shadowBlur = 0;

      } else if (entity.type === ObstacleType.SPIKES) {
          ctx.fillStyle = '#cbd5e1'; // Silver/Metal
          ctx.beginPath();
          // Draw 3 spikes
          const sW = width / 3;
          for(let k=0; k<3; k++) {
              const sx = x - width/2 + k*sW;
              ctx.moveTo(sx, y);
              ctx.lineTo(sx + sW/2, y - height * 0.8); // Spike tip
              ctx.lineTo(sx + sW, y);
          }
          ctx.fill();
          // Blood tip?
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          for(let k=0; k<3; k++) {
              const sx = x - width/2 + k*sW;
              ctx.moveTo(sx + sW/2, y - height * 0.8);
              ctx.lineTo(sx + sW/2 - sW*0.1, y - height * 0.6);
              ctx.lineTo(sx + sW/2 + sW*0.1, y - height * 0.6);
          }
          ctx.fill();
      } else if (entity.type === ObstacleType.DRONE) {
          // Hovering body
          const floatY = y - height * 0.1 * Math.sin(performance.now() * 0.01); 
          // Main body
          ctx.fillStyle = '#1e293b'; // Dark Slate
          ctx.beginPath(); ctx.ellipse(x, floatY - height/2, width/2, height/4, 0, 0, Math.PI*2); ctx.fill();
          // Eye
          ctx.fillStyle = '#ef4444'; // Red eye
          ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.arc(x, floatY - height/2, width/6, 0, Math.PI*2); ctx.fill();
          ctx.shadowBlur = 0;
          // Rotors
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x - width/2, floatY - height/2); ctx.lineTo(x - width, floatY - height/2 - 10); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + width/2, floatY - height/2); ctx.lineTo(x + width, floatY - height/2 - 10); ctx.stroke();
          // Propellers
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.beginPath(); ctx.ellipse(x - width, floatY - height/2 - 10, width/3, 5, performance.now() * 0.02, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(x + width, floatY - height/2 - 10, width/3, 5, -performance.now() * 0.02, 0, Math.PI*2); ctx.fill();
      } else if (entity.type === ObstacleType.WALL) {
          // Concrete block with graffiti?
          ctx.fillStyle = '#475569';
          ctx.fillRect(x - width/2, y - height, width, height);
          // Details
          ctx.fillStyle = '#000000';
          ctx.globalAlpha = 0.2;
          ctx.fillRect(x - width/2 + 5, y - height + 5, width - 10, height - 10);
          ctx.globalAlpha = 1.0;
          // Graffiti
          ctx.fillStyle = '#d946ef'; // Pink
          ctx.font = `bold ${height*0.4}px monospace`;
          ctx.textAlign = 'center';
          ctx.fillText("NO!", x, y - height/2);
      } else {
          ctx.shadowColor = '#000'; ctx.shadowBlur = 10;
          ctx.fillStyle = '#94a3b8'; 
          ctx.beginPath();
          ctx.moveTo(x - width/2, y);
          ctx.lineTo(x - width/2 + width*0.1, y - height);
          ctx.lineTo(x + width/2 - width*0.1, y - height);
          ctx.lineTo(x + width/2, y);
          ctx.closePath();
          ctx.fill();
          ctx.save();
          ctx.clip();
          ctx.fillStyle = '#facc15'; 
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
      const baseSize = 80; 
      const size = baseSize * scale;

      ctx.save();

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(x, y, size * 0.4, size * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();

      // Player visual
      if (playerImageRef.current) {
           // Flicker effect for invincibility (Rampage OR Post-Minigame OR Damage Cooldown)
           if (player.invincible || player.rampageTimer > 0 || postMinigameTimerRef.current > 0 || damageCooldownRef.current > 0) {
               // Flash faster if damaged
               const freq = damageCooldownRef.current > 0 ? 0.2 : 0.02;
               ctx.globalAlpha = 0.6 + Math.sin(performance.now() * freq) * 0.3;
               
               // Tint red if damaged
               if (damageCooldownRef.current > 0) {
                   ctx.filter = 'sepia(1) saturate(5) hue-rotate(-50deg)';
               }
           }
           
           ctx.drawImage(playerImageRef.current, x - size/2, y - size, size, size);
           ctx.filter = 'none';
      } else {
          ctx.fillStyle = character.color;
          ctx.fillRect(x - size/4, y - size, size/2, size);
      }

      ctx.restore();
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
            
            {/* Health Bar */}
            <div className="flex gap-1 transform skew-x-[-12deg] ml-2">
                {Array.from({ length: GAME_CONFIG.MAX_HEALTH }).map((_, i) => (
                    <Heart 
                        key={i} 
                        size={28} 
                        className={`transform skew-x-[12deg] drop-shadow-lg ${i < hudHealth ? 'text-red-500 fill-red-500' : 'text-slate-700 fill-slate-800'}`} 
                    />
                ))}
            </div>

            {rampageTime > 0 && (
                <div className="bg-yellow-900/60 backdrop-blur-md px-6 py-2 border-l-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] transform skew-x-[-12deg] animate-pulse">
                     <div className="transform skew-x-[12deg] flex items-center gap-2">
                        <Flame size={20} className="text-yellow-400" />
                        <span className="text-xl text-yellow-100 font-black">{rampageTime}s</span>
                    </div>
                </div>
            )}
            {/* Visual indicator for Post-Minigame Invincibility */}
            {isResuming && rampageTime === 0 && (
                 <div className="bg-blue-900/60 backdrop-blur-md px-6 py-2 border-l-4 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] transform skew-x-[-12deg] animate-pulse">
                     <div className="transform skew-x-[12deg] flex items-center gap-2">
                        <Shield size={20} className="text-blue-400" />
                        <span className="text-xl text-blue-100 font-black">VARIÐ!</span>
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
          {/* Damage Flash */}
          {isDamaged && (
              <div className="absolute inset-0 bg-red-500/20 animate-pulse pointer-events-none" />
          )}

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
      
      <div className="absolute top-2 w-full text-center pointer-events-none">
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
