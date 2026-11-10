import { crearApp } from './api.js';

const puerto = Number(process.env.PORT || 3000);
if (!Number.isSafeInteger(puerto) || puerto < 1 || puerto > 65535) {
  throw new Error('PORT debe ser un número de puerto válido');
}
crearApp().listen(puerto, '127.0.0.1', () => {
  console.log(`API ID3D de demostración disponible en http://127.0.0.1:${puerto}/api/salud`);
  console.log('Solo entorno local con datos ficticios; NO apto para producción ni información clínica real.');
});
