/**
 * KUARAHY — Fighter AI Controller
 * Implements Fácil, Normal, and Difícil decision making without cheating.
 */
import { Fighter } from '../combat/Fighter';
import { InputState, AIDifficulty } from '../types/game';

export class FighterAI {
  private difficulty: AIDifficulty;
  private actionCooldown: number = 0;
  private currentGoal: 'approach' | 'retreat' | 'attack' | 'defend' | 'idle' = 'idle';
  private goalTimer: number = 0;
  private reactionDelay: number = 0;

  constructor(difficulty: AIDifficulty = 'normal') {
    this.difficulty = difficulty;
  }

  public setDifficulty(diff: AIDifficulty) {
    this.difficulty = diff;
  }

  public getInputs(ai: Fighter, player: Fighter): InputState {
    const inputs: InputState = {
      up: false,
      down: false,
      left: false,
      right: false,
      punch: false,
      kick: false,
      heavy: false,
      special: false,
      grab: false,
      block: false,
      super: false,
      punchPressed: false,
      kickPressed: false,
      heavyPressed: false,
      specialPressed: false,
      grabPressed: false,
      blockPressed: false,
      superPressed: false,
    };

    if (!ai.canAct()) return inputs;

    const dist = Math.abs(ai.x - player.x);
    const aiIsLeft = ai.x < player.x;

    // Reaction delay setup based on difficulty
    const maxReaction = this.difficulty === 'facil' ? 24 : this.difficulty === 'normal' ? 14 : 6;

    if (this.actionCooldown > 0) {
      this.actionCooldown--;
    }

    if (this.goalTimer > 0) {
      this.goalTimer--;
    } else {
      // Pick a new high-level goal
      this.decideGoal(ai, player, dist);
    }

    // 1. REACTION DEFENSE / PARRY (Difícil & Normal):
    // If player is attacking and within strike distance, attempt block or parry
    if (player.isAttacking() && dist < 110) {
      const parryChance = this.difficulty === 'dificil' ? 0.35 : 0.05;
      const blockChance = this.difficulty === 'dificil' ? 0.85 : this.difficulty === 'normal' ? 0.55 : 0.2;

      if (Math.random() < blockChance) {
        inputs.block = true;
        inputs.blockPressed = true;
        // Back away while blocking
        if (aiIsLeft) inputs.left = true;
        else inputs.right = true;
        return inputs;
      }
    }

    // 2. PUNISH TURTLE (If player is blocking constantly at close range, perform Grab!)
    if (dist < 42 && player.state === 'block' && Math.random() < (this.difficulty === 'dificil' ? 0.6 : 0.25)) {
      inputs.grabPressed = true;
      inputs.grab = true;
      return inputs;
    }

    // 3. EXECUTE SUPER IF AVAILABLE (Difícil and Normal)
    if (ai.energy >= 100 && dist < 140 && Math.random() < (this.difficulty === 'dificil' ? 0.4 : 0.15)) {
      inputs.superPressed = true;
      inputs.super = true;
      this.actionCooldown = 30;
      return inputs;
    }

    // 4. BEHAVIOR BY DISTANCE:
    // A. Close range (< 50px)
    if (dist < 50) {
      if (this.actionCooldown === 0) {
        const rand = Math.random();
        if (rand < 0.35) {
          inputs.punchPressed = true;
          inputs.punch = true;
        } else if (rand < 0.65) {
          inputs.kickPressed = true;
          inputs.kick = true;
        } else if (rand < 0.85) {
          inputs.heavyPressed = true;
          inputs.heavy = true;
        } else {
          // Special move
          inputs.specialPressed = true;
          inputs.special = true;
        }
        this.actionCooldown = this.difficulty === 'dificil' ? 8 : this.difficulty === 'normal' ? 16 : 28;
      }
    }
    // B. Mid range (50px - 140px)
    else if (dist < 140) {
      if (this.actionCooldown === 0) {
        const rand = Math.random();
        // Approach, jump in, or special poke
        if (rand < 0.3) {
          // Fire special move / projectile poke
          inputs.specialPressed = true;
          inputs.special = true;
          this.actionCooldown = 22;
        } else if (rand < 0.55 && this.difficulty !== 'facil') {
          // Jump in attack
          inputs.up = true;
          if (aiIsLeft) inputs.right = true;
          else inputs.left = true;
          setTimeout(() => {
            // aerial trigger
          }, 150);
          this.actionCooldown = 20;
        } else {
          // Step closer
          if (aiIsLeft) inputs.right = true;
          else inputs.left = true;
        }
      } else {
        // Step closer
        if (aiIsLeft) inputs.right = true;
        else inputs.left = true;
      }
    }
    // C. Far range (> 140px)
    else {
      // Approach opponent
      if (aiIsLeft) {
        inputs.right = true;
      } else {
        inputs.left = true;
      }

      // Occasionally toss a projectile or special
      if (Math.random() < 0.04 && this.actionCooldown === 0) {
        inputs.specialPressed = true;
        inputs.special = true;
        this.actionCooldown = 35;
      }
    }

    return inputs;
  }

  private decideGoal(ai: Fighter, player: Fighter, dist: number) {
    const hpRatio = ai.health / (player.health + 0.1);

    if (dist > 180) {
      this.currentGoal = 'approach';
      this.goalTimer = 25;
    } else if (dist < 60 && hpRatio < 0.4 && Math.random() < 0.5) {
      this.currentGoal = 'retreat';
      this.goalTimer = 18;
    } else {
      this.currentGoal = 'attack';
      this.goalTimer = 30;
    }
  }
}
