import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user';
import { Repository } from 'typeorm';
import { IPaginationOptions } from '../../utils/pagination';
import { Chat } from './chat.entity';
import {
  ChatListDto,
  CreateChatDto,
  CreateMessageDto,
  MessageSeenDto,
} from './commons/chat.dto';
import { Message } from './message.entity';
import * as moment from 'moment';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   *
   * @param createChatDTO
   * @param fromId
   * @returns
   */
  async createChat(createChatDTO: CreateChatDto, fromId) {
    const exists = await this.chatRepository.findOne({
      where: [
        {
          from: {
            uuid: createChatDTO.toUserId,
          },
          to: {
            uuid: fromId,
          },
        },
        {
          from: {
            uuid: fromId,
          },
          to: {
            uuid: createChatDTO.toUserId,
          },
        },
      ],
    });
    if (exists) return exists;

    let chat = new Chat();
    chat.from = await this.userRepository.findOneBy({ uuid: fromId });
    chat.to = await this.userRepository.findOneBy({
      uuid: createChatDTO.toUserId,
    });

    return await this.chatRepository.save(chat);
  }

  /**
   *
   * @param userId
   * @returns
   */
  public async getChatList(
    userId: string,
    query: ChatListDto,
    pagination: IPaginationOptions,
  ) {
    const search = query.userName
      ? ` AND U."userName" ILIKE '%${query.userName}%'`
      : '';
    let sql = `SELECT 
                UC.id,
                UC.user,
                UC.text,
                UC."unreadCount" :: INTEGER,
                UC."createdAt",
                U."userName",
                P."profilePicture"
            FROM
                (SELECT 
                    C.id,
                    CASE 
                       WHEN C."toUserId"='${userId}' THEN C."fromUserId"
                       WHEN C."fromUserId"='${userId}' THEN C."toUserId"
                    END AS user,
                    UM.text,
                    UM."createdAt",
                    (SELECT count(CASE WHEN isdelivered THEN 1 END) FROM "Message" WHERE "chatId"=C.id)
                    AS "unreadCount"
                FROM 
                    "Chat" C
                    INNER JOIN(SELECT 
                            M.id, M.text, M."createdAt", M."chatId"
                     FROM 
                       "Message"  M
                     WHERE 
                         "createdAt" IN (SELECT MAX("createdAt") FROM "Message" M GROUP BY M."chatId")
            ) AS UM ON C.id = UM."chatId"
            WHERE 
                C."toUserId" = '${userId}' 
                OR 
                C."fromUserId"='${userId}'
            ) AS UC
            INNER JOIN "User" U ON U.id = UC.user
            LEFT JOIN "Profile" P ON U.id = P."userId" 
            WHERE 1=1 ${search}
            ORDER BY UC."createdAt" DESC
            `;
    let paginatedSql =
      sql +
      ` LIMIT ${pagination.limit} OFFSET ${
        pagination.limit * (pagination.page - 1)
      }`;
    let totalSql = `SELECT 
                    COUNT(*) :: INTEGER
                FROM
                   (${sql}) as chats`;

    const chats = await this.chatRepository.query(paginatedSql);
    const totalCount = await this.chatRepository.query(totalSql);

    return { chats, totalCount: totalCount[0].count };
  }

  /**
   *
   * @param chatId
   * @param from
   * @param pagination
   * @returns
   */
  public async getConversation(
    chatId: string,
    from: string,
    pagination: IPaginationOptions,
  ) {
    const chat = await this.getChatById(chatId);
    return chat;
  }

  /**
   *
   * @param id
   * @returns
   */
  public async getChatById(id: string) {
    return await this.chatRepository.findOne({
      where: {
        uuid: id,
      },
      relations: ['from', 'to', 'message', 'message.sender'],
    });
  }

  /**
   *
   * @param id
   * @returns
   */
  public async getMessageById(id: number) {
    return await this.messageRepository.findOneBy({
      id,
    });
  }

  /**
   *
   * @param createMessageDto
   * @param senderId
   * @returns
   */
  public async createMessage(
    createMessageDto: CreateMessageDto,
    senderId: string,
  ) {
    let message = new Message();
    message.text = createMessageDto.text;
    message.isdelivered = true;
    message.createdAt = moment().unix();
    message.sender = await this.userRepository.findOneBy({ uuid: senderId });
    message.chat = await this.chatRepository.findOneBy({
      uuid: createMessageDto.chatId,
    });

    return await this.messageRepository.save(message);
  }
}
