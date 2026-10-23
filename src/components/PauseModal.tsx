/**
 * KUARAHY — In-Game Pause Menu
 */
import React from 'react';
import { soundEngine } from '../audio/SoundEngine';
import { Play, RotateCcw, BookOpen, LogOut } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenMoves: () => void;
  onQuitToMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onOpenMoves,
  onQuitToMenu,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none font-pixel">
      <div className="w-full max-w-sm bg-neutral-900 border-2 border-amber-500 rounded-xl p-6 shadow-2xl flex flex-col items-center gap-4 text-white">
        <h2 className="text-xl font-bold tracking-widest text-amber-400 text-glow-gold">
          PAUSADO
        </h2>

        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={() => {
              soundEngine.playMenuBeep();
              onResume();
            }}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded border border-yellow-200 flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>CONTINUAR</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playMenuBeep();
              onOpenMoves();
            }}
            className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded border border-neutral-600 flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>LISTA DE GOLPES</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playMenuBeep();
              onRestart();
            }}
            className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded border border-neutral-600 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REINICIAR LUTA</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playMenuBeep();
              onQuitToMenu();
            }}
            className="w-full py-2.5 px-4 bg-red-950/80 hover:bg-red-900 text-red-200 font-bold text-xs rounded border border-red-800 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <LogOut className="w-4 h-4" />
            <span>SAIR PARA O MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
