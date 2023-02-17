import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { ResponseMessage } from '../../utils/enum';
import { IsValidCountry } from '../../modules/common/validator/country.validator';
import { IsValidPhoneNumber } from '../../modules/common/validator/phone.validator';
import { SameAs } from './../common/validator/same-as.validator';

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
