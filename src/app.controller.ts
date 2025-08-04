import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller()
export class AppController {
 @Inject() private health: HealthCheckService;
 @Inject() private db: MongooseHealthIndicator
 @Inject() private memory: MemoryHealthIndicator

  @Get('health')
  @HealthCheck()
  healthCheck() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024 *100),
    ]);
  }

}
