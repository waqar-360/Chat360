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
