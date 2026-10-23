/**
 * KUARAHY — On-Screen Mobile Arcade Touch Controls
 * Virtual D-Pad and Combat Action Buttons for smartphones and tablets.
 */
import React from 'react';
import { InputState } from '../types/game';

interface TouchControlsProps {
  onInputDown: (key: keyof InputState) => void;
  onInputUp: (key: keyof InputState) => void;
  canSuper: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onInputDown,
  onInputUp,
  canSuper,
}) => {
  const handleTouch = (key: keyof InputState, isPressed: boolean) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (isPressed) {
      onInputDown(key);
    } else {
      onInputUp(key);
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-2 pointer-events-auto flex justify-between px-3 md:px-8 select-none font-pixel">
      {/* LEFT: ARCADE D-PAD */}
      <div className="relative w-36 h-36">
        {/* UP / JUMP */}
        <button
          onTouchStart={handleTouch('up', true)}
          onTouchEnd={handleTouch('up', false)}
          onMouseDown={handleTouch('up', true)}
          onMouseUp={handleTouch('up', false)}
          className="absolute top-0 left-12 w-12 h-12 bg-neutral-800/80 active:bg-amber-600 border-2 border-neutral-600 rounded flex items-center justify-center text-white text-base shadow active:scale-95 transition-transform"
        >
          ▲
        </button>

        {/* LEFT */}
        <button
          onTouchStart={handleTouch('left', true)}
          onTouchEnd={handleTouch('left', false)}
          onMouseDown={handleTouch('left', true)}
          onMouseUp={handleTouch('left', false)}
          className="absolute top-12 left-0 w-12 h-12 bg-neutral-800/80 active:bg-amber-600 border-2 border-neutral-600 rounded flex items-center justify-center text-white text-base shadow active:scale-95 transition-transform"
        >
          ◀
        </button>

        {/* CENTER PIVOT */}
        <div className="absolute top-12 left-12 w-12 h-12 bg-neutral-900/60 rounded-full border border-neutral-700 flex items-center justify-center text-[8px] text-neutral-400">
          PAD
        </div>

        {/* RIGHT */}
        <button
          onTouchStart={handleTouch('right', true)}
          onTouchEnd={handleTouch('right', false)}
          onMouseDown={handleTouch('right', true)}
          onMouseUp={handleTouch('right', false)}
          className="absolute top-12 right-0 w-12 h-12 bg-neutral-800/80 active:bg-amber-600 border-2 border-neutral-600 rounded flex items-center justify-center text-white text-base shadow active:scale-95 transition-transform"
        >
          ▶
        </button>

        {/* DOWN / CROUCH */}
        <button
          onTouchStart={handleTouch('down', true)}
          onTouchEnd={handleTouch('down', false)}
          onMouseDown={handleTouch('down', true)}
          onMouseUp={handleTouch('down', false)}
          className="absolute bottom-0 left-12 w-12 h-12 bg-neutral-800/80 active:bg-amber-600 border-2 border-neutral-600 rounded flex items-center justify-center text-white text-base shadow active:scale-95 transition-transform"
        >
          ▼
        </button>
      </div>

      {/* RIGHT: ARCADE ACTION BUTTONS */}
      <div className="flex flex-col items-end gap-2">
        {/* SUPER BUTTON (when charged) */}
        {canSuper && (
          <button
            onTouchStart={handleTouch('super', true)}
            onTouchEnd={handleTouch('super', false)}
            onMouseDown={handleTouch('super', true)}
            onMouseUp={handleTouch('super', false)}
            className="w-32 py-1.5 bg-gradient-to-r from-amber-500 to-red-600 border-2 border-yellow-300 rounded text-black text-[10px] font-black uppercase tracking-wider animate-pulse shadow-[0_0_15px_#f59e0b]"
          >
            ★ SUPER! ★
          </button>
        )}

        {/* ROW 1: Soco, Chute, Forte */}
        <div className="flex gap-2">
          <button
            onTouchStart={handleTouch('punch', true)}
            onTouchEnd={handleTouch('punch', false)}
            onMouseDown={handleTouch('punch', true)}
            onMouseUp={handleTouch('punch', false)}
            className="w-12 h-12 rounded-full bg-red-700 active:bg-red-500 border-2 border-red-400 flex flex-col items-center justify-center text-white text-[9px] shadow-lg active:scale-95"
          >
            <span>SOCO</span>
            <span className="text-[7px] text-red-200">J</span>
          </button>

          <button
            onTouchStart={handleTouch('kick', true)}
            onTouchEnd={handleTouch('kick', false)}
            onMouseDown={handleTouch('kick', true)}
            onMouseUp={handleTouch('kick', false)}
            className="w-12 h-12 rounded-full bg-blue-700 active:bg-blue-500 border-2 border-blue-400 flex flex-col items-center justify-center text-white text-[9px] shadow-lg active:scale-95"
          >
            <span>CHUTE</span>
            <span className="text-[7px] text-blue-200">K</span>
          </button>

          <button
            onTouchStart={handleTouch('heavy', true)}
            onTouchEnd={handleTouch('heavy', false)}
            onMouseDown={handleTouch('heavy', true)}
            onMouseUp={handleTouch('heavy', false)}
            className="w-12 h-12 rounded-full bg-amber-600 active:bg-amber-400 border-2 border-amber-300 flex flex-col items-center justify-center text-white text-[9px] shadow-lg active:scale-95"
          >
            <span>FORTE</span>
            <span className="text-[7px] text-amber-200">O</span>
          </button>
        </div>

        {/* ROW 2: Especial, Agarrão, Defesa */}
        <div className="flex gap-2">
          <button
            onTouchStart={handleTouch('special', true)}
            onTouchEnd={handleTouch('special', false)}
            onMouseDown={handleTouch('special', true)}
            onMouseUp={handleTouch('special', false)}
            className="w-12 h-12 rounded-full bg-purple-700 active:bg-purple-500 border-2 border-purple-400 flex flex-col items-center justify-center text-white text-[9px] shadow-lg active:scale-95"
          >
            <span>ESP</span>
            <span className="text-[7px] text-purple-200">L</span>
          </button>

          <button
            onTouchStart={handleTouch('grab', true)}
            onTouchEnd={handleTouch('grab', false)}
            onMouseDown={handleTouch('grab', true)}
            onMouseUp={handleTouch('grab', false)}
            className="w-12 h-12 rounded-full bg-emerald-700 active:bg-emerald-500 border-2 border-emerald-400 flex flex-col items-center justify-center text-white text-[9px] shadow-lg active:scale-95"
          >
            <span>AGAR</span>
            <span className="text-[7px] text-emerald-200">U</span>
          </button>

          <button
            onTouchStart={handleTouch('block', true)}
            onTouchEnd={handleTouch('block', false)}
            onMouseDown={handleTouch('block', true)}
            onMouseUp={handleTouch('block', false)}
            className="w-12 h-12 rounded-full bg-neutral-700 active:bg-neutral-500 border-2 border-neutral-400 flex flex-col items-center justify-center text-white text-[9px] shadow-lg active:scale-95"
          >
            <span>DEF</span>
            <span className="text-[7px] text-neutral-300">I</span>
          </button>
        </div>
      </div>
    </div>
  );
};
