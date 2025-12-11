
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Character, GameState, Lane, ObstacleType, PowerUpType, Entity } from '../types';
import { GAME_CONFIG } from '../constants';
import { Pause, Zap, Crosshair, LogOut } from 'lucide-react';

interface GameEngineProps {
  character: Character;
  onGameOver: (score: number, coins: number) => void;
  onQuit: () => void;
  gameState: GameState;
}

const GameEngine: React.FC<GameEngineProps> = ({ character, onGameOver, onQuit, gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // HUD State
  const [hudScore, setHudScore] = useState(0);
  const [hudCoins, setHudCoins] = useState(0);
  const [hudAmmo, setHudAmmo] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showSpeedBoost, setShowSpeedBoost] = useState(false);
  const [showAmmoReload, setShowAmmoReload] = useState(false);
  
  // Game Logic Refs
  const statsRef = useRef({ score: 0, coins: 0, distance: 0, speed: GAME_CONFIG.INITIAL_SPEED, collectedPowerups: 0 });
  const playerRef = useRef({
    lane: Lane.CENTER,
    x: 0,
    y: 0,
    vy: 0, // Vertical Velocity (Jump height)
    z: GAME_CONFIG.PLAYER_Z,
    state: 'RUNNING' as 'RUNNING' | 'JUMPING' | 'ROLLING',
    targetX: 0, 
    invincible: false,
    magnetTimer: 0,
    lastProjectileTime: 0,
    ammo: 0,
  });
  
  const entitiesRef = useRef<Entity[]>([]);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  // Initialize game
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
        resetGame();
        lastTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      ammo: 0,
    };
    entitiesRef.current = [];
    setHudScore(0);
    setHudCoins(0);
    setHudAmmo(0);
    setIsPaused(false);
    setShowSpeedBoost(false);
    setShowAmmoReload(false);
  };

  // Helper to spawn projectile
  const fireProjectile = (subType: string) => {
      const player = playerRef.current;
      entitiesRef.current.push({
         x: player.x,
         y: 1.0, 
         z: player.z + 1, // Start slightly ahead
         width: 0.8,
         height: 0.8,
         type: 'PROJECTILE',
         subType: subType,
         active: true
     });
  };

  // Input Handling
  const handleInput = useCallback((key: string) => {
    if (isPaused) return;
    const player = playerRef.current;
    
    switch (key) {
      case 'ArrowLeft':
      case 'a':
        if (player.lane > Lane.FAR_LEFT) { // -2
          player.lane--;
          player.targetX = player.lane * GAME_CONFIG.LANE_WIDTH;
        }
        break;
      case 'ArrowRight':
      case 'd':
        if (player.lane < Lane.FAR_RIGHT) { // 2
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
           player.vy = -GAME_CONFIG.JUMP_FORCE; // Fast fall
        } else {
            player.state = 'ROLLING';
            setTimeout(() => { 
                if(playerRef.current.state === 'ROLLING') playerRef.current.state = 'RUNNING'; 
            }, 800);
        }
        break;
      case 'Control': // SHOOT / WEAPON
        // Unified Shooting Mechanic: Uses Ammo
        if (player.ammo > 0) {
            const now = performance.now();
            if (now - player.lastProjectileTime > 250) { // Global fire rate limit
                player.lastProjectileTime = now;
                player.ammo--;
                setHudAmmo(player.ammo);
                
                // Determine projectile type based on Character
                let projType = 'HANDCUFF'; // Default
                if (character.id === 'char_2') projType = 'FIREBALL';
                else if (character.id === 'char_3') projType = 'BLOOD';
                else if (character.id === 'char_4') projType = 'LIGHT_STAR';
                else if (character.id === 'char_5') projType = 'NEON_CAT';
                else if (character.id === 'char_6') projType = 'NUMBER_BOLT';
                else if (character.id === 'char_7') projType = 'ECTO_BLAST';
                else if (character.id === 'char_8') projType = 'ROCKET';
                else if (character.id === 'char_9') projType = 'SOCCER_BALL'; // Bragnaldo
                else if (character.id === 'char_10') projType = 'WATER_BOTTLE'; // Cyclo
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
      
      // Tap detection for shooting on mobile
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
          handleInput('Control');
      }

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

      // Update speed
      if (stats.speed < GAME_CONFIG.MAX_SPEED) {
          stats.speed += GAME_CONFIG.SPEED_INCREMENT;
      }

      // Update distance and score
      stats.distance += stats.speed;
      stats.score = Math.floor(stats.distance * (character.powerUp === PowerUpType.DOUBLE_SCORE ? 2 : 1));
      setHudScore(stats.score);

      // Player Movement Logic (Lerp)
      player.x += (player.targetX - player.x) * 0.2;
      
      // Jump Physics
      if (player.y > 0 || player.vy > 0) {
          player.y += player.vy;
          player.vy -= GAME_CONFIG.GRAVITY;
          if (player.y < 0) {
              player.y = 0;
              player.vy = 0;
              if (player.state === 'JUMPING') player.state = 'RUNNING';
          }
      }

      // Magnet Logic
      if (player.magnetTimer > 0) {
          player.magnetTimer -= deltaTime;
      }

      // Spawn Logic
      // Reduced global spawn rate from 0.05 to 0.035 to make it easier
      if (Math.random() < 0.035) {
          const typeRand = Math.random();
          let type: any = ObstacleType.LOW_BARRIER;
          let y = 0;
          let width = 1;
          
          // Adjusted distribution: More Pizzas, Fewer Obstacles
          if (typeRand > 0.95) {
               type = 'SPEED_BOOST'; // 5%
               width = 0.8;
          } else if (typeRand > 0.55) { // 40% Chance for Pizza (Was ~10%)
              type = 'PIZZA';
              width = 0.6;
              y = 0.5;
          } else if (typeRand > 0.35) { // 20% High Barrier
              type = ObstacleType.HIGH_BARRIER;
              y = 2.5; // High up
          } else if (typeRand > 0.15) { // 20% Train
              type = ObstacleType.TRAIN;
          }
          // Else Low Barrier (15%)

          // Random Lane Selection (5 Lanes: -2, -1, 0, 1, 2)
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

      // Update Entities
      for (let i = entitiesRef.current.length - 1; i >= 0; i--) {
          const entity = entitiesRef.current[i];
          
          if (entity.type === 'PROJECTILE') {
              // Projectiles move FORWARD
              entity.z += 1.5; 
              if (entity.z > player.z + GAME_CONFIG.DRAW_DISTANCE) {
                  entity.active = false;
              }
              
              // Projectile Collision
              for (let j = 0; j < entitiesRef.current.length; j++) {
                  const target = entitiesRef.current[j];
                  if (!target.active || target === entity || target.type === 'PROJECTILE' || target.type === 'PIZZA' || target.type === 'SPEED_BOOST') continue;
                  
                  if (Math.abs(entity.x - target.x) < 1 && Math.abs(entity.z - target.z) < 2) {
                      target.active = false; 
                      entity.active = false; 
                      stats.score += 50; 
                      break;
                  }
              }

          } else {
              // Entities move towards player
              entity.z -= stats.speed * 20; 
          }

          // Cull objects
          if (entity.z < player.z - 5) {
              entity.active = false;
          }

          // Collision Detection
          if (entity.active && entity.type !== 'PROJECTILE') {
              if (Math.abs(entity.z - player.z) < 1.5) {
                  if (Math.abs(entity.x - player.x) < 0.8) {
                       const playerBottom = player.y;
                       
                       let collision = false;
                       
                       if (entity.type === 'PIZZA') {
                           stats.coins += 1;
                           setHudCoins(stats.coins);
                           entity.active = false;

                           if (stats.coins % 10 === 0) {
                               player.ammo += 3;
                               setHudAmmo(player.ammo);
                               setShowAmmoReload(true);
                               setTimeout(() => setShowAmmoReload(false), 2000);
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

                       if (collision && !player.invincible) {
                           onGameOver(stats.score, stats.coins);
                           return; 
                       }
                  }
              }
          }
      }
      
      entitiesRef.current = entitiesRef.current.filter(e => e.active);

      // Magnet
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

  // Perspective Projection Helper
  const project = (x: number, y: number, z: number, canvasWidth: number, canvasHeight: number) => {
      // Camera Settings
      const focalLength = 300;
      const cameraY = 1.5; // Height of camera above track
      const cameraZ = -5;  // Camera distance behind player
      const horizonY = canvasHeight * 0.35; // Horizon line position

      // Relative coordinates
      const relZ = z - cameraZ;
      const scale = focalLength / (focalLength + relZ);
      
      // Projected coordinates
      // Scale lane width based on screen width to ensure 5 lanes fit
      const xFactor = canvasWidth / 12; // Adjusted for 5 lanes
      const projX = (canvasWidth / 2) + (x * xFactor * scale);
      
      // Y Maps Z to vertical space. 
      const projY = horizonY + ((cameraY - y) * 100 * scale);

      // Re-adjust Y so that Z=0 is near bottom of screen
      const groundY = canvasHeight * 0.9;
      const runnerY = horizonY + (groundY - horizonY) * scale - (y * 50 * scale);

      return { x: projX, y: runnerY, scale };
  };

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, speed: number) => {
      // 1. Cyberpunk Gradient Sky
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#020617'); // Slate 950
      gradient.addColorStop(0.3, '#1e1b4b'); // Indigo 950
      gradient.addColorStop(0.6, '#4c1d95'); // Violet 800
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const horizonY = height * 0.35;

      // 2. Retro Sun
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
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunSize, 0, Math.PI * 2);
      ctx.fill();

      // Scanlines on sun
      ctx.fillStyle = '#4c1d95';
      for(let i=0; i<10; i++) {
          ctx.fillRect(sunX - sunSize, sunY + (i*8) - 20, sunSize*2, 2);
      }
      ctx.restore();

      // 3. Grid Floor (Perspective)
      ctx.save();
      
      // Floor Gradient
      const floorGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      floorGrad.addColorStop(0, '#000000');
      floorGrad.addColorStop(1, '#312e81');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      ctx.strokeStyle = '#c026d3'; 
      ctx.lineWidth = 1;
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#d946ef';

      // Vertical Lines (Lanes dividers)
      // 5 Lanes: -2, -1, 0, 1, 2. Lines at +/- 0.5, 1.5, 2.5
      for (let i = -3; i <= 3; i++) {
          const laneBoundary = (i + 0.5) * GAME_CONFIG.LANE_WIDTH;
          
          const pNear = project(laneBoundary, 0, 0, width, height);
          const pFar = project(laneBoundary, 0, 100, width, height);
          
          ctx.beginPath();
          ctx.moveTo(pNear.x, pNear.y);
          ctx.lineTo(pFar.x, pFar.y);
          ctx.stroke();
      }

      // Horizontal Lines (scrolling)
      const phase = (statsRef.current.distance * 10) % 20;
      for (let z = 0; z < 20; z++) {
          const worldZ = (z * 5) - phase;
          if (worldZ < -2) continue;

          // Project full width (-2.5 to 2.5 lanes roughly)
          const edge = 2.5 * GAME_CONFIG.LANE_WIDTH;
          const pLeft = project(-edge, 0, worldZ, width, height);
          const pRight = project(edge, 0, worldZ, width, height);

          // Distance fading
          const alpha = Math.max(0, 1 - (worldZ / 80));
          ctx.globalAlpha = alpha;

          ctx.beginPath();
          ctx.moveTo(pLeft.x, pLeft.y);
          ctx.lineTo(pRight.x, pRight.y);
          ctx.stroke();
      }
      
      ctx.restore();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw Background
    drawBackground(ctx, canvas.width, canvas.height, statsRef.current.speed);

    // Sort entities by Z (painters algorithm, far to near)
    const renderList = [...entitiesRef.current];
    renderList.sort((a, b) => b.z - a.z);

    renderList.forEach(entity => {
         const relZ = entity.z - playerRef.current.z;
         
         if (relZ > -2) {
             const proj = project(entity.x, entity.y, relZ, canvas.width, canvas.height);
             drawEntity(ctx, entity, proj.x, proj.y, proj.scale);
         }
    });

    // Draw Player
    const player = playerRef.current;
    const proj = project(player.x, player.y, 0, canvas.width, canvas.height);
    drawPlayer(ctx, proj.x, proj.y, proj.scale);
  };

  const drawEntity = (ctx: CanvasRenderingContext2D, entity: Entity, x: number, y: number, scale: number) => {
      // Base unit size is roughly 50px at scale 1
      const baseSize = 50; 
      const width = entity.width * baseSize * scale;
      const height = entity.height * baseSize * scale;
      
      ctx.save();
      
      if (entity.type === 'PIZZA') {
          const size = width;
          // GREEN PIZZA (Safe/Collect)
          ctx.shadowColor = '#22c55e'; // Green-500
          ctx.shadowBlur = 20;
          ctx.fillStyle = '#22c55e'; // Green Pizza Dough
          ctx.beginPath(); ctx.arc(x, y - size/2, size/2, 0, Math.PI*2); ctx.fill();
          // Details
          ctx.fillStyle = '#bbf7d0'; // Light Green Cheese
          ctx.beginPath(); ctx.arc(x, y - size/2, size/2.5, 0, Math.PI*2); ctx.fill();
          // Pepperoni (Darker Green)
          ctx.fillStyle = '#166534';
          ctx.beginPath(); ctx.arc(x - size/6, y - size/2 - size/6, size/8, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + size/6, y - size/2 + size/6, size/8, 0, Math.PI*2); ctx.fill();
          
      } else if (entity.type === 'SPEED_BOOST') {
          const size = width;
          ctx.shadowColor = '#06b6d4'; // Cyan Glow
          ctx.shadowBlur = 20;
          ctx.fillStyle = '#22d3ee';
          ctx.beginPath();
          ctx.moveTo(x, y - size);
          ctx.lineTo(x + size/2, y - size/2);
          ctx.lineTo(x, y);
          ctx.lineTo(x - size/2, y - size/2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = `bold ${size/1.5}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡', x, y - size/2);

      } else if (entity.type === 'PROJECTILE') {
          const size = width * 0.5;
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#fff';
          
          if (entity.subType === 'SOCCER_BALL') {
               ctx.fillStyle = '#fff';
               ctx.beginPath(); ctx.arc(x, y - size, size, 0, Math.PI*2); ctx.fill();
               ctx.strokeStyle = '#000'; ctx.stroke();
          } else {
              // Energy Bolt
              ctx.fillStyle = '#a855f7'; 
              if (entity.subType === 'FIREBALL') ctx.fillStyle = '#f97316';
              if (entity.subType === 'ECTO_BLAST') ctx.fillStyle = '#22d3ee';
              
              ctx.beginPath(); ctx.arc(x, y - size, size, 0, Math.PI*2); ctx.fill();
              ctx.fillStyle = '#fff';
              ctx.beginPath(); ctx.arc(x, y - size, size/2, 0, Math.PI*2); ctx.fill();
          }

      } else if (entity.type === ObstacleType.TRAIN) {
          // RED OBSTACLE
          ctx.shadowColor = '#dc2626'; // Red-600
          ctx.shadowBlur = 20;
          ctx.fillStyle = '#991b1b'; // Red-800
          ctx.strokeStyle = '#ef4444'; // Red-500
          ctx.lineWidth = 2;
          
          // Front Face
          ctx.fillRect(x - width/2, y - height, width, height);
          ctx.strokeRect(x - width/2, y - height, width, height);
          
          // Glowing Window
          ctx.shadowColor = '#fcd34d';
          ctx.fillStyle = '#fcd34d';
          ctx.fillRect(x - width/3, y - height + (height*0.2), width/1.5, height/3);

      } else if (entity.type === ObstacleType.HIGH_BARRIER) {
          // RED OBSTACLE (Gate)
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 15;
          ctx.fillStyle = 'rgba(239, 68, 68, 0.2)'; // Red Transparent
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          
          // Top bar
          ctx.strokeRect(x - width/2, y - height, width, height/3);
          
          // Posts
          ctx.fillRect(x - width/2, y - height, width/8, height);
          ctx.fillRect(x + width/2 - width/8, y - height, width/8, height);

      } else {
          // RED OBSTACLE (Low Barrier)
          ctx.shadowColor = '#dc2626';
          ctx.shadowBlur = 15;
          ctx.fillStyle = 'rgba(220, 38, 38, 0.4)';
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          
          ctx.fillRect(x - width/2, y - height/2, width, height/2);
          ctx.strokeRect(x - width/2, y - height/2, width, height/2);
          
          // Warning Stripes
          ctx.beginPath();
          ctx.moveTo(x - width/4, y);
          ctx.lineTo(x, y - height/2);
          ctx.stroke();
      }
      
      ctx.restore();
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) => {
      const player = playerRef.current;
      const baseSize = 50;
      const size = baseSize * scale;

      // Player Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      // Shadow scales with distance from ground (jump)
      const shadowScale = Math.max(0.5, 1 - (player.y * 0.2));
      ctx.ellipse(x, y, (size/2) * shadowScale, (size/4) * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Adjust Y for jump
      const visualY = y - (player.y * 100 * scale);

      // AMMO GLOW
      if (player.ammo > 0) {
          ctx.shadowBlur = 30;
          ctx.shadowColor = '#22c55e'; // Green-500
      } else {
          ctx.shadowBlur = 15;
          ctx.shadowColor = character.accentColor;
      }

      ctx.save();
      ctx.translate(x, visualY - size/2); // Center pivot

      const char = character;

      // Draw Character Box
      if (!['char_6', 'char_8', 'char_9', 'char_10'].includes(char.id)) {
          ctx.fillStyle = char.color;
          ctx.fillRect(-size/2, -size/2, size, size);
          
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.strokeRect(-size/2, -size/2, size, size);

          // Eyes
          ctx.fillStyle = '#fff';
          ctx.fillRect(-size*0.3, -size*0.3, size*0.2, size*0.2);
          ctx.fillRect(size*0.1, -size*0.3, size*0.2, size*0.2);

          // Roberto Hat
          if (char.id === 'char_1') {
              ctx.fillStyle = '#1e3a8a';
              ctx.fillRect(-size/2 - 2, -size/2 - size*0.2, size + 4, size*0.3);
          }
      } else {
         // Special Chars
         if (char.id === 'char_9') { // Bragnaldo
             ctx.fillStyle = '#166534'; ctx.fillRect(-size/2, -size/2, size, size);
             ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(-size/2, -size/2, size, size);
             ctx.fillStyle = '#dc2626'; ctx.fillRect(-size/2, size*0.25, size, size*0.25);
             ctx.fillStyle = '#fcd34d'; ctx.beginPath(); ctx.arc(0, -size*0.3, size*0.4, 0, Math.PI*2); ctx.fill();
         } else if (char.id === 'char_10') { // Cyclo
             ctx.fillStyle = '#0f172a';
             ctx.beginPath(); ctx.arc(-size*0.6, size*0.2, size*0.25, 0, Math.PI*2); ctx.fill();
             ctx.beginPath(); ctx.arc(size*0.6, size*0.2, size*0.25, 0, Math.PI*2); ctx.fill();
             ctx.fillStyle = char.color; ctx.fillRect(-size*0.25, -size*0.5, size*0.5, size*0.5);
             ctx.strokeStyle = '#38bdf8'; ctx.strokeRect(-size*0.25, -size*0.5, size*0.5, size*0.5);
         } else if (char.id === 'char_6') {
             ctx.font = `bold ${size}px monospace`;
             ctx.fillStyle = '#10b981'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('67', 0, 0);
         } else if (char.id === 'char_8') { // Pig
             ctx.fillStyle = '#f472b6'; ctx.beginPath(); ctx.arc(0, 0, size/2, 0, Math.PI*2); ctx.fill();
             ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
             ctx.fillStyle = '#374151'; ctx.fillRect(-size*0.4, -size*0.3, size*0.2, size*0.6);
         }
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
      
      {/* HUD - Cyberpunk UI */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-3">
            {/* Score */}
            <div className="bg-slate-900/60 backdrop-blur-md px-6 py-2 border-l-4 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] transform skew-x-[-12deg]">
                <div className="transform skew-x-[12deg]">
                    <span className="text-[10px] text-cyan-300 block font-bold uppercase tracking-widest mb-1">Stig</span>
                    <span className="text-2xl text-white font-black drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
                        {hudScore.toString().padStart(6, '0')}
                    </span>
                </div>
            </div>
            {/* Pizza (Now Green) */}
            <div className="bg-slate-900/60 backdrop-blur-md px-6 py-2 border-l-4 border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.4)] transform skew-x-[-12deg]">
                 <div className="transform skew-x-[12deg] flex items-center gap-2">
                    <span className="text-xl filter drop-shadow grayscale-0">🍕</span> 
                    <span className="text-2xl text-green-100 font-bold">{hudCoins}</span>
                </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
              <div className="flex gap-3">
                <button 
                    className="pointer-events-auto p-3 bg-red-600/80 border border-red-400 hover:border-white text-white rounded-none transform rotate-45 hover:rotate-0 transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0.2)]"
                    onClick={onQuit}
                >
                    <div className="transform -rotate-45 hover:rotate-0 transition-all duration-300">
                        <LogOut size={20} />
                    </div>
                </button>
                <button 
                    className="pointer-events-auto p-3 bg-slate-800/80 border border-slate-600 hover:border-white text-white rounded-none transform rotate-45 hover:rotate-0 transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                    onClick={() => setIsPaused(!isPaused)}
                >
                    <div className="transform -rotate-45 hover:rotate-0 transition-all duration-300">
                        <Pause size={20} />
                    </div>
                </button>
              </div>
              
              {/* Ammo Counter */}
              <div className={`
                transition-all duration-300 px-6 py-3 border-r-4 transform skew-x-[12deg] backdrop-blur-md
                ${hudAmmo > 0 
                    ? 'bg-green-900/60 border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]' 
                    : 'bg-slate-900/60 border-slate-600 opacity-80'}
              `}>
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

      {/* Messages */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col gap-6">
          {showSpeedBoost && (
              <div className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-pulse skew-x-[-10deg]">
                  HRÖÐUN!
              </div>
          )}
          {showAmmoReload && (
              <div className="text-3xl font-black text-white bg-green-600/90 px-8 py-4 border-2 border-white shadow-[0_0_30px_rgba(34,197,94,0.8)] skew-x-[-10deg] animate-bounce">
                  SKOT HLAÐIN!
              </div>
          )}
          {hudAmmo > 0 && !isPaused && (
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
      
      {/* Controls Hint */}
      <div className="absolute bottom-6 w-full text-center">
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
