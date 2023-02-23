/*
 Copyright (c) 2023, Xgrid Inc, http://xgrid.co

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

//Angular imports
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

// Constant imports
import { environment } from 'src/environments/environment';
import { constants } from '../commons/constants';

/** Service imports */
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket;

  constructor(
    private storageService: StorageService
  ) {}
  
  /**
   * Set up socket Connection with server
   * @returns void 
   */
  setUpSocketConnection() {
    let token = this.storageService.get(constants.TOKEN);
    if (token) {
      const socketOptions = {
        reconnection: true,

        extraHeaders: {
          Authorization: `Bearer ` + token.replace(/"/g, ''),
        },
      };

      this.socket = io(`${environment.CHAT_WEBSOCKET_URL}`, socketOptions);
    }
  }
}
