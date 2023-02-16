import { ApiHttpService } from './api-http.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../commons/type';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private apiHttpService: ApiHttpService,
    private authService: AuthService,
    private router: Router,
  ) {}

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  createIfNotExist(from, to) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    };
    return this.apiHttpService.post(
      environment.CHAT_BACKEND_URL + '/chat',
      { toUserId: to.uuid },
      httpOptions,
    );
  }

  getChatbyId(id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    };
    return this.apiHttpService.get(
      environment.CHAT_BACKEND_URL + `/chat/${id}`,
      httpOptions,
    );
  }
}
