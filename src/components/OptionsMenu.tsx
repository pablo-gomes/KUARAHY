/**
 * KUARAHY — Options and Controls Configuration Menu
 */
import React from 'react';
import { GameSettings } from '../types/game';
import { soundEngine } from '../audio/SoundEngine';
import { ArrowLeft, Volume2, Clock, Trophy, Tv, Keyboard } from 'lucide-react';

interface OptionsMenuProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onBack: () => void;
}

export const OptionsMenu: React.FC<OptionsMenuProps> = ({
  settings,
  onUpdateSettings,
  onBack,
}) => {
  const handleMusicChange = (val: number) => {
    const updated = { ...settings, musicVolume: val };
    onUpdateSettings(updated);
    soundEngine.setVolumes(updated.musicVolume, updated.sfxVolume);
  };

  const handleSfxChange = (val: number) => {
    const updated = { ...settings, sfxVolume: val };
    onUpdateSettings(updated);
    soundEngine.setVolumes(updated.musicVolume, updated.sfxVolume);
    soundEngine.playKick();
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 md:p-6 overflow-y-auto select-none font-pixel bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between z-10 border-b border-neutral-800 pb-3">
        <button
          onClick={() => {
            soundEngine.playMenuBeep();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded text-[9px] text-neutral-300 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>VOLTAR AO MENU</span>
        </button>

        <h1 className="text-base md:text-xl font-bold tracking-widest text-amber-400 text-glow-gold">
          OPÇÕES & CONTROLES
        </h1>

        <div className="w-20" />
      </div>

      {/* SETTINGS PANELS */}
      <div className="max-w-3xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4 my-4 z-10">
        {/* AUDIO & DISPLAY SETTINGS */}
        <div className="bg-neutral-900/90 border border-neutral-700 p-4 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold border-b border-neutral-800 pb-1.5">
            <Volume2 className="w-4 h-4" />
            <span>ÁUDIO & VÍDEO</span>
          </div>

          {/* Music Volume */}
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] text-neutral-300">
              <span>MÚSICA (CHIPTUNE)</span>
              <span>{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={(e) => handleMusicChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* SFX Volume */}
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] text-neutral-300">
              <span>EFEITOS SONOROS (SFX)</span>
              <span>{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={(e) => handleSfxChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* CRT Scanline Toggle */}
          <div className="flex items-center justify-between text-[8px] pt-2 border-t border-neutral-800">
            <div className="flex items-center gap-2 text-neutral-300">
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              <span>SCANLINES RETRO CRT</span>
            </div>
            <button
              onClick={() => {
                soundEngine.playMenuBeep();
                onUpdateSettings({ ...settings, enableScanlines: !settings.enableScanlines });
              }}
              className={`px-3 py-1 rounded border cursor-pointer ${
                settings.enableScanlines
                  ? 'bg-amber-600 border-amber-400 text-black font-bold'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400'
              }`}
            >
              {settings.enableScanlines ? 'LIGADO' : 'DESLIGADO'}
            </button>
          </div>
        </div>

        {/* MATCH RULES SETTINGS */}
        <div className="bg-neutral-900/90 border border-neutral-700 p-4 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold border-b border-neutral-800 pb-1.5">
            <Trophy className="w-4 h-4" />
            <span>REGRAS DA PARTIDA</span>
          </div>

          {/* Rounds to Win */}
          <div className="flex items-center justify-between text-[8px]">
            <span className="text-neutral-300">ROUNDS PARA VENCER</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    soundEngine.playMenuBeep();
                    onUpdateSettings({ ...settings, roundsToWin: r });
                  }}
                  className={`px-2.5 py-1 rounded border cursor-pointer ${
                    settings.roundsToWin === r
                      ? 'bg-amber-500 border-amber-300 text-black font-bold'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                  }`}
                >
                  {r === 1 ? '1 RD' : r === 2 ? 'MELHOR DE 3' : 'MELHOR DE 5'}
                </button>
              ))}
            </div>
          </div>

          {/* Timer per Round */}
          <div className="flex items-center justify-between text-[8px]">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>TEMPO POR ROUND</span>
            </div>
            <div className="flex gap-1">
              {[60, 99, 0].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    soundEngine.playMenuBeep();
                    onUpdateSettings({ ...settings, roundTimer: t });
                  }}
                  className={`px-2.5 py-1 rounded border cursor-pointer ${
                    settings.roundTimer === t
                      ? 'bg-amber-500 border-amber-300 text-black font-bold'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                  }`}
                >
                  {t === 0 ? 'INFINITO' : `${t}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Hitbox visualizer toggle */}
          <div className="flex items-center justify-between text-[8px] pt-2 border-t border-neutral-800">
            <span className="text-neutral-300">CAIXAS DE COLISÃO (DEBUG)</span>
            <button
              onClick={() => {
                soundEngine.playMenuBeep();
                onUpdateSettings({ ...settings, showHitboxes: !settings.showHitboxes });
              }}
              className={`px-3 py-1 rounded border cursor-pointer ${
                settings.showHitboxes
                  ? 'bg-red-600 border-red-400 text-white font-bold'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400'
              }`}
            >
              {settings.showHitboxes ? 'EXIBIR' : 'OCULTAR'}
            </button>
          </div>
        </div>

        {/* CONTROLS CHEAT SHEET (SECTION 5 OF DOCUMENT) */}
        <div className="col-span-1 md:col-span-2 bg-neutral-900/90 border border-neutral-700 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold border-b border-neutral-800 pb-2 mb-3">
            <Keyboard className="w-4 h-4" />
            <span>MAPA DE CONTROLES DO TECLADO</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[8px]">
            {/* Player 1 Controls */}
            <div className="bg-neutral-950/60 p-3 rounded border border-red-900/40">
              <h3 className="text-red-400 font-bold mb-2 flex items-center gap-1">
                <span>🔴 JOGADOR 1</span>
              </h3>
              <ul className="space-y-1.5 text-neutral-300">
                <li className="flex justify-between"><span>Mover / Pular / Agachar:</span> <strong className="text-white">W / A / S / D</strong></li>
                <li className="flex justify-between"><span>Soco:</span> <strong className="text-yellow-400">J</strong></li>
                <li className="flex justify-between"><span>Chute:</span> <strong className="text-cyan-400">K</strong></li>
                <li className="flex justify-between"><span>Ataque Forte:</span> <strong className="text-amber-400">O</strong></li>
                <li className="flex justify-between"><span>Especial 1 & 2:</span> <strong className="text-purple-400">L ou ↓ → + L</strong></li>
                <li className="flex justify-between"><span>Agarrão (Grab):</span> <strong className="text-emerald-400">U</strong></li>
                <li className="flex justify-between"><span>Defesa (Block):</span> <strong className="text-neutral-400">I ou Segurar Trás</strong></li>
                <li className="flex justify-between"><span>Contra (Parry):</span> <strong className="text-amber-300">Defesa no instante exato</strong></li>
                <li className="flex justify-between"><span>Técnica de Energia (Super):</span> <strong className="text-red-400">ESPAÇO (100% Barra)</strong></li>
              </ul>
            </div>

            {/* Player 2 Controls (Local 2P) */}
            <div className="bg-neutral-950/60 p-3 rounded border border-blue-900/40">
              <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-1">
                <span>🔵 JOGADOR 2 (MODO LOCAL)</span>
              </h3>
              <ul className="space-y-1.5 text-neutral-300">
                <li className="flex justify-between"><span>Mover / Pular / Agachar:</span> <strong className="text-white">SETAS DIRECIONAIS</strong></li>
                <li className="flex justify-between"><span>Soco:</span> <strong className="text-yellow-400">NUMPAD 1 (ou 7)</strong></li>
                <li className="flex justify-between"><span>Chute:</span> <strong className="text-cyan-400">NUMPAD 2 (ou 8)</strong></li>
                <li className="flex justify-between"><span>Ataque Forte:</span> <strong className="text-amber-400">NUMPAD 3 (ou 9)</strong></li>
                <li className="flex justify-between"><span>Especial 1 & 2:</span> <strong className="text-purple-400">NUMPAD 5 (ou 0)</strong></li>
                <li className="flex justify-between"><span>Agarrão (Grab):</span> <strong className="text-emerald-400">NUMPAD 4 (ou P)</strong></li>
                <li className="flex justify-between"><span>Defesa (Block):</span> <strong className="text-neutral-400">NUMPAD 6 (ou [)</strong></li>
                <li className="flex justify-between"><span>Técnica de Energia (Super):</span> <strong className="text-blue-400">ENTER (100% Barra)</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center z-10">
        <button
          onClick={() => {
            soundEngine.playMenuBeep();
            onBack();
          }}
          className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded text-xs text-white font-bold cursor-pointer"
        >
          SALVAR & VOLTAR
        </button>
      </div>
    </div>
  );
};
