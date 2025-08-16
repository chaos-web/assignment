import { Module } from '@nestjs/common';
import { ComposerService } from './composer.service';
import { ComposerController } from './composer.controller';
import { OutboxModule } from 'src/rabbit-outbox/outbox.module';

@Module({
  imports:[
    OutboxModule
  ],
  controllers: [ComposerController],
  providers: [ComposerService]
})
export class ComposerModule {}
