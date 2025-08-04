import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import conf from "./utils/config";
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { HarvesterModule } from './harvester/harvester.module';
import { OfferModule } from './offer/offer.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // Just for showcase purpose , i wont use it
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development', '.env'],
      load: [conf],
    }),
    MongooseModule.forRoot(conf().database.url),
    TerminusModule.forRoot(),
    ScheduleModule.forRoot(),
    HarvesterModule,
    OfferModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
