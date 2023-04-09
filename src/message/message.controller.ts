import { MessageService } from './message.service';
import { Body, Controller, Param, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { NumberMassiveMessageDto } from './dto/postDto/massive.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

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
}
