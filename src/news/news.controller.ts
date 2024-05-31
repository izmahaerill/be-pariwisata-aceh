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
import { NewsService } from './news.service';
import { Response } from 'express';
import { DetailDto, UpsertNewsDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}
  @Get('all')
  getAllNews(@Res() res: Response) {
    return this.newsService.getAllData({ res });
  }
  @Get('/:id')
  getDetailNews(@Param() param: DetailDto, @Res() res: Response) {
    return this.newsService.getDataWithId({ param, res });
  }
  @Post('add')
  @UseInterceptors(FileInterceptor('file'))
  addNews(
    @Body() dto: UpsertNewsDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response
  ) {
    return this.newsService.postData({ dto, file, res });
  }
  @Put('/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateNews(
    @Body() dto: UpsertNewsDto,
    @UploadedFile() file: Express.Multer.File,
    @Param() param: DetailDto,
    @Res() res: Response
  ) {
    return this.newsService.updateData({ dto, file, param, res });
  }
  @Delete('/:id')
  deleteNews(@Param() param: DetailDto, @Res() res: Response) {
    return this.newsService.deleteData({ param, res });
  }
}
