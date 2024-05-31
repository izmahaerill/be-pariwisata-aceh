import { IsNotEmpty } from 'class-validator';

class UpsertFestivalDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  locate: string;
  @IsNotEmpty()
  startDate: string;
  @IsNotEmpty()
  endDate: string;
  @IsNotEmpty()
  desc: string;
}
class DetailDto {
  @IsNotEmpty()
  id: string;
}

export { UpsertFestivalDto, DetailDto };
