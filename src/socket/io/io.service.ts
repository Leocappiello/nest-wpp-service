import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway()
export class IoService implements OnModuleInit {
  constructor() {
    console.log('iniciado el io service');
  }

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Connected !', socket.id);
      this.greeting();
    });
  }

  greeting() {
    this.server.emit('message', { saludo: 'hola' });
  }

  emitMessage(message: string, data: any) {
    console.log('message:', message);
    this.server.send(message, data);
  }
}
