// outbox.service.ts
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { OutboxMessage } from './outbox.types';

@Injectable()
export class OutboxService {
  private readonly listKey = 'outbox:assignment';
  @Inject("REDISDB") private readonly redis : Redis

  async enqueue(message: OutboxMessage): Promise<void> {
    await this.redis.rpush(this.listKey, JSON.stringify(message));
  }

  async dequeue(timeoutSeconds = 5): Promise<OutboxMessage | null> {
    const res = await this.redis.blpop(this.listKey, timeoutSeconds);  // Keeps connection waitin
    if (!res) return null;
    const [, value] = res;
    return JSON.parse(value) as OutboxMessage;
  }
}
