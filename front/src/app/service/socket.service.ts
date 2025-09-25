import { Inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService<T> {
  private socket: Socket;

  constructor(@Inject(String) url: string) {
    this.socket = io(url);
  }

  send(message: T): void {
    this.socket.emit('message', message);
  }

  onMessage(callback: (message: T) => void): void {
    this.socket.on('message', callback);
  }

  onInit(callback: (data: T[]) => void): void {
    this.socket.on('init', callback);
  }

  onUpdate(callback: (data: T[]) => void): void {
    this.socket.on('update', callback);
  }

  onDelete(): void {
    this.socket.emit('delete');
  }
}
