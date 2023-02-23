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

import { RegisterPayload } from '../../modules/auth';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ length: 255 })
  userName: string;

  @Column({ length: 255 })
  email: string;

  @Column({
    name: `password`,
    length: 255,
  })
  password: string;

  toJSON() {
    const { password, ...self } = this;
    return self;
  }

  toDto() {
    const { password, ...dto } = this;
    return dto;
  }

  fromDto(payload: RegisterPayload): User {
    this.userName = payload.userName;
    this.email = payload.email.toLowerCase();
    this.password = payload.password;

    return this;
  }
}

export class UserFillableFields {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
