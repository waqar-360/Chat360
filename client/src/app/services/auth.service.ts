import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiHttpService } from './api-http.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiHttpService: ApiHttpService, private router: Router) {}

  signUpUser(user) {
    return this.apiHttpService.post(
      environment.CHAT_BACKEND_URL + '/auth/register',
      user,
    );
  }

  signInUser(user) {
    return this.apiHttpService.post(
      environment.CHAT_BACKEND_URL + '/auth/login',
      user,
    );
  }

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

  loggedIn() {
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expiresAt');
    return token && Number(expiresAt) > moment().unix() ? true : false;
  }

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
          console.log(res);
          this.router.navigate(['/login']);
        },
        (err) => console.log(err),
      );
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
