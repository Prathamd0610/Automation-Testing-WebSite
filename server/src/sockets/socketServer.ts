import type { Server as HttpServer } from 'node:http';
import { Server as SocketServer, type Socket } from 'socket.io';
import { env } from '../config/env';
import { logger } from '../config/logger';

let io: SocketServer | null = null;

let onlineCount = 0;

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

export interface LiveNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

/** Boots the Socket.IO server and wires the practice real-time channels. */
export function initializeSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: { origin: env.FRONTEND_URL, credentials: true },
    path: '/socket.io',
  });

  io.on('connection', (socket: Socket) => {
    onlineCount += 1;
    logger.debug(`Socket connected: ${socket.id} (online: ${onlineCount})`);
    io?.emit('presence:count', { online: onlineCount });

    socket.emit('connection:ack', { id: socket.id, message: 'Connected to live server' });

    // Chat: echo messages to every connected client.
    socket.on('chat:send', (payload: { user: string; text: string }) => {
      const message: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        user: payload.user || 'Anonymous',
        text: String(payload.text ?? '').slice(0, 500),
        timestamp: new Date().toISOString(),
      };
      io?.emit('chat:message', message);
    });

    // Subscribe to a periodic server-pushed counter for live-update practice.
    socket.on('counter:subscribe', () => {
      let value = 0;
      const interval = setInterval(() => {
        value += 1;
        socket.emit('counter:tick', { value, timestamp: new Date().toISOString() });
      }, 1000);
      socket.on('counter:unsubscribe', () => clearInterval(interval));
      socket.on('disconnect', () => clearInterval(interval));
    });

    socket.on('disconnect', () => {
      onlineCount = Math.max(0, onlineCount - 1);
      io?.emit('presence:count', { online: onlineCount });
      logger.debug(`Socket disconnected: ${socket.id} (online: ${onlineCount})`);
    });
  });

  return io;
}

/** Broadcasts a notification to all connected clients. */
export function broadcastNotification(notification: LiveNotification): void {
  io?.emit('notification:new', notification);
}

export function getSocketServer(): SocketServer | null {
  return io;
}
