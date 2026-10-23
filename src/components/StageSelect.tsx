/**
 * KUARAHY — Stage Selection Screen
 * 6 Authentic Paraguayan Arenas with lore, palettes, and visual cards.
 */
import React, { useState } from 'react';
import { StageId } from '../types/game';
import { STAGES } from '../data/stages';
import { soundEngine } from '../audio/SoundEngine';
import { ArrowLeft, Play, MapPin } from 'lucide-react';

interface StageSelectProps {
  onConfirmStage: (stageId: StageId) => void;
  onBack: () => void;
}

const STAGE_LIST: StageId[] = [
  'assuncao',
  'chaco_stage',
  'itaipu_stage',
  'rio_paraguai',
  'encarnacion',
  'arena_cultural',
];

export const StageSelect: React.FC<StageSelectProps> = ({
  onConfirmStage,
  onBack,
}) => {
  const [selectedStage, setSelectedStage] = useState<StageId>('assuncao');
  const stageData = STAGES[selectedStage];

  const handleSelect = (id: StageId) => {
    soundEngine.playMenuBeep();
    setSelectedStage(id);
  };

  const handleConfirm = () => {
    soundEngine.playSelectConfirm();
    onConfirmStage(selectedStage);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 md:p-6 overflow-hidden select-none font-pixel bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* HEADER */}
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
            ESCOLHA A ARENA
          </h1>
          <span className="text-[8px] text-neutral-400 tracking-wider">
            6 CENÁRIOS EMBLEMÁTICOS DO PARAGUAI
          </span>
        </div>

        <div className="w-20" />
      </div>

      {/* STAGES GRID & DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-2 flex-1 items-center z-10 max-w-5xl mx-auto w-full">
        {/* LEFT: 6 STAGE CARDS */}
        <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {STAGE_LIST.map((id, index) => {
            const st = STAGES[id];
            const isSelected = selectedStage === id;

            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                className={`relative aspect-video border-2 rounded-lg p-2 flex flex-col justify-between transition-all duration-150 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)] scale-105'
                    : 'border-neutral-700 hover:border-neutral-500'
                }`}
                style={{
                  background: `linear-gradient(to bottom, ${st.palette.skyBottom}, ${st.palette.ground})`,
                }}
              >
                <div className="flex justify-between items-center text-[7px] text-white/80 drop-shadow">
                  <span>0{index + 1}</span>
                  {isSelected && <span className="text-amber-300 font-bold">★ ATIVA</span>}
                </div>

                <div className="text-left drop-shadow">
                  <p className="text-[9px] font-bold text-white tracking-tight">{st.name}</p>
                  <p className="text-[7px] text-neutral-200 truncate">{st.region}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT: SELECTED ARENA SPOTLIGHT */}
        <div className="md:col-span-5 bg-neutral-900/90 border-2 border-neutral-700 p-4 rounded-xl flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{stageData.region}</span>
            </div>
            <h2 className="text-lg font-black text-white tracking-wider">
              {stageData.name}
            </h2>
            <p className="text-[8px] text-amber-300/80 tracking-widest uppercase mb-3">
              {stageData.subtitle}
            </p>

            {/* Arena color banner */}
            <div
              className="w-full h-16 rounded border border-black shadow-inner flex items-center justify-center p-2 text-center text-[9px] text-white font-bold drop-shadow"
              style={{
                background: `linear-gradient(135deg, ${stageData.palette.skyTop}, ${stageData.palette.skyBottom}, ${stageData.palette.ground})`,
              }}
            >
              <span>{stageData.name}</span>
            </div>

            <p className="text-[8px] text-neutral-300 leading-relaxed mt-3 pt-2 border-t border-neutral-800">
              {stageData.description}
            </p>
          </div>

          <div className="mt-4 pt-2 border-t border-neutral-800 text-[8px] text-neutral-400 flex justify-between">
            <span>FÍSICA: <strong>60 FPS RETRO</strong></span>
            <span>CLIMA: <strong>DINÂMICO</strong></span>
          </div>
        </div>
      </div>

      {/* CONFIRM BUTTON */}
      <div className="flex justify-center z-10">
        <button
          onClick={handleConfirm}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm md:text-base rounded-lg border-2 border-yellow-200 shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center gap-2 cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>CONFIRMAR ARENA & INICIAR</span>
        </button>
      </div>
    </div>
  );
};
