import { Module } from '@nestjs/common';
import { SignalService } from './signal.service';
import { SignalController } from './signal.controller';
import { Signal, SignalModel, SignalRepository } from './entities/signal.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import config from 'src/utils/config';
import { ServiceEventsRabbitAddress } from 'src/common.interface';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([SignalModel]),
    RabbitMQModule.forRoot({
      uri: config().rabbit.uri,
      exchanges: [
        {
          name: ServiceEventsRabbitAddress.exchange,
          type: ServiceEventsRabbitAddress.type,
        },
      ],
      enableControllerDiscovery: true,
      connectionInitOptions: {
        timeout: 20000,
        wait: false,
        reject: false,
      },
    }),
  ],
  controllers: [SignalController],
  providers: [SignalService , SignalRepository],
})
export class SignalModule {}
