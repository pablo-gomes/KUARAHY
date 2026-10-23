/**
 * KUARAHY — Character Selection Screen
 * 6-Fighter Arcade Grid with Stat Radars, Lore, Quotes, and Move Previews.
 */
import React, { useState } from 'react';
import { FighterId, AIDifficulty, SubMode } from '../types/game';
import { FIGHTERS } from '../data/characters';
import { soundEngine } from '../audio/SoundEngine';
import { ArrowLeft, Play, Zap, Shield, Flame, Gauge } from 'lucide-react';

interface CharacterSelectProps {
  mode: SubMode;
  onConfirmSelection: (p1Id: FighterId, p2Id: FighterId, aiDiff: AIDifficulty) => void;
  onBack: () => void;
}

const FIGHTER_LIST: FighterId[] = ['terere', 'harpa', 'chaco', 'nanduti', 'itaipu', 'guarani'];

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  mode,
  onConfirmSelection,
  onBack,
}) => {
  const [p1Selection, setP1Selection] = useState<FighterId>('terere');
  const [p2Selection, setP2Selection] = useState<FighterId>('guarani');
  const [selectingPlayer, setSelectingPlayer] = useState<1 | 2>(1);
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('normal');
  const [showMoves, setShowMoves] = useState<boolean>(false);

  const activeFighter = FIGHTERS[selectingPlayer === 1 ? p1Selection : p2Selection];

  const handleSelectFighter = (id: FighterId) => {
    soundEngine.playMenuBeep();
    if (selectingPlayer === 1) {
      setP1Selection(id);
      if (mode === '1v1_local') {
        // In local 2P, next click chooses P2
        setSelectingPlayer(2);
      }
    } else {
      setP2Selection(id);
    }
  };

  const handleStartFight = () => {
    soundEngine.playSelectConfirm();
    onConfirmSelection(p1Selection, p2Selection, aiDifficulty);
  };

  const renderStatBar = (label: string, value: number, icon: React.ReactNode, color: string) => {
    return (
      <div className="flex items-center gap-2 text-[9px] w-full">
        <div className="flex items-center gap-1 w-24 text-neutral-300">
          {icon}
          <span>{label}</span>
        </div>
        <div className="flex-1 flex gap-1 h-3 bg-neutral-950 p-0.5 border border-neutral-700 rounded">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${
                i < value ? color : 'bg-neutral-800'
              }`}
            />
          ))}
        </div>
        <span className="w-5 text-right font-mono text-neutral-400">{value}/5</span>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 md:p-6 overflow-hidden select-none font-pixel bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* TOP BAR: HEADER & CONTROLS */}
      <div className="flex items-center justify-between z-10">
        <button
          onClick={() => {
            soundEngine.playMenuBeep();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded text-[9px] text-neutral-300 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>VOLTAR</span>
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-base md:text-xl font-bold tracking-widest text-amber-400 text-glow-gold">
            ESCOLHA SEU LUTADOR
          </h1>
          <span className="text-[8px] text-neutral-400 tracking-wider">
            {mode === '1vbot'
              ? 'SELECIONE SEU PERSONAGEM & ADVERSÁRIO'
              : mode === '1v1_local'
              ? selectingPlayer === 1 ? 'JOGADOR 1: ESCOLHA SEU PERSONAGEM' : 'JOGADOR 2: ESCOLHA SEU PERSONAGEM'
              : 'MODO TREINAMENTO'}
          </span>
        </div>

        {/* AI DIFFICULTY SELECTOR (if 1vBot) */}
        {mode === '1vbot' && (
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-700 p-1 rounded text-[8px]">
            <span className="text-neutral-400 px-1">IA:</span>
            {(['facil', 'normal', 'dificil'] as AIDifficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  soundEngine.playMenuBeep();
                  setAiDifficulty(diff);
                }}
                className={`px-2 py-1 rounded uppercase font-bold cursor-pointer transition-colors ${
                  aiDifficulty === diff
                    ? diff === 'facil'
                      ? 'bg-emerald-600 text-white'
                      : diff === 'normal'
                      ? 'bg-amber-600 text-white'
                      : 'bg-red-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CENTER: CHARACTER ROSTER GRID & PROFILE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-2 flex-1 items-center z-10 max-w-5xl mx-auto w-full">
        {/* LEFT COLUMN: 6 CHARACTER TILES */}
        <div className="md:col-span-6 grid grid-cols-3 gap-2.5">
          {FIGHTER_LIST.map((id, index) => {
            const fighter = FIGHTERS[id];
            const isP1 = p1Selection === id;
            const isP2 = p2Selection === id;

            return (
              <button
                key={id}
                onClick={() => handleSelectFighter(id)}
                className={`relative aspect-square border-2 rounded-lg p-2 flex flex-col items-center justify-between transition-all duration-150 cursor-pointer overflow-hidden ${
                  isP1
                    ? 'border-red-500 bg-red-950/40 shadow-[0_0_15px_rgba(239,68,68,0.6)] scale-105'
                    : isP2
                    ? 'border-blue-500 bg-blue-950/40 shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-105'
                    : 'border-neutral-700 bg-neutral-900/60 hover:border-neutral-500 hover:scale-100'
                }`}
                style={{
                  boxShadow: isP1
                    ? '0 0 15px rgba(239, 68, 68, 0.4)'
                    : isP2
                    ? '0 0 15px rgba(59, 130, 246, 0.4)'
                    : undefined,
                }}
              >
                {/* Selection Badges */}
                <div className="w-full flex justify-between items-center text-[7px] font-mono">
                  <span className="text-neutral-500">0{index + 1}</span>
                  <div className="flex gap-1">
                    {isP1 && <span className="px-1 bg-red-600 text-white font-bold rounded">P1</span>}
                    {isP2 && <span className="px-1 bg-blue-600 text-white font-bold rounded">P2</span>}
                  </div>
                </div>

                {/* Character Silhouette Icon */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg my-1 border border-black shadow"
                  style={{
                    backgroundColor: fighter.colorTheme.primary,
                    color: '#ffffff',
                  }}
                >
                  {fighter.name.charAt(fighter.name.startsWith('O ') || fighter.name.startsWith('A ') ? 2 : 0)}
                </div>

                {/* Name */}
                <span className="text-[8px] font-bold tracking-tight text-center truncate w-full text-neutral-200">
                  {fighter.name}
                </span>
              </button>
            );
          })}

          {/* Quick Player Target Switcher in 1v1 Local */}
          {mode === '1v1_local' && (
            <div className="col-span-3 flex justify-center gap-3 mt-1">
              <button
                onClick={() => setSelectingPlayer(1)}
                className={`px-3 py-1 text-[8px] rounded border ${
                  selectingPlayer === 1
                    ? 'bg-red-600 border-red-400 text-white font-bold'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                }`}
              >
                CONFIGURAR P1
              </button>
              <button
                onClick={() => setSelectingPlayer(2)}
                className={`px-3 py-1 text-[8px] rounded border ${
                  selectingPlayer === 2
                    ? 'bg-blue-600 border-blue-400 text-white font-bold'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                }`}
              >
                CONFIGURAR P2
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SELECTED FIGHTER DETAILS & STATS */}
        <div className="md:col-span-6 bg-neutral-900/90 border-2 border-neutral-700 p-4 rounded-xl flex flex-col justify-between shadow-xl">
          <div>
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div>
                <h2 className="text-base font-bold text-amber-300 tracking-wider">
                  {activeFighter.name}
                </h2>
                <p className="text-[8px] text-amber-500/90 tracking-widest uppercase">
                  {activeFighter.title} • {activeFighter.origin}
                </p>
              </div>
              <span className="px-2 py-0.5 bg-neutral-800 border border-neutral-600 text-[8px] text-neutral-300 rounded">
                {activeFighter.style}
              </span>
            </div>

            {/* Fighter quote */}
            <p className="text-[8px] italic text-neutral-400 my-2 px-2 py-1 bg-neutral-950/50 border-l-2 border-amber-500 rounded">
              "{activeFighter.quote}"
            </p>

            {/* Tab: Stats or Moves */}
            <div className="flex gap-2 my-2 border-b border-neutral-800 pb-1">
              <button
                onClick={() => setShowMoves(false)}
                className={`text-[8px] pb-1 cursor-pointer ${
                  !showMoves ? 'text-amber-400 border-b-2 border-amber-400 font-bold' : 'text-neutral-500'
                }`}
              >
                ATRIBUTOS
              </button>
              <button
                onClick={() => setShowMoves(true)}
                className={`text-[8px] pb-1 cursor-pointer ${
                  showMoves ? 'text-amber-400 border-b-2 border-amber-400 font-bold' : 'text-neutral-500'
                }`}
              >
                LISTA DE GOLPES
              </button>
            </div>

            {/* Content Tab */}
            {!showMoves ? (
              <div className="space-y-2 mt-2">
                {renderStatBar('DANO', activeFighter.stats.damage, <Flame className="w-3 h-3 text-red-400" />, 'bg-red-500')}
                {renderStatBar('VELOC.', activeFighter.stats.speed, <Gauge className="w-3 h-3 text-cyan-400" />, 'bg-cyan-500')}
                {renderStatBar('DEFESA', activeFighter.stats.defense, <Shield className="w-3 h-3 text-emerald-400" />, 'bg-emerald-500')}
                {renderStatBar('ALCANCE', activeFighter.stats.reach, <Zap className="w-3 h-3 text-amber-400" />, 'bg-amber-500')}

                <p className="text-[8px] text-neutral-400 leading-relaxed mt-2 pt-1 border-t border-neutral-800">
                  {activeFighter.bio}
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
                {activeFighter.moves.map((m, i) => (
                  <div key={i} className="flex justify-between items-center text-[8px] bg-neutral-950/60 p-1.5 rounded border border-neutral-800">
                    <div>
                      <span className="font-bold text-amber-200">{m.name}</span>
                      <p className="text-[7px] text-neutral-400">{m.desc}</p>
                    </div>
                    <span className="font-mono text-cyan-300 text-[8px] bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700">
                      {m.command}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Special Move Highlight */}
          <div className="mt-3 pt-2 border-t border-neutral-800 flex justify-between items-center text-[7px] text-neutral-400">
            <span>ESPECIAL: <strong className="text-amber-300">{activeFighter.special1Name}</strong></span>
            <span>SUPER: <strong className="text-cyan-300">{activeFighter.superName}</strong></span>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="flex justify-center z-10">
        <button
          onClick={handleStartFight}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm md:text-base rounded-lg border-2 border-yellow-200 shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center gap-2 cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>LUTAR AGORA!</span>
        </button>
      </div>
    </div>
  );
};
