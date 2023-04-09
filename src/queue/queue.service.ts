import { Injectable } from '@nestjs/common';
import { Queue, Job } from 'bull';
import { InjectQueue, Processor, Process } from '@nestjs/bull';
import { MESSAGE_QUEUE } from './constants';
//import { QueueRepository } from './queue.repository';

@Injectable()
@Processor(MESSAGE_QUEUE)
export class QueueService {
  constructor(@InjectQueue(MESSAGE_QUEUE) private messagesQueue: Queue) {}

  //@QueueProcess(MESSAGE_QUEUE)
  @Process()
  async processMessage(job: Job) {
    return;
  }

  /*  constructor(
    private readonly queueRepository: QueueRepository<TemplateMessage>,
  ) {}

  async addTemplateQueue(data: TemplateMessage): Promise<void> {
    await this.queueRepository.add(data);
  } */
  /* @Process()
  async processTemplateQueue(): Promise<void> {
    await this.queueRepository.process(async (data) => {
      console.log('received data', data);
      // process data !
    });
  } */
}
