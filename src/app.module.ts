import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TouristDestinationService } from './tourist_destination/tourist_destination.service';
import { TouristDestinationController } from './tourist_destination/tourist_destination.controller';
import { TouristDestinationModule } from './tourist_destination/tourist_destination.module';
import { SupabaseModule } from './supabase/supabase.module';
import { FestivalModule } from './festival/festival.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    TouristDestinationModule,
    SupabaseModule,
    FestivalModule,
  ],
  providers: [TouristDestinationService],
  controllers: [TouristDestinationController],
})
export class AppModule {}
