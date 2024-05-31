import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TouristDestinationService } from './tourist_destination.service';
import { UpsertTouristDestinationDto, TouristDestinationDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('tourist-destination')
export class TouristDestinationController {
  constructor(private touristDestinationService: TouristDestinationService) {}
  @Get('all')
  getAll(@Res() res: Response) {
    return this.touristDestinationService.getAllData({ res });
  }
  @Get('/:id')
  getWithId(@Param() param: TouristDestinationDto, @Res() res: Response) {
    return this.touristDestinationService.getDataWithId({ param, res });
  }

  @Post('add')
  @UseInterceptors(FileInterceptor('file'))
  postOne(
    @Body() dto: UpsertTouristDestinationDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response
  ) {
    return this.touristDestinationService.postData({ file, dto, res });
  }
  @Put('/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateOne(
    @Param() param: TouristDestinationDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Body() dto: UpsertTouristDestinationDto
  ) {
    return this.touristDestinationService.updateData({ param, file, res, dto });
  }
  @Delete('/:id')
  deleteOne(@Param() param: TouristDestinationDto, @Res() res: Response) {
    return this.touristDestinationService.deleteData({ param, res });
  }
}
