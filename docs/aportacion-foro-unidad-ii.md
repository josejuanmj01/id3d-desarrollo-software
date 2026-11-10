# Aportación al foro — Unidad II

**Buenas tardes a todos.**

Por medio de esta participación comparto los avances de la Unidad II de Desarrollo de Software, tomando como base mi proyecto **Imagen Dental 3D (ID3D)**. El sistema busca facilitar la administración y entrega controlada de estudios dentales. Incorporé tres librerías a la implementación previa en JavaScript, Node.js y programación orientada a objetos.

**1. Express (API REST).** Permite crear rutas HTTP para que una aplicación cliente se comunique con el backend. Lo elegí para ofrecer servicios que después pueda consumir una interfaz web o móvil. Implementé rutas para verificar el servicio, registrar pacientes ficticios, crear estudios, asociar metadatos y publicar estudios.

**2. Zod (validación).** Comprueba que los datos recibidos cumplan las reglas de cada operación. Lo elegí para rechazar registros incompletos, identificadores mal formados, fechas incorrectas y tamaños o tipos MIME no admitidos. Implementé esquemas de validación que devuelven HTTP 400 ante datos inválidos.

**3. UUID (identificadores).** Genera identificadores con probabilidad de colisión muy baja. Lo elegí para asignar referencias públicas a pacientes y estudios, y generar folios, sin exponer los números internos del modelo orientado a objetos. Posteriormente MySQL deberá garantizar la unicidad de identificadores persistentes mediante restricciones UNIQUE.

**Implementación.** La nueva API REST local conserva las clases de la Unidad I. La demostración automatizada verifica el servicio HTTP, el rechazo de entradas incorrectas, la creación de pacientes y estudios con UUID, la regla que impide publicar sin archivos asociados y la publicación correcta después de agregar metadatos. Por ahora utiliza datos ficticios en memoria: no almacena estudios clínicos reales, no ofrece autenticación ni persistencia en MySQL.

**Código:** https://github.com/josejuanmj01/id3d-desarrollo-software/tree/unidad-ii-express-zod-uuid

**Capturas de pantalla:** [Insertar aquí las capturas reales de la ejecución antes de publicar en el foro.]

Estos avances brindan una base para integrar persistencia, autenticación y controles de acceso en la Unidad III. Quedo atento a sus comentarios y observaciones.

**Saludos cordiales.**

## Guía de capturas de pantalla

1. Abrir `package.json`: mostrar `express`, `zod`, `uuid` y scripts.
2. Abrir `src/api.js`: mostrar importaciones, `safeParse`, `uuidv4` y rutas.
3. Ejecutar `npm install` y `npm run demo:api`: fotografiar HTTP 200, HTTP 400, UUID y PUBLICADO.
4. Ejecutar `npm test`: fotografiar resumen de pruebas sin fallos, después de instalar dependencias.
5. Opcional: ejecutar `npm run api` y abrir `http://127.0.0.1:3000/api/salud` en navegador.
6. Abrir rama `unidad-ii-express-zod-uuid` en GitHub: mostrar los archivos publicados.

Tomar capturas legibles de ejecuciones reales, sin datos de pacientes y sin afirmar funcionalidades no implementadas. La rama debe revisarse y fusionarse a main solamente después de ejecutar las pruebas.
