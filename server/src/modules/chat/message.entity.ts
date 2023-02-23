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

import { User } from '../user';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Chat } from './chat.entity';

@Entity({
  name: 'messages',
})
export class Message {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  text: string;

  @Column({
    default: false,
  })
  isdelivered: boolean;

  @Column({
    default: false,
  })
  isseen: boolean;

  @Column()
  createdAt: number;

  @ManyToOne(() => Chat, (chat) => chat.uuid)
  chat: Chat;

  @ManyToOne(() => User, (user) => user.uuid)
  sender: User;
}
