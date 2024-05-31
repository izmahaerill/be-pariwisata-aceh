import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { FestivalService } from './festival.service';
import { DetailDto, UpsertFestivalDto } from './dto';
import { Response } from 'express';

@Controller('festival')
export class FestivalController {
  constructor(private festivalService: FestivalService) {}
  @Post('add')
  addFestival(@Body() dto: UpsertFestivalDto, @Res() res: Response) {
    return this.festivalService.addFestival({ dto, res });
  }
  @Put('/:id')
  updateFestival(
    @Body() dto: UpsertFestivalDto,
    @Res() res: Response,
    @Param() param: DetailDto
  ) {
    return this.festivalService.updateFestival({ dto, res, param });
  }
  @Delete('/:id')
  deleteFestival(@Res() res: Response, @Param() param: DetailDto) {
    return this.festivalService.deleteFestival({ res, param });
  }
  @Get('all')
  getFestivals(@Res() res: Response) {
    return this.festivalService.getFestivals({ res });
  }
  @Get('/:id')
  getDetailFestival(@Res() res: Response, @Param() param: DetailDto) {
    return this.festivalService.getFestivalWithId({ res, param });
  }
}
