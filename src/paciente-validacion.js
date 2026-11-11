import { z } from 'zod';

export const pacienteSchema = z.object({
  expediente: z.string()
    .trim()
    .min(1, 'El expediente es obligatorio.')
    .max(30, 'El expediente admite hasta 30 caracteres.'),

  nombres: z.string()
    .trim()
    .min(1, 'El nombre es obligatorio.')
    .max(100, 'El nombre admite hasta 100 caracteres.'),

  apellidos: z.string()
    .trim()
    .min(1, 'Los apellidos son obligatorios.')
    .max(150, 'Los apellidos admiten hasta 150 caracteres.'),

  fechaNacimiento: z.iso.date({
    error: 'Usa una fecha válida con formato AAAA-MM-DD.'
  })
    .refine(
      (valor) => valor >= '1000-01-01'
        && valor <= new Date().toISOString().slice(0, 10),
      { message: 'La fecha debe estar entre el año 1000 y hoy.' }
    )
    .nullable()
    .default(null)
}).strict();