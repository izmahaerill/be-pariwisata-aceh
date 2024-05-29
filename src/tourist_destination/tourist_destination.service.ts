import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { TouristDestinationDto, UpsertTouristDestinationDto } from './dto';
import { Response } from 'express';

@Injectable()
export class TouristDestinationService {
  constructor(
    private prismaClient: PrismaService,
    private supabaseService: SupabaseService
  ) {}
  async getAllData() {
    const data = await this.prismaClient.touristDestination.findMany({
      include: {
        location: {
          select: {
            lat: true,
            lng: true,
          },
        },
      },
    });

    return {
      data,
    };
  }
  async getDataWithId({
    param,
    res,
  }: {
    param: TouristDestinationDto;
    res: Response;
  }) {
    try {
      if (!Number(param.id)) {
        throw new Error('id must be a number');
      }

      const id = parseInt(param.id);
      const data = await this.prismaClient.touristDestination.findUnique({
        where: {
          id: id,
        },
        include: {
          location: {
            select: {
              lat: true,
              lng: true,
            },
          },
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
    dto: UpsertTouristDestinationDto;
    file: Express.Multer.File;
    res: Response;
  }) {
    const uniqueValue = new Date().toISOString();

    const { title, desc, lat, lng, locate, typeLocation, typeSellTicket } = dto;

    try {
      const { data, error } = await this.supabaseService.supabase.storage
        .from('tourist-destination')
        .upload(
          `${uniqueValue}-${file.originalname || 'tourist-destination.jpg'}`,
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

      const { data: url } = this.supabaseService.supabase.storage
        .from('public-bucket')
        .getPublicUrl(data.path);

      const publicUrl = url.publicUrl.replace(
        'public-bucket',
        'tourist-destination'
      );

      await this.prismaClient.touristDestination.create({
        data: {
          title,
          desc,
          locate,
          location: {
            create: {
              lat,
              lng,
            },
          },
          typeLocation,
          typeSellTicket,
          url: publicUrl,
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
    param: TouristDestinationDto;
    file: Express.Multer.File;
    res: Response;
    dto: UpsertTouristDestinationDto;
  }) {
    try {
      if (!Number(param.id)) throw new Error('id must be a number');
      const dataOld = await this.prismaClient.touristDestination.findUnique({
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
            .from('tourist-destination')
            .remove([path]);
        if (errorDeleteOldImage) throw new Error(errorDeleteOldImage.message);

        const { data: dataUploadImage, error: errorUploadImage } =
          await this.supabaseService.supabase.storage
            .from('tourist-destination')
            .upload(
              `${uniqueValue}-${file.originalname || 'tourist-destination.jpg'}`,
              file.buffer,
              {
                cacheControl: '3600',
                upsert: false,
                contentType: file.mimetype,
              }
            );
        if (errorUploadImage) throw new Error(errorUploadImage.message);

        const {
          data: { publicUrl: newUrlBeforeReplace },
        } = this.supabaseService.supabase.storage
          .from('tourist-destination')
          .getPublicUrl(dataUploadImage.path);

        const newUrl = newUrlBeforeReplace.replace(
          'public-bucket',
          'tourist-destination'
        );

        await this.prismaClient.touristDestination.update({
          where: {
            id: parseInt(param.id),
          },
          data: {
            url: newUrl,
          },
        });
      }

      await this.prismaClient.touristDestination.update({
        where: {
          id: parseInt(param.id),
        },
        data: {
          title: dto.title,
          desc: dto.desc,
          locate: dto.locate,
          typeLocation: dto.typeLocation,
          typeSellTicket: dto.typeSellTicket,
          location: {
            update: {
              lat: dto.lat,
              lng: dto.lng,
            },
          },
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
  async deleteData({
    param,
    res,
  }: {
    param: TouristDestinationDto;
    res: Response;
  }) {
    try {
      if (!Number(param.id)) throw new Error('id must be a number');
      const dataOld = await this.prismaClient.touristDestination.findUnique({
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
        await this.supabaseService.supabase.storage
          .from('tourist-destination')
          .remove([path]);
      if (errorDeleteOldImage) throw new Error(errorDeleteOldImage.message);

      await this.prismaClient.location.delete({
        where: {
          touristDestinationId: parseInt(param.id),
        },
      });
      await this.prismaClient.touristDestination.delete({
        where: {
          id: parseInt(param.id),
        },
      });

      return res.status(HttpStatus.ACCEPTED).json({
        status: 'success',
        message: ['delete data success'],
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: [error.message],
      });
    }
  }
}
