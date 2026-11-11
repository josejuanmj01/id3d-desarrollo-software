import express from 'express';
import { PacienteRepositorio } from './paciente-repositorio.js';
import { pacienteSchema } from './paciente-validacion.js';

const app = express();
const puerto = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.get('/api/estado', (req, res) => {
  res.json({
    proyecto: 'Imagen Dental 3D',
    estado: 'API en funcionamiento'
  });
});
const pacienteRepositorio = new PacienteRepositorio();

app.get('/api/pacientes', async (req, res) => {
  try {
    const pacientes = await pacienteRepositorio.listar();

    res.json({
      total: pacientes.length,
      pacientes
    });
  } catch (error) {
    console.error('Error al consultar pacientes:', error.code ?? error.name);

    res.status(500).json({
      mensaje: 'No se pudieron consultar los pacientes.'
    });
  }
});

app.post('/api/pacientes', async (req, res) => {
  const validacion = pacienteSchema.safeParse(req.body);

  if (!validacion.success) {
    return res.status(400).json({
      mensaje: 'Datos del paciente inválidos.',
      errores: validacion.error.issues.map((error) => ({
        campo: error.path.join('.'),
        mensaje: error.message
      }))
    });
  }

  try {
    const paciente = await pacienteRepositorio.crear(validacion.data);

    return res.status(201).json({
      mensaje: 'Paciente registrado correctamente.',
      paciente
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        mensaje: 'Ya existe un paciente con ese expediente.'
      });
    }

    console.error('Error al registrar paciente:', error.code ?? error.name);

    return res.status(500).json({
      mensaje: 'No se pudo registrar el paciente.'
    });
  }
});
app.listen(puerto, '127.0.0.1', () => {
  console.log(`Servidor disponible en http://127.0.0.1:${puerto}`);
});