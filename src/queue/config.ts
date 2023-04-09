import { BullModuleOptions } from '@nestjs/bull';
import { MESSAGE_QUEUE } from './constants';

export const queueConfig: BullModuleOptions = {
  name: MESSAGE_QUEUE,
  redis: {
    host: 'localhost',
    port: 6379,
  },
};
