import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bull';
import { MessageConsumer } from './messageQueue.consumer';
import { queueConfig } from './config';

@Module({
  imports: [
    /* BullModule.forRoot({
      redis: {
        host: process.env.REDIS_URL || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: MESSAGE_QUEUE,
    }), */
    BullModule.registerQueue(queueConfig),
  ],
  providers: [QueueService, MessageConsumer],
})
export class QueueModule {}
