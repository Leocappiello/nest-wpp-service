import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway(/* 81, {
  namespace: 'messages',
  cors: {
    origin: ['*'],
  },
} */)
export class IoService implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Connected !', socket.id);
      this.emitMessage();
    });
  }

  emitMessage() {
    console.log('emitiendo saludo !');
    this.server.emit('message', { saludo: 'hola' });
  }
}
