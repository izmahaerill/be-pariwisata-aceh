import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TouristDestinationService } from './tourist_destination.service';
import { AddTouristDestinationDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('tourist-destination')
export class TouristDestinationController {
  constructor(private touristDestinationService: TouristDestinationService) {}
  @Get('all')
  getAll() {
    return this.touristDestinationService.getAllData();
  }
  @Put('add')
  @UseInterceptors(FileInterceptor('file'))
  postOne(
    @Body() dto: AddTouristDestinationDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.touristDestinationService.postData({ file, dto });
  }
  @Post('yeah')
  get() {
    return {
      success: true,
    };
  }
}
