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

export enum ResponseMessage {
  SUCCESS = `Success`,
  CREATED_SUCCESSFULLY = `Created successfully`,
  CONTENT_NOT_FOUND = `Content not found`,

  INVALID_USERNAME_OR_PASSWORD = `Invalid email or password`,
  USER_ALREADY_EXISTS = `User with the same email already exists`,
  FORGOT_PASSWORD_EMAIL = `Please Check Your Email To Reset Password`,
  EMAIL_NOT_REGISTERED = `Email not registered`,

  INVALID_EMAIL = `Invalid email address`,
  INVALID_PASSWORD = `Invalid Password. Use 8-15 characters with a mix of letters, numbers & symbols`,
  INVALID_USERNAME = `Invalid user name`,
  INVALID_NAME = `Invalid name`,
  INVALID_COUNTRY = `Invalid country name`,
  INVALID_PHONE_NUMBER = `Invalid phone number`,
  RESET_PASSWORD_LINK_EXPIRED = `This Reset Password Link Has Been Expied`,
  USER_DOES_NOT_EXIST = `User with specified email does not exists`,
}

// some code enums for sending response code in api response
export enum ResponseCode {
  SUCCESS = 200,
  CREATED_SUCCESSFULLY = 201,
  INTERNAL_ERROR = 500,
  NOT_FOUND = 404,
  CONTENT_NOT_FOUND = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  ALREADY_EXIST = 409,
}

export enum LoggerMessages {
  API_CALLED = `Api Has Been Called.`,
}

export enum NodeEnv {
  TEST = `test`,
  DEVELOPMENT = `development`,
  PRODUCTION = `production`,
}
