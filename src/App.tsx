/**
 * KUARAHY — Jogo de Luta 2D Pixel Art
 * Main Application Orchestrator & 60 FPS Fight Engine.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameMode,
  SubMode,
  AIDifficulty,
  FighterId,
  StageId,
  InputState,
  Projectile,
  ParticleEffect,
  GameSettings,
  MatchRoundState,
} from './types/game';
import { Fighter } from './combat/Fighter';
import { FighterAI } from './ai/FighterAI';
import { evaluateCombatCollision } from './combat/HitboxSystem';
import { PixelRenderer } from './graphics/PixelRenderer';
import { soundEngine } from './audio/SoundEngine';
import { multiplayerManager } from './network/MultiplayerManager';

import { HUD } from './components/HUD';
import { TouchControls } from './components/TouchControls';
import { MainMenu } from './components/MainMenu';
import { CharacterSelect } from './components/CharacterSelect';
import { StageSelect } from './components/StageSelect';
import { TrainingOverlay, DummyBehavior } from './components/TrainingOverlay';
import { OptionsMenu } from './components/OptionsMenu';
import { PauseModal } from './components/PauseModal';
import { MoveListModal } from './components/MoveListModal';
import { MultiplayerLobby } from './components/MultiplayerLobby';

const VIRTUAL_WIDTH = 480;
const VIRTUAL_HEIGHT = 270;

export default function App() {
  // Navigation & Game State
  const [mode, setMode] = useState<GameMode>('menu');
  const [subMode, setSubMode] = useState<SubMode>('1vbot');
  const [p1FighterId, setP1FighterId] = useState<FighterId>('terere');
  const [p2FighterId, setP2FighterId] = useState<FighterId>('chaco');
  const [stageId, setStageId] = useState<StageId>('assuncao');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('normal');

  // Modals & Overlays
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showMoveList, setShowMoveList] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  // Training Mode Settings
  const [dummyBehavior, setDummyBehavior] = useState<DummyBehavior>('stand');
  const [infiniteHp, setInfiniteHp] = useState<boolean>(true);
  const [infiniteEnergy, setInfiniteEnergy] = useState<boolean>(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  // User Settings
  const [settings, setSettings] = useState<GameSettings>({
    musicVolume: 0.65,
    sfxVolume: 0.85,
    roundsToWin: 2, // Best of 3
    roundTimer: 60,
    aiDifficulty: 'normal',
    showHitboxes: false,
    enableScanlines: true,
  });

  // Match Round State
  const [roundState, setRoundState] = useState<MatchRoundState>({
    currentRound: 1,
    p1RoundsWon: 0,
    p2RoundsWon: 0,
    timer: 60,
    phase: 'intro',
    winner: null,
    bannerText: 'ROUND 1',
    bannerSubtext: 'PREPARE-SE!',
    bannerTimer: 90,
  });

  // Canvas Reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active Fighters and Entities Refs (for mutable 60 FPS tick)
  const f1Ref = useRef<Fighter>(new Fighter(1, 'terere', 120, 1));
  const f2Ref = useRef<Fighter>(new Fighter(2, 'chaco', 360, -1));
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<ParticleEffect[]>([]);
  const aiRef = useRef<FighterAI>(new FighterAI('normal'));
  const rendererRef = useRef<PixelRenderer | null>(null);

  const screenShakeRef = useRef<number>(0);
  const hitstopFramesRef = useRef<number>(0);
  const nextProjectileIdRef = useRef<number>(1);

  // Input states refs
  const p1InputsRef = useRef<InputState>({
    up: false, down: false, left: false, right: false,
    punch: false, kick: false, heavy: false, special: false, grab: false, block: false, super: false,
    punchPressed: false, kickPressed: false, heavyPressed: false, specialPressed: false, grabPressed: false, blockPressed: false, superPressed: false,
  });

  const p2InputsRef = useRef<InputState>({
    up: false, down: false, left: false, right: false,
    punch: false, kick: false, heavy: false, special: false, grab: false, block: false, super: false,
    punchPressed: false, kickPressed: false, heavyPressed: false, specialPressed: false, grabPressed: false, blockPressed: false, superPressed: false,
  });

  // Check touch capability on mount
  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);

  // Sync Audio Engine volumes on startup
  useEffect(() => {
    soundEngine.setVolumes(settings.musicVolume, settings.sfxVolume);
  }, [settings.musicVolume, settings.sfxVolume]);

  // Handle Mode Change & Music Transitions
  useEffect(() => {
    if (mode === 'menu') {
      soundEngine.startBgm('menu');
    } else if (mode === 'fight' || mode === 'training') {
      soundEngine.startBgm('fight');
    }
  }, [mode]);

  // Push command to training history
  const logCommand = useCallback((cmd: string) => {
    setCommandHistory((prev) => [...prev.slice(-12), cmd]);
  }, []);

  // Initialize Canvas Renderer
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        rendererRef.current = new PixelRenderer(ctx, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
      }
    }
  }, [mode]);

  // KEYBOARD CONTROLS LISTENER
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Pause Toggle (Escape or P)
      if ((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && (mode === 'fight' || mode === 'training')) {
        setIsPaused((prev) => !prev);
        soundEngine.playMenuBeep();
        return;
      }

      // Quick Reset in Training (R)
      if ((e.key === 'r' || e.key === 'R') && mode === 'training') {
        resetTrainingPositions();
        return;
      }

      // PLAYER 1 KEYS (WASD + J/K/O/L/U/I/Space)
      const p1 = p1InputsRef.current;
      switch (e.key.toLowerCase()) {
        case 'w': p1.up = true; break;
        case 's': p1.down = true; break;
        case 'a': p1.left = true; break;
        case 'd': p1.right = true; break;
        case 'j':
          if (!p1.punch) { p1.punchPressed = true; logCommand('P1: SOCO (J)'); }
          p1.punch = true;
          break;
        case 'k':
          if (!p1.kick) { p1.kickPressed = true; logCommand('P1: CHUTE (K)'); }
          p1.kick = true;
          break;
        case 'o':
          if (!p1.heavy) { p1.heavyPressed = true; logCommand('P1: FORTE (O)'); }
          p1.heavy = true;
          break;
        case 'l':
          if (!p1.special) { p1.specialPressed = true; logCommand('P1: ESPECIAL (L)'); }
          p1.special = true;
          break;
        case 'u':
          if (!p1.grab) { p1.grabPressed = true; logCommand('P1: AGARRÃO (U)'); }
          p1.grab = true;
          break;
        case 'i':
          if (!p1.block) { p1.blockPressed = true; logCommand('P1: DEFESA (I)'); }
          p1.block = true;
          break;
        case ' ':
          if (!p1.super) { p1.superPressed = true; logCommand('P1: SUPER (ESPAÇO)'); }
          p1.super = true;
          break;
      }

      // PLAYER 2 KEYS (Arrow Keys + Numpad / Alternate Numbers)
      const p2 = p2InputsRef.current;
      switch (e.key) {
        case 'ArrowUp': p2.up = true; break;
        case 'ArrowDown': p2.down = true; break;
        case 'ArrowLeft': p2.left = true; break;
        case 'ArrowRight': p2.right = true; break;
        case '1':
        case '7':
          if (!p2.punch) p2.punchPressed = true;
          p2.punch = true;
          break;
        case '2':
        case '8':
          if (!p2.kick) p2.kickPressed = true;
          p2.kick = true;
          break;
        case '3':
        case '9':
          if (!p2.heavy) p2.heavyPressed = true;
          p2.heavy = true;
          break;
        case '5':
        case '0':
          if (!p2.special) p2.specialPressed = true;
          p2.special = true;
          break;
        case '4':
        case 'p':
        case 'P':
          if (!p2.grab) p2.grabPressed = true;
          p2.grab = true;
          break;
        case '6':
        case '[':
          if (!p2.block) p2.blockPressed = true;
          p2.block = true;
          break;
        case 'Enter':
          if (!p2.super) p2.superPressed = true;
          p2.super = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const p1 = p1InputsRef.current;
      switch (e.key.toLowerCase()) {
        case 'w': p1.up = false; break;
        case 's': p1.down = false; break;
        case 'a': p1.left = false; break;
        case 'd': p1.right = false; break;
        case 'j': p1.punch = false; break;
        case 'k': p1.kick = false; break;
        case 'o': p1.heavy = false; break;
        case 'l': p1.special = false; break;
        case 'u': p1.grab = false; break;
        case 'i': p1.block = false; break;
        case ' ': p1.super = false; break;
      }

      const p2 = p2InputsRef.current;
      switch (e.key) {
        case 'ArrowUp': p2.up = false; break;
        case 'ArrowDown': p2.down = false; break;
        case 'ArrowLeft': p2.left = false; break;
        case 'ArrowRight': p2.right = false; break;
        case '1':
        case '7': p2.punch = false; break;
        case '2':
        case '8': p2.kick = false; break;
        case '3':
        case '9': p2.heavy = false; break;
        case '5':
        case '0': p2.special = false; break;
        case '4':
        case 'p':
        case 'P': p2.grab = false; break;
        case '6':
        case '[': p2.block = false; break;
        case 'Enter': p2.super = false; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [mode, logCommand]);

  // TOUCH CONTROLS HANDLERS
  const handleTouchDown = (key: keyof InputState) => {
    const p1 = p1InputsRef.current;
    (p1 as any)[key] = true;
    if (key === 'punch') p1.punchPressed = true;
    if (key === 'kick') p1.kickPressed = true;
    if (key === 'heavy') p1.heavyPressed = true;
    if (key === 'special') p1.specialPressed = true;
    if (key === 'grab') p1.grabPressed = true;
    if (key === 'block') p1.blockPressed = true;
    if (key === 'super') p1.superPressed = true;
  };

  const handleTouchUp = (key: keyof InputState) => {
    const p1 = p1InputsRef.current;
    (p1 as any)[key] = false;
  };

  // RESET FIGHT POSITIONS (New Round or Match Start)
  const initRound = useCallback((roundNum: number, p1Wins: number, p2Wins: number) => {
    f1Ref.current.reset(120, 1, false);
    f2Ref.current.reset(360, -1, false);
    projectilesRef.current = [];
    particlesRef.current = [];
    screenShakeRef.current = 0;
    hitstopFramesRef.current = 0;

    const bannerText = `ROUND ${roundNum}`;
    const bannerSubtext = roundNum === 3 ? 'ROUND FINAL!' : 'FIGHT!';

    setRoundState({
      currentRound: roundNum,
      p1RoundsWon: p1Wins,
      p2RoundsWon: p2Wins,
      timer: settings.roundTimer,
      phase: 'intro',
      winner: null,
      bannerText,
      bannerSubtext,
      bannerTimer: 75,
    });

    soundEngine.playRoundCall(bannerText);
  }, [settings.roundTimer]);

  const resetTrainingPositions = useCallback(() => {
    f1Ref.current.reset(140, 1, false);
    f2Ref.current.reset(340, -1, false);
    if (infiniteHp) {
      f1Ref.current.health = 100;
      f2Ref.current.health = 100;
    }
    if (infiniteEnergy) {
      f1Ref.current.energy = 100;
      f2Ref.current.energy = 100;
    }
    projectilesRef.current = [];
    particlesRef.current = [];
  }, [infiniteHp, infiniteEnergy]);

  // SPAWN HIT SPARKS PARTICLES
  const spawnHitParticles = (x: number, y: number, color: string, count: number = 8, shape: 'spark' | 'ring' | 'square' = 'spark') => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const spd = 2 + Math.random() * 4.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: shape === 'ring' ? 8 : 3 + Math.random() * 3,
        color,
        alpha: 1,
        life: 0,
        maxLife: 14 + Math.random() * 8,
        shape,
      });
    }
  };

  // SPAWN PROJECTILE FROM SPECIAL ATTACK
  const spawnProjectile = (fighter: Fighter, projData: any) => {
    const projX = fighter.facing === 1 ? fighter.x + 35 : fighter.x - 35;
    const projY = fighter.y - 48;

    projectilesRef.current.push({
      id: nextProjectileIdRef.current++,
      ownerId: fighter.id,
      x: projX,
      y: projY,
      vx: projData.speed * fighter.facing,
      vy: 0,
      w: projData.w,
      h: projData.h,
      damage: fighter.currentAttack ? fighter.currentAttack.damage : 15,
      energyGain: 12,
      hitstun: fighter.currentAttack ? fighter.currentAttack.hitstun : 22,
      type: projData.type,
      lifetime: projData.lifetime,
      active: true,
    });
  };

  // 60 FPS DETERMINISTIC GAME LOOP
  useEffect(() => {
    if (mode !== 'fight' && mode !== 'training') return;

    let animId: number;
    let timerFrameCounter = 0;

    const gameLoop = () => {
      animId = requestAnimationFrame(gameLoop);

      if (isPaused) return;

      const f1 = f1Ref.current;
      const f2 = f2Ref.current;

      // 1. Process Round Phase Timers
      setRoundState((prev) => {
        if (prev.bannerTimer > 0) {
          const newTimer = prev.bannerTimer - 1;
          if (newTimer === 0 && prev.phase === 'intro') {
            soundEngine.playRoundCall('FIGHT!');
            return {
              ...prev,
              phase: 'fight',
              bannerText: 'FIGHT!',
              bannerSubtext: '',
              bannerTimer: 35,
            };
          } else if (newTimer === 0 && prev.phase === 'fight' && prev.bannerText === 'FIGHT!') {
            return { ...prev, bannerText: '', bannerTimer: 0 };
          } else if (newTimer === 0 && prev.phase === 'round_over') {
            // Check if match won
            const p1WonMatch = prev.p1RoundsWon >= settings.roundsToWin;
            const p2WonMatch = prev.p2RoundsWon >= settings.roundsToWin;

            if (p1WonMatch || p2WonMatch) {
              soundEngine.startBgm('victory');
              return {
                ...prev,
                phase: 'match_over',
                bannerText: p1WonMatch ? `${f1.name} VENCE!` : `${f2.name} VENCE!`,
                bannerSubtext: 'VITÓRIA SUPREMA!',
                bannerTimer: 200,
              };
            } else {
              // Proceed to next round!
              initRound(prev.currentRound + 1, prev.p1RoundsWon, prev.p2RoundsWon);
            }
          }
          return { ...prev, bannerTimer: newTimer };
        }
        return prev;
      });

      // 2. Timer countdown in fight phase
      if (roundState.phase === 'fight' && roundState.timer > 0) {
        timerFrameCounter++;
        if (timerFrameCounter >= 60) {
          timerFrameCounter = 0;
          setRoundState((prev) => {
            if (prev.timer <= 1) {
              // TIME OVER
              soundEngine.playRoundCall('TIME OVER');
              let winner: 1 | 2 | 'draw' = 'draw';
              if (f1.health > f2.health) winner = 1;
              else if (f2.health > f1.health) winner = 2;

              const p1Wins = winner === 1 ? prev.p1RoundsWon + 1 : prev.p1RoundsWon;
              const p2Wins = winner === 2 ? prev.p2RoundsWon + 1 : prev.p2RoundsWon;

              return {
                ...prev,
                phase: 'round_over',
                timer: 0,
                winner,
                p1RoundsWon: p1Wins,
                p2RoundsWon: p2Wins,
                bannerText: 'TEMPO ESGOTADO!',
                bannerSubtext: winner === 1 ? `${f1.name} VENCE POR VIDA!` : winner === 2 ? `${f2.name} VENCE POR VIDA!` : 'EMPATE!',
                bannerTimer: 100,
              };
            }
            return { ...prev, timer: prev.timer - 1 };
          });
        }
      }

      // 3. Resolve Inputs for P2 (AI or Local 2P)
      let activeP2Inputs = { ...p2InputsRef.current };
      if (mode === 'fight' && subMode === '1vbot') {
        activeP2Inputs = aiRef.current.getInputs(f2, f1);
      } else if (mode === 'training') {
        // Training Dummy AI behaviors
        activeP2Inputs = {
          up: dummyBehavior === 'jump',
          down: dummyBehavior === 'crouch',
          left: false, right: false,
          punch: false, kick: false, heavy: false, special: false, grab: false,
          block: dummyBehavior === 'block_all' || (dummyBehavior === 'block_random' && Math.random() < 0.5),
          super: false,
          punchPressed: false, kickPressed: false, heavyPressed: false, specialPressed: false, grabPressed: false,
          blockPressed: false, superPressed: false,
        };
      }

      // 4. Update Fighters
      const arenaMinX = 20;
      const arenaMaxX = VIRTUAL_WIDTH - 20;

      if (roundState.phase === 'fight' || mode === 'training') {
        f1.update(p1InputsRef.current, f2, arenaMinX, arenaMaxX);
        f2.update(activeP2Inputs, f1, arenaMinX, arenaMaxX);
      } else {
        // Stand still during intro / round_over
        f1.vx = 0;
        f2.vx = 0;
      }

      // 5. Training Mode Infinites Enforcer
      if (mode === 'training') {
        if (infiniteHp) {
          f1.health = 100;
          f2.health = 100;
        }
        if (infiniteEnergy) {
          f1.energy = 100;
          f2.energy = 100;
        }
      }

      // 6. Check Projectile Spawns on startup frame
      if (f1.isAttacking() && f1.currentAttack && f1.currentAttack.projectile && f1.stateFrame === f1.currentAttack.startup) {
        spawnProjectile(f1, f1.currentAttack.projectile);
      }
      if (f2.isAttacking() && f2.currentAttack && f2.currentAttack.projectile && f2.stateFrame === f2.currentAttack.startup) {
        spawnProjectile(f2, f2.currentAttack.projectile);
      }

      // 7. Update Projectiles
      for (const p of projectilesRef.current) {
        if (!p.active) continue;
        p.x += p.vx;
        p.lifetime--;

        // Screen bounds
        if (p.x < 0 || p.x > VIRTUAL_WIDTH || p.lifetime <= 0) {
          p.active = false;
          continue;
        }

        // Projectile vs Fighter Collision
        const target = p.ownerId === 1 ? f2 : f1;
        const targetIsBlocking = target.state === 'block';

        if (Math.abs(p.x - target.x) < 24 && Math.abs(p.y - (target.y - 45)) < 35) {
          p.active = false;
          if (targetIsBlocking) {
            target.takeBlock(Math.round(p.damage * 0.2), 12, p.vx > 0 ? 4 : -4);
            soundEngine.playBlock();
            spawnHitParticles(p.x, p.y, '#94a3b8', 5);
          } else {
            target.takeDamage(p.damage, p.hitstun, p.vx > 0 ? 8 : -8, -3);
            soundEngine.playSpecial(p.type);
            spawnHitParticles(p.x, p.y, '#38bdf8', 12, 'spark');
            screenShakeRef.current = 4;
          }
        }
      }

      // 8. Direct Attack Hitbox Collisions (F1 attacking F2)
      if (f1.isHitboxActive() && f1.currentAttack && !f1.hasHitInCurrentAttack) {
        const result = evaluateCombatCollision(
          f1.x, f1.y, f1.facing, f1.currentAttack,
          f2.x, f2.y, f2.facing,
          f2.state === 'crouch' || f2.state === 'crouch_punch' || f2.state === 'crouch_kick',
          !f2.isGrounded(),
          f2.state === 'block' || f2.blockHeldFrames > 0,
          f2.blockHeldFrames,
          2, // defense stat
          f2.invulnerableFrames > 0
        );

        if (result && result.hit) {
          f1.hasHitInCurrentAttack = true;

          if (result.isParry) {
            // CONTRA TRIGGERED!
            f2.executeParry();
            f1.hitstun = 24; // Stun attacker!
            f1.state = 'hit';
            spawnHitParticles(result.impactX, result.impactY, '#fde047', 16, 'ring');
            screenShakeRef.current = 6;
          } else if (result.isBlocked) {
            // NORMAL BLOCK
            f2.takeBlock(result.damage, result.blockstun, result.knockbackX);
            soundEngine.playBlock();
            spawnHitParticles(result.impactX, result.impactY, '#e2e8f0', 6);
          } else {
            // CLEAN HIT!
            f2.takeDamage(result.damage, result.hitstun, result.knockbackX, result.knockbackY);
            f1.addEnergy(f1.currentAttack.energyGain);
            f1.comboHits++;
            f1.comboDamage += result.damage;
            f1.comboTimer = 75; // 1.25s window to continue combo

            // Hitstop & screen shake
            hitstopFramesRef.current = f1.currentAttack.type === 'heavy' || f1.currentAttack.type === 'super' ? 10 : 6;
            f1.hitstop = hitstopFramesRef.current;
            f2.hitstop = hitstopFramesRef.current;
            screenShakeRef.current = f1.currentAttack.type === 'super' ? 8 : 4;

            // SFX & Particles
            if (f1.currentAttack.type === 'punch') soundEngine.playPunch();
            else if (f1.currentAttack.type === 'kick') soundEngine.playKick();
            else if (f1.currentAttack.type === 'heavy') soundEngine.playHeavy();
            else if (f1.currentAttack.type === 'grab') soundEngine.playGrab();
            else soundEngine.playSpecial();

            spawnHitParticles(result.impactX, result.impactY, '#ef4444', 12, 'spark');
          }
        }
      }

      // 9. Direct Attack Hitbox Collisions (F2 attacking F1)
      if (f2.isHitboxActive() && f2.currentAttack && !f2.hasHitInCurrentAttack) {
        const result = evaluateCombatCollision(
          f2.x, f2.y, f2.facing, f2.currentAttack,
          f1.x, f1.y, f1.facing,
          f1.state === 'crouch' || f1.state === 'crouch_punch' || f1.state === 'crouch_kick',
          !f1.isGrounded(),
          f1.state === 'block' || f1.blockHeldFrames > 0,
          f1.blockHeldFrames,
          3,
          f1.invulnerableFrames > 0
        );

        if (result && result.hit) {
          f2.hasHitInCurrentAttack = true;

          if (result.isParry) {
            // CONTRA TRIGGERED BY P1!
            f1.executeParry();
            f2.hitstun = 24;
            f2.state = 'hit';
            spawnHitParticles(result.impactX, result.impactY, '#fde047', 16, 'ring');
            screenShakeRef.current = 6;
          } else if (result.isBlocked) {
            f1.takeBlock(result.damage, result.blockstun, result.knockbackX);
            soundEngine.playBlock();
            spawnHitParticles(result.impactX, result.impactY, '#e2e8f0', 6);
          } else {
            f1.takeDamage(result.damage, result.hitstun, result.knockbackX, result.knockbackY);
            f2.addEnergy(f2.currentAttack.energyGain);
            f2.comboHits++;
            f2.comboDamage += result.damage;
            f2.comboTimer = 75;

            hitstopFramesRef.current = f2.currentAttack.type === 'heavy' || f2.currentAttack.type === 'super' ? 10 : 6;
            f1.hitstop = hitstopFramesRef.current;
            f2.hitstop = hitstopFramesRef.current;
            screenShakeRef.current = f2.currentAttack.type === 'super' ? 8 : 4;

            if (f2.currentAttack.type === 'punch') soundEngine.playPunch();
            else if (f2.currentAttack.type === 'kick') soundEngine.playKick();
            else if (f2.currentAttack.type === 'heavy') soundEngine.playHeavy();
            else if (f2.currentAttack.type === 'grab') soundEngine.playGrab();
            else soundEngine.playSpecial();

            spawnHitParticles(result.impactX, result.impactY, '#ef4444', 12, 'spark');
          }
        }
      }

      // 10. Check Knockout in Fight Mode
      if (mode === 'fight' && roundState.phase === 'fight') {
        if (f1.health <= 0 || f2.health <= 0) {
          soundEngine.playRoundCall('KNOCKOUT');
          const p1Wins = f2.health <= 0;
          const p2Wins = f1.health <= 0;

          if (p1Wins) f1.state = 'victory';
          if (p2Wins) f2.state = 'victory';

          setRoundState((prev) => ({
            ...prev,
            phase: 'round_over',
            p1RoundsWon: p1Wins ? prev.p1RoundsWon + 1 : prev.p1RoundsWon,
            p2RoundsWon: p2Wins ? prev.p2RoundsWon + 1 : prev.p2RoundsWon,
            winner: p1Wins ? 1 : 2,
            bannerText: 'K.O.!',
            bannerSubtext: p1Wins ? `${f1.name} VENCE O ROUND!` : `${f2.name} VENCE O ROUND!`,
            bannerTimer: 110,
          }));
        }
      }

      // 11. Update Particle Effects
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;
        return p.life < p.maxLife;
      });

      // 12. Screen Shake Decay
      if (screenShakeRef.current > 0) {
        screenShakeRef.current *= 0.85;
        if (screenShakeRef.current < 0.2) screenShakeRef.current = 0;
      }

      // 13. Reset single-frame input pressed flags
      p1InputsRef.current.punchPressed = false;
      p1InputsRef.current.kickPressed = false;
      p1InputsRef.current.heavyPressed = false;
      p1InputsRef.current.specialPressed = false;
      p1InputsRef.current.grabPressed = false;
      p1InputsRef.current.blockPressed = false;
      p1InputsRef.current.superPressed = false;

      p2InputsRef.current.punchPressed = false;
      p2InputsRef.current.kickPressed = false;
      p2InputsRef.current.heavyPressed = false;
      p2InputsRef.current.specialPressed = false;
      p2InputsRef.current.grabPressed = false;
      p2InputsRef.current.blockPressed = false;
      p2InputsRef.current.superPressed = false;

      // 14. Render Frame
      if (rendererRef.current) {
        rendererRef.current.render(
          stageId,
          f1,
          f2,
          projectilesRef.current,
          particlesRef.current,
          settings.showHitboxes,
          screenShakeRef.current
        );
      }
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [mode, subMode, isPaused, roundState.phase, roundState.timer, stageId, settings, dummyBehavior, infiniteHp, infiniteEnergy, initRound]);

  // Handle Character Selection Confirmation -> Proceed to Stage Selection
  const handleConfirmCharacters = (p1: FighterId, p2: FighterId, aiDiff: AIDifficulty) => {
    setP1FighterId(p1);
    setP2FighterId(p2);
    setAiDifficulty(aiDiff);
    aiRef.current.setDifficulty(aiDiff);

    f1Ref.current = new Fighter(1, p1, 120, 1);
    f2Ref.current = new Fighter(2, p2, 360, -1);

    setMode('select_stage');
  };

  // Handle Stage Confirmation -> Launch Fight
  const handleConfirmStage = (stage: StageId) => {
    setStageId(stage);
    setMode(subMode === 'training' ? 'training' : 'fight');
    initRound(1, 0, 0);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 flex items-center justify-center select-none">
      {/* 1. SCENE: MAIN MENU */}
      {mode === 'menu' && (
        <MainMenu
          onSelectMode={(selectedSubMode) => {
            setSubMode(selectedSubMode);
            if (selectedSubMode === 'lan') {
              setMode('lan_lobby');
            } else {
              setMode('select_char');
            }
          }}
          onOpenOptions={() => setMode('options')}
          onOpenHelp={() => setShowMoveList(true)}
        />
      )}

      {/* 2. SCENE: CHARACTER SELECT */}
      {mode === 'select_char' && (
        <CharacterSelect
          mode={subMode}
          onConfirmSelection={handleConfirmCharacters}
          onBack={() => setMode('menu')}
        />
      )}

      {/* 3. SCENE: STAGE SELECT */}
      {mode === 'select_stage' && (
        <StageSelect
          onConfirmStage={handleConfirmStage}
          onBack={() => setMode('select_char')}
        />
      )}

      {/* 4. SCENE: OPTIONS MENU */}
      {mode === 'options' && (
        <OptionsMenu
          settings={settings}
          onUpdateSettings={setSettings}
          onBack={() => setMode('menu')}
        />
      )}

      {/* 5. SCENE: LAN LOBBY */}
      {mode === 'lan_lobby' && (
        <MultiplayerLobby
          onStartLanMatch={() => setMode('select_char')}
          onBack={() => setMode('menu')}
        />
      )}

      {/* 6. SCENE: FIGHT & TRAINING CANVAS VIEWPORT */}
      {(mode === 'fight' || mode === 'training') && (
        <div className="relative w-full h-full max-w-[1280px] max-h-[720px] aspect-[16/9] flex items-center justify-center bg-black overflow-hidden shadow-2xl">
          {/* Virtual Canvas (480x270 native pixel art) */}
          <canvas
            ref={canvasRef}
            width={VIRTUAL_WIDTH}
            height={VIRTUAL_HEIGHT}
            className="w-full h-full object-contain pixelated"
          />

          {/* CRT Scanline Overlay */}
          {settings.enableScanlines && (
            <div className="absolute inset-0 crt-overlay crt-vignette pointer-events-none" />
          )}

          {/* HUD Overlay */}
          <HUD
            f1={f1Ref.current}
            f2={f2Ref.current}
            roundState={roundState}
            roundsToWin={settings.roundsToWin}
          />

          {/* Pause Button in Top Right */}
          <button
            onClick={() => {
              soundEngine.playMenuBeep();
              setIsPaused(true);
            }}
            className="absolute top-3 right-3 z-30 px-2.5 py-1 bg-black/60 hover:bg-neutral-800 border border-neutral-700 text-white text-[8px] font-pixel rounded cursor-pointer"
          >
            PAUSE (ESC)
          </button>

          {/* Training Mode Specific Controls Overlay */}
          {mode === 'training' && (
            <TrainingOverlay
              p1={f1Ref.current}
              p2={f2Ref.current}
              dummyBehavior={dummyBehavior}
              infiniteHp={infiniteHp}
              infiniteEnergy={infiniteEnergy}
              showHitboxes={settings.showHitboxes}
              commandHistory={commandHistory}
              onToggleInfiniteHp={() => setInfiniteHp((p) => !p)}
              onToggleInfiniteEnergy={() => setInfiniteEnergy((p) => !p)}
              onToggleHitboxes={() => setSettings((s) => ({ ...s, showHitboxes: !s.showHitboxes }))}
              onSetDummyBehavior={setDummyBehavior}
              onResetPositions={resetTrainingPositions}
            />
          )}

          {/* On-Screen Touch Controls for Mobile / Tablets */}
          {isTouchDevice && (
            <TouchControls
              onInputDown={handleTouchDown}
              onInputUp={handleTouchUp}
              canSuper={f1Ref.current.energy >= 100}
            />
          )}

          {/* Match Victory / Defeat Overlay Button */}
          {roundState.phase === 'match_over' && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm p-6 text-center font-pixel animate-arcade-pulse">
              <h2 className="text-3xl md:text-5xl font-black text-amber-400 text-glow-gold mb-2">
                {roundState.bannerText}
              </h2>
              <p className="text-xs md:text-sm text-amber-200 mb-6 tracking-widest uppercase">
                {roundState.bannerSubtext}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    soundEngine.playSelectConfirm();
                    initRound(1, 0, 0);
                  }}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded border border-yellow-200 cursor-pointer shadow-lg"
                >
                  JOGAR NOVAMENTE
                </button>
                <button
                  onClick={() => {
                    soundEngine.playMenuBeep();
                    setMode('menu');
                  }}
                  className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded border border-neutral-600 cursor-pointer"
                >
                  MENU PRINCIPAL
                </button>
              </div>
            </div>
          )}

          {/* Pause Modal */}
          {isPaused && (
            <PauseModal
              onResume={() => setIsPaused(false)}
              onRestart={() => {
                setIsPaused(false);
                initRound(1, 0, 0);
              }}
              onOpenMoves={() => setShowMoveList(true)}
              onQuitToMenu={() => {
                setIsPaused(false);
                setMode('menu');
              }}
            />
          )}
        </div>
      )}

      {/* Move List Modal Guide */}
      {showMoveList && (
        <MoveListModal
          defaultFighter={p1FighterId}
          onClose={() => setShowMoveList(false)}
        />
      )}
    </div>
  );
}
