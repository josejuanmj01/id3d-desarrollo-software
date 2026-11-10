import express from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Paciente, TipoEstudio, Estudio, Archivo } from './modelo.js';

// Entradas validadas: solo campos previstos y datos de demostración.
const pacienteSchema = z.strictObject({
  expediente: z.string().trim().min(3).max(30),
  nombres: z.string().trim().min(1).max(80),
  apellidos: z.string().trim().min(1).max(80)
});
const estudioSchema = z.strictObject({
  pacienteId: z.uuid(),
  tipoEstudio: z.string().trim().min(2).max(100),
  fechaRealizacion: z.iso.datetime({ offset: true })
});
const archivoSchema = z.strictObject({
  nombreOriginal: z.string().trim().min(1).max(120),
  tipoMime: z.enum(['application/dicom', 'image/jpeg', 'image/png', 'application/pdf']),
  tamanoBytes: z.number().int().positive().max(52_428_800)
});
function validar(schema, body, res) {
  const r = schema.safeParse(body);
  if (r.success) return r.data;
  res.status(400).json({error:'Datos inválidos', detalles:r.error.issues.map(({path,message}) =>
    ({campo:path.join('.') || 'cuerpo', mensaje:message}))});
  return null;
}
function nuevoId(mapa) {
  let id;
  do { id = uuidv4(); } while (mapa.has(id));
  return id;
}
function presentar({id, pacienteId, estudio}) {
  return {id, pacienteId, folio:estudio.folio, tipoEstudio:estudio.tipoEstudio.nombre,
    fechaRealizacion:estudio.fechaRealizacion, estado:estudio.estado,
    archivos:estudio.archivos.map(a => ({nombreOriginal:a.nombreOriginal,
      tipoMime:a.tipoMime, tamanoBytes:a.tamanoBytes}))};
}

export function crearApp() {
  const app = express();
  const pacientes = new Map(), estudios = new Map(), folios = new Set();
  let siguientePaciente = 1, siguienteTipo = 1, siguienteEstudio = 1, siguienteArchivo = 1;
  app.disable('x-powered-by');
  app.use(express.json({limit:'64kb'}));
  app.get('/api/salud', (_req,res) => res.json({sistema:'ID3D', estado:'activo', persistencia:'memoria'}));

  app.post('/api/pacientes', (req,res) => {
    const entrada = validar(pacienteSchema,req.body,res);
    if (!entrada) return;
    if ([...pacientes.values()].some(p => p.paciente.expediente === entrada.expediente))
      return res.status(409).json({error:'El expediente ya existe'});
    const paciente = new Paciente(siguientePaciente++,entrada.expediente,entrada.nombres,entrada.apellidos);
    const id = nuevoId(pacientes);
    pacientes.set(id,{id,paciente});
    res.status(201).json({id, expediente:paciente.expediente, nombreCompleto:paciente.nombreCompleto()});
  });

  app.post('/api/estudios', (req,res) => {
    const entrada = validar(estudioSchema,req.body,res);
    if (!entrada) return;
    const asociado = pacientes.get(entrada.pacienteId);
    if (!asociado) return res.status(404).json({error:'Paciente no encontrado'});
    const id = nuevoId(estudios);
    let folio;
    do { folio = 'EST-' + uuidv4(); } while (folios.has(folio));
    folios.add(folio);
    const estudio = new Estudio(siguienteEstudio++, asociado.paciente,
      new TipoEstudio(siguienteTipo++,entrada.tipoEstudio),folio,entrada.fechaRealizacion);
    const registro = {id,pacienteId:entrada.pacienteId,estudio};
    estudios.set(id,registro);
    res.status(201).json(presentar(registro));
  });

  app.post('/api/estudios/:id/archivos',(req,res) => {
    const entrada = validar(archivoSchema,req.body,res);
    if (!entrada) return;
    const registro = estudios.get(req.params.id);
    if (!registro) return res.status(404).json({error:'Estudio no encontrado'});
    if (registro.estudio.estado !== 'EN_PREPARACION')
      return res.status(409).json({error:'Solo se agregan archivos en preparación'});
    // No se recibe ni almacena ningún archivo clínico real.
    const archivo = new Archivo(siguienteArchivo++,
      'demo/' + registro.id + '/' + uuidv4(), entrada.nombreOriginal,
      entrada.tipoMime, entrada.tamanoBytes);
    registro.estudio.agregarArchivo(archivo);
    res.status(201).json({estudioId:registro.id,archivo:{
      nombreOriginal:archivo.nombreOriginal,tipoMime:archivo.tipoMime,tamanoBytes:archivo.tamanoBytes}});
  });

  app.post('/api/estudios/:id/publicar',(req,res) => {
    const registro = estudios.get(req.params.id);
    if (!registro) return res.status(404).json({error:'Estudio no encontrado'});
    if (registro.estudio.estado !== 'EN_PREPARACION')
      return res.status(409).json({error:'El estudio ya no está en preparación'});
    if (!registro.estudio.archivos.length)
      return res.status(409).json({error:'Se requiere al menos un archivo'});
    registro.estudio.publicar();
    res.json(presentar(registro));
  });

  app.get('/api/estudios/:id',(req,res) => {
    const registro = estudios.get(req.params.id);
    if (!registro) return res.status(404).json({error:'Estudio no encontrado'});
    res.json(presentar(registro));
  });

  app.use((error,_req,res,_next) => {
    if (error.type === 'entity.parse.failed') return res.status(400).json({error:'JSON inválido'});
    if (error.type === 'entity.too.large') return res.status(413).json({error:'Solicitud demasiado grande'});
    console.error('Error interno de ID3D:',error);
    res.status(500).json({error:'Error interno del servidor'});
  });
  return app;
}
