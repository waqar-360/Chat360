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

import { IsOptional, IsUUID } from 'class-validator';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsUUID()
  toUserId: string;
}

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  chatId: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}

export class MessageSeenDto {
  @IsNotEmpty()
  @IsInt()
  readonly messageId: number;
}

export class ChatListDto {
  @IsOptional()
  @IsString()
  userName: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  pageSize?: number;
}

export class connectedUser {
  uuid: string;

  userName: string;

  email: string;
}
