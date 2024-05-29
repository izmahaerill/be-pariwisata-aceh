import { IsNotEmpty, IsString } from 'class-validator';

class UpsertTouristDestinationDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  desc: string;
  @IsNotEmpty()
  @IsString()
  lat: string;
  @IsNotEmpty()
  @IsString()
  lng: string;
  @IsNotEmpty()
  @IsString()
  locate: string;
  @IsNotEmpty()
  @IsString()
  typeLocation: string;
  @IsNotEmpty()
  @IsString()
  typeSellTicket: string;
}

class TouristDestinationDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
export { UpsertTouristDestinationDto, TouristDestinationDto };
