/**
 * KUARAHY — Pixel Art Graphics & Canvas Rendering Engine
 * Crisp 16-bit retro arcade visual rendering for all 6 characters, 6 stages,
 * projectiles, particle effects, hitboxes, and combat fx.
 */
import { Fighter } from '../combat/Fighter';
import { Projectile, ParticleEffect, StageId } from '../types/game';
import { STAGES } from '../data/stages';
import { FIGHTERS } from '../data/characters';
import { getWorldHitbox, getFighterHurtboxes } from '../combat/HitboxSystem';

export class PixelRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private frameCount: number = 0;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public setDimensions(w: number, h: number) {
    this.width = w;
    this.height = h;
  }

  public render(
    stageId: StageId,
    f1: Fighter,
    f2: Fighter,
    projectiles: Projectile[],
    particles: ParticleEffect[],
    showHitboxes: boolean = false,
    screenShake: number = 0
  ) {
    this.frameCount++;
    const ctx = this.ctx;

    ctx.save();

    // Screen Shake offset
    if (screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * screenShake * 2.5;
      const shakeY = (Math.random() - 0.5) * screenShake * 2.5;
      ctx.translate(shakeX, shakeY);
    }

    // 1. Draw Arena Background
    this.drawStageBackground(stageId);

    // 2. Draw Fighter Shadows
    this.drawFighterShadow(f1);
    this.drawFighterShadow(f2);

    // 3. Draw Fighters
    this.drawFighter(f1);
    this.drawFighter(f2);

    // 4. Draw Projectiles
    this.drawProjectiles(projectiles);

    // 5. Draw Particles (Sparks, Dust, Impact Flashes)
    this.drawParticles(particles);

    // 6. Draw Debug Hitboxes & Hurtboxes if enabled
    if (showHitboxes) {
      this.drawDebugBoxes(f1, '#10b981', '#ef4444');
      this.drawDebugBoxes(f2, '#3b82f6', '#f59e0b');
    }

    ctx.restore();
  }

  // ================= STAGES =================

  private drawStageBackground(stageId: StageId) {
    const ctx = this.ctx;
    const stage = STAGES[stageId];
    const w = this.width;
    const h = this.height;
    const groundY = 224;

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, stage.palette.skyTop);
    skyGrad.addColorStop(1, stage.palette.skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, groundY);

    if (stageId === 'assuncao') {
      // Historical Assunção: Colonial Palacio / Cabildo silhouettes & Paraguayan flag
      // Far city skyline
      ctx.fillStyle = '#2e1065';
      for (let i = 0; i < 9; i++) {
        const bx = i * 65;
        const bh = 55 + (i % 3) * 25;
        ctx.fillRect(bx, groundY - bh - 30, 50, bh);
      }

      // El Cabildo colonial columns & arches
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, groundY - 70, w, 70);

      // White colonial pillars
      ctx.fillStyle = '#e2e8f0';
      for (let x = 30; x < w; x += 60) {
        ctx.fillRect(x, groundY - 65, 8, 65);
        // Arch top
        ctx.fillRect(x - 4, groundY - 69, 16, 5);
      }

      // Paraguayan Flag fluttering on pole
      const flagX = w / 2 - 20;
      ctx.fillStyle = '#94a3b8'; // flag pole
      ctx.fillRect(flagX, groundY - 115, 3, 55);

      const flagWave = Math.sin(this.frameCount * 0.08) * 3;
      // Red stripe
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(flagX + 3, groundY - 115 + flagWave, 36, 8);
      // White stripe
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(flagX + 3, groundY - 107 + flagWave, 36, 8);
      // Coat of arms emblem
      ctx.fillStyle = '#facc15';
      ctx.fillRect(flagX + 18, groundY - 105 + flagWave, 6, 4);
      // Blue stripe
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(flagX + 3, groundY - 99 + flagWave, 36, 8);

      // Street lamps with glow
      for (let lx of [70, w - 70]) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(lx - 2, groundY - 55, 4, 55);
        ctx.fillRect(lx - 6, groundY - 58, 12, 4);
        // Amber light
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(lx - 3, groundY - 54, 6, 6);
      }
    } else if (stageId === 'chaco_stage') {
      // Arid Chaco: Quebracho trees, dunes, heat shimmer
      const sunY = 55;
      const sunX = w - 90;
      // Burning sun
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 26, 0, Math.PI * 2);
      ctx.fill();

      // Distant dunes
      ctx.fillStyle = '#9a3412';
      ctx.beginPath();
      ctx.moveTo(0, groundY - 20);
      ctx.quadraticCurveTo(w * 0.35, groundY - 65, w * 0.7, groundY - 25);
      ctx.quadraticCurveTo(w * 0.85, groundY - 45, w, groundY - 30);
      ctx.lineTo(w, groundY);
      ctx.lineTo(0, groundY);
      ctx.fill();

      // Silhouetted Quebracho Trees
      ctx.fillStyle = '#451a03';
      [60, 220, w - 90].forEach((tx, idx) => {
        const th = 60 + idx * 10;
        ctx.fillRect(tx, groundY - th, 7, th);
        // Branches
        ctx.fillRect(tx - 18, groundY - th + 10, 42, 6);
        ctx.fillRect(tx - 24, groundY - th - 12, 54, 18);
      });
    } else if (stageId === 'itaipu_stage') {
      // Itaipu Hydropower Dam: Concrete dam spillway and churning water
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, groundY - 100, w, 100);

      // Dam sluice gates
      ctx.fillStyle = '#1e293b';
      for (let gx = 20; gx < w; gx += 50) {
        ctx.fillRect(gx, groundY - 95, 36, 95);
        // Water chute foam
        const flowOff = (this.frameCount * 4) % 18;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(gx + 4, groundY - 60 + flowOff, 28, 6);
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(gx + 8, groundY - 30 + (flowOff * 1.2) % 20, 20, 8);
        ctx.fillStyle = '#1e293b';
      }

      // Industrial metal railing on catwalk
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, groundY - 15, w, 3);
      for (let rx = 10; rx < w; rx += 25) {
        ctx.fillRect(rx, groundY - 15, 2, 15);
      }
    } else if (stageId === 'rio_paraguai') {
      // Rio Paraguai: Calm sunset water, wooden boats, reeds
      // Water body
      const waterGrad = ctx.createLinearGradient(0, groundY - 50, 0, groundY);
      waterGrad.addColorStop(0, '#be185d');
      waterGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, groundY - 55, w, 55);

      // Water ripples
      ctx.fillStyle = '#f472b6';
      for (let r = 0; r < 8; r++) {
        const rx = (this.frameCount * 0.8 + r * 65) % (w + 40) - 20;
        const ry = groundY - 45 + (r * 5);
        ctx.fillRect(rx, ry, 28, 2);
      }

      // Wooden canoe / boat
      const boatX = 90;
      const boatY = groundY - 32 + Math.sin(this.frameCount * 0.05) * 3;
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(boatX, boatY);
      ctx.lineTo(boatX + 50, boatY);
      ctx.lineTo(boatX + 40, boatY + 12);
      ctx.lineTo(boatX + 10, boatY + 12);
      ctx.closePath();
      ctx.fill();

      // Fishing lantern on boat
      ctx.fillStyle = '#fde047';
      ctx.fillRect(boatX + 42, boatY - 8, 4, 6);
    } else if (stageId === 'encarnacion') {
      // Costanera de Encarnación: Sunset beach promenade & palms
      ctx.fillStyle = '#be123c';
      ctx.fillRect(0, groundY - 60, w, 60);

      // Palm trees
      [45, w - 60].forEach((px) => {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(px, groundY - 75, 6, 75);
        // Fronds
        ctx.fillStyle = '#15803d';
        ctx.fillRect(px - 22, groundY - 82, 50, 5);
        ctx.fillRect(px - 16, groundY - 78, 38, 4);
      });
    } else {
      // Arena Cultural: Decorative Ñandutí circular lace mandalas on wooden temple
      ctx.fillStyle = '#3b0764';
      ctx.fillRect(0, groundY - 90, w, 90);

      // 3 Giant Ñandutí mandalas on wall
      [75, w / 2, w - 75].forEach((cx, idx) => {
        const cy = groundY - 55;
        const rad = 24;
        const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#a855f7'];
        ctx.strokeStyle = colors[idx % colors.length];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();

        // Web spoke lines
        for (let a = 0; a < 8; a++) {
          const angle = (a * Math.PI) / 4 + (this.frameCount * 0.01);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(angle) * rad, cy + Math.sin(angle) * rad);
          ctx.stroke();
        }
      });
    }

    // Ground platform
    ctx.fillStyle = stage.palette.ground;
    ctx.fillRect(0, groundY, w, h - groundY);

    // Ground texture line / curb
    ctx.fillStyle = stage.palette.groundAccent;
    ctx.fillRect(0, groundY, w, 4);

    // Ground stones pattern
    for (let gx = 0; gx < w; gx += 28) {
      ctx.fillRect(gx + (gx % 14), groundY + 8 + (gx % 12), 12, 3);
    }
  }

  // ================= FIGHTERS =================

  private drawFighterShadow(f: Fighter) {
    const ctx = this.ctx;
    const shadowY = 224;
    const shadowW = Math.max(12, 34 - Math.abs(f.y - shadowY) * 0.18);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(f.x, shadowY + 2, shadowW, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawFighter(f: Fighter) {
    const ctx = this.ctx;
    const def = FIGHTERS[f.fighterId];
    const theme = def.colorTheme;
    const facing = f.facing;

    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.scale(facing, 1);

    // Flashing effects (Hit or Super)
    if (f.state === 'hit' && f.stateFrame % 2 === 0) {
      ctx.filter = 'brightness(1.8) contrast(1.2)';
    } else if (f.state === 'super') {
      ctx.filter = 'brightness(1.4) drop-shadow(0 0 6px ' + theme.energy + ')';
    } else if (f.state === 'parry') {
      ctx.filter = 'brightness(2.0)';
    }

    // Draw customized pixel body based on fighter ID and state
    this.drawCharacterSprites(f, theme);

    ctx.restore();
  }

  private drawCharacterSprites(f: Fighter, theme: { primary: string; secondary: string; accent: string; energy: string }) {
    const ctx = this.ctx;
    const state = f.state;
    const frame = f.stateFrame;

    // Head, torso, limbs offsets based on action
    let headY = -68;
    let headX = 0;
    let bodyY = -52;
    let bodyH = 28;
    let legL_X = -7;
    let legR_X = 7;
    let legY = -24;
    let legH = 24;
    let armFrontX = 8;
    let armFrontY = -48;
    let armFrontRot = 0;

    // Stance adjustments
    if (state === 'idle') {
      const bob = Math.sin(this.frameCount * 0.15) * 2;
      headY += bob;
      bodyY += bob;
    } else if (state === 'crouch' || state === 'crouch_punch' || state === 'crouch_kick') {
      headY = -42;
      bodyY = -34;
      bodyH = 20;
      legH = 14;
      legY = -14;
    } else if (state === 'jump' || state === 'jump_fall' || state === 'jump_punch' || state === 'jump_kick') {
      headY = -66;
      bodyY = -52;
      legH = 16;
      legY = -20;
    } else if (state === 'knockdown') {
      // Fallen on back
      this.drawKnockedDownFighter(f, theme);
      return;
    } else if (state === 'victory') {
      // Arms raised high
      headY = -72;
      bodyY = -56;
      this.drawVictoryFighter(f, theme);
      return;
    }

    // 1. BACK LEG
    ctx.fillStyle = theme.secondary;
    if (state === 'walk_forward' || state === 'walk_backward') {
      const walkShift = Math.sin(frame * 0.4) * 8;
      ctx.fillRect(legL_X - walkShift, legY, 6, legH);
    } else if (state === 'kick' || state === 'jump_kick') {
      ctx.fillRect(legL_X, legY, 6, legH);
    } else {
      ctx.fillRect(legL_X, legY, 6, legH);
    }

    // 2. TORSO / BODY
    ctx.fillStyle = theme.primary;
    ctx.fillRect(-10, bodyY, 20, bodyH);

    // Decorative belt / sash (authentic cultural motif)
    ctx.fillStyle = theme.accent;
    ctx.fillRect(-11, bodyY + bodyH - 6, 22, 5);

    // 3. FRONT LEG
    ctx.fillStyle = theme.primary;
    if (state === 'walk_forward' || state === 'walk_backward') {
      const walkShift = Math.sin(frame * 0.4) * 8;
      ctx.fillRect(legR_X + walkShift, legY, 6, legH);
    } else if (state === 'kick' || state === 'crouch_kick' || state === 'jump_kick') {
      // Extended kick leg!
      ctx.fillStyle = theme.primary;
      const kickReach = state === 'crouch_kick' ? 32 : 36;
      ctx.fillRect(4, legY + 2, kickReach, 8);
      // Boot / Foot
      ctx.fillStyle = theme.secondary;
      ctx.fillRect(4 + kickReach - 6, legY - 2, 8, 12);
    } else {
      ctx.fillRect(legR_X, legY, 6, legH);
    }

    // 4. HEAD & FACE
    ctx.fillStyle = '#fbcfe8'; // skin tone base
    if (f.fighterId === 'guarani' || f.fighterId === 'chaco') {
      ctx.fillStyle = '#d97706'; // tanned / warrior tone
    }
    ctx.fillRect(headX - 7, headY, 14, 14);

    // Hair / Headgear / Distinctive silhouette per character
    this.drawFighterHeadgear(f, headX, headY, theme);

    // Eye pixel
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(headX + 2, headY + 5, 3, 3);

    // 5. ARMS & ATTACK POSES
    if (state === 'punch' || state === 'crouch_punch' || state === 'jump_punch') {
      // Extended punch arm
      ctx.fillStyle = theme.accent;
      const punchY = state === 'crouch_punch' ? bodyY + 6 : bodyY - 2;
      ctx.fillRect(4, punchY, 32, 7);
      // Fist
      ctx.fillStyle = theme.secondary;
      ctx.fillRect(32, punchY - 1, 8, 9);
    } else if (state === 'heavy') {
      // Devastating heavy attack windup / release
      ctx.fillStyle = theme.accent;
      if (frame < 8) {
        // Windup backward
        ctx.fillRect(-18, bodyY - 8, 14, 14);
      } else {
        // Full extension slam
        ctx.fillRect(6, bodyY - 8, 38, 14);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(40, bodyY - 10, 10, 18);
      }
    } else if (state === 'block') {
      // Guard stance: both arms crossed in front of chest
      ctx.fillStyle = theme.accent;
      ctx.fillRect(4, bodyY - 4, 8, 18);
      ctx.fillRect(9, bodyY - 8, 7, 20);
      // Blue guard shield glow
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.fillRect(16, bodyY - 12, 4, 30);
    } else if (state === 'parry') {
      // Radiant parry counter pose with expanding star
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, bodyY - 10, 10, 22);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(18, bodyY - 18, 6, 38);
    } else {
      // Idle / Walking arms
      this.drawCharacterSignatureItem(f, bodyY, theme);
    }
  }

  private drawFighterHeadgear(f: Fighter, hx: number, hy: number, theme: { primary: string; secondary: string; accent: string }) {
    const ctx = this.ctx;
    if (f.fighterId === 'terere') {
      // Straw hat / sombrero piri trim
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(hx - 12, hy - 4, 24, 4);
      ctx.fillRect(hx - 7, hy - 8, 14, 5);
    } else if (f.fighterId === 'harpa') {
      // Flowing golden-brown hair with floral pin
      ctx.fillStyle = '#78350f';
      ctx.fillRect(hx - 9, hy - 3, 16, 6);
      ctx.fillRect(hx - 10, hy + 2, 5, 14);
      ctx.fillStyle = '#ef4444'; // Red passion flower
      ctx.fillRect(hx + 3, hy - 2, 4, 4);
    } else if (f.fighterId === 'chaco') {
      // Leather bandana & rough quebracho beard
      ctx.fillStyle = '#451a03';
      ctx.fillRect(hx - 8, hy - 2, 16, 4);
      ctx.fillRect(hx - 6, hy + 8, 12, 6); // beard
    } else if (f.fighterId === 'nanduti') {
      // Delicate woven lace hair ribbon and twin buns
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(hx - 8, hy - 6, 6, 6);
      ctx.fillRect(hx + 2, hy - 6, 6, 6);
      ctx.fillStyle = '#fbcfe8';
      ctx.fillRect(hx - 4, hy - 4, 8, 3);
    } else if (f.fighterId === 'itaipu') {
      // Heavy industrial turbine helmet with visor
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(hx - 9, hy - 6, 18, 9);
      ctx.fillStyle = '#38bdf8'; // Glowing blue hydraulic visor
      ctx.fillRect(hx, hy + 3, 8, 4);
    } else {
      // Guarani: Feathered headdress (Jasy) & Urucum war paint
      ctx.fillStyle = '#facc15';
      ctx.fillRect(hx - 8, hy - 4, 16, 4);
      // Red & yellow feathers standing
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(hx - 6, hy - 14, 4, 10);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(hx - 1, hy - 16, 4, 12);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(hx + 4, hy - 13, 4, 9);
      // Red stripe across cheek
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(hx - 4, hy + 6, 9, 2);
    }
  }

  private drawCharacterSignatureItem(f: Fighter, bodyY: number, theme: { primary: string; secondary: string; accent: string; energy: string }) {
    const ctx = this.ctx;
    if (f.fighterId === 'terere') {
      // Carved cow-horn Guampa + silver bombilla
      ctx.fillStyle = '#451a03'; // horn
      ctx.fillRect(6, bodyY + 4, 8, 14);
      ctx.fillStyle = '#e2e8f0'; // silver bombilla straw
      ctx.fillRect(10, bodyY - 4, 2, 10);
    } else if (f.fighterId === 'harpa') {
      // 36-string wooden Paraguayan harp carried with golden strings
      ctx.fillStyle = '#92400e';
      ctx.fillRect(-16, bodyY - 14, 8, 34);
      ctx.fillRect(-16, bodyY - 14, 24, 6);
      ctx.fillStyle = '#fde047'; // strings
      for (let s = -12; s < 4; s += 4) {
        ctx.fillRect(s, bodyY - 8, 1, 26);
      }
    } else if (f.fighterId === 'chaco') {
      // Spiked stone knuckles
      ctx.fillStyle = '#78350f';
      ctx.fillRect(6, bodyY + 6, 12, 12);
    } else if (f.fighterId === 'nanduti') {
      // Shimmering thread spools on wrists
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(5, bodyY + 6, 8, 8);
    } else if (f.fighterId === 'itaipu') {
      // Heavy dynamo gauntlets with spark node
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(6, bodyY + 4, 14, 14);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(16, bodyY + 8, 4, 6);
    } else {
      // Guarani: Feathered bracelets
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(6, bodyY + 6, 8, 8);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(12, bodyY + 8, 4, 4);
    }
  }

  private drawKnockedDownFighter(f: Fighter, theme: { primary: string; secondary: string; accent: string }) {
    const ctx = this.ctx;
    // Fighter flat on the ground
    ctx.fillStyle = theme.primary;
    ctx.fillRect(-30, -12, 50, 12);
    // Head
    ctx.fillStyle = '#fbcfe8';
    ctx.fillRect(-40, -14, 12, 12);
    // Legs
    ctx.fillStyle = theme.secondary;
    ctx.fillRect(16, -10, 24, 10);
  }

  private drawVictoryFighter(f: Fighter, theme: { primary: string; secondary: string; accent: string; energy: string }) {
    const ctx = this.ctx;
    // Triumphant standing pose
    ctx.fillStyle = theme.primary;
    ctx.fillRect(-12, -56, 24, 30);
    // Legs
    ctx.fillStyle = theme.secondary;
    ctx.fillRect(-10, -26, 8, 26);
    ctx.fillRect(2, -26, 8, 26);
    // Head
    ctx.fillStyle = '#fbcfe8';
    ctx.fillRect(-8, -72, 16, 16);
    this.drawFighterHeadgear(f, 0, -72, theme);

    // Raised arms in V shape
    ctx.fillStyle = theme.accent;
    ctx.fillRect(-22, -78, 8, 28);
    ctx.fillRect(14, -78, 8, 28);

    // Sparkles of victory
    ctx.fillStyle = theme.energy;
    const sparkOff = Math.sin(this.frameCount * 0.2) * 12;
    ctx.fillRect(-24 + sparkOff, -85, 4, 4);
    ctx.fillRect(24 - sparkOff, -85, 4, 4);
  }

  // ================= PROJECTILES =================

  private drawProjectiles(projectiles: Projectile[]) {
    const ctx = this.ctx;
    for (const p of projectiles) {
      if (!p.active) continue;

      ctx.save();
      ctx.translate(p.x, p.y);

      if (p.type === 'water') {
        // High pressure ice-cold water bullet
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(-p.w / 2 + 4, -p.h / 2 + 2, p.w - 8, p.h - 4);
      } else if (p.type === 'note') {
        // Musical note projectile disc
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-2, -6, 4, 10);
        ctx.fillRect(0, -6, 6, 3);
      } else if (p.type === 'electricity') {
        // Arcing lightning bolt
        ctx.fillStyle = '#67e8f9';
        const off1 = Math.sin(this.frameCount * 0.8) * 4;
        ctx.fillRect(-p.w / 2, -p.h / 2 + off1, p.w, p.h);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-p.w / 2 + 6, -p.h / 2 + off1 + 2, p.w - 12, p.h - 4);
      } else if (p.type === 'thread') {
        // Spinning web lace ring
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Earth projectile
        ctx.fillStyle = '#b45309';
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }

      ctx.restore();
    }
  }

  // ================= PARTICLES =================

  private drawParticles(particles: ParticleEffect[]) {
    const ctx = this.ctx;
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'spark') {
        // 4-point star impact burst
        ctx.fillRect(p.x - p.size, p.y - 1, p.size * 2, 2);
        ctx.fillRect(p.x - 1, p.y - p.size, 2, p.size * 2);
      } else if (p.shape === 'ring') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Pixel square
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }

      ctx.restore();
    }
  }

  // ================= DEBUG BOXES =================

  private drawDebugBoxes(f: Fighter, hurtColor: string, hitColor: string) {
    const ctx = this.ctx;
    ctx.lineWidth = 1.5;

    // Hurtboxes (Green/Blue)
    const hurtboxes = getFighterHurtboxes(
      f.x,
      f.y,
      f.facing,
      f.state === 'crouch' || f.state === 'crouch_punch' || f.state === 'crouch_kick',
      !f.isGrounded()
    );

    ctx.strokeStyle = hurtColor;
    ctx.fillStyle = hurtColor.replace(')', ', 0.15)').replace('rgb', 'rgba');
    for (const hb of hurtboxes) {
      ctx.strokeRect(hb.x, hb.y, hb.w, hb.h);
      ctx.fillRect(hb.x, hb.y, hb.w, hb.h);
    }

    // Hitbox (Red)
    if (f.isHitboxActive() && f.currentAttack) {
      const attackBox = getWorldHitbox(f.x, f.y, f.facing, f.currentAttack);
      ctx.strokeStyle = hitColor;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.strokeRect(attackBox.x, attackBox.y, attackBox.w, attackBox.h);
      ctx.fillRect(attackBox.x, attackBox.y, attackBox.w, attackBox.h);
    }
  }
}
