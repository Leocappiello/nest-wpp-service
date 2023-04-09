import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGuard } from './message.guard';
//import { QueueRepository } from 'src/queue/queue.repository';
import { HttpModule } from '@nestjs/axios/dist';
import { ProvidersModule } from 'src/providers/providers.module';
import { SocketModule } from 'src/socket/io/socket.module';

@Module({
  imports: [HttpModule, ProvidersModule],
  controllers: [MessageController],
  providers: [
    MessageService,
    MessageGuard /* , QueueRepository */,
    SocketModule,
  ],
})
export class MessageModule {}
