import { pool } from './db.js';
import { Paciente } from './modelo.js';

export class PacienteRepositorio {
  async listar() {
    const [filas] = await pool.execute(`
      SELECT
        id_paciente,
        expediente,
        nombres,
        apellidos,
        fecha_nacimiento
      FROM paciente
      ORDER BY id_paciente
      LIMIT 100
    `);
    

    return filas.map((fila) => new Paciente(
      fila.id_paciente,
      fila.expediente,
      fila.nombres,
      fila.apellidos,
      fila.fecha_nacimiento
    ));
  }
    async crear(datos) {
    const [resultado] = await pool.execute(
      `INSERT INTO paciente
        (expediente, nombres, apellidos, fecha_nacimiento)
       VALUES (?, ?, ?, ?)`,
      [
        datos.expediente,
        datos.nombres,
        datos.apellidos,
        datos.fechaNacimiento
      ]
    );

    return new Paciente(
      resultado.insertId,
      datos.expediente,
      datos.nombres,
      datos.apellidos,
      datos.fechaNacimiento
    );
  }
}