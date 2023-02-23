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

import { BadRequestException, Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'ws';
import { CacheManagerService } from '../cache-manager/cache-manager.service';
import { ChatService } from './chat.service';
import {
  connectedUser,
  CreateMessageDto,
  MessageSeenDto,
} from './commons/chat.dto';
import { JwtService } from '@nestjs/jwt';
import { User, UsersService } from '../user';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  private connectedUsers: connectedUser[] = [];

  constructor(
    private readonly chatService: ChatService,
    private readonly cacheService: CacheManagerService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  @SubscribeMessage('messageToServer')
  public async handleMessage(
    client: Socket,
    payload: CreateMessageDto,
  ): Promise<WsResponse<any>> {
    let user: User;
    const token = client.handshake.headers.authorization.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token);

      user = await this.userService.get(payload.uuid);
      !user && client.disconnect();
    } catch (err) {
      return;
    }

    const chat = await this.chatService.getChatById(payload.chatId);
    const message = await this.chatService.createMessage(payload, user.uuid);
    const [from, to] = await Promise.all([
      this.cacheService.get(chat.from.uuid),
      this.cacheService.get(chat.to.uuid),
    ]);

    if (from === to) {
      this.server.emit(from, message);
    } else {
      this.server.emit(from, message);
      return this.server.emit(to, message);
    }
  }

  /**
   *
   * @param client
   * @returns
   */
  public async handleDisconnect(client: Socket) {
    let user: User;
    const token = client.handshake.headers.authorization.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token);

      user = await this.userService.get(payload.uuid);
      if (!user && client.disconnect()) return;
    } catch (err) {
      return;
    }
    const userPos = this.connectedUsers.map((m) => m.uuid).indexOf(user.uuid);
    this.logger.log(`Client disconnected: ${client.id}`);
    if (userPos > -1) {
      this.connectedUsers.splice(userPos, 1);
    }
    this.server.emit('users', this.connectedUsers);
  }

  /**
   *
   */
  disconnectUser(user: User) {
    const userPos = this.connectedUsers.map((m) => m.uuid).indexOf(user.uuid);
    if (userPos > -1) {
      this.connectedUsers.splice(userPos, 1);
    }
    this.server.emit('users', this.connectedUsers);
  }

  /**
   *
   */
  public async handleConnection(client: Socket) {
    let user: User;
    const token = client.handshake.headers.authorization.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token);

      user = await this.userService.get(payload.uuid);
      if (!user && client.disconnect()) return;
    } catch (err) {
      return;
    }
    this.logger.log(`Client connected: ${client.id}`);
    const { password, ...newUser } = user;
    this.connectedUsers = [...this.connectedUsers, newUser];
    this.connectedUsers = [
      ...new Map(this.connectedUsers.map((item) => [item.uuid, item])).values(),
    ];
    this.server.emit('users', this.connectedUsers);
  }
}
