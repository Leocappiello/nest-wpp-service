import { Injectable, Inject } from '@nestjs/common';
import { actions } from './actions';
import { HttpCustomService } from 'src/providers/http/http.service';
import { IoService } from 'src/socket/io/io.service';
import { MESSAGES } from './messages';

@Injectable()
export class MessageService {
  id = process.env.WHATSAPP_ID;
  token = process.env.WHATSAPP_TOKEN;
  url = 'https://graph.facebook.com/v16.0/';
  access_token = '/messages?access_token=';
  headers = { 'Content-Type': 'application/json' };
  urlPost = this.url + this.id + this.access_token + this.token;

  constructor(
    @Inject(IoService)
    private readonly ioService: IoService,
    private readonly httpService: HttpCustomService,
  ) {}

  async action(action: string, dataAction: any) {
    const templates = [];
    const actionFunction = actions[action];
    if (!actionFunction) {
      throw new Error('Accion invalida');
    }
    actionFunction(dataAction, templates);
    /* console.log(data, 'data');
    console.log(templates[0].parameters); */
    dataAction.name = action;
    return await this.sendMessage(this.urlPost, dataAction /* , templates */);
  }

  async sendMessage(url, dataAction /* , templates */) {
    const dataMessage = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: dataAction.to,
      type: 'template',
      template: {
        name: dataAction.name,
        language: {
          code: 'en_US',
        },
        //components: [{ ...templates[0] }],
      },
    };
    //console.log(dataMessage);
    const { status, data, config } = await this.httpService.postMessage(
      this.urlPost,
      dataMessage,
    );
    this.ioService.emitMessage(MESSAGES.messageSent, { config, status, data });
    //console.log(config.data);
    return { status, data, config };
  }

  async sendMessageWTemplate(message: any) {
    const { status, data, config } = await this.httpService.postMessage(
      this.urlPost,
      message,
    );
    this.ioService.emitMessage(MESSAGES.messageSent, { config, status, data });
    console.log(config);
    return { config, status, data };
  }

  async emitMessage(messageType: string, data: any) {
    console.log('data desde emit', data);
    this.ioService.emitMessage(MESSAGES[messageType], data);
  }
}
