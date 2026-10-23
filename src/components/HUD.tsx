/**
 * KUARAHY — Arcade Fight HUD
 * Displays authentic retro health bars, energy meters, round indicators, timer,
 * combo hit notifications, and match announcement banners.
 */
import React from 'react';
import { Fighter } from '../combat/Fighter';
import { MatchRoundState } from '../types/game';
import { FIGHTERS } from '../data/characters';

interface HUDProps {
  f1: Fighter;
  f2: Fighter;
  roundState: MatchRoundState;
  roundsToWin: number;
}

export const HUD: React.FC<HUDProps> = ({ f1, f2, roundState, roundsToWin }) => {
  const f1Def = FIGHTERS[f1.fighterId];
  const f2Def = FIGHTERS[f2.fighterId];

  // Health percentages
  const p1HpPercent = Math.max(0, Math.min(100, f1.health));
  const p2HpPercent = Math.max(0, Math.min(100, f2.health));

  // Energy percentages
  const p1EnergyPercent = Math.max(0, Math.min(100, f1.energy));
  const p2EnergyPercent = Math.max(0, Math.min(100, f2.energy));

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 select-none font-pixel">
      {/* Top HUD: Health Bars, Names, Timer, and Rounds */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-2">
          {/* PLAYER 1 HEALTH & INFO */}
          <div className="flex-1 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-400 text-xs font-bold tracking-wider drop-shadow">P1</span>
              <span className="text-white text-xs tracking-wider uppercase drop-shadow">{f1Def.name}</span>
              {/* Round Wins Circles */}
              <div className="flex items-center gap-1 ml-2">
                {Array.from({ length: roundsToWin }).map((_, idx) => (
                  <div
                    key={`p1-rd-${idx}`}
                    className={`w-3 h-3 rounded-full border border-black ${
                      idx < roundState.p1RoundsWon
                        ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                        : 'bg-neutral-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Health Bar Container (Left to Right drain) */}
            <div className="w-full h-5 bg-neutral-900 border-2 border-black p-0.5 shadow-md relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-amber-400 to-green-500 transition-all duration-75"
                style={{ width: `${p1HpPercent}%` }}
              />
              <span className="absolute right-1 top-0.5 text-[9px] text-white/90 drop-shadow">
                {Math.ceil(f1.health)}
              </span>
            </div>

            {/* Energy Bar (Bottom) */}
            <div className="w-3/4 h-2.5 bg-neutral-950 border border-neutral-700 mt-1 relative overflow-hidden">
              <div
                className={`h-full transition-all duration-75 ${
                  p1EnergyPercent >= 100
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse shadow-[0_0_10px_#38bdf8]'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${p1EnergyPercent}%` }}
              />
              {p1EnergyPercent >= 100 && (
                <span className="absolute inset-0 flex items-center justify-center text-[7px] text-white font-bold tracking-tighter drop-shadow">
                  SUPER PRONTO!
                </span>
              )}
            </div>
          </div>

          {/* CENTER: TIMER */}
          <div className="flex flex-col items-center justify-center px-3">
            <div className="w-14 h-12 bg-neutral-950 border-2 border-amber-500 rounded flex items-center justify-center shadow-lg">
              <span
                className={`text-xl font-bold ${
                  roundState.timer <= 10 && roundState.timer > 0
                    ? 'text-red-500 animate-bounce'
                    : 'text-amber-400'
                }`}
              >
                {roundState.timer === 0 ? '∞' : roundState.timer}
              </span>
            </div>
            <span className="text-[8px] text-amber-200 mt-0.5 tracking-widest uppercase">
              RD {roundState.currentRound}
            </span>
          </div>

          {/* PLAYER 2 HEALTH & INFO */}
          <div className="flex-1 flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1 flex-row-reverse">
              <span className="text-blue-400 text-xs font-bold tracking-wider drop-shadow">P2</span>
              <span className="text-white text-xs tracking-wider uppercase drop-shadow">{f2Def.name}</span>
              {/* Round Wins Circles */}
              <div className="flex items-center gap-1 mr-2 flex-row-reverse">
                {Array.from({ length: roundsToWin }).map((_, idx) => (
                  <div
                    key={`p2-rd-${idx}`}
                    className={`w-3 h-3 rounded-full border border-black ${
                      idx < roundState.p2RoundsWon
                        ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                        : 'bg-neutral-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Health Bar Container (Right to Left drain) */}
            <div className="w-full h-5 bg-neutral-900 border-2 border-black p-0.5 shadow-md relative overflow-hidden flex justify-end">
              <div
                className="h-full bg-gradient-to-l from-red-600 via-amber-400 to-green-500 transition-all duration-75"
                style={{ width: `${p2HpPercent}%` }}
              />
              <span className="absolute left-1 top-0.5 text-[9px] text-white/90 drop-shadow">
                {Math.ceil(f2.health)}
              </span>
            </div>

            {/* Energy Bar (Bottom) */}
            <div className="w-3/4 h-2.5 bg-neutral-950 border border-neutral-700 mt-1 relative overflow-hidden flex justify-end">
              <div
                className={`h-full transition-all duration-75 ${
                  p2EnergyPercent >= 100
                    ? 'bg-gradient-to-l from-cyan-400 to-blue-500 animate-pulse shadow-[0_0_10px_#38bdf8]'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${p2EnergyPercent}%` }}
              />
              {p2EnergyPercent >= 100 && (
                <span className="absolute inset-0 flex items-center justify-center text-[7px] text-white font-bold tracking-tighter drop-shadow">
                  SUPER PRONTO!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* COMBO POPUPS */}
        <div className="flex justify-between mt-4 px-2">
          {/* P1 Combo Notice */}
          <div className="h-10">
            {f1.comboHits >= 2 && (
              <div className="animate-bounce flex flex-col items-start bg-black/60 px-2 py-1 rounded border border-red-500/50">
                <span className="text-amber-300 text-xs font-bold tracking-wide">
                  {f1.comboHits} HITS!
                </span>
                <span className="text-[8px] text-red-300">
                  {f1.comboDamage} DANO
                </span>
              </div>
            )}
            {f1.state === 'parry' && (
              <div className="animate-pulse bg-amber-500/80 text-black px-2 py-0.5 rounded text-[9px] font-bold">
                CONTRA!
              </div>
            )}
          </div>

          {/* P2 Combo Notice */}
          <div className="h-10">
            {f2.comboHits >= 2 && (
              <div className="animate-bounce flex flex-col items-end bg-black/60 px-2 py-1 rounded border border-blue-500/50">
                <span className="text-amber-300 text-xs font-bold tracking-wide">
                  {f2.comboHits} HITS!
                </span>
                <span className="text-[8px] text-blue-300">
                  {f2.comboDamage} DANO
                </span>
              </div>
            )}
            {f2.state === 'parry' && (
              <div className="animate-pulse bg-amber-500/80 text-black px-2 py-0.5 rounded text-[9px] font-bold">
                CONTRA!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CENTER STAGE ANNOUNCEMENT BANNER */}
      {roundState.bannerText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-black/75 px-8 py-4 border-y-4 border-amber-500 shadow-2xl flex flex-col items-center animate-arcade-pulse">
            <h1 className="text-3xl md:text-5xl font-black text-amber-400 tracking-wider text-stroke-arcade text-glow-gold text-center">
              {roundState.bannerText}
            </h1>
            {roundState.bannerSubtext && (
              <p className="text-xs md:text-sm text-amber-200 mt-2 tracking-widest uppercase">
                {roundState.bannerSubtext}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
