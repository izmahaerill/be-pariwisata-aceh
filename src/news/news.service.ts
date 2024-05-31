import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { DetailDto, UpsertNewsDto } from './dto';
import { Response } from 'express';

@Injectable()
export class NewsService {
  constructor(
    private prismaClient: PrismaService,
    private supabaseService: SupabaseService
  ) {}
  async getAllData({ res }: { res: Response }) {
    try {
      const data = await this.prismaClient.news.findMany();
      res.status(HttpStatus.OK).json({
        message: ['get data success'],
        data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: [error.message],
      });
    }
  }
  async getDataWithId({ param, res }: { param: DetailDto; res: Response }) {
    try {
      if (!Number(param.id)) {
        throw new Error('id must be a number');
      }

      const id = parseInt(param.id);
      const data = await this.prismaClient.news.findUnique({
        where: {
          id: id,
        },
      });
      if (!data) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: ['Data with that id not found'],
        });
      }
      return res.status(HttpStatus.OK).json({
        message: ['get data success'],
        data,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: [error.message],
      });
    }
  }

  async postData({
    file,
    dto,
    res,
  }: {
    dto: UpsertNewsDto;
    file: Express.Multer.File;
    res: Response;
  }) {
    if (!file) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: ['please upload an image'],
      });
    }

    const uniqueValue = new Date().toISOString();

    const { tagLine, dateRelease, desc } = dto;

    try {
      const { data, error } = await this.supabaseService.supabase.storage
        .from('news')
        .upload(
          `${uniqueValue}-${file.originalname || 'news.jpg'}`,
          file.buffer,
          {
            cacheControl: '3600',
            upsert: true,
            contentType: file.mimetype,
          }
        );

      if (error)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: ['failed post image'],
        });

      const { data: dataUrl } = this.supabaseService.supabase.storage
        .from('news')
        .getPublicUrl(data.path);

      await this.prismaClient.news.create({
        data: {
          url: dataUrl.publicUrl,
          desc,
          dateRelease,
          tagLine,
        },
      });

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: ['add data success'],
      });
    } catch (error) {
      if (error)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: ['failed add data', error.message],
        });
    }
  }
  async updateData({
    param,
    file,
    res,
    dto,
  }: {
    param: DetailDto;
    file: Express.Multer.File;
    res: Response;
    dto: UpsertNewsDto;
  }) {
    try {
      if (!Number(param.id)) throw new Error('id must be a number');
      const dataOld = await this.prismaClient.news.findUnique({
        where: {
          id: parseInt(param.id),
        },
        select: {
          url: true,
        },
      });

      if (!dataOld) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: ['data with that id not found'],
        });
      }

      const path = dataOld.url.split('/').pop();

      if (file) {
        const uniqueValue = new Date().toISOString();

        const { error: errorDeleteOldImage } =
          await this.supabaseService.supabase.storage
            .from('news')
            .remove([path]);
        if (errorDeleteOldImage) throw new Error(errorDeleteOldImage.message);

        const { data: dataUploadImage, error: errorUploadImage } =
          await this.supabaseService.supabase.storage
            .from('news')
            .upload(
              `${uniqueValue}-${file.originalname || 'news.jpg'}`,
              file.buffer,
              {
                cacheControl: '3600',
                upsert: false,
                contentType: file.mimetype,
              }
            );
        if (errorUploadImage) throw new Error(errorUploadImage.message);

        const { data: dataUrl } = this.supabaseService.supabase.storage
          .from('news')
          .getPublicUrl(dataUploadImage.path);

        await this.prismaClient.news.update({
          where: {
            id: parseInt(param.id),
          },
          data: {
            url: dataUrl.publicUrl,
          },
        });
      }

      await this.prismaClient.news.update({
        where: {
          id: parseInt(param.id),
        },
        data: {
          desc: dto.desc,
          tagLine: dto.tagLine,
          dateRelease: dto.dateRelease,
        },
      });
      return res.status(HttpStatus.ACCEPTED).json({
        success: true,
        message: ['update data success'],
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: [error.message],
      });
    }
  }
  async deleteData({ param, res }: { param: DetailDto; res: Response }) {
    try {
      if (!Number(param.id)) throw new Error('id must be a number');
      const dataOld = await this.prismaClient.news.findUnique({
        where: {
          id: parseInt(param.id),
        },
        select: {
          url: true,
        },
      });

      if (!dataOld) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: ['data with that id not found'],
        });
      }

      const path = dataOld.url.split('/').pop();

      const { error: errorDeleteOldImage } =
        await this.supabaseService.supabase.storage.from('news').remove([path]);
      if (errorDeleteOldImage) throw new Error(errorDeleteOldImage.message);

      await this.prismaClient.news.delete({
        where: {
          id: parseInt(param.id),
        },
      });

      return res.status(HttpStatus.ACCEPTED).json({
        status: 'success',
        message: ['delete data success'],
        data: {
          id: parseInt(param.id),
        },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: [error.message],
      });
    }
  }
}
