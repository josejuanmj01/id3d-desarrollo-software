# Imagen Dental 3D ID3D

Instituto Universitario Veracruzano
Maestría en Ingeniería y Desarrollo de Software
Proyecto de Desarrollo de Software — Unidades I y II
Proyecto: Sistema web de Imagen Dental 3D (ID3D)
Autor: José Juan Muñoz Jiménez.
Materia: Desarrollo de Software

ID3D busca gestionar y entregar estudios de imagen dental con acceso controlado.
La Unidad I implementó siete clases en JavaScript y una demostración
por consola. 
La Unidad II incorpora una API con Express, validación
con Zod y persistencia de pacientes en MySQL mediante mysql2.
El diagrama de clases corresponde al modelo desarrollado en la Unidad I.

## Unidad I: ejecutar la demostración en memoria

1. Instalar Node.js 22 o superior desde https://nodejs.org/ y Visual Studio Code desde
   https://code.visualstudio.com/ .
2. Extraer la carpeta completa `id3d-poo` y abrirla en Visual Studio Code.
3. Abrir Terminal > New Terminal dentro de esa carpeta.
4. Verificar `node --version` y ejecutar:

```bash
node src/demo.js
node --test
```

También se pueden usar npm start y npm test; en PowerShell,
npm.cmd start y npm.cmd test. La demostración del modelo no requiere
MySQL ni variables de entorno y utiliza datos ficticios en memoria.
Para instalar las dependencias y ejecutar la API, consultar la
sección de la Unidad II.

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
| docs/aportacion-foro.md | Borrador de doce renglones y espacio para el enlace real |

## Tecnologías y límites

Se eligió JavaScript porque permite implementar clases y compartir lenguaje entre el
backend y las futuras interfaces. Node.js ejecuta el modelo fuera del navegador.
Visual Studio Code ofrece asistencia para JavaScript y depuración.

Las interfaces previstas utilizarán React Native, Expo y React Native Web.
Actualmente, el backend incluye una API local para consultar y registrar
pacientes en MySQL. Las demás entidades conservan su implementación
como clases del modelo.

Quedan pendientes las interfaces, la autenticación, la autorización
de las rutas y la carga real de archivos. El método esVigente evalúa
un permiso del modelo; no reemplaza la seguridad de la API.
La demostración de estudios comprueba metadatos, no la existencia
física de archivos ni la integridad DICOM. No es un sistema listo
para producción.

La cardinalidad del modelo está documentada junto al diagrama.
En el módulo de pacientes, MySQL genera la clave primaria mediante
AUTO_INCREMENT y evita expedientes duplicados mediante una
restricción UNIQUE.

## Fuentes técnicas

- JavaScript en VS Code: https://code.visualstudio.com/docs/languages/javascript
- Pruebas en Node.js: https://nodejs.org/api/test.html
- Diagramas en GitHub: https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams


## Unidad II: integración de librerías

En esta unidad se amplió Imagen Dental 3D (ID3D) con una API
para consultar y registrar pacientes en MySQL. Se reutiliza la
clase Paciente del modelo orientado a objetos de la Unidad I.

### Librerías utilizadas y justificación

| Librería | Función e implementación | Justificación |
| --- | --- | --- |
| Express | Define las rutas HTTP para consultar el estado de la API, listar pacientes y registrar pacientes. Se utiliza en src/servidor.js. | Facilita la organización de las peticiones y respuestas del backend, que posteriormente podrá consumir la interfaz del proyecto. |
| Zod | Valida expediente, nombres, apellidos y fecha de nacimiento antes del registro. Sus reglas están en src/paciente-validacion.js. | Permite centralizar las reglas de entrada y devolver errores específicos, evitando enviar datos inválidos a MySQL. |
| mysql2 | Conecta JavaScript con MySQL mediante un grupo de conexiones y ejecuta consultas desde src/paciente-repositorio.js. | Permite conservar los pacientes en la base de datos y utilizar parámetros separados del SQL al realizar inserciones. |

### Entorno utilizado

- JavaScript con módulos ES y programación orientada a objetos.
- Node.js 26.13.0 y npm 11.20.0.
- MySQL Community Server 8.4.13.
- Visual Studio Code.
- Windows y PowerShell.
- Express 5.3.0, Zod 4.6.7 y mysql2 3.24.6.

### Configuración y ejecución

Ejecutar los comandos desde la carpeta principal del proyecto,
donde se encuentra package.json.

1. Instalar las dependencias indicadas en package-lock.json:

   ```powershell
   npm.cmd ci
   ```

2. Tener MySQL en ejecución. Para una instalación nueva, abrir
   sql/01_modulo_pacientes.sql en MySQL Workbench y ejecutarlo
   con un usuario que tenga permisos para crear la base de datos
   y la tabla.

   Este script prepara la estructura mínima del módulo de
   pacientes; no contiene el modelo completo de siete tablas.
   Si ya se dispone de la base de datos del proyecto anterior,
   se utiliza la tabla paciente existente.

   El script no elimina datos. CREATE TABLE IF NOT EXISTS no
   modifica ni comprueba la estructura de una tabla ya existente.
   La API no crea automáticamente la base de datos ni sus tablas.

