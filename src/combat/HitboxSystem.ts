/**
 * KUARAHY — Hitbox and Collision Combat System
 * Handles hurtboxes, active hitboxes, parries (Contra), blocking, and damage calculation.
 */
import { Box, AttackFrameData } from '../types/game';

export interface CollisionResult {
  hit: boolean;
  isParry: boolean;
  isBlocked: boolean;
  isGrab: boolean;
  damage: number;
  hitstun: number;
  blockstun: number;
  knockbackX: number;
  knockbackY: number;
  impactX: number;
  impactY: number;
  sound: 'punch' | 'kick' | 'heavy' | 'special' | 'super' | 'grab' | 'laser' | 'water';
}

/**
 * Checks AABB intersection between two bounding boxes
 */
export function checkAABB(boxA: Box, boxB: Box): boolean {
  return (
    boxA.x < boxB.x + boxB.w &&
    boxA.x + boxA.w > boxB.x &&
    boxA.y < boxB.y + boxB.h &&
    boxA.y + boxA.h > boxB.y
  );
}

/**
 * Calculate world-space hurtboxes for a fighter given position, facing and posture
 */
export function getFighterHurtboxes(
  x: number,
  y: number,
  facing: 1 | -1,
  isCrouching: boolean,
  isJumping: boolean
): Box[] {
  const width = 36;
  const height = isCrouching ? 44 : 76;
  const offsetY = isCrouching ? -44 : -76;

  // Primary body hurtbox
  return [
    {
      x: x - width / 2,
      y: y + offsetY,
      w: width,
      h: height,
    },
  ];
}

/**
 * Calculate world-space attack hitbox from frame data, position and facing
 */
export function getWorldHitbox(
  x: number,
  y: number,
  facing: 1 | -1,
  attackData: AttackFrameData
): Box {
  const offset = attackData.hitboxOffset;
  const worldX = facing === 1 ? x + offset.x : x - offset.x - offset.w;
  const worldY = y + offset.y;

  return {
    x: worldX,
    y: worldY,
    w: offset.w,
    h: offset.h,
  };
}

/**
 * Evaluate attack contact between attacker and defender
 */
export function evaluateCombatCollision(
  attackerX: number,
  attackerY: number,
  attackerFacing: 1 | -1,
  attackData: AttackFrameData,
  defenderX: number,
  defenderY: number,
  defenderFacing: 1 | -1,
  defenderIsCrouching: boolean,
  defenderIsJumping: boolean,
  defenderIsBlocking: boolean,
  defenderBlockFrames: number, // how many frames defender has been holding block
  defenderDefenseStat: number, // 1 to 5
  defenderIsInvulnerable: boolean
): CollisionResult | null {
  if (defenderIsInvulnerable) return null;

  const attackHitbox = getWorldHitbox(attackerX, attackerY, attackerFacing, attackData);
  const defenderHurtboxes = getFighterHurtboxes(
    defenderX,
    defenderY,
    defenderFacing,
    defenderIsCrouching,
    defenderIsJumping
  );

  let hasIntersected = false;
  for (const hurtbox of defenderHurtboxes) {
    if (checkAABB(attackHitbox, hurtbox)) {
      hasIntersected = true;
      break;
    }
  }

  if (!hasIntersected) return null;

  // Collision point for sparks and text
  const impactX = (attackHitbox.x + attackHitbox.w / 2 + defenderX) / 2;
  const impactY = attackHitbox.y + attackHitbox.h / 2;

  // Grab handling
  if (attackData.isUnblockable) {
    // Air targets cannot be grabbed
    if (defenderIsJumping) return null;

    const baseDmg = attackData.damage;
    const defMultiplier = 1.25 - (defenderDefenseStat * 0.08);
    const finalDamage = Math.round(baseDmg * defMultiplier);

    return {
      hit: true,
      isParry: false,
      isBlocked: false,
      isGrab: true,
      damage: finalDamage,
      hitstun: attackData.hitstun,
      blockstun: 0,
      knockbackX: attackData.knockbackX * attackerFacing,
      knockbackY: attackData.knockbackY,
      impactX,
      impactY,
      sound: 'grab',
    };
  }

  // PARRY (CONTRA) CHECK:
  // If defender started blocking within the last 1 to 8 frames, it's a JUST DEFEND / CONTRA!
  const isParry = defenderIsBlocking && defenderBlockFrames > 0 && defenderBlockFrames <= 8;

  if (isParry) {
    return {
      hit: true,
      isParry: true,
      isBlocked: true,
      isGrab: false,
      damage: 0, // Parrying completely negates damage!
      hitstun: 0,
      blockstun: 0,
      knockbackX: 2 * attackerFacing,
      knockbackY: 0,
      impactX,
      impactY,
      sound: 'punch', // will play parry sound via SoundEngine
    };
  }

  // STANDARD BLOCKING:
  // Defender is holding block and facing the incoming attack
  const isFacingAttacker = (defenderFacing === 1 && attackerX > defenderX) || (defenderFacing === -1 && attackerX < defenderX);
  const isBlocked = defenderIsBlocking && isFacingAttacker;

  // Defense stat scaling: 1 def = 1.15x dmg taken, 5 def = 0.85x dmg taken
  const defenseMultiplier = 1.22 - (defenderDefenseStat * 0.07);

  if (isBlocked) {
    // Chip damage is 15-20% of base damage
    const chipDmg = Math.max(1, Math.round(attackData.damage * 0.18 * defenseMultiplier));
    return {
      hit: true,
      isParry: false,
      isBlocked: true,
      isGrab: false,
      damage: chipDmg,
      hitstun: 0,
      blockstun: attackData.blockstun,
      knockbackX: (attackData.knockbackX * 0.6) * attackerFacing,
      knockbackY: 0,
      impactX,
      impactY,
      sound: 'punch',
    };
  }

  // CLEAN HIT:
  const finalDamage = Math.max(3, Math.round(attackData.damage * defenseMultiplier));
  return {
    hit: true,
    isParry: false,
    isBlocked: false,
    isGrab: false,
    damage: finalDamage,
    hitstun: attackData.hitstun,
    blockstun: 0,
    knockbackX: attackData.knockbackX * attackerFacing,
    knockbackY: attackData.knockbackY,
    impactX,
    impactY,
    sound: attackData.soundEffect,
  };
}
