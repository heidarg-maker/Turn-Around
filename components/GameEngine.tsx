import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Character, GameState, Lane, ObstacleType, PowerUpType, Entity } from '../types';
import { GAME_CONFIG } from '../constants';
import { Pause, Zap, Crosshair } from 'lucide-react';

interface GameEngineProps {
  character: Character;
  onGameOver: (score: number, coins: number) => void;
  gameState: GameState;
}

const GameEngine: React.FC<GameEngineProps> = ({ character, onGameOver, gameState }) => {
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
        if (player.lane > Lane.LEFT) {
          player.lane--;
          player.targetX = player.lane * GAME_CONFIG.LANE_WIDTH;
        }
        break;
      case 'ArrowRight':
      case 'd':
        if (player.lane < Lane.RIGHT) {
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
      
      // Tap detection for shooting on mobile if we want
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


  const gameLoop = (time: number) => {
    if (isPaused) {
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(gameLoop);
        return;
    }

    const dt = Math.min((time - lastTimeRef.current) / 16.67, 2);
    lastTimeRef.current = time;

    updatePhysics(dt, time);
    render(dt);

    if (gameState === GameState.PLAYING) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const updatePhysics = (dt: number, time: number) => {
    const stats = statsRef.current;
    const player = playerRef.current;

    // 1. Update Speed
    let speedMult = 1;
    if (character.powerUp === PowerUpType.SLOW_TIME) speedMult = 0.8;
    
    // Gradual increase
    if (stats.speed < GAME_CONFIG.MAX_SPEED) {
        stats.speed += GAME_CONFIG.SPEED_INCREMENT * speedMult * dt;
    }
    
    // 2. Score
    let scoreMult = 1;
    if (character.powerUp === PowerUpType.DOUBLE_SCORE) scoreMult = 2;
    stats.score += (stats.speed * 10 * scoreMult) * dt;
    
    stats.distance += stats.speed * dt;
    player.z = stats.distance;

    // 3. Player Movement
    player.x += (player.targetX - player.x) * 0.2 * dt; 

    // Vertical Physics
    if (player.y > 0 || player.vy > 0) {
        let gravity = GAME_CONFIG.GRAVITY;
        if (character.powerUp === PowerUpType.FLOATY) gravity *= 0.6;

        player.y += player.vy * dt;
        player.vy -= gravity * dt;
        
        if (player.y <= 0) {
            player.y = 0;
            player.vy = 0;
            player.state = 'RUNNING';
        }
    }


    // 4. Spawn Entities
    const spawnHorizon = player.z + GAME_CONFIG.DRAW_DISTANCE;
    const lastEntityZ = entitiesRef.current.length > 0 
        ? Math.max(...entitiesRef.current.map(e => e.z)) 
        : player.z;
    
    if (lastEntityZ < spawnHorizon) {
        spawnEntity(lastEntityZ);
    }

    // 5. Update Entities & Collision
    for (let i = entitiesRef.current.length - 1; i >= 0; i--) {
        const ent = entitiesRef.current[i];
        
        // PROJECTILE LOGIC
        if (ent.type === 'PROJECTILE') {
             ent.z += (stats.speed + 0.3) * dt;
             
             // Check if projectile hits an obstacle
             for (const other of entitiesRef.current) {
                 if (!other.active || other.type === 'COIN' || other.type === 'SPEED_BOOST' || other.type === 'PROJECTILE') continue;
                 
                 // Collision check
                 if (Math.abs(ent.z - other.z) < 1.0 && Math.abs(ent.x - other.x) < 1.0) {
                     ent.active = false;
                     other.active = false;
                     break;
                 }
             }

             if (ent.z > player.z + 60) ent.active = false;
             
             if (!ent.active) {
                 entitiesRef.current.splice(i, 1);
                 continue;
             }
             continue; // Skip player collision logic for projectile
        }

        // Magnet
        if (character.powerUp === PowerUpType.MAGNET && ent.type === 'COIN') {
             if (ent.z < player.z + 15 && ent.z > player.z - 2) {
                 const laneDiff = (player.lane * GAME_CONFIG.LANE_WIDTH) - ent.x;
                 if (Math.abs(laneDiff) < 4) {
                     ent.x += laneDiff * 0.1 * dt;
                     ent.z += (player.z - ent.z) * 0.05 * dt;
                 }
             }
        }

        // Cleanup passed entities
        if (ent.z < player.z - 10) {
            entitiesRef.current.splice(i, 1);
            continue;
        }

        if (ent.active && checkCollision(player, ent)) {
            if (ent.type === 'COIN') {
                const coinValue = character.powerUp === PowerUpType.DOUBLE_COINS ? 2 : 1;
                stats.coins += coinValue;
                ent.active = false;

                // --- NEW MECHANIC: 10 COINS = AMMO RELOAD ---
                if (stats.coins % 10 === 0) {
                    player.ammo += 3; // Grant 3 shots
                    setHudAmmo(player.ammo);
                    setShowAmmoReload(true);
                    setTimeout(() => setShowAmmoReload(false), 1000);
                }

            } else if (ent.type === 'SPEED_BOOST') {
                stats.speed += GAME_CONFIG.SPEED_BOOST_AMOUNT;
                stats.collectedPowerups += 1; 
                ent.active = false;
                setShowSpeedBoost(true);
                setTimeout(() => setShowSpeedBoost(false), 1000);
            } else {
                if (player.invincible) {
                    player.invincible = false;
                    ent.active = false; 
                } else if (character.powerUp === PowerUpType.PHASE_SHIFT && ent.type === ObstacleType.HIGH_BARRIER && Math.random() < 0.2) {
                     // Phase through
                } else {
                    handleGameOver();
                }
            }
        }
    }

    if (Math.floor(stats.score) % 10 === 0) {
        setHudScore(Math.floor(stats.score));
        setHudCoins(stats.coins);
    }
  };

  const checkCollision = (p: typeof playerRef.current, e: Entity) => {
      const collisionDepth = 0.8; 
      if (Math.abs(p.z - e.z) > collisionDepth) return false;
      if (Math.abs(p.x - e.x) > 0.8) return false;
      const playerHeight = p.state === 'ROLLING' ? 0.8 : 1.8;
      const playerBottom = p.y;
      const playerTop = p.y + playerHeight;
      const entBottom = e.y;
      const entTop = e.y + e.height;
      return (playerBottom < entTop && playerTop > entBottom);
  };

  const spawnEntity = (farZ: number) => {
      const speedFactor = Math.max(1, statsRef.current.speed / 0.3);
      const spawnZ = farZ + (Math.random() * 10 + 10 * speedFactor);
      const lane = [Lane.LEFT, Lane.CENTER, Lane.RIGHT][Math.floor(Math.random() * 3)];
      const x = lane * GAME_CONFIG.LANE_WIDTH;
      const r = Math.random();
      
      if (r < 0.08) { 
          entitiesRef.current.push({
              x, y: 0.5, z: spawnZ, width: 0.8, height: 0.8, type: 'SPEED_BOOST', active: true
          });
      } else if (r < 0.35) {
          entitiesRef.current.push({
              x, y: 0.5, z: spawnZ, width: 0.5, height: 0.5, type: 'COIN', active: true
          });
          entitiesRef.current.push({
            x, y: 0.5, z: spawnZ + 2, width: 0.5, height: 0.5, type: 'COIN', active: true
          });
          entitiesRef.current.push({
            x, y: 0.5, z: spawnZ + 4, width: 0.5, height: 0.5, type: 'COIN', active: true
          });
      } else {
          const type = Math.random() > 0.5 
            ? ObstacleType.LOW_BARRIER 
            : (Math.random() > 0.5 ? ObstacleType.HIGH_BARRIER : ObstacleType.TRAIN);
          let y = 0;
          let height = 0;
          if (type === ObstacleType.LOW_BARRIER) { height = 1.0; } 
          if (type === ObstacleType.HIGH_BARRIER) { y = 1.5; height = 1.5; } 
          if (type === ObstacleType.TRAIN) { height = 3.0; }
          entitiesRef.current.push({
              x, y, z: spawnZ, width: 1.5, height, type, active: true
          });
      }
  };

  const handleGameOver = () => {
      onGameOver(Math.floor(statsRef.current.score), statsRef.current.coins);
  };

  const render = (dt: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const PPU = Math.min(w, h) / 8; 
      const trackCenterX = w / 2;
      const playerScreenY = h * 0.8;
      
      // Clear
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Lanes
      ctx.fillStyle = '#1e293b'; 
      const trackWidth = GAME_CONFIG.LANE_WIDTH * 3 * PPU;
      ctx.fillRect(trackCenterX - trackWidth/2, 0, trackWidth, h);

      // Dividers
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.setLineDash([20, 20]);
      const dashOffset = (playerRef.current.z * PPU) % 40;
      ctx.lineDashOffset = -dashOffset;
      ctx.beginPath();
      const leftDivX = trackCenterX - (GAME_CONFIG.LANE_WIDTH * 0.5 * PPU);
      ctx.moveTo(leftDivX, 0);
      ctx.lineTo(leftDivX, h);
      const rightDivX = trackCenterX + (GAME_CONFIG.LANE_WIDTH * 0.5 * PPU);
      ctx.moveTo(rightDivX, 0);
      ctx.lineTo(rightDivX, h);
      ctx.stroke();
      ctx.setLineDash([]); 

      // Entities
      const drawList = [...entitiesRef.current];
      const worldToScreen = (wx: number, wz: number) => {
          const relZ = wz - playerRef.current.z;
          return {
              x: trackCenterX + (wx * PPU),
              y: playerScreenY - (relZ * PPU)
          };
      };
      drawList.sort((a, b) => b.z - a.z); 

      drawList.forEach(ent => {
          if (!ent.active) return;
          const pos = worldToScreen(ent.x, ent.z);
          if (pos.y > h + 100 || pos.y < -100) return;

          const width = ent.width * PPU;
          
          // Shadow 
          ctx.fillStyle = 'rgba(0,0,0,0.4)';
          ctx.beginPath();
          ctx.ellipse(pos.x, pos.y, width/2, width/2, 0, 0, Math.PI*2);
          ctx.fill();

          const lift = ent.y * PPU * 0.8; 
          
          if (ent.type === 'COIN') {
              ctx.fillStyle = '#fbbf24';
              ctx.beginPath();
              const spin = Math.abs(Math.sin(lastTimeRef.current / 200));
              ctx.ellipse(pos.x, pos.y - lift, (width/2) * spin, width/2, 0, 0, Math.PI*2);
              ctx.fill();
              ctx.strokeStyle = '#d97706';
              ctx.lineWidth = 2;
              ctx.stroke();
          } else if (ent.type === 'SPEED_BOOST') {
              ctx.fillStyle = '#facc15'; 
              ctx.beginPath();
              ctx.moveTo(pos.x, pos.y - lift - width);
              ctx.lineTo(pos.x + width/2, pos.y - lift);
              ctx.lineTo(pos.x - width/2, pos.y - lift);
              ctx.fill();
              ctx.shadowColor = '#fef08a';
              ctx.shadowBlur = 10;
              ctx.fill();
              ctx.shadowBlur = 0;
          } else if (ent.type === 'PROJECTILE') {
              // RENDER PROJECTILES
              if (ent.subType === 'FIREBALL') {
                  ctx.fillStyle = '#ef4444';
                  ctx.beginPath(); ctx.arc(pos.x, pos.y - lift, width/2, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#fca5a5';
                  ctx.beginPath(); ctx.arc(pos.x, pos.y - lift, width/3, 0, Math.PI*2); ctx.fill();
                  ctx.shadowColor = '#b91c1c'; ctx.shadowBlur = 15; ctx.fill(); ctx.shadowBlur = 0;
              } else if (ent.subType === 'BLOOD') {
                  ctx.fillStyle = '#991b1b';
                  ctx.beginPath();
                  ctx.arc(pos.x, pos.y - lift, width/2, 0, Math.PI*2);
                  ctx.moveTo(pos.x, pos.y - lift - width/2);
                  ctx.lineTo(pos.x - width/4, pos.y - lift - width);
                  ctx.lineTo(pos.x + width/4, pos.y - lift - width);
                  ctx.fill();
              } else if (ent.subType === 'LIGHT_STAR') {
                  const rotation = lastTimeRef.current * 0.01;
                  ctx.save();
                  ctx.translate(pos.x, pos.y - lift);
                  ctx.rotate(rotation);
                  ctx.fillStyle = '#fbbf24';
                  ctx.beginPath();
                  for (let i = 0; i < 4; i++) {
                      ctx.rotate(Math.PI / 2);
                      ctx.moveTo(0, 0); ctx.lineTo(width/2, width/6); ctx.lineTo(width, 0); ctx.lineTo(width/2, -width/6);
                  }
                  ctx.fill();
                  ctx.shadowColor = '#fcd34d'; ctx.shadowBlur = 10; ctx.stroke();
                  ctx.restore(); ctx.shadowBlur = 0;
              } else if (ent.subType === 'NEON_CAT') {
                  ctx.fillStyle = '#e879f9';
                  ctx.beginPath();
                  ctx.arc(pos.x, pos.y - lift, width/2, 0, Math.PI*2);
                  ctx.moveTo(pos.x - width/3, pos.y - lift - width/3); ctx.lineTo(pos.x - width/2, pos.y - lift - width); ctx.lineTo(pos.x, pos.y - lift - width/2);
                  ctx.moveTo(pos.x + width/3, pos.y - lift - width/3); ctx.lineTo(pos.x + width/2, pos.y - lift - width); ctx.lineTo(pos.x, pos.y - lift - width/2);
                  ctx.fill();
                  ctx.shadowColor = '#d946ef'; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0;
              } else if (ent.subType === 'ROCKET') {
                  ctx.fillStyle = '#374151'; 
                  ctx.fillRect(pos.x - width/4, pos.y - lift - width, width/2, width);
                  ctx.fillStyle = '#ef4444'; 
                  ctx.beginPath();
                  ctx.moveTo(pos.x - width/4, pos.y - lift - width); ctx.lineTo(pos.x + width/4, pos.y - lift - width); ctx.lineTo(pos.x, pos.y - lift - width * 1.5);
                  ctx.fill();
                  ctx.fillStyle = '#f59e0b';
                  ctx.beginPath(); ctx.arc(pos.x, pos.y - lift, width/3, 0, Math.PI*2); ctx.fill();
              } else if (ent.subType === 'NUMBER_BOLT') {
                  // 6-7's Projectile
                  ctx.fillStyle = '#10b981';
                  ctx.font = `bold ${width}px monospace`;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillText("7", pos.x, pos.y - lift - width/2);
              } else if (ent.subType === 'ECTO_BLAST') {
                  // Specter's Projectile
                  ctx.fillStyle = '#22d3ee';
                  ctx.beginPath();
                  ctx.arc(pos.x, pos.y - lift, width/2, 0, Math.PI*2);
                  ctx.fill();
                  ctx.fillStyle = '#cffafe';
                  ctx.beginPath();
                  ctx.arc(pos.x, pos.y - lift, width/3, 0, Math.PI*2);
                  ctx.fill();
                  ctx.shadowColor = '#0891b2'; ctx.shadowBlur = 15; ctx.fill(); ctx.shadowBlur = 0;
              } else {
                  // Handcuffs
                  ctx.fillStyle = '#94a3b8'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
                  ctx.beginPath(); ctx.arc(pos.x - width/4, pos.y - lift, width/4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                  ctx.beginPath(); ctx.arc(pos.x + width/4, pos.y - lift, width/4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                  ctx.beginPath(); ctx.moveTo(pos.x - width/4, pos.y - lift); ctx.lineTo(pos.x + width/4, pos.y - lift); ctx.stroke();
              }

          } else if (ent.type === ObstacleType.TRAIN) {
              ctx.fillStyle = '#475569';
              const trainLen = width * 2.5;
              ctx.fillRect(pos.x - width/2, pos.y - lift - trainLen/2, width, trainLen);
              ctx.fillStyle = '#64748b';
              ctx.fillRect(pos.x - width/2 + 4, pos.y - lift - trainLen/2 + 4, width - 8, trainLen - 8);
          } else {
              // Barrier
              ctx.fillStyle = ent.type === ObstacleType.HIGH_BARRIER ? '#dc2626' : '#ea580c';
              ctx.fillRect(pos.x - width/2, pos.y - lift - width/2, width, width/2); 
              ctx.fillStyle = 'rgba(255,255,255,0.2)';
              ctx.fillRect(pos.x - width/2, pos.y - lift - width/2, width, 5);
          }
      });

      // Render Player
      const player = playerRef.current;
      const pPos = worldToScreen(player.x, player.z); 
      
      const pWidth = 1.0 * PPU; // Base size
      const jumpScale = 1 + (player.y * 0.3); // Scale factor
      
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      const shadowSize = (pWidth/2) / (1 + player.y);
      ctx.ellipse(pPos.x, pPos.y, shadowSize, shadowSize, 0, 0, Math.PI*2);
      ctx.fill();

      // Player Body
      ctx.save();
      ctx.translate(pPos.x, pPos.y);
      ctx.scale(jumpScale, jumpScale); 
      
      // ... (Reusing existing drawing logic, shortened for this block to focus on structure) ...
      // I will copy the drawing logic from the previous file content but ensuring 6-7 uses standard rendering mostly.
      
      if (character.id === 'char_1') { // ROBERTO
          ctx.fillStyle = character.color;
          ctx.beginPath(); ctx.arc(0, 0, pWidth/2, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#3e2723'; 
          const curlSize = pWidth / 6;
          for(let i=0; i<8; i++) {
              const angle = (i / 8) * Math.PI * 2;
              const cx = Math.cos(angle) * (pWidth/2.2);
              const cy = Math.sin(angle) * (pWidth/2.2);
              ctx.beginPath(); ctx.arc(cx, cy, curlSize, 0, Math.PI*2); ctx.fill();
          }
          ctx.fillStyle = '#64748b'; 
          ctx.fillRect(-pWidth/2 - curlSize/2, -pWidth/6, pWidth/5, pWidth/3);
          ctx.fillRect(pWidth/2 - curlSize, -pWidth/6, pWidth/5, pWidth/3);
          ctx.strokeStyle = '#64748b'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(0, 0, pWidth/2 + 2, Math.PI, 0); ctx.stroke();
      } else if (character.id === 'char_2') { // STEVE
          ctx.fillStyle = '#5d4037'; ctx.fillRect(-pWidth/6, -pWidth/6, pWidth/3, pWidth/3);
          ctx.fillStyle = '#9ca3af';
          ctx.beginPath(); ctx.moveTo(pWidth/6, -pWidth/4); ctx.quadraticCurveTo(pWidth/1.5, 0, pWidth/6, pWidth/4); ctx.fill();
          ctx.beginPath(); ctx.moveTo(-pWidth/6, -pWidth/4); ctx.quadraticCurveTo(-pWidth/1.5, 0, -pWidth/6, pWidth/4); ctx.fill();
          ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(-pWidth/3, 0, pWidth/10, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(pWidth/3, 0, pWidth/10, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(-pWidth/3, 0, pWidth/20, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(pWidth/3, 0, pWidth/20, 0, Math.PI*2); ctx.fill();
      } else if (character.id === 'char_3') { // EL
          ctx.fillStyle = character.accentColor; ctx.beginPath(); ctx.arc(0, 0, pWidth/2, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#fca5a5'; ctx.beginPath(); ctx.arc(0, 0, pWidth/3, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = 'rgba(50,30,30,0.2)'; ctx.beginPath(); ctx.arc(0, 0, pWidth/3.2, 0, Math.PI*2); ctx.fill();
      } else if (character.id === 'char_4') { // LORD AMBER
          ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.moveTo(-pWidth/2, pWidth/2); ctx.quadraticCurveTo(0, -pWidth/2, pWidth/2, pWidth/2); ctx.fill();
          ctx.fillStyle = '#000'; ctx.beginPath(); ctx.moveTo(-pWidth/4, pWidth/4); ctx.lineTo(pWidth/4, pWidth/4); ctx.lineTo(0, pWidth/2); ctx.fill();
      } else if (character.id === 'char_5') { // HOPPER
          ctx.fillStyle = '#a16207'; ctx.beginPath(); ctx.arc(0, 0, pWidth/2, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#78350f'; ctx.beginPath(); ctx.ellipse(0, -pWidth/10, pWidth/2.2, pWidth/2.2, 0, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(0, -pWidth/10, pWidth/4, 0, Math.PI*2); ctx.fill();
      } else if (character.id === 'char_6') { // 6-7
          ctx.fillStyle = '#10b981'; ctx.font = `bold ${pWidth/1.5}px monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText("6", -pWidth/4, 0); ctx.fillStyle = '#34d399'; ctx.fillText("7", pWidth/4, 0);
      } else if (character.id === 'char_7') { // SPECTER
           ctx.fillStyle = '#cbd5e1'; 
           ctx.beginPath();
           ctx.moveTo(-pWidth/3, pWidth/2); ctx.lineTo(-pWidth/3, 0); ctx.quadraticCurveTo(0, -pWidth/2, pWidth/3, 0); ctx.lineTo(pWidth/3, pWidth/2);
           ctx.fill();
           ctx.fillStyle = '#0f172a';
           ctx.beginPath(); ctx.arc(-pWidth/6, 0, pWidth/12, 0, Math.PI*2); ctx.fill();
           ctx.beginPath(); ctx.arc(pWidth/6, 0, pWidth/12, 0, Math.PI*2); ctx.fill();
      } else if (character.id === 'char_8') { // SHOTGUN-BOMB
          ctx.fillStyle = '#f472b6'; ctx.beginPath(); ctx.arc(0, 0, pWidth/2, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.moveTo(-pWidth/3, -pWidth/3); ctx.lineTo(-pWidth/2, -pWidth/2); ctx.lineTo(-pWidth/4, -pWidth/2); ctx.moveTo(pWidth/3, -pWidth/3); ctx.lineTo(pWidth/2, -pWidth/2); ctx.lineTo(pWidth/4, -pWidth/2); ctx.fill();
          ctx.fillStyle = '#fbcfe8'; ctx.beginPath(); ctx.ellipse(0, pWidth/6, pWidth/6, pWidth/8, 0, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#be185d'; ctx.beginPath(); ctx.arc(-pWidth/12, pWidth/6, pWidth/20, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(pWidth/12, pWidth/6, pWidth/20, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(-pWidth/5, -pWidth/12, pWidth/12, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(pWidth/5, -pWidth/12, pWidth/12, 0, Math.PI*2); ctx.fill();
          ctx.save(); ctx.rotate(-Math.PI/4); ctx.fillStyle = '#374151'; ctx.fillRect(0, -pWidth/2, pWidth/3, pWidth); ctx.fillStyle = '#ef4444'; ctx.fillRect(0, -pWidth/2, pWidth/3, pWidth/6); ctx.restore();
      } else {
          ctx.fillStyle = character.color; ctx.beginPath(); ctx.arc(0, 0, pWidth/2, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = character.accentColor; ctx.beginPath(); ctx.arc(0, -pWidth/6, pWidth/4, 0, Math.PI*2); ctx.fill();
      }

      if (player.invincible) {
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, (pWidth/2) + 5, 0, Math.PI*2); ctx.stroke();
      }

      ctx.restore();
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden" 
         onTouchStart={handleTouchStart} 
         onTouchEnd={handleTouchEnd}
    >
      <canvas 
        ref={canvasRef} 
        width={window.innerWidth} 
        height={window.innerHeight} 
        className="block"
      />
      
      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-1">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-700 text-white font-mono text-2xl font-bold">
                  {hudScore.toString().padStart(6, '0')}
              </div>
          </div>

          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="pointer-events-auto p-2 bg-white/10 rounded-full hover:bg-white/20"
          >
             <Pause className="text-white" />
          </button>

          <div className="flex flex-col gap-1 items-end">
             {/* Coin Counter */}
             <div className="bg-amber-500/90 p-2 rounded border border-amber-300 text-white font-mono text-2xl font-bold flex items-center gap-2 shadow-lg">
                 <span>{hudCoins}</span>
                 <div className="w-4 h-4 rounded-full bg-yellow-300 border border-yellow-600" />
             </div>
             
             {/* Ammo Counter */}
             <div className={`mt-2 p-2 rounded border font-mono font-bold flex items-center gap-2 shadow-lg transition-all
                  ${hudAmmo > 0 ? 'bg-red-600 border-red-400 text-white animate-pulse' : 'bg-slate-800 border-slate-600 text-slate-500'}
             `}>
                  <span>{hudAmmo}</span>
                  <Crosshair size={16} />
             </div>
             <div className="text-[10px] text-slate-400 mt-1">10 COINS = +3 AMMO</div>
          </div>
      </div>
      
      {/* Active Character Badge */}
      <div className="absolute bottom-6 left-6 pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-600">
               <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: character.color }}>
                   <span className="text-white font-bold text-xs">P{character.id.split('_')[1]}</span>
               </div>
               <div className="flex flex-col">
                   <span className="text-white text-sm font-bold">{character.name}</span>
                   <span className="text-xs text-slate-400">{character.powerUp.replace('_', ' ')}</span>
                   <span className="text-[10px] text-cyan-400 font-mono">SHOOT: CTRL</span>
               </div>
          </div>
      </div>

      {showSpeedBoost && (
        <div className="absolute top-1/4 left-0 right-0 flex justify-center pointer-events-none animate-bounce">
            <div className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-2 rounded-full font-black text-xl shadow-lg border-2 border-white">
                <Zap className="fill-black" />
                SPEED UP!
            </div>
        </div>
      )}

      {showAmmoReload && (
        <div className="absolute top-1/3 left-0 right-0 flex justify-center pointer-events-none animate-bounce">
            <div className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-full font-black text-xl shadow-lg border-2 border-white">
                <Crosshair />
                RELOAD!
            </div>
        </div>
      )}

      {isPaused && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm pointer-events-none">
              <h2 className="text-4xl font-bold text-white tracking-widest">PAUSED</h2>
          </div>
      )}
    </div>
  );
};

export default GameEngine;