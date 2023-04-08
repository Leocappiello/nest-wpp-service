import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bull';
import { MESSAGE_QUEUE } from './constants';
import { MessageConsumer } from './messageQueue.consumer';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_URL || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: MESSAGE_QUEUE,
    }),
  ],
  providers: [QueueService, MessageConsumer],
})
export class QueueModule {}
