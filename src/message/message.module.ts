import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGuard } from './message.guard';
//import { QueueRepository } from 'src/queue/queue.repository';
import { HttpModule } from '@nestjs/axios/dist';
import { ProvidersModule } from 'src/providers/providers.module';

@Module({
  imports: [HttpModule, ProvidersModule],
  controllers: [MessageController],
  providers: [
    //HttpService,
    MessageService,
    MessageGuard /* , QueueRepository */,
  ],
})
export class MessageModule {}
