import { IsNotEmpty } from 'class-validator';

class UpsertNewsDto {
  @IsNotEmpty()
  tagLine: string;
  @IsNotEmpty()
  dateRelease: string;
  @IsNotEmpty()
  desc: string;
}
class DetailDto {
  @IsNotEmpty()
  id: string;
}

export { UpsertNewsDto, DetailDto };
