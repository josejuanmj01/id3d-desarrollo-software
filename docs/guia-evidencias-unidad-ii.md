# ID3D · Unidad II: implementación y evidencias

Este documento técnico forma parte del **repositorio de código** de ID3D. Explica la implementación y cómo reproducir sus evidencias. La participación académica se publica **por separado en el foro de la plataforma universitaria**; GitHub no es el espacio de entrega del foro.

## Bibliotecas incorporadas

| Biblioteca | Uso en ID3D | Archivo |
|---|---|---|
| Express 5 | Servidor HTTP y API REST de pacientes y estudios ficticios | `src/api.js` y `src/servidor.js` |
| Zod 4 | Validación de entradas con esquemas y respuestas HTTP 400 | `src/api.js` |
| UUID v4 | Identificadores públicos de pacientes, estudios y folios | `src/api.js` |

## Ejecución local

Requisitos: Node.js 22 o superior y conexión para la instalación inicial.

```bash
npm install
npm run demo:api
npm test
```

Opcionalmente, iniciar el servidor mediante `npm run api` y consultar `http://127.0.0.1:3000/api/salud`.

**Nota sobre las pruebas:** verificar los resultados reales después de ejecutar los comandos; la existencia de pruebas en el repositorio no significa que se haya comprobado su ejecución en cada computadora.

## Guía para obtener evidencias claras

1. **Dependencias.** Abrir `package.json` y capturar las entradas `express`, `zod` y `uuid` junto con los comandos npm.
2. **Código.** Abrir `src/api.js`; capturar las importaciones, el esquema de Zod y la función que genera UUID.
3. **API REST.** Ejecutar `npm run demo:api`; capturar las salidas HTTP 200, 400 y 201, el UUID generado y el resultado `PUBLICADO`.
4. **Pruebas.** Ejecutar `npm test`; capturar la salida real y el resumen de resultados.
5. **Servidor (opcional).** Ejecutar `npm run api` y abrir en un navegador `http://127.0.0.1:3000/api/salud`.
6. **Código publicado.** Mostrar en GitHub la rama `unidad-ii-express-zod-uuid` y los archivos incorporados.

Las capturas son evidencia de ejecución y deben realizarse en el equipo donde se haya probado el código. **No incluir datos reales de pacientes.**

## Alcance del prototipo

Este sistema es una demostración académica con registros ficticios en memoria. No ofrece autenticación, persistencia MySQL, almacenamiento de archivos DICOM reales ni seguridad clínica de producción. Los trabajos posteriores podrán retomar el modelo de la Unidad I e implementar esas capacidades.