3. Crear un archivo .env tomando .env.example como plantilla.
   Si .env ya existe, editarlo sin sobrescribir su configuración.

   ```dotenv
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=TU_USUARIO_MYSQL
   DB_PASSWORD="TU_CONTRASENA_MYSQL"
   DB_NAME=id3d
   PORT=3000
   ```

   Sustituir el usuario y la contraseña por las credenciales
   locales. El usuario necesita permisos SELECT e INSERT sobre
   id3d.paciente. No publicar el archivo .env.

4. Comprobar la conexión:

   ```powershell
   node --env-file=.env src/probar-conexion.js
   ```

5. Iniciar la API:

   ```powershell
   node --env-file=.env src/servidor.js
   ```

   Mantener abierta esta terminal mientras se utiliza la API.
   Para detenerla, presionar Ctrl + C.

### Rutas disponibles

Dirección local predeterminada: http://127.0.0.1:3000

| Método | Ruta | Función |
| --- | --- | --- |
| GET | /api/estado | Devuelve un mensaje que indica que la API responde. |
| GET | /api/pacientes | Consulta hasta 100 pacientes, ordenados por identificador. |
| POST | /api/pacientes | Valida y registra un paciente en MySQL. |

La ruta /api/estado comprueba la respuesta del servidor HTTP;
no comprueba por sí misma la conexión a MySQL.

Para registrar pacientes, enviar una petición POST con
Content-Type: application/json y un cuerpo como este:

```json
{
  "expediente": "EXP-DEMO-004",
  "nombres": "Elena",
  "apellidos": "Paciente de Prueba",
  "fechaNacimiento": "1992-04-18"
}
```

Cada expediente debe ser único. La fecha de nacimiento puede
omitirse o enviarse como null. Si se incluye una fecha, debe
ser válida y tener el formato AAAA-MM-DD.

Abrir una dirección en el navegador envía una petición GET;
para registrar un paciente se requiere una petición POST.

### Respuestas del registro

- HTTP 201: paciente registrado.
- HTTP 400: datos rechazados por la validación.
- HTTP 409: expediente duplicado.
- HTTP 500: error interno durante el registro.

### Verificaciones realizadas

- Conexión desde JavaScript a la base de datos id3d.
- Respuesta de la ruta /api/estado.
- Consulta de los pacientes de prueba almacenados en MySQL.
- Registro de un paciente válido con respuesta HTTP 201.
- Rechazo de un nombre vacío y una fecha inexistente con HTTP 400.
- Consulta SQL que confirmó el registro válido y la ausencia
  del expediente rechazado.
- Ejecución de las 13 pruebas del modelo anterior:
  13 aprobadas y 0 fallidas.

Para ejecutar las pruebas del modelo:

```powershell
npm.cmd test
```

Estas pruebas corresponden al modelo de clases. Las pruebas
de la API y de persistencia se realizaron manualmente y se
documentaron mediante capturas de pantalla.

### Alcance de esta entrega

Esta versión implementa consulta y registro de pacientes,
validación de entradas y persistencia en MySQL. Se ejecuta
localmente con datos ficticios.

La interfaz en React Native y la autenticación y autorización
de las rutas quedan pendientes para etapas posteriores.
La API escucha únicamente en 127.0.0.1.

### Evidencias de funcionamiento

Las capturas se encuentran en [docs/evidencias](docs/evidencias).

| Captura | Evidencia |
| --- | --- |
| [01](docs/evidencias/01_Librerias_instaladas.png) | Instalación y versiones de Express, Zod y mysql2. |
| [02](docs/evidencias/02_Conexion_MySQL.png) | Conexión de JavaScript con MySQL mediante mysql2. |
| [03](docs/evidencias/03_API_Express_Estado.png) | Respuesta de la ruta de estado implementada con Express. |
| [04](docs/evidencias/04_Consulta_Pacientes_MySQL.png) | Consulta de pacientes desde la API. |
| [05](docs/evidencias/05_Registro_Paciente_Exitoso.png) | Registro válido con respuesta HTTP 201. |
| [06](docs/evidencias/06_Validacion_Zod_Datos_Invalidos.png) | Rechazo de datos incorrectos mediante Zod, con HTTP 400. |
| [07](docs/evidencias/07_Verificacion_Persistencia_MySQL.png) | Verificación en MySQL del registro válido y ausencia del rechazado. |
| [08](docs/evidencias/08_Pruebas_Modelo_POO.png) | Las 13 pruebas del modelo aprobadas, sin fallos. |

### Documentación de las librerías

- Express: https://expressjs.com/
- Zod: https://zod.dev/
- mysql2: https://sidorares.github.io/node-mysql2/docs