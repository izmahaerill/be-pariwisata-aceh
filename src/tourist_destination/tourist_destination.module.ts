import { Module } from '@nestjs/common';
import { TouristDestinationController } from './tourist_destination.controller';
import { TouristDestinationService } from './tourist_destination.service';

@Module({
  controllers: [TouristDestinationController],
  providers: [TouristDestinationService],
})
export class TouristDestinationModule {}
