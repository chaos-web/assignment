import { Module } from '@nestjs/common';
import { HarvesterService } from './harvester.service';
import { HarvesterController } from './harvester.controller';
import { StructureAStrategy } from './strategies/structureA.strategy';
import { StructureBStrategy } from './strategies/structureB.strategy';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import config from '../utils/config';
import { ServiceEventsRabbitAddress } from '../common.interface';
import { HarvesterLogRepository, HarvesterLogSchema } from './entities/harvester.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { HarvesterLog } from './entities/harvester.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HarvesterLog.name, schema: HarvesterLogSchema },
    ]),
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
  controllers: [HarvesterController],
  providers: [HarvesterService, StructureAStrategy, StructureBStrategy , HarvesterLogRepository],
})
export class HarvesterModule {}
