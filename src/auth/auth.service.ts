import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
import { Response } from 'express';
import * as argon from 'argon2';
import * as jsonwebtoken from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup({ dto, res }: { dto: SignupDto; res: Response }) {
    const userIsExist = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (userIsExist)
      return res.status(HttpStatus.CONFLICT).json({
        message: ['The user with that email already exists'],
      });

    const hash = await argon.hash(dto.password);

    await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username || null,
        password: hash,
      },
    });

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: ['signup success'],
    });
  }
  async signin({ dto, res }: { dto: SigninDto; res: Response }) {
    const dataUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!dataUser) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: ['User not found'],
      });
    }

    const authStatus = await argon.verify(dataUser.password, dto.password);

    if (!authStatus)
      return res.status(HttpStatus.CONFLICT).json({
        message: ['password incorrect'],
      });

    const token = jsonwebtoken.sign(
      {
        email: dto.email || 'pariwisata-aceh',
      },
      'pariwata-aceh'
    );

    res.json({
      status: 'login',
      token,
      message: ['Login Success'],
    });
  }
}
