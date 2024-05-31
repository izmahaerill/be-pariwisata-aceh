import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { DetailDto, UpsertFestivalDto } from './dto';
import { Response } from 'express';

@Injectable()
export class FestivalService {
  constructor(
    private prismaClient: PrismaService,
    private supabaseService: SupabaseService
  ) {}

  async addFestival({ dto, res }: { dto: UpsertFestivalDto; res: Response }) {
    try {
      await this.prismaClient.festival.create({
        data: {
          title: dto.title,
          locate: dto.locate,
          desc: dto.desc,
          startDate: dto.startDate,
          endDate: dto.endDate,
        },
      });

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: ['add data success'],
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: [error.message],
      });
    }
  }

  async updateFestival({
    dto,
    res,
    param,
  }: {
    dto: UpsertFestivalDto;
    res: Response;
    param: DetailDto;
  }) {
    try {
      if (!Number(param.id))
        return res.status(HttpStatus.FORBIDDEN).json({
          message: ['id must be number'],
        });
      const data = await this.prismaClient.festival.findFirst({
        where: {
          id: parseInt(param.id),
        },
      });
      if (!data)
        return res.status(HttpStatus.NOT_FOUND).json({
          message: ['data not found'],
        });

      await this.prismaClient.festival.update({
        where: {
          id: parseInt(param.id),
        },
        data: {
          title: dto.title,
          locate: dto.locate,
          desc: dto.desc,
          startDate: dto.startDate,
          endDate: dto.endDate,
        },
      });
      return res.status(HttpStatus.ACCEPTED).json({
        message: ['update success'],
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: [error.message],
      });
    }
  }
  async deleteFestival({ res, param }: { res: Response; param: DetailDto }) {
    try {
      if (!Number(param.id))
        return res.status(HttpStatus.FORBIDDEN).json({
          message: ['id must be number'],
        });
      const dataIsExist = await this.prismaClient.festival.findFirst({
        where: {
          id: parseInt(param.id),
        },
      });
      if (!dataIsExist)
        return res.status(HttpStatus.NOT_FOUND).json({
          message: ['data not found'],
        });
      const data = await this.prismaClient.festival.delete({
        where: {
          id: parseInt(param.id),
        },
      });
      return res.status(HttpStatus.ACCEPTED).json({
        message: ['delete data success'],
        data,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: [error.message],
      });
    }
  }
  async getFestivals({ res }: { res: Response }) {
    try {
      const data = await this.prismaClient.festival.findMany();
      return res.status(HttpStatus.OK).json({
        message: ['success get data'],
        data,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: [error.message],
      });
    }
  }
}
