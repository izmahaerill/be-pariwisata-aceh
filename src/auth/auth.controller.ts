import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('signup')
  signup(@Query() dto: SignupDto, @Res() res: Response) {
    return this.authService.signup({ dto, res });
  }
  @Get('signin')
  signin(@Query() dto: SigninDto, @Res() res: Response) {
    return this.authService.signin({ dto, res });
  }
  @Get('test')
  heh() {
    return { data: 'hehe' };
  }
}
