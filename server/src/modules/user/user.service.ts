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

import {
  HttpException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hash } from '../../utils/Hash';
import { RegisterPayload } from '../auth';
import { Repository } from 'typeorm';
import { ResponseCode, ResponseMessage } from '../../utils/enum';
import { User, UserFillableFields } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  
  /**
   * Get User by Id
   * @param uuid 
   * @returns Object<User> 
   */
  async get(uuid: string) {
    return this.userRepository.findOneBy({ uuid });
  }

  /**
   * Get User by email
   * @param email 
   * @returns Object<User>
   */
  async getByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  /**
   * Create a new user
   * @param payload 
   * @returns Object<User> || Exception
   */
  async create(payload: UserFillableFields) {
    const user = await this.getByEmail(payload.email);

    if (user) {
      throw new NotAcceptableException(
        `User with provided email already created.`,
      );
    }

    return await this.userRepository.save(payload);
  }

  /**
   * Create a genesis user
   * @param payload
   * @returns
   */
  async register(payload: RegisterPayload): Promise<User> {
    const user = await this.getByEmail(payload.email);
    if (user) {
      throw new HttpException(
        ResponseMessage.USER_ALREADY_EXISTS,
        ResponseCode.BAD_REQUEST,
      );
    }
    const newUser = new User().fromDto(payload);
    newUser.password = await Hash.make(newUser.password);
    return await this.userRepository.save(newUser);
  }

  /**
   * Forget password confirmation
   * @param email
   * @param password
   * @returns
   */
  public async confirmForgotPassword(email: string, password: string) {
    const user: User = await this.userRepository.findOneBy({ email });
    if (user) {
      const passwordHash = await Hash.make(password);
      await this.userRepository.update({ email }, { password: passwordHash });
      return user;
    } else {
      throw new HttpException(
        ResponseMessage.USER_DOES_NOT_EXIST,
        ResponseCode.NOT_FOUND,
      );
    }
  }
}
