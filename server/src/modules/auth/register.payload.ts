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

import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { ResponseMessage } from '../../utils/enum';

export class RegisterPayload {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-/_~]{3,26}$/, {
    message: ResponseMessage.INVALID_USERNAME,
  })
  @Matches(/^(?!.*[$&+,:;=?@#|'<>.^*()%!-/_~]{2}).*$/, {
    message: ResponseMessage.INVALID_USERNAME,
  })
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  @Matches(
    /^[a-zA-Z]+[a-zA-Z0-9_.-]*[a-zA-Z0-9]+@(([a-zA-Z0-9-]){3,30}.)+([a-zA-Z0-9]{2,5})$/,
    { message: ResponseMessage.INVALID_EMAIL },
  )
  @Matches(/^(?!.*[-_.]{2}).*$/, {
    message: ResponseMessage.INVALID_EMAIL,
  })
  email: string;

  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()_%!-])[A-Za-z\d$&+,:;=?@#|'<>.^*()_%!-]{8,15}$/,
    {
      message: ResponseMessage.INVALID_PASSWORD,
    },
  )
  password: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$&+,:;=?@#|'<>.^*()_%!-])[A-Za-zd$&+,:;=?@#|'<>.^*()_%!-]{8,15}$/,
    {
      message: ResponseMessage.INVALID_PASSWORD,
    },
  )
  password: string;
}

export class EmailDto {
  @IsNotEmpty()
  email: string;
}
