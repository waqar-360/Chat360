import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseCode, ResponseMessage } from '../../utils/enum';
import { MailService } from '../../utils/mailer/mail.service';
import { RegisterPayload } from '.';
import { Hash } from '../../utils/Hash';
import { User, UsersService } from './../user';
import { LoginPayload } from './login.payload';
import { CacheManagerService } from './../cache-manager/cache-manager.service';
import { ChatGateway } from '../chat/chat.gateway';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly mailerservice: MailService,
    private readonly cacheService: CacheManagerService,
    private readonly chatGateWayService: ChatGateway,
  ) {}

  async createToken(
    user: User,
    expiryTime?: number | string,
    subject?: string,
  ) {
    const token = this.jwtService.sign(
      { uuid: user.uuid },
      {
        subject: subject ? process.env.JWT_SECRET_KEY + user.password : '',
        expiresIn: expiryTime ? expiryTime : process.env.JWT_EXPIRATION_TIME,
      },
    );
    await this.cacheService.set(user.uuid, token, {
      ttl: expiryTime ? expiryTime : process.env.JWT_EXPIRATION_TIME,
    });
    return {
      expiresAt: moment(
        moment.now() + Number(process.env.JWT_EXPIRATION_TIME),
      ).unix(),
      accessToken: token,
      user,
    };
  }

  /**
   * Register a genesis user
   * @param payload
   * @returns
   */
  public async register(payload: RegisterPayload): Promise<User> {
    return new Promise<User>(async (resolve, reject) => {
      await this.userService
        .register(payload)
        .then(async (user: User) => {
          await this.createToken(user);
          return resolve(user);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async validateUser(payload: LoginPayload): Promise<any> {
    const user = await this.userService.getByEmail(payload.email.toLowerCase());
    if (!user) {
      throw new HttpException(
        ResponseMessage.INVALID_USERNAME_OR_PASSWORD,
        ResponseCode.BAD_REQUEST,
      );
    }
    const isValidPassword = await Hash.compare(payload.password, user.password);
    if (!isValidPassword) {
      throw new HttpException(
        ResponseMessage.INVALID_USERNAME_OR_PASSWORD,
        ResponseCode.BAD_REQUEST,
      );
    }
    return user;
  }

  async getUserById(userId: string) {
    return this.userService.get(userId);
  }

  /**
   * Send Password Recovery Link To User Email
   * @param email
   * @returns
   */
  public async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.getByEmail(email);
    if (user) {
      const token = await this.createToken(
        user,
        process.env.JWT_TIME_FORGOT_PASSWORD,
        user.password,
      );
      await this.mailerservice.sendForgotPasswordMail(
        user.email,
        token.accessToken,
      );
      return;
    } else {
      throw new HttpException(
        ResponseMessage.EMAIL_NOT_REGISTERED,
        ResponseCode.NOT_FOUND,
      );
    }
  }

  async checkPasswordLinkExpiry(email: string, token: string) {
    try {
      const user = await this.userService.getByEmail(email);
      const subject = process.env.JWT_SECRET_KEY + user.password;
      this.jwtService.verify(token, { subject });
      return;
    } catch (err) {
      throw new HttpException(
        ResponseMessage.RESET_PASSWORD_LINK_EXPIRED,
        ResponseCode.NOT_FOUND,
      );
    }
  }

  /**
   * Confirm the forgot password and update
   * @param email
   * @param password
   * @returns
   */
  public async confirmForgotPassword(email: string, password: string) {
    await this.userService.confirmForgotPassword(email, password);
    return;
  }

  /**
   *
   */
  public async logout(user: User) {
    this.cacheService.del(user.uuid);
    this.chatGateWayService.disconnectUser(user);
    return;
  }
}
