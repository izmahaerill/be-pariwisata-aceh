import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { AddTouristDestinationDto, TouristDestinationDto } from './dto';
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
    dto,
    res,
  }: {
    dto: TouristDestinationDto;
    res: Response;
  }) {
    try {
      if (!Number(dto.id)) {
        throw new Error('id must be a number');
      }

      const id = parseInt(dto.id);
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
    dto: AddTouristDestinationDto;
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
}
