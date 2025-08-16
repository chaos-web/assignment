// outbox.worker.ts
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { OutboxService } from './outbox.service';
import { OutboxMessage } from './outbox.types';
import { randomInt } from 'crypto';

@Injectable()
export class OutboxWorker implements OnModuleInit     {
  private readonly logger = new Logger(OutboxWorker.name);
  private running = true;
  @Inject() private readonly outboxService: OutboxService;
  @Inject() private readonly rabbit: AmqpConnection;

  async onModuleInit() {
    await new Promise((res) => setTimeout(res, randomInt(100, 2000))); //  delay for outsyncing concurrent workers in a cluster
    this.startWorker();
  }

  private async startWorker() {
    this.logger.verbose('Outbox worker started.');
    while (this.running) {
      try {
        const msg = await this.outboxService.dequeue(5); 
        if (!msg) continue;
        await this.publishToRabbit(msg);
      } catch (err) {
        this.logger.error('Worker loop error', err.stack || err);
        await new Promise((res) => setTimeout(res, 2000));
      }
    }
  }

  private async publishToRabbit(msg: OutboxMessage) {
    try {
      await this.rabbit.publish(
        msg.exchange,
        msg.routingKey,
        msg.body,
      );
      this.logger.debug(
        `Published message to ${msg.exchange}:${msg.routingKey}`,
      );
    } catch (err) {
      this.logger.error('Failed to publish, re-enqueuing', err.stack || err);
      await this.outboxService.enqueue(msg);
      await new Promise((res) => setTimeout(res, 5000)); 
    }
  }
}
