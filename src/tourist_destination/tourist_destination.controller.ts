import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TouristDestinationService } from './tourist_destination.service';
import { AddTouristDestinationDto, TouristDestinationDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
@Controller('tourist-destination')
export class TouristDestinationController {
  constructor(private touristDestinationService: TouristDestinationService) {}
  @Get('all')
  getAll() {
    return this.touristDestinationService.getAllData();
  }
  @Get('/:id')
  getWithId(@Param() dto: TouristDestinationDto, @Res() res: Response) {
    return this.touristDestinationService.getDataWithId({ dto, res });
  }

  @Post('add')
  @UseInterceptors(FileInterceptor('file'))
  postOne(
    @Body() dto: AddTouristDestinationDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response
  ) {
    return this.touristDestinationService.postData({ file, dto, res });
  }
}
