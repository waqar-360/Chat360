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

// Angular component imports
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Types import
import { User } from 'src/app/commons/type';

// Services import
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service'

// Npm imports
import Swal from 'sweetalert2';
import { constants } from 'src/app/commons/constants';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
})
export class LogInComponent implements OnInit {
  public user: User = {};
  constructor(private authService: AuthService,
    private storageService: StorageService,
    private router: Router) { }

  ngOnInit(): void { }

  /**
   * Signin user
   * @returns void 
   */
  signIn() {
    this.authService.signInUser(this.user).subscribe(
      (res) => {
        this.storageService.set(constants.TOKEN, res['accessToken']);
        this.storageService.set(
          constants.EXPIRE_AT,
          JSON.stringify(res['expiresAt'].valueOf()),
        );
        this.router.navigate([constants.CHATS]);
      },
      (err) => {
        if (err.status === 400) {
          this.showErrorAlert();
        }
      },
    );
  }

  showErrorAlert() {
    Swal.fire('Oops!', 'Invalid email or password!', 'error');
  }
}
