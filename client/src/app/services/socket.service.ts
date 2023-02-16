import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ChatComponent } from '../chat/chat.component';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket;

  constructor() {}
  // emit event
  setUpSocketConnection() {
    let token = localStorage.getItem('token');
    if (token) {
      const socketOptions = {
        reconnection: true,

        extraHeaders: {
          Authorization: `Bearer ` + token.replace(/"/g, ''),
        },
      };

      this.socket = io('http://localhost:3836', socketOptions);
    }
  }
}
