# Imagen Dental 3D ID3D

Intituto Universitario Veracruzando.

Maestria en Ingeniería y Desarrollo de Software.

Implementación inicial orientada a objetos para Desarrollo de Software, Unidad I.

Proyecto: Sistema web de Imagen Dental 3D (ID3D).

Autor: José Juan Muñoz Jiménez.

Materia: Desarrollo de Software.

ID3D busca gestionar y entregar estudios de imagen dental con acceso controlado.
Esta entrega implementa siete clases en JavaScript y una demostración por consola.
El diagrama fue reconstruido y actualizado para esta actividad; no es una copia
verificada de la entrega anterior de Análisis y Diseño de Sistemas.

## Ejecutar en Windows, macOS o Linux

1. Instalar Node.js 22 o superior desde https://nodejs.org/ y Visual Studio Code desde
   https://code.visualstudio.com/ .
2. Extraer la carpeta completa `id3d-poo` y abrirla en Visual Studio Code.
3. Abrir Terminal > New Terminal dentro de esa carpeta.
4. Verificar `node --version` y ejecutar:

```bash
node src/demo.js
node --test
```

También se pueden usar `npm start` y `npm test`. No hay paquetes externos: no es
necesario ejecutar npm install. No se necesitan credenciales, variables de entorno
ni MySQL para esta demostración en memoria. Los datos se pierden al terminar.

## Resultado esperado

```text
Validación esperada: Se requiere al menos un archivo
Paciente: Paciente Ficticio
Estado: PUBLICADO
Acceso autorizado: true
Acceso después de revocar: false
Demostración en memoria: no se cargan ni descargan archivos reales.
```

## Contenido

| Archivo | Función |
|---|---|
| [docs/diagrama-clases.md](docs/diagrama-clases.md) | Diagrama UML en Mermaid, reglas y correspondencia con MySQL |
| src/modelo.js | Siete clases, constructores y validaciones |
| src/demo.js | Escenario reproducible con datos ficticios |
| test/modelo.test.js | Trece pruebas de comportamiento |
| docs/aportacion-foro.md | Descripción del proyecto y enlace |

## Tecnologías y límites

Se eligió JavaScript porque permite implementar clases y compartir lenguaje entre el
backend y las futuras interfaces. Node.js ejecuta el modelo fuera del navegador.
Visual Studio Code ofrece asistencia para JavaScript y depuración.

La arquitectura prevista utilizará React Native, Expo y React Native Web para las
interfaces; Node.js y una API para el backend; MySQL con InnoDB para la persistencia.
Esta entrega NO implementa interfaces, servidor HTTP, conexión MySQL, autenticación,
carga real de archivos ni autorización del operador que concede permisos. El método
esVigente evalúa un permiso ya creado; no reemplaza la seguridad de una API.
La demo comprueba metadatos, no existencia física de archivos ni integridad DICOM.
No es un sistema listo para producción.

La cardinalidad y los límites de esta iteración están documentados junto al diagrama.
El adaptador MySQL deberá hacer que cada elemento del sistema tenga un identificador 
único que no se repita, para evitar confusiones o errores en correos, folios, claves y permisos,
y mapear objetos a las tablas existentes.

## Fuentes técnicas

- JavaScript en VS Code: https://code.visualstudio.com/docs/languages/javascript
- Pruebas en Node.js: https://nodejs.org/api/test.html
- Diagramas en GitHub: https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams
