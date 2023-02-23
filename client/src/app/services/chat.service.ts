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

// Angular imports
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Service imports
import { ApiHttpService } from './api-http.service';
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

  /**
   * Get current user
   * @returns Observable
   */
  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  /**
   * Create a new chat if not exist 
   * @param from 
   * @param to 
   * @returns Observable
   */
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

  /**
   * Get Chat by id
   * @param id 
   * @returns Observable
   */
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
