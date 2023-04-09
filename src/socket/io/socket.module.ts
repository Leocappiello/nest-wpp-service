import { Module } from '@nestjs/common';
import { IoService } from './io.service';

@Module({
  providers: [IoService],
})
export class SocketModule {}
