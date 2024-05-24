import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class SignupDto {
  @IsString()
  @IsNotEmpty()
  username?: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}

class SigninDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}

export { SigninDto, SignupDto };
