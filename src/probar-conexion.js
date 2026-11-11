import mysql from 'mysql2/promise';

let conexion;

try {
  conexion = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [resultado] = await conexion.execute(
    'SELECT DATABASE() AS base_de_datos, VERSION() AS version_mysql'
  );

  console.log('Conexión con MySQL establecida correctamente.');
  console.table(resultado);
} catch (error) {
  console.error('No se pudo conectar con MySQL.');
  console.error('Código del error:', error.code);
  process.exitCode = 1;
} finally {
  if (conexion) {
    await conexion.end();
  }
}