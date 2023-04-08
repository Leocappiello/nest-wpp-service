import { CodigoVerificacionDto } from '../dto/codigo-verificacion.dto';

export async function codigoVerificacionUsuario(
  cuerpo: CodigoVerificacionDto,
  templates: Array<any>,
) {
  templates.push({
    type: 'body',
    parameters: [
      { type: 'text', text: cuerpo.materia },
      {
        type: 'text',
        text: cuerpo.hash,
      },
    ],
  });
}
