/**
 * KUARAHY — Arcade Main Menu Screen
 * Neo-Geo style animated attract screen with mode selection and authentic Paraguayan motifs.
 */
import React, { useState, useEffect } from 'react';
import { SubMode } from '../types/game';
import { soundEngine } from '../audio/SoundEngine';
import { Swords, Bot, Wifi, Dumbbell, Settings, BookOpen } from 'lucide-react';

interface MainMenuProps {
  onSelectMode: (mode: SubMode) => void;
  onOpenOptions: () => void;
  onOpenHelp: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectMode,
  onOpenOptions,
  onOpenHelp,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuOptions = [
    {
      id: '1vbot' as SubMode,
      title: '1V BOT',
      subtitle: 'Enfrente a IA em 3 dificuldades',
      icon: Bot,
      color: 'from-amber-500 to-red-600',
    },
    {
      id: '1v1_local' as SubMode,
      title: '1V1 LOCAL',
      subtitle: '2 jogadores no mesmo teclado ou controles',
      icon: Swords,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'lan' as SubMode,
      title: '1V1 LAN / WI-FI',
      subtitle: 'Dois dispositivos na mesma rede local',
      icon: Wifi,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'training' as SubMode,
      title: 'TREINAMENTO',
      subtitle: 'Pratique golpes, combos e frame data',
      icon: Dumbbell,
      color: 'from-purple-500 to-pink-600',
    },
  ];

  // Keyboard navigation for authentic arcade feel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        soundEngine.playMenuBeep();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : menuOptions.length));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        soundEngine.playMenuBeep();
        setSelectedIndex((prev) => (prev < menuOptions.length ? prev + 1 : 0));
      } else if (e.key === 'Enter' || e.key === ' ' || e.key === 'j' || e.key === 'J') {
        soundEngine.playSelectConfirm();
        if (selectedIndex < menuOptions.length) {
          onSelectMode(menuOptions[selectedIndex].id);
        } else {
          onOpenOptions();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, menuOptions, onSelectMode, onOpenOptions]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 overflow-hidden select-none font-pixel bg-gradient-to-b from-neutral-950 via-indigo-950/40 to-neutral-950">
      {/* Paraguayan Tricolor Animated Accent Bar */}
      <div className="absolute top-0 inset-x-0 h-2 flex shadow-lg">
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-blue-600" />
      </div>

      {/* TOP HEADER: TITLE & LOGO */}
      <div className="flex flex-col items-center mt-6 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🇵🇾</span>
          <h1 className="text-4xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-stroke-arcade text-glow-gold">
            KUARAHY
          </h1>
          <span className="text-2xl">⚡</span>
        </div>
        <p className="text-[10px] md:text-xs text-amber-200/90 mt-2 tracking-widest uppercase text-center max-w-md">
          O Torneio Ancestral do Sol Guaraní — Jogo de Luta Arcade 2D
        </p>
      </div>

      {/* CENTER: ARCADE MENU LIST */}
      <div className="w-full max-w-md flex flex-col gap-3 z-10">
        {menuOptions.map((opt, idx) => {
          const isSelected = selectedIndex === idx;
          const IconComponent = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={() => {
                soundEngine.playSelectConfirm();
                onSelectMode(opt.id);
              }}
              onMouseEnter={() => {
                soundEngine.playMenuBeep();
                setSelectedIndex(idx);
              }}
              className={`w-full px-5 py-3.5 border-2 rounded-lg flex items-center justify-between transition-all duration-150 cursor-pointer ${
                isSelected
                  ? `bg-gradient-to-r ${opt.color} border-yellow-300 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)] translate-x-2`
                  : 'bg-neutral-900/80 border-neutral-700 text-neutral-300 hover:border-neutral-500'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-xs ${isSelected ? 'text-yellow-200' : 'text-neutral-500'}`}>
                  {isSelected ? '▶' : ' '}
                </span>
                <IconComponent className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold tracking-wider">{opt.title}</span>
                  <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-yellow-100' : 'text-neutral-400'}`}>
                    {opt.subtitle}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-white/60">0{idx + 1}</span>
            </button>
          );
        })}

        {/* OPTIONS & CONTROLS ROW */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <button
            onClick={() => {
              soundEngine.playSelectConfirm();
              onOpenOptions();
            }}
            onMouseEnter={() => {
              soundEngine.playMenuBeep();
              setSelectedIndex(menuOptions.length);
            }}
            className={`py-3 px-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedIndex === menuOptions.length
                ? 'bg-neutral-800 border-yellow-300 text-yellow-300 shadow-md'
                : 'bg-neutral-900/80 border-neutral-700 text-neutral-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-[10px] font-bold">OPÇÕES</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playMenuBeep();
              onOpenHelp();
            }}
            className="py-3 px-4 bg-neutral-900/80 border-2 border-neutral-700 rounded-lg flex items-center justify-center gap-2 text-neutral-400 hover:text-white hover:border-neutral-500 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] font-bold">GOLPES</span>
          </button>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="flex flex-col items-center gap-1 z-10 text-[9px] text-neutral-400 text-center">
        <p className="tracking-wider">
          <span className="text-yellow-400 font-bold">DICA:</span> Use [W/S] ou Setas para navegar, [ENTER] ou [J] para confirmar.
        </p>
        <p className="text-neutral-400 tracking-tighter">
          KUARAHY v1.0 • 6 Lutadores • 6 Arenas • Trilha Sonora Paraguaia
        </p>
      </div>
    </div>
  );
};
