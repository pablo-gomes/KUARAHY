/**
 * KUARAHY — Move List & Character Command Reference Guide
 */
import React, { useState } from 'react';
import { FighterId } from '../types/game';
import { FIGHTERS } from '../data/characters';
import { soundEngine } from '../audio/SoundEngine';
import { X, BookOpen, Sparkles } from 'lucide-react';

interface MoveListModalProps {
  onClose: () => void;
  defaultFighter?: FighterId;
}

const FIGHTER_LIST: FighterId[] = ['terere', 'harpa', 'chaco', 'nanduti', 'itaipu', 'guarani'];

export const MoveListModal: React.FC<MoveListModalProps> = ({
  onClose,
  defaultFighter = 'terere',
}) => {
  const [selectedFighter, setSelectedFighter] = useState<FighterId>(defaultFighter);
  const fighter = FIGHTERS[selectedFighter];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none font-pixel">
      <div className="w-full max-w-2xl bg-neutral-900 border-2 border-amber-500 rounded-xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2 text-amber-400">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-sm md:text-base font-bold tracking-wider">
              GUIA DE GOLPES & ESPECIAIS
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playMenuBeep();
              onClose();
            }}
            className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FIGHTER TABS */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 my-3">
          {FIGHTER_LIST.map((id) => {
            const f = FIGHTERS[id];
            const isSelected = selectedFighter === id;
            return (
              <button
                key={id}
                onClick={() => {
                  soundEngine.playMenuBeep();
                  setSelectedFighter(id);
                }}
                className={`py-1.5 px-1 rounded text-[8px] font-bold truncate border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black border-yellow-300'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                {f.name}
              </button>
            );
          })}
        </div>

        {/* SELECTED FIGHTER INFO */}
        <div className="flex items-center justify-between bg-neutral-950/70 p-2.5 rounded border border-neutral-800 mb-3">
          <div>
            <h3 className="text-xs font-bold text-amber-300">{fighter.name}</h3>
            <p className="text-[8px] text-neutral-400">{fighter.title} • Estilo: {fighter.style}</p>
          </div>
          <span className="text-[8px] text-amber-400/90 italic">"{fighter.quote}"</span>
        </div>

        {/* MOVES LIST */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {fighter.moves.map((m, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 bg-neutral-950/50 border border-neutral-800 rounded text-[8px]"
            >
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-[9px]">{m.name}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[7px] ${
                      m.type === 'Técnica de Energia'
                        ? 'bg-red-950 text-red-300 border border-red-700'
                        : m.type === 'Especial'
                        ? 'bg-purple-950 text-purple-300 border border-purple-700'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {m.type}
                  </span>
                </div>
                <span className="text-neutral-400 text-[7px]">{m.desc}</span>
              </div>

              <div className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-cyan-300 font-mono font-bold text-[8px] rounded shadow">
                {m.command}
              </div>
            </div>
          ))}
        </div>

        {/* CONTRA / PARRY MECHANIC TIP */}
        <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center gap-2 text-[7px] text-amber-300/90 bg-amber-950/30 p-2 rounded">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>MECÂNICA DE CONTRA (PARRY):</strong> Pressione a defesa no momento exato do impacto inimigo para anular todo o dano e atordoar o rival!
          </span>
        </div>
      </div>
    </div>
  );
};
