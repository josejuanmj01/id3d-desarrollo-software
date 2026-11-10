import { createServer } from 'node:http';
import { once } from 'node:events';
import { crearApp } from './api.js';

const servidor = createServer(crearApp());
servidor.listen(0,'127.0.0.1');
await once(servidor,'listening');
const base = 'http://127.0.0.1:' + servidor.address().port;
async function pedir(metodo,ruta,datos) {
  const respuesta = await fetch(base+ruta,{method:metodo,
    headers:{'Content-Type':'application/json'},
    ...(datos === undefined ? {} : {body:JSON.stringify(datos)})});
  return {status:respuesta.status,datos:await respuesta.json()};
}
try {
  console.log('=== ID3D · Unidad II (datos ficticios) ===');
  const salud=await pedir('GET','/api/salud');
  console.log('1. Express · HTTP:',salud.status,JSON.stringify(salud.datos));
  if(salud.status!==200) throw Error('Falló Express');

  const invalido=await pedir('POST','/api/pacientes',
    {expediente:'',nombres:'',apellidos:'Ejemplo'});
  console.log('2. Zod · validación:',invalido.status,JSON.stringify(invalido.datos));
  if(invalido.status!==400) throw Error('Falló Zod');

  const paciente=await pedir('POST','/api/pacientes',
    {expediente:'DEMO-001',nombres:'Paciente',apellidos:'Ficticio'});
  console.log('3. UUID · paciente:',paciente.status,paciente.datos.id);
  if(paciente.status!==201) throw Error('Falló registro de paciente');

  const estudio=await pedir('POST','/api/estudios',{pacienteId:paciente.datos.id,
    tipoEstudio:'Radiografía panorámica',fechaRealizacion:'2026-11-09T12:00:00Z'});
  console.log('4. UUID · estudio:',estudio.status,estudio.datos.id);
  if(estudio.status!==201) throw Error('Falló registro de estudio');

  const antes=await pedir('POST','/api/estudios/'+estudio.datos.id+'/publicar');
  console.log('5. Publicar sin archivo:',antes.status,antes.datos.error);
  if(antes.status!==409) throw Error('Falló regla del dominio');

  const archivo=await pedir('POST','/api/estudios/'+estudio.datos.id+'/archivos',
    {nombreOriginal:'imagen-demo.dcm',tipoMime:'application/dicom',tamanoBytes:2048});
  console.log('6. Metadatos:',archivo.status,JSON.stringify(archivo.datos.archivo));
  if(archivo.status!==201) throw Error('Falló registro de metadatos');

  const publicado=await pedir('POST','/api/estudios/'+estudio.datos.id+'/publicar');
  console.log('7. Publicación:',publicado.status,publicado.datos.estado);
  if(publicado.status!==200 || publicado.datos.estado!=='PUBLICADO')
    throw Error('Falló publicación');
  console.log('RESULTADO: DEMOSTRACIÓN COMPLETADA CORRECTAMENTE');
} finally {
  await new Promise((resolve,reject)=>servidor.close(e=>e?reject(e):resolve()));
}
