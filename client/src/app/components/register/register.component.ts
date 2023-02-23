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
/** Angular imports */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/** Service imports */
import { AuthService } from '../../services/auth.service';

/** Type imports */
import { User } from '../../commons/type';
import { constants } from 'src/app/commons/constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  user: User = {};
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  /**
   * Signup user
   * @returns void
   */
  signUp() {
    this.authService.signUpUser(this.user).subscribe(
      (res) => {
        this.router.navigate([constants.LOGIN]);
      },
      (err) => console.log(err),
    );
  }
}
