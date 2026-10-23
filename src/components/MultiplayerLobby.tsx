/**
 * KUARAHY — LAN / Wi-Fi Multiplayer Lobby
 * Host room creation, room code joining, ping indicator, and match start.
 */
import React, { useState, useEffect } from 'react';
import { multiplayerManager, NetworkMessage } from '../network/MultiplayerManager';
import { soundEngine } from '../audio/SoundEngine';
import { ArrowLeft, Wifi, Users, Play, Copy, Check } from 'lucide-react';

interface MultiplayerLobbyProps {
  onStartLanMatch: () => void;
  onBack: () => void;
}

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({
  onStartLanMatch,
  onBack,
}) => {
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [roomCode, setRoomCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [ping, setPing] = useState<number>(0);

  useEffect(() => {
    // Generate initial host room code
    const code = multiplayerManager.createRoom();
    setRoomCode(code);

    const handleMsg = (msg: NetworkMessage) => {
      if (msg.type === 'join' || msg.type === 'joined') {
        setIsConnected(true);
        soundEngine.playSelectConfirm();
      } else if (msg.type === 'pong') {
        setPing(multiplayerManager.pingMs);
      }
    };

    multiplayerManager.onMessage(handleMsg);

    const interval = setInterval(() => {
      setIsConnected(multiplayerManager.peerConnected);
      setPing(multiplayerManager.pingMs);
    }, 1000);

    return () => {
      clearInterval(interval);
      multiplayerManager.removeListener(handleMsg);
    };
  }, []);

  const handleJoin = () => {
    if (!inputCode.trim()) return;
    soundEngine.playMenuBeep();
    multiplayerManager.joinRoom(inputCode);
    setRoomCode(inputCode.toUpperCase());
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 md:p-6 overflow-hidden select-none font-pixel bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between z-10 border-b border-neutral-800 pb-3">
        <button
          onClick={() => {
            soundEngine.playMenuBeep();
            multiplayerManager.disconnect();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded text-[9px] text-neutral-300 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>VOLTAR AO MENU</span>
        </button>

        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-emerald-400" />
          <h1 className="text-base md:text-xl font-bold tracking-widest text-amber-400 text-glow-gold">
            1V1 LAN / WI-FI
          </h1>
        </div>

        <div className="w-20" />
      </div>

      {/* CENTER CONTENT */}
      <div className="max-w-md mx-auto w-full bg-neutral-900/90 border-2 border-neutral-700 p-6 rounded-xl shadow-2xl z-10 flex flex-col items-center">
        {/* TABS: CRIAR SALA / ENTRAR NA SALA */}
        <div className="grid grid-cols-2 gap-2 w-full mb-6">
          <button
            onClick={() => {
              soundEngine.playMenuBeep();
              setTab('create');
              const code = multiplayerManager.createRoom();
              setRoomCode(code);
            }}
            className={`py-2 text-[9px] font-bold rounded border cursor-pointer ${
              tab === 'create'
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400'
            }`}
          >
            CRIAR SALA (HOST)
          </button>

          <button
            onClick={() => {
              soundEngine.playMenuBeep();
              setTab('join');
            }}
            className={`py-2 text-[9px] font-bold rounded border cursor-pointer ${
              tab === 'join'
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400'
            }`}
          >
            ENTRAR NA SALA (CLIENTE)
          </button>
        </div>

        {tab === 'create' ? (
          <div className="flex flex-col items-center text-center w-full">
            <span className="text-[9px] text-neutral-400 mb-2">
              COMPARTILHE ESTE CÓDIGO COM O JOGADOR 2 NA MESMA REDE:
            </span>

            {/* BIG ROOM CODE DISPLAY */}
            <div className="flex items-center gap-2 my-2">
              <div className="px-6 py-3 bg-black border-2 border-amber-400 rounded-lg text-2xl md:text-3xl font-black text-amber-400 tracking-widest text-glow-gold">
                {roomCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="p-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-lg text-neutral-300 cursor-pointer"
                title="Copiar Código"
              >
                {isCopied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-[8px] text-neutral-400 mt-2">
              Abra o KUARAHY em outro celular, tablet ou aba e digite este código.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center w-full">
            <span className="text-[9px] text-neutral-400 mb-2">
              DIGITE O CÓDIGO DE 4 LETRAS DA SALA:
            </span>

            <div className="flex gap-2 my-2 w-full">
              <input
                type="text"
                maxLength={4}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="EX: ASUN"
                className="flex-1 px-4 py-2.5 bg-black border-2 border-neutral-700 focus:border-amber-400 rounded-lg text-center text-xl font-black tracking-widest text-amber-400 uppercase outline-none"
              />
              <button
                onClick={handleJoin}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-[9px] rounded-lg cursor-pointer"
              >
                CONECTAR
              </button>
            </div>
          </div>
        )}

        {/* CONNECTION STATUS BADGE */}
        <div className="w-full mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-[8px]">
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 animate-pulse'
              }`}
            />
            <span className={isConnected ? 'text-emerald-400' : 'text-neutral-400'}>
              {isConnected ? 'JOGADOR 2 CONECTADO!' : 'AGUARDANDO CONEXÃO...'}
            </span>
          </div>

          {isConnected && (
            <span className="text-neutral-400 font-mono">
              PING: <strong className="text-emerald-400">{ping || '<1'}ms</strong>
            </span>
          )}
        </div>
      </div>

      {/* START LAN MATCH BUTTON */}
      <div className="flex justify-center z-10">
        <button
          onClick={() => {
            soundEngine.playSelectConfirm();
            onStartLanMatch();
          }}
          className={`px-8 py-3.5 rounded-lg border-2 font-black text-sm flex items-center gap-2 cursor-pointer transition-all ${
            isConnected
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-300 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] transform hover:scale-105'
              : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>INICIAR PARTIDA LAN</span>
        </button>
      </div>
    </div>
  );
};
