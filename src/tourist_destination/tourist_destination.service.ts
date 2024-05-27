import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { AddTouristDestinationDto } from './dto';

@Injectable()
export class TouristDestinationService {
  constructor(
    private prismaClient: PrismaService,
    private supabaseService: SupabaseService
  ) {}
  async getAllData() {
    const data = await this.prismaClient.touristDestination.findMany();

    return {
      data,
    };
  }

  async postData({
    file,
    dto,
  }: {
    dto: AddTouristDestinationDto;
    file: Express.Multer.File;
  }) {
    console.log({ file, title: dto.title });
    // const { data, error } = await this.supabaseService.supabase.storage
    //   .from('tourist-destination')
    //   .upload(`${file.originalname}`, file.buffer, {
    //     cacheControl: '3600',
    //     upsert: true,
    //     contentType: file.mimetype,
    //   });
    // console.log({ data }, { error });
    return { success: true };
  }
}
