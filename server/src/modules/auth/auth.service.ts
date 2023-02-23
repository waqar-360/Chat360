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

import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseCode, ResponseMessage } from '../../utils/enum';
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
    private readonly cacheService: CacheManagerService,
    private readonly chatGateWayService: ChatGateway,
  ) {}

  /**
   * create token for user
   * @param user 
   * @param expiryTime 
   * @param subject 
   * @returns Object
   */
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

  /**
   * validate User login request
   * @param payload 
   * @returns Http Exception || User
   */
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

  /**
   * Get User By Id
   * @param userId 
   * @returns Object<User>
   */
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
      return;
    } else {
      throw new HttpException(
        ResponseMessage.EMAIL_NOT_REGISTERED,
        ResponseCode.NOT_FOUND,
      );
    }
  }

  /**
   * Verify password Expiry Link
   * @param email 
   * @param token 
   * @returns void || Exception
   */
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
   * logout current user
   * @param user 
   * @returns void
   */
  public async logout(user: User) {
    this.cacheService.del(user.uuid);
    this.chatGateWayService.disconnectUser(user);
    return;
  }
}
