import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { MESSAGE_QUEUE } from './constants';

@Injectable()
export class QueueRepository<T> {
  constructor(
    @InjectQueue(MESSAGE_QUEUE) private readonly messageQueue: Queue,
  ) {}

  async add(data: T): Promise<void> {
    await this.messageQueue.add(data);
  }

  /*  async process(jobHandler: (jobData: T) => Promise<void>): Promise<void> {
    this.messageQueue.process(async (job) => {
      await jobHandler(job.data);
    });
  } */
}
