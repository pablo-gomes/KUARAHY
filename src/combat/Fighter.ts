/**
 * KUARAHY — Fighter Entity and State Machine
 * Encapsulates physics, animations, inputs, and combat lifecycle.
 */
import {
  FighterId,
  FighterActionState,
  InputState,
  AttackFrameData,
  Box,
} from '../types/game';
import { FIGHTERS, getAttackData } from '../data/characters';
import { soundEngine } from '../audio/SoundEngine';

export const GROUND_Y = 224; // arena floor level

export class Fighter {
  public id: 1 | 2;
  public fighterId: FighterId;
  public name: string;

  // Transform
  public x: number;
  public y: number;
  public vx: number = 0;
  public vy: number = 0;
  public facing: 1 | -1 = 1;

  // Stats
  public health: number = 100;
  public maxHealth: number = 100;
  public energy: number = 0;
  public maxEnergy: number = 100;

  // Combat States
  public state: FighterActionState = 'idle';
  public stateFrame: number = 0;
  public currentAttack: AttackFrameData | null = null;
  public hasHitInCurrentAttack: boolean = false;

  public hitstun: number = 0;
  public blockstun: number = 0;
  public hitstop: number = 0;
  public invulnerableFrames: number = 0;
  public blockHeldFrames: number = 0;

  // Combo Tracking
  public comboHits: number = 0;
  public comboDamage: number = 0;
  public comboTimer: number = 0;

  // Input buffer history for motions (e.g. ↓ → + Especial)
  public inputHistory: { dir: string; action: string; time: number }[] = [];

  constructor(id: 1 | 2, fighterId: FighterId, startX: number, facing: 1 | -1) {
    this.id = id;
    this.fighterId = fighterId;
    this.name = FIGHTERS[fighterId].name;
    this.x = startX;
    this.y = GROUND_Y;
    this.facing = facing;
  }

  public reset(startX: number, facing: 1 | -1, resetEnergy: boolean = false) {
    this.x = startX;
    this.y = GROUND_Y;
    this.vx = 0;
    this.vy = 0;
    this.facing = facing;
    this.health = this.maxHealth;
    if (resetEnergy) this.energy = 0;
    this.state = 'idle';
    this.stateFrame = 0;
    this.currentAttack = null;
    this.hasHitInCurrentAttack = false;
    this.hitstun = 0;
    this.blockstun = 0;
    this.hitstop = 0;
    this.invulnerableFrames = 30; // brief spawn iframe
    this.blockHeldFrames = 0;
    this.comboHits = 0;
    this.comboDamage = 0;
    this.comboTimer = 0;
  }

  public isGrounded(): boolean {
    return this.y >= GROUND_Y;
  }

  public isAttacking(): boolean {
    return [
      'punch',
      'kick',
      'heavy',
      'crouch_punch',
      'crouch_kick',
      'jump_punch',
      'jump_kick',
      'special1',
      'special2',
      'super',
      'grab_startup',
    ].includes(this.state);
  }

  public isHitboxActive(): boolean {
    if (!this.currentAttack || !this.isAttacking() || this.hasHitInCurrentAttack) return false;
    const startup = this.currentAttack.startup;
    const activeEnd = startup + this.currentAttack.active;
    return this.stateFrame >= startup && this.stateFrame < activeEnd;
  }

  public canAct(): boolean {
    return (
      this.hitstop === 0 &&
      this.hitstun === 0 &&
      this.blockstun === 0 &&
      !this.isAttacking() &&
      this.state !== 'knockdown' &&
      this.state !== 'getup' &&
      this.state !== 'grabbed' &&
      this.state !== 'victory' &&
      this.state !== 'defeat'
    );
  }

