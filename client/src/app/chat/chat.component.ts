import { CommentStmt } from '@angular/compiler';
import { Component, ModuleWithComponentFactories, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../commons/type';
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
  ) {}
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

  highlight(row) {
    this.selectedRowIndex = row.uuid;
  }

  setActiveUsers(users: User[]) {
    this.onlineUsers = users;
    this.onlineUsers.length ? this.chatSelected(this.onlineUsers[0]) : '';
  }

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

  validateInput() {
    return this.newMessage.length > 0;
  }

  time(timestamp) {
    const date = new Date(timestamp * 1000);
    const normalizeDigit = (digit: number) =>
      `${digit < 10 ? '0' : ''}${digit}`;

    return `${normalizeDigit(date.getHours())}:${normalizeDigit(
      date.getMinutes(),
    )}`;
  }

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
