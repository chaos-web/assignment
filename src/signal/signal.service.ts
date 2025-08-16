import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Signal, SignalRepository, State } from './entities/signal.entity';
import { CreateSignalDto, FindSignalDto } from './dto/create-signal.dto';

@Injectable()
export class SignalService {
  @Inject() private readonly signalRepository: SignalRepository;

  create(dto: CreateSignalDto) {
    const newSignal = new Signal();
    newSignal.deviceId = dto.deviceId;
    newSignal.payload = dto.payload.map((payload) => [
      payload.time,
      [payload.latitude, payload.longitude, payload.speed],
    ]);
    newSignal.state = State.FETCHED;
    newSignal.totalItems = dto.payload.length;
    newSignal.createdAt = new Date(dto.time);
    return this.signalRepository.create(newSignal);
  }


  findAll(dto: FindSignalDto) {
    const query: any = {};
    if (dto.deviceId) {
      query.deviceId = dto.deviceId;
    }
    if (dto.startTime) {
      query.createdAt = { $gte: new Date(dto.startTime) };
    }
    if (dto.endTime) {
      query.createdAt = { $lte: new Date(dto.endTime) };
    }
    return this.signalRepository.findEvery(query);
  }
}