  /**
   * Main game physics & state tick
   */
  public update(inputs: InputState, opponent: Fighter, arenaMinX: number, arenaMaxX: number) {
    // 1. Hitstop pause (freeze-frame on impact)
    if (this.hitstop > 0) {
      this.hitstop--;
      return;
    }

    // 2. Invulnerability countdown
    if (this.invulnerableFrames > 0) {
      this.invulnerableFrames--;
    }

    // 3. Combo timer decay
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer === 0) {
        this.comboHits = 0;
        this.comboDamage = 0;
      }
    }

    // 4. Update block held counter (used for Parry / Just-Defend detection)
    if (inputs.block || (this.isGrounded() && ((this.facing === 1 && inputs.left) || (this.facing === -1 && inputs.right)))) {
      this.blockHeldFrames++;
    } else {
      this.blockHeldFrames = 0;
    }

    // 5. Hitstun & Blockstun resolution
    if (this.hitstun > 0) {
      this.hitstun--;
      this.state = this.isGrounded() ? 'hit' : 'hit';
      if (this.hitstun === 0) {
        this.state = this.isGrounded() ? 'idle' : 'jump_fall';
      }
    } else if (this.blockstun > 0) {
      this.blockstun--;
      this.state = 'block';
      if (this.blockstun === 0) {
        this.state = 'idle';
      }
    }

    // 6. Parry stance tick
    if (this.state === 'parry') {
      this.stateFrame++;
      if (this.stateFrame > 14) {
        this.state = 'idle';
        this.stateFrame = 0;
      }
      return;
    }

    // 7. Knockdown & Getup resolution
    if (this.state === 'knockdown') {
      this.stateFrame++;
      if (this.stateFrame > 35) {
        this.state = 'getup';
        this.stateFrame = 0;
        this.invulnerableFrames = 25; // iframe on getup
      }
      return;
    }
    if (this.state === 'getup') {
      this.stateFrame++;
      if (this.stateFrame > 18) {
        this.state = 'idle';
        this.stateFrame = 0;
      }
      return;
    }

    // 8. Face opponent automatically when neutral and grounded
    if (this.canAct() && this.isGrounded()) {
      if (this.x < opponent.x) {
        this.facing = 1;
      } else if (this.x > opponent.x) {
        this.facing = -1;
      }
    }

    // 9. Input handling if character can act
    if (this.canAct()) {
      this.handleInputs(inputs, opponent);
    }

    // 10. Attack animation progression
    if (this.isAttacking() && this.currentAttack) {
      this.stateFrame++;
      const totalFrames =
        this.currentAttack.startup +
        this.currentAttack.active +
        this.currentAttack.recovery;

      if (this.stateFrame >= totalFrames) {
        // Attack finished, transition back to idle or air fall
        this.state = this.isGrounded() ? 'idle' : 'jump_fall';
        this.stateFrame = 0;
        this.currentAttack = null;
        this.hasHitInCurrentAttack = false;
      }
    }

    // 11. Physics & Movement integration
    this.applyPhysics(arenaMinX, arenaMaxX, opponent);
  }

  /**
   * Translates player button presses into actions
   */
  private handleInputs(inputs: InputState, opponent: Fighter) {
    const stats = FIGHTERS[this.fighterId].stats;
    const speedMult = 0.8 + (stats.speed * 0.15); // 0.95 to 1.55

    // A. JUMPING
    if (this.isGrounded() && inputs.up) {
      this.vy = -13.5;
      this.state = 'jump';
      this.stateFrame = 0;
      if (inputs.left) this.vx = -4.5 * speedMult;
      else if (inputs.right) this.vx = 4.5 * speedMult;
      return;
    }

    // B. CROUCHING
    if (this.isGrounded() && inputs.down) {
      // Crouch attacks
      if (inputs.punchPressed) {
        this.startAttack('crouch_punch');
        return;
      }
      if (inputs.kickPressed) {
        this.startAttack('crouch_kick');
        return;
      }
      this.state = 'crouch';
      this.vx *= 0.5;
      return;
    }

    // C. AIR ATTACKS
    if (!this.isGrounded()) {
      if (inputs.punchPressed) {
        this.startAttack('jump_punch');
        return;
      }
      if (inputs.kickPressed) {
        this.startAttack('jump_kick');
        return;
      }
      return;
    }

    // D. GROUND ATTACKS
    // Super Finisher (Requires 100% Energy)
    if (inputs.superPressed || (inputs.specialPressed && inputs.heavyPressed)) {
      if (this.energy >= 100) {
        this.startAttack('super');
        this.energy = 0;
        soundEngine.playSuper();
        return;
      }
    }

    // Grab (U button or close grab)
    if (inputs.grabPressed) {
      this.startAttack('grab');
      return;
    }

    // Specials: Special 1 (Quarter circle forward / ↓ → or direct Special button)
    if (inputs.specialPressed) {
      if (inputs.left && this.facing === 1) {
        this.startAttack('special2');
      } else if (inputs.right && this.facing === -1) {
        this.startAttack('special2');
      } else {
        this.startAttack('special1');
      }
      return;
    }

    // Heavy Attack
    if (inputs.heavyPressed) {
      this.startAttack('heavy');
      return;
    }

    // Normal Kick
    if (inputs.kickPressed) {
      this.startAttack('kick');
      return;
    }

    // Normal Punch
    if (inputs.punchPressed) {
      this.startAttack('punch');
      return;
    }

    // E. BLOCKING
    const isBackHeld = (this.facing === 1 && inputs.left) || (this.facing === -1 && inputs.right);
    if (inputs.block || (isBackHeld && Math.abs(opponent.x - this.x) < 220)) {
      this.state = 'block';
      this.vx = 0;
      return;
    }

    // F. WALKING
    const walkSpeed = 3.6 * speedMult;
    if (inputs.left) {
      this.vx = -walkSpeed;
      this.state = this.facing === 1 ? 'walk_backward' : 'walk_forward';
    } else if (inputs.right) {
      this.vx = walkSpeed;
      this.state = this.facing === 1 ? 'walk_forward' : 'walk_backward';
    } else {
      this.vx = 0;
      this.state = 'idle';
    }
  }

  public startAttack(moveKey: 'punch' | 'kick' | 'heavy' | 'crouch_punch' | 'crouch_kick' | 'jump_punch' | 'jump_kick' | 'special1' | 'special2' | 'super' | 'grab') {
    this.currentAttack = getAttackData(this.fighterId, moveKey);
    this.state =
      moveKey === 'crouch_punch' || moveKey === 'crouch_kick'
        ? 'crouch'
        : moveKey === 'grab'
        ? 'grab_startup'
        : moveKey;
    this.stateFrame = 0;
    this.hasHitInCurrentAttack = false;

    // Lunge forward slightly on grounded normals/specials
    if (this.isGrounded()) {
      if (moveKey === 'special1' && this.fighterId === 'chaco') {
        this.vx = 7.5 * this.facing; // Chaco bull charge!
      } else if (moveKey === 'special1' && this.fighterId === 'guarani') {
        this.vx = 9.0 * this.facing; // Swift dash!
      } else if (moveKey === 'heavy') {
        this.vx = 2.5 * this.facing;
      }
    }
  }

  private applyPhysics(arenaMinX: number, arenaMaxX: number, opponent: Fighter) {
    // Gravity
    if (!this.isGrounded()) {
      this.vy += 0.72; // Gravity constant
    }

    // Apply Velocities
    this.x += this.vx;
    this.y += this.vy;

    // Ground collision
    if (this.y >= GROUND_Y) {
      this.y = GROUND_Y;
      this.vy = 0;
      if (this.state === 'jump' || this.state === 'jump_fall') {
        this.state = 'idle';
        this.stateFrame = 0;
      }
    }

    // Ground friction
    if (this.isGrounded()) {
      this.vx *= 0.82;
      if (Math.abs(this.vx) < 0.1) this.vx = 0;
    }

    // Pushbox between fighters (cannot occupy the exact same space)
    const minDistance = 32;
    const dist = this.x - opponent.x;
    if (Math.abs(dist) < minDistance && Math.abs(this.y - opponent.y) < 40) {
      const push = (minDistance - Math.abs(dist)) / 2;
      if (dist >= 0) {
        this.x += push;
        opponent.x -= push;
      } else {
        this.x -= push;
        opponent.x += push;
      }
    }

    // Arena horizontal bounds
    const halfWidth = 24;
    if (this.x < arenaMinX + halfWidth) {
      this.x = arenaMinX + halfWidth;
    } else if (this.x > arenaMaxX - halfWidth) {
      this.x = arenaMaxX - halfWidth;
    }
  }

  public takeDamage(damage: number, hitstunFrames: number, knockX: number, knockY: number) {
    this.health = Math.max(0, this.health - damage);
    this.hitstun = hitstunFrames;
    this.vx = knockX;
    this.vy = knockY;
    this.hasHitInCurrentAttack = false;

    // Gain energy when taking damage
    this.addEnergy(Math.round(damage * 0.45));

    if (knockY < -2 || damage >= 20) {
      this.state = 'knockdown';
      this.stateFrame = 0;
    } else {
      this.state = 'hit';
      this.stateFrame = 0;
    }
  }

  public takeBlock(chipDmg: number, blockstunFrames: number, knockX: number) {
    this.health = Math.max(1, this.health - chipDmg);
    this.blockstun = blockstunFrames;
    this.vx = knockX;
    this.state = 'block';
    this.stateFrame = 0;
    this.addEnergy(4);
  }

  public executeParry() {
    this.state = 'parry';
    this.stateFrame = 0;
    this.hitstun = 0;
    this.blockstun = 0;
    this.addEnergy(15); // Big reward for successful parry!
    soundEngine.playParry();
  }

  public addEnergy(amount: number) {
    this.energy = Math.min(this.maxEnergy, this.energy + amount);
  }
}
