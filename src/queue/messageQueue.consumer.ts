import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MESSAGE_QUEUE } from './constants';
import { Logger } from '@nestjs/common';

@Processor(MESSAGE_QUEUE)
export class MessageConsumer {
  private readonly logger = new Logger(MessageConsumer.name);

  @Process()
  async handleMessage(job: Job<unknown>) {
    this.logger.log(job);
  }
}
