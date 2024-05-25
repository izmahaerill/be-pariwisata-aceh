import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto, @Res() res: Response) {
    return this.authService.signup({ dto, res });
  }
  @Post('signin')
  signin(@Body() dto: SigninDto, @Res() res: Response) {
    return this.authService.signin({ dto, res });
  }
  @Get('test')
  heh() {
    return { data: 'hehe' };
  }
}
