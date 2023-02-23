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

/**Npm imports */
import { Component, ModuleWithComponentFactories, OnInit } from '@angular/core';;

/** Types import */
import { User } from '../commons/type';

/** Service import */
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  private currentUser: User;
  isDataAvailable: boolean = false;
  currentChatId = '';
  username = '';
  messages = [];
  newMessage = '';
  onlineUsers: User[] = [];
  chatClient: any;
  selectedRowIndex = -1;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private socketService: SocketService,
  ) { }
  ngOnInit() {
    this.chatService.getCurrentUser().subscribe((res: any) => {
      this.currentUser = res;
      this.isDataAvailable = true;
    });

    this.socketService.setUpSocketConnection();
    this.socketService.socket.on('connect', () => {
      this.socketService.socket.on(this.authService.getToken(), (message) => {
        this.messages.push(message);
      });
    });

    this.socketService.socket.on('users', (users: User[]) => {
      const index = users.map((m) => m.uuid).indexOf(this.currentUser.uuid);
      users.splice(index, 1);
      this.setActiveUsers(users);
    });
    return;
  }

  /**
   * hightlight selected row
   * @param row 
   * @return void
   */
  highlight(row) {
    this.selectedRowIndex = row.uuid;
  }

  /**
   * 
   * @param users 
   * @return void
   */
  setActiveUsers(users: User[]) {
    this.onlineUsers = users;
    this.onlineUsers.length ? this.chatSelected(this.onlineUsers[0]) : '';
  }

  /**
   * Select a chat
   * @param user 
   * @returns void
   */
  chatSelected(user) {
    this.selectedRowIndex = user.uuid;
    this.chatService
      .createIfNotExist(this.currentUser, user)
      .subscribe((res: any) => {
        this.chatService.getChatbyId(res.uuid).subscribe((chat: any) => {
          this.currentChatId = chat.uuid;
          this.messages = [...chat.message];
        });
      });
  }

  /**
   * Send message
   * @returns void
   */
  sendMessage() {
    if (this.validateInput()) {
      const message = {
        text: this.newMessage,
        chatId: this.currentChatId,
      };

      this.socketService.socket.emit('messageToServer', message);
      this.newMessage = '';
    }
  }

  /**
   * validate the input message
   * @returns boolean
   */
  validateInput() {
    return this.newMessage.length > 0;
  }

  /**
   * Convert timestamp to human readable date
   * @param timestamp 
   * @returns date
   */
  time(timestamp) {
    const date = new Date(timestamp * 1000);
    const normalizeDigit = (digit: number) =>
      `${digit < 10 ? '0' : ''}${digit}`;

    return `${normalizeDigit(date.getHours())}:${normalizeDigit(
      date.getMinutes(),
    )}`;
  }

  /**
   * Get initials from string
   * @param name 
   * @returns string
   */
  initials(name) {
    let initial = '';

    if (name) {
      const first = name[0];
      const second = name[1];

      if (first) {
        initial += first;
      }

      if (second) {
        initial += second;
      }
    }
    return initial.toUpperCase();
  }
}
