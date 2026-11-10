# Imagen Dental 3D (ID3D) · Desarrollo de Software · Unidad II

**Maestría en Ingeniería y Desarrollo de Software — IUV**  
**Autor:** José Juan Muñoz Jiménez  
**Repositorio:** https://github.com/josejuanmj01/id3d-desarrollo-software

Esta versión extiende la entrega de la Unidad I sin sustituir su modelo orientado a objetos. Se implementan tres librerías reales: **Express**, **Zod** y **UUID**. El resultado es una **API REST de demostración** que trabaja únicamente con datos ficticios en memoria.

## Las tres librerías implementadas

| Librería | Uso específico en ID3D | Evidencia |
|---|---|---|
| Express 5 | Expone rutas HTTP para registrar pacientes, crear estudios, registrar metadatos y publicar estudios. | `src/api.js` y consulta `GET /api/salud` |
| Zod 4 | Comprueba campos, formato UUID, fecha, MIME y tamaños; rechaza solicitudes incorrectas con HTTP 400. | `src/api.js` y paso 2 de `npm run demo:api` |
| uuid 14 | Genera identificadores públicos UUID v4 para pacientes y estudios y folios de estudios. | `src/api.js` y pasos 3 y 4 de `npm run demo:api` |

**Importante:** UUID v4 reduce mucho el riesgo de colisión, pero no garantiza por sí solo unicidad global absoluta. La demo evita colisiones en los registros en memoria; la futura base de datos MySQL deberá imponer `UNIQUE` en los identificadores persistentes.

## Requisitos y ejecución

Se requiere **Node.js 22 o superior** y una conexión a internet **para instalar** las dependencias por primera vez.

En Visual Studio Code, abrir la carpeta del proyecto y ejecutar:

```bash
npm install
npm run demo:api
npm test
```

Para levantar la API REST localmente:

```bash
npm run api
```

Abrir `http://127.0.0.1:3000/api/salud` en el navegador. El resultado esperado es:

```json
{"sistema":"ID3D","estado":"activo","persistencia":"memoria"}
```

La demostración completa `npm run demo:api` crea su propio servidor HTTP temporal y realiza una prueba integrada con datos ficticios: consulta de salud, rechazo de campos inválidos, creación de paciente con UUID, creación de estudio, prevención de publicación sin archivos, incorporación de metadatos y publicación.

La demo original de la Unidad I se mantiene:

```bash
npm start
```

## Rutas disponibles

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/salud` | Comprueba que el servidor responde |
| POST | `/api/pacientes` | Registra un paciente ficticio |
| POST | `/api/estudios` | Crea un estudio asociado a un paciente |
| POST | `/api/estudios/:id/archivos` | Registra metadatos, **sin subir un archivo real** |
| POST | `/api/estudios/:id/publicar` | Publica el estudio si tiene al menos un archivo de metadatos |
| GET | `/api/estudios/:id` | Consulta el estudio ficticio por UUID |

Ejemplo de paciente:

```json
{"expediente":"DEMO-001","nombres":"Paciente","apellidos":"Ficticio"}
```

Ejemplo de estudio (sustituir `UUID_DEVUELTO` por el identificador del paso anterior):

```json
{"pacienteId":"UUID_DEVUELTO","tipoEstudio":"Radiografía panorámica","fechaRealizacion":"2026-11-09T12:00:00Z"}
```

La ejecución automatizada no requiere Postman ni insertar UUID manualmente.

## Archivos relevantes

- `src/modelo.js`: siete clases del modelo original, intactas.
- `src/demo.js`: demostración original de la Unidad I.
- `src/api.js`: implementación de Express + Zod + UUID.
- `src/servidor.js`: inicio del servicio HTTP en `127.0.0.1:3000`.
- `src/demo-api.js`: demostración automatizada con resultados visibles por consola.
- `test/modelo.test.js`: trece pruebas originales.
- `test/api.test.js`: prueba de integración que verifica el ciclo completo, validaciones y estados HTTP.
- `docs/guia-evidencias-unidad-ii.md`: documentación de las bibliotecas y guía para capturas de ejecución.
- `docs/documentacion-unidad-i.md`: documentación de la implementación previa.

## Restricciones y siguientes pasos

**Prototipo local para fines académicos; NO apto para producción ni para información clínica real.** Los datos se pierden al detener el proceso. No implementa autenticación, autorización de usuarios, cifrado de datos clínicos, auditoría, carga/validación de archivos reales ni conexión a MySQL. El atributo MIME es un metadato proporcionado por el cliente y no verifica la integridad del archivo. No se debe publicar el servidor ni cargar estudios de pacientes reales.

Para la Unidad III se podrá implementar un adaptador MySQL con restricciones de unicidad, control de acceso autenticado, registro de auditoría y almacenamiento seguro de archivos. Las clases existentes se conservan como base del dominio.

## Fuentes

- Express: https://expressjs.com/
- Zod: https://zod.dev/basics
- UUID: https://www.npmjs.com/package/uuid
- Node.js Test Runner: https://nodejs.org/api/test.html