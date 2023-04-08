import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { MessageModule } from './message/message.module';
import { QueueModule } from './queue/queue.module';
//import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MessageModule,
    QueueModule,
    //ScheduleModule, // automatic tasks module
  ],
  controllers: [AppController, MessageController],
  providers: [AppService, MessageService],
})
export class AppModule {
  static port: number;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = +this.configService.get('PORT');
  }
}
