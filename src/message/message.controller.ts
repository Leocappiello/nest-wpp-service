import { MessageService } from './message.service';
import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Req,
  Res,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { NumberMassiveMessageDto } from './dto/postDto/massive.dto';
import { IoService } from 'src/socket/io/io.service';
import { plainToInstance } from 'class-transformer';
import MessageReceivedDTO from './dto/postDto/received.dto';
import { validate } from 'class-validator';
import { MESSAGES } from './messages';
import MessageSentDTO from './dto/postDto/messageSent.dto';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService /* @Inject(IoService)
    private readonly ioService: IoService, */,
  ) {}

  @Post('/webhook')
  async handleMessage(@Body() body, @Req() req: Request, @Res() res: Response) {
    try {
      /*
        Message to receive
      */
      if (body.object) {
        const { changes } = body.entry[0];
        if (changes[0].value.statuses) {
          if (changes[0].value.statuses[0].errors) {
            /*
              ERROR 
            */
            const { title, code } = changes[0].value.statuses[0].errors[0];

            const error = {
              title,
              code,
            };

            return this.messageService.emitMessage('errorReceived', error);
          }
          /*
            STATUS
          */
          return this.messageService.emitMessage('statusReceived', body);
        } else {
          let { from } = changes[0].value.messages[0];
          const { timestamp } = changes[0].value.messages[0];
          const { display_phone_number, phone_number_id } =
            changes[0].value.metadata;
          const { id, ...data } = changes[0].value.messages[0];

          // delete '9' in phone number
          if (from.length > 12) {
            from = from.substr(0, 2) + from.substr(3, from.length);
          }

          const message = {
            display_phone_number,
            phone_number_id,
            from,
            id,
            timestamp,
            ...data,
          };

          // parses
          message.from = parseInt(from);
          message.phone_number_id = parseInt(phone_number_id);
          message.display_phone_number = parseInt(display_phone_number);
          message.timestamp = parseInt(timestamp);

          const messageDto = plainToInstance(MessageReceivedDTO, message);
          const errors = await validate(messageDto);

          if (!errors.length) {
            this.messageService.emitMessage('messageReceived', messageDto);
            return res.sendStatus(200);
          }
          return res.status(400).json({ error: errors });
        }
      }

      /*
        Message to send
      */
      if (body.to) {
        const { messaging_product, type, ...data } = body;
        const to = parseInt(body.to) as number;
        //
        const messageSent: MessageSent = {
          messaging_product,
          to,
          type,
          ...data,
        };

        const message = plainToInstance(MessageSentDTO, messageSent);
        const errors = await validate(message);

        if (!errors.length) {
          const result = await this.messageService.sendMessageWTemplate(
            message,
          );
          return res.sendStatus(result?.status);
        }
        return res.status(400).json({ error: errors });
      }

      /*
        Bad format message
      */
      res.status(500).json({ message: 'bad format message' });
    } catch (error) {
      res.status(500).json({ message: 'error' });
    }
  }

  @Post(':accion')
  async enviarWhatsapp(
    @Param('accion') accion: string,
    @Body() cuerpo: any,
    @Req() req,
    @Res() res: Response,
  ) {
    console.log(accion);
    const { status, data } = await this.messageService.action(accion, cuerpo);
    if (data.error) {
      console.log(data.error.message);
    }
    return res.sendStatus(status);
  }

  @Post('/masive/:accion')
  async sendMassiveTemplate(
    @Param('accion') accion: string,
    @Body() cuerpo: NumberMassiveMessageDto,
    @Req() req,
    @Res() res: Response,
  ) {
    console.log(accion, ' masiva');
    cuerpo.number.forEach(async (elem) => {
      cuerpo.to = elem;
      const { status, data } = await this.messageService.action(accion, cuerpo);
      if (data.error) {
        console.log(data.error.message);
      }
    });
    /* const { status, data } = await this.messageService.action(accion, cuerpo);
    if (data.error) {
      console.log(data.error.message);
    }*/
    return res.sendStatus(200);
  }

  @Get('webhook')
  async verifyHook(@Req() req, @Res() res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === token) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  }

  /* @Get('testSocket')
  async testSocket() {
    this.ioService.greeting();
  } */
}
