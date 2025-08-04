import { Inject, Injectable } from '@nestjs/common';
import { StructureAStrategy } from './strategies/structureA.strategy';
import { StructureBStrategy } from './strategies/structureB.strategy';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { HarvesterLogRepository, State } from './entities/harvester.entity';
import { ServiceEventsRabbitAddress } from '../common.interface';

export interface IHarvesterData {
  id: string;
  name: string;
  description: string;
  location: string;
  company: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  createdAt: Date;
}

export interface IHarvesterStrategy {
  name: string;
  execute(): Promise<IHarvesterData[]>;
  fetchData(): Promise<any>;
  transform(data: any): Promise<IHarvesterData[]>;
}

@Injectable()
export class HarvesterService {
  private readonly strategies: IHarvesterStrategy[] = [];
  @Inject() private readonly rabbit: AmqpConnection;
  @Inject() private readonly harvesterLogRepo: HarvesterLogRepository;

  ///  Inject Strategies here
  constructor(
    private readonly structureAStrategy: StructureAStrategy,
    private readonly structureBStrategy: StructureBStrategy,
  ) {
    this.strategies.push(this.structureAStrategy);
    this.strategies.push(this.structureBStrategy);
    this.execute();
  }
  

  async execute() {
    this.strategies.forEach(async (strategy) => {
      try {
        const data = await strategy.execute();
        this.rabbit.publish(
          ServiceEventsRabbitAddress.exchange,
          ServiceEventsRabbitAddress.routingkeys.harvester.newData,
          data,
        ).catch((error) => {
          ///  Just "LIKE" Outbox Pattern , we can use this log to retry the message later  
          ///  didnt mean to use it here , but just for showcase purpose
          this.log(data, strategy.name, State.FAILED);
        });
        this.log(data, strategy.name, State.PUBLISHED);
      } catch (error) {
        console.error(error);
      }
    });
  }

  async log(data: any[], strategy: string , state: State) {
    this.harvesterLogRepo.create({
      totalItems: data.length,
      strategy,
      state,
      payload: data,
    });
  }

  async updateLog(id: string, state: State) {
    this.harvesterLogRepo.update(id, { state });
  }
}
