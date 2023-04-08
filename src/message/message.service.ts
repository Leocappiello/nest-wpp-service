import { Injectable } from '@nestjs/common';
import { actions } from './actions';
import { HttpCustomService } from 'src/providers/http/http.service';

@Injectable()
export class MessageService {
  id = process.env.WHATSAPP_ID;
  token = process.env.WHATSAPP_TOKEN;
  url = 'https://graph.facebook.com/v16.0/';
  access_token = '/messages?access_token=';
  headers = { 'Content-Type': 'application/json' };
  urlPost = this.url + this.id + this.access_token + this.token;

  constructor(private readonly httpService: HttpCustomService) {}

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
      url,
      dataMessage,
    );
    console.log(config.data);
    return { status, data };
  }
}
