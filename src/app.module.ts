import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import conf from "./utils/config";
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { MongooseModule } from '@nestjs/mongoose';
import { ComposerModule } from './composer/composer.module';
import { OutboxModule } from './rabbit-outbox/outbox.module';
import { SignalModule } from './signal/signal.module';

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
    ComposerModule,
    OutboxModule,
    SignalModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
