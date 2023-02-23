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
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { constants } from './commons/constants';

// Service imports
import { AuthService } from './services/auth.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'chat360';
  constructor(
    public authService: AuthService,
    private router: Router,
    private socketService: SocketService,
  ) {}

  ngOnInit() {
    this.authService.loggedIn()
      ? this.router.navigate([constants.CHATS])
      : this.router.navigate([constants.LOGIN]);
  }
}
