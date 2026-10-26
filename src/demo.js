import { Rol, Usuario, Paciente, TipoEstudio, Archivo, Estudio, AccesoEstudio } from './modelo.js';
const rol = new Rol(1, 'Odontólogo');
const usuario = new Usuario(1, 'Profesional de prueba', 'demo@example.com', rol);
const paciente = new Paciente(1, 'DEMO-001', 'Paciente', 'Ficticio');
const tipo = new TipoEstudio(1, 'Radiografía panorámica');
const estudio = new Estudio(1, paciente, tipo, 'EST-DEMO-001', '2026-10-26T10:00:00Z');
const archivo = new Archivo(1, 'demo/imagen.dcm', 'imagen.dcm', 'application/dicom', 2048);
try { estudio.publicar(); } catch (error) { console.log('Validación esperada:', error.message); }
estudio.agregarArchivo(archivo);
estudio.publicar();
const acceso = new AccesoEstudio(estudio, usuario, '2026-10-26T10:00:00Z', '2026-10-27T10:00:00Z');
const instante = '2026-10-26T12:00:00Z';
console.log('Paciente:', paciente.nombreCompleto());
console.log('Estado:', estudio.estado);
console.log('Acceso autorizado:', acceso.esVigente(instante));
acceso.revocar();
console.log('Acceso después de revocar:', acceso.esVigente(instante));
console.log('Demostración en memoria: no se cargan ni descargan archivos reales.');
