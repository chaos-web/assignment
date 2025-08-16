import { Module } from '@nestjs/common';
import config from '../utils/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ServiceEventsRabbitAddress } from 'src/common.interface';
import { redisdb } from 'src/utils/redis.provider';
import { OutboxService } from './outbox.service';
import { OutboxWorker } from './outbox.worker';

@Module({
  imports: [
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
  providers: [redisdb , OutboxService , OutboxWorker],
  exports:[OutboxService]
})
export class OutboxModule {}
