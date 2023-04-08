import { Injectable } from '@nestjs/common';
import { QueueRepository } from './queue.repository';

interface TemplateMessage {
  id: '';
}

@Injectable()
export class QueueService {
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
