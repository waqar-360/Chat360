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
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

//Service import
import { ApiHttpService } from './api-http.service';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

// Third party imports 
import * as moment from 'moment';
import { constants } from '../commons/constants';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiHttpService: ApiHttpService,
    private storageService: StorageService,
    private router: Router) { }

  /**
   * Signup user
   * @param user 
   * @returns HTTP Response Object
   */
  signUpUser(user) {
    return this.apiHttpService.post(
      environment.CHAT_BACKEND_URL + '/auth/register',
      user,
    );
  }

  /**
   * Signin user
   * @param user 
   * @returns HTTP Response Object
   */
  signInUser(user) {
    return this.apiHttpService.post(
      environment.CHAT_BACKEND_URL + '/auth/login',
      user,
    );
  }

  /**
   * Get Current User
   * @returns HTTP Response Object
   */
  getCurrentUser() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
      }),
    };

    return this.apiHttpService.get(
      environment.CHAT_BACKEND_URL + '/auth/me',
      httpOptions,
    );
  }

  /**
   * Validate loggedIn status
   * @returns boolean
   */
  loggedIn() {
    const token = this.storageService.get(constants.TOKEN);
    const expiresAt = this.storageService.get(constants.EXPIRE_AT);
    return token && Number(expiresAt) > moment().unix() ? true : false;
  }

  /**
   * Log out current user
   * @returns void
   */
  async logout() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
      }),
    };

    await this.apiHttpService
      .post(environment.CHAT_BACKEND_URL + '/auth/logout', null, httpOptions)
      .subscribe(
        (res) => {
          this.router.navigate([constants.LOGIN]);
        },
        (err) => console.log(err),
      );
    this.storageService.remove(constants.TOKEN);
    this.storageService.remove(constants.EXPIRE_AT);
  }

  /**
   * Get token 
   * @returns  string
   */
  getToken() {
    return this.storageService.get(constants.TOKEN);
  }
}
