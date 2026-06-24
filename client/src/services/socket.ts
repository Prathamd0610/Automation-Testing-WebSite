import { io, type Socket } from 'socket.io-client';
import { apiOrigin } from '@/lib/env';

let socket: Socket | null = null;

/**
 * Returns a lazily-created singleton Socket.IO client pointed at the API origin
 * (the API base URL minus its `/api` suffix). Connection is manual so pages can
 * control the lifecycle explicitly.
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(apiOrigin, {
      withCredentials: true,
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}
