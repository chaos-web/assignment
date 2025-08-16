import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { SignalService } from './signal.service';
import { CreateSignalDto, FindSignalDto } from './dto/create-signal.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Timeout } from '@nestjs/schedule';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ServiceEventsRabbitAddress } from 'src/common.interface';
import { IDeviceTrackingData } from 'src/composer/entities/composer.entity';

@ApiBearerAuth()
@ApiTags('Signal')
@Controller('signal')
export class SignalController {
  constructor(private readonly signalService: SignalService) {}

  @Post()
  create(@Body() createSignalDto: CreateSignalDto) {
    return this.signalService.create(createSignalDto);
  }

  @Get()
  findAll(@Query() dto: FindSignalDto) {
    return this.signalService.findAll(dto);
  }

  @RabbitSubscribe({
    exchange: ServiceEventsRabbitAddress.exchange,
    routingKey: ServiceEventsRabbitAddress.routingkeys.composer.newData,
    queue: 'signal.newData',
  })
  async handleNewData(msg: IDeviceTrackingData) {
    const keys = Object.keys(msg);
    for (let index = 0; index < keys.length; index++) {
      const deviceId = keys[index];
      const element = msg[deviceId];
      this.signalService.create({
        deviceId,
        time: element.time,
        payload: element.data.map((item) => ({
          time: item[0],
          latitude: item[1][0],
          longitude: item[1][1],
          speed: item[1][2],
        })),
      });
    }
  }
}
