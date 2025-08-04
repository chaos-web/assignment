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
import { OfferMapper } from './dto/offer.mapper';

@ApiBearerAuth()
@ApiTags('Offer')
@Controller('offer')
export class OfferController {
  private readonly offerMapper = new OfferMapper();
  constructor(private readonly offerService: OfferService) {}

  @Get()
  @ApiOkResponse({ type: GetOfferResourceDto, isArray: true })
  async findAll(@Query() query: FindOfferDto) {
    const { offers, total } = await this.offerService.findAll(query);
    return this.offerMapper.getOffers(offers, total);
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
