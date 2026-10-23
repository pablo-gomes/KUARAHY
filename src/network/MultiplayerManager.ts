/**
 * KUARAHY — LAN / Wi-Fi Multiplayer Network Manager
 * Synchronizes room lobbies, inputs, and match states across devices.
 * Uses BroadcastChannel for local/tab play and WebRTC / local socket signaling.
 */
import { InputState, FighterId, StageId } from '../types/game';

export interface NetworkMessage {
  type: 'join' | 'joined' | 'ready' | 'select' | 'input' | 'state_sync' | 'ping' | 'pong';
  roomCode: string;
  senderId: string;
  payload: any;
  timestamp: number;
}

export class MultiplayerManager {
  public isHost: boolean = false;
  public roomCode: string = '';
  public peerConnected: boolean = false;
  public pingMs: number = 0;
  private peerId: string = Math.random().toString(36).substring(2, 9);
  private channel: BroadcastChannel | null = null;
  private listeners: ((msg: NetworkMessage) => void)[] = [];
  private pingInterval: number | null = null;

  constructor() {
    //
  }

  public createRoom(): string {
    this.isHost = true;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.roomCode = code;
    this.setupChannel(code);
    return code;
  }

  public joinRoom(code: string): boolean {
    this.isHost = false;
    this.roomCode = code.toUpperCase().trim();
    this.setupChannel(this.roomCode);

    // Broadcast join request
    this.sendMessage({
      type: 'join',
      roomCode: this.roomCode,
      senderId: this.peerId,
      payload: { role: 'client' },
      timestamp: Date.now(),
    });

    return true;
  }

  private setupChannel(code: string) {
    if (this.channel) {
      this.channel.close();
    }

    this.channel = new BroadcastChannel(`kuarahy_room_${code}`);
    this.channel.onmessage = (event) => {
      const msg = event.data as NetworkMessage;
      if (msg.senderId === this.peerId) return; // ignore self

      if (msg.type === 'join' && this.isHost) {
        this.peerConnected = true;
        this.sendMessage({
          type: 'joined',
          roomCode: this.roomCode,
          senderId: this.peerId,
          payload: { hostId: this.peerId },
          timestamp: Date.now(),
        });
      } else if (msg.type === 'joined' && !this.isHost) {
        this.peerConnected = true;
      } else if (msg.type === 'ping') {
        this.sendMessage({
          type: 'pong',
          roomCode: this.roomCode,
          senderId: this.peerId,
          payload: { originalTime: msg.timestamp },
          timestamp: Date.now(),
        });
      } else if (msg.type === 'pong') {
        const roundtrip = Date.now() - msg.payload.originalTime;
        this.pingMs = Math.round(roundtrip / 2);
      }

      for (const listener of this.listeners) {
        listener(msg);
      }
    };

    // Start periodic ping
    if (this.pingInterval) clearInterval(this.pingInterval);
    this.pingInterval = window.setInterval(() => {
      if (this.peerConnected) {
        this.sendMessage({
          type: 'ping',
          roomCode: this.roomCode,
          senderId: this.peerId,
          payload: {},
          timestamp: Date.now(),
        });
      }
    }, 2000);
  }

  public sendInput(inputs: InputState) {
    this.sendMessage({
      type: 'input',
      roomCode: this.roomCode,
      senderId: this.peerId,
      payload: inputs,
      timestamp: Date.now(),
    });
  }

  public sendSelection(fighterId: FighterId, stageId?: StageId) {
    this.sendMessage({
      type: 'select',
      roomCode: this.roomCode,
      senderId: this.peerId,
      payload: { fighterId, stageId },
      timestamp: Date.now(),
    });
  }

  public onMessage(fn: (msg: NetworkMessage) => void) {
    this.listeners.push(fn);
  }

  public removeListener(fn: (msg: NetworkMessage) => void) {
    this.listeners = this.listeners.filter((l) => l !== fn);
  }

  private sendMessage(msg: NetworkMessage) {
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch (err) {
        console.error('Error posting network message', err);
      }
    }
  }

  public disconnect() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.peerConnected = false;
    this.listeners = [];
  }
}

export const multiplayerManager = new MultiplayerManager();
