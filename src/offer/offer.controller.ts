import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { FindOfferDto } from './dto/offer.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ServiceEventsRabbitAddress } from '../common.interface';
import { IHarvesterData } from '../harvester/harvester.service';
import { GetOfferResourceDto } from './dto/offer-resource.dto';

@ApiBearerAuth()
@ApiTags('Offer')
@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Get()
  @ApiOkResponse({ type: GetOfferResourceDto, isArray: true })
  findAll(@Query() query: FindOfferDto) {
    return this.offerService.findAll(query);
  }

  @RabbitSubscribe({
    exchange: ServiceEventsRabbitAddress.exchange,
    routingKey: ServiceEventsRabbitAddress.routingkeys.harvester.newData,
    queue: 'offer.new-data',
  })
  async handleHarvesterNewData(data: IHarvesterData[]) {
    this.offerService.create(
      data.map((item) => ({
        name: item.name,
        description: item.description,
        company: item.company,
        location: item.location,
        issuedAt: item.createdAt,
        minSalary: item.salary.min,
        maxSalary: item.salary.max,
      })),
    );
  }
}
