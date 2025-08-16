import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IDeviceTrackingData } from './entities/composer.entity';
import { OutboxService } from 'src/rabbit-outbox/outbox.service';
import { ServiceEventsRabbitAddress } from 'src/common.interface';
import { randomInt } from 'crypto';

@Injectable()
export class ComposerService implements OnModuleInit {
  @Inject() private readonly outboxService: OutboxService;

  onModuleInit() {
    this.publishData();
  }

  async *generateDeviceData(): AsyncGenerator<IDeviceTrackingData> {
    
    let counter = 0;
    while (true) {
      const deviceId = counter

      const generateData = (): Array<[number, [number, number, number]]> => {
        const data: Array<[number, [number, number, number]]> = [];
        for (let i = 0; i < randomInt(1, 100); i++) {
          data.push([
            counter * 1000,
            [
              51.339764 + Math.random() * 0.00001,
              12.339223833333334 + Math.random() * 0.00001,
              1 + Math.random() * 2,
            ],
          ]);
        }
        return data;
      };

      const data: IDeviceTrackingData = {
        [deviceId]: {
          data: generateData(),
          time: Date.now(),
        },
      };

      yield data;

      counter++;
      const delay = () => new Promise((res) => setTimeout(res, 1000));
      await delay();
    }
  }

  async publishData() {
    for await (const data of this.generateDeviceData()) {
      this.outboxService.enqueue({
        exchange: ServiceEventsRabbitAddress.exchange,
        routingKey: ServiceEventsRabbitAddress.routingkeys.composer.newData,
        body: data,
      });
    }
  }
}
