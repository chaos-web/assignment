import { Controller, Inject } from '@nestjs/common';
import { HarvesterService } from './harvester.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Cron, Interval } from '@nestjs/schedule';
import conf, { secondsToCronExpression } from '../utils/config';

@ApiBearerAuth()
@ApiTags('Harvester')
@Controller('harvester')
export class HarvesterController {
  @Inject() private readonly harvesterService: HarvesterService;

  //  SLIGHTLY DIFFERENT OUTCOMES , I WILL USE CRON FOR NOW
  // @Interval(conf().harvester.ttl * 1000)
  @Cron(secondsToCronExpression(conf().harvester.ttl))
  async handleCron() {
    await this.harvesterService.execute();
  }

}
