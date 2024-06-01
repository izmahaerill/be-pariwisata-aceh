import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
import { Response } from 'express';
import * as argon from 'argon2';
import * as jsonwebtoken from 'jsonwebtoken';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup({ dto, res }: { dto: SignupDto; res: Response }) {
    try {
      const userIsExist =
        dto.role === 'USER'
          ? await this.prisma.user.findUnique({
              where: {
                email: dto.email,
                role: 'USER',
              },
            })
          : await this.prisma.user.findUnique({
              where: {
                email: dto.email,
                role: 'ADMIN',
              },
            });

      if (userIsExist)
        return res.status(HttpStatus.CONFLICT).json({
          message: ['Credential with that email already exists'],
        });

      const hash = await argon.hash(dto.password);

      await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username || null,
          password: hash,
          role: dto.role,
        },
      });

      res.status(HttpStatus.CREATED).json({
        message: ['signup success'],
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: ['Credetential taken'],
          });
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: ['signup failed'],
        });
      }
      throw error;
    }
  }
  async signin({ dto, res }: { dto: SigninDto; res: Response }) {
    const dataUser =
      dto.role === 'USER'
        ? await this.prisma.user.findUnique({
            where: {
              email: dto.email,
              role: 'USER',
            },
          })
        : await this.prisma.user.findUnique({
            where: {
              email: dto.email,
              role: 'ADMIN',
            },
          });
    if (!dataUser) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: ['Credential not found'],
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

    res.status(HttpStatus.ACCEPTED).json({
      status: 'login',
      token,
      message: ['Login Success'],
    });
  }
}
