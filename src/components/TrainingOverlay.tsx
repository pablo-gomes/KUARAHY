/**
 * KUARAHY — Training Mode HUD & Frame Data Tool
 * Real-time command history, dummy AI behaviors, damage calculation, and position reset.
 */
import React from 'react';
import { Fighter } from '../combat/Fighter';
import { soundEngine } from '../audio/SoundEngine';
import { RotateCcw, Shield, PlayCircle, Eye, EyeOff } from 'lucide-react';

export type DummyBehavior = 'stand' | 'crouch' | 'jump' | 'block_all' | 'block_random';

interface TrainingOverlayProps {
  p1: Fighter;
  p2: Fighter;
  dummyBehavior: DummyBehavior;
  infiniteHp: boolean;
  infiniteEnergy: boolean;
  showHitboxes: boolean;
  commandHistory: string[];
  onToggleInfiniteHp: () => void;
  onToggleInfiniteEnergy: () => void;
  onToggleHitboxes: () => void;
  onSetDummyBehavior: (behavior: DummyBehavior) => void;
  onResetPositions: () => void;
}

export const TrainingOverlay: React.FC<TrainingOverlayProps> = ({
  p1,
  p2,
  dummyBehavior,
  infiniteHp,
  infiniteEnergy,
  showHitboxes,
  commandHistory,
  onToggleInfiniteHp,
  onToggleInfiniteEnergy,
  onToggleHitboxes,
  onSetDummyBehavior,
  onResetPositions,
}) => {
  return (
    <div className="absolute inset-x-0 bottom-16 pointer-events-none flex justify-between px-4 select-none font-pixel">
      {/* LEFT: COMMAND HISTORY STACK */}
      <div className="flex flex-col items-start gap-1 max-w-[200px]">
        <span className="text-[8px] text-amber-400 font-bold tracking-wider bg-black/60 px-1.5 py-0.5 rounded border border-amber-500/30">
          HISTÓRICO DE COMANDOS
        </span>
        <div className="flex flex-col-reverse gap-1">
          {commandHistory.slice(-6).map((cmd, idx) => (
            <div
              key={idx}
              className="px-2 py-0.5 bg-black/70 border border-neutral-700 text-cyan-300 text-[8px] rounded shadow tracking-tight"
            >
              {cmd}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: TRAINING CONTROLS PANEL */}
      <div className="pointer-events-auto bg-neutral-950/80 border-2 border-neutral-700 p-2.5 rounded-lg flex flex-col gap-2 shadow-2xl backdrop-blur-sm max-w-xs">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-1">
          <span className="text-[9px] text-amber-300 font-bold">PAINEL DE TREINO</span>
          <button
            onClick={() => {
              soundEngine.playMenuBeep();
              onResetPositions();
            }}
            className="flex items-center gap-1 px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-black text-[8px] font-bold rounded cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET (R)</span>
          </button>
        </div>

        {/* Dummy AI behavior dropdown */}
        <div className="flex items-center justify-between text-[8px]">
          <span className="text-neutral-400">DUMMY:</span>
          <select
            value={dummyBehavior}
            onChange={(e) => onSetDummyBehavior(e.target.value as DummyBehavior)}
            className="bg-neutral-900 border border-neutral-700 text-white text-[8px] px-1 py-0.5 rounded cursor-pointer"
          >
            <option value="stand">PARADO</option>
            <option value="crouch">AGACHADO</option>
            <option value="jump">PULANDO</option>
            <option value="block_all">DEFENDER SEMPRE</option>
            <option value="block_random">DEFESA ALEATÓRIA</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-1.5 text-[7px]">
          <button
            onClick={onToggleInfiniteHp}
            className={`px-1.5 py-1 rounded border cursor-pointer ${
              infiniteHp
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                : 'bg-neutral-900 border-neutral-700 text-neutral-400'
            }`}
          >
            VIDA INFINITA: {infiniteHp ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={onToggleInfiniteEnergy}
            className={`px-1.5 py-1 rounded border cursor-pointer ${
              infiniteEnergy
                ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                : 'bg-neutral-900 border-neutral-700 text-neutral-400'
            }`}
          >
            ENERGIA: {infiniteEnergy ? '100%' : 'PADRÃO'}
          </button>

          <button
            onClick={onToggleHitboxes}
            className={`col-span-2 px-1.5 py-1 rounded border flex items-center justify-center gap-1 cursor-pointer ${
              showHitboxes
                ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                : 'bg-neutral-900 border-neutral-700 text-neutral-400'
            }`}
          >
            {showHitboxes ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>HITBOXES VISÍVEIS: {showHitboxes ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Live Frame / Damage Stats */}
        <div className="bg-neutral-900/80 p-1.5 rounded border border-neutral-800 text-[7px] text-neutral-300 flex justify-between">
          <span>COMBO: <strong className="text-amber-400">{p1.comboHits}</strong></span>
          <span>DANO: <strong className="text-red-400">{p1.comboDamage}</strong></span>
          <span>ESTADO: <strong className="text-cyan-400">{p2.state.toUpperCase()}</strong></span>
        </div>
      </div>
    </div>
  );
};
