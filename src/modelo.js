// Modelo de dominio. Los objetos se conservan en memoria durante la ejecución.
function texto(valor, campo) {
  if (typeof valor !== 'string' || !valor.trim()) throw new Error(`${campo} es obligatorio`);
  return valor.trim();
}
function id(valor) {
  if (!Number.isSafeInteger(valor) || valor <= 0) throw new Error('Identificador inválido');
  return valor;
}
function fecha(valor) {
  const resultado = new Date(valor);
  if (valor == null || !Number.isFinite(resultado.getTime())) throw new Error('Fecha inválida');
  return resultado.getTime();
}
function instancia(valor, clase) {
  if (!(valor instanceof clase)) throw new Error(`Se requiere ${clase.name}`);
  return valor;
}

export class Rol {
  constructor(idRol, nombre) {
    this.idRol = id(idRol); this.nombre = texto(nombre, 'Nombre del rol');
    Object.freeze(this);
  }
}

export class Usuario {
  #activo = true;
  constructor(idUsuario, nombre, correo, rol) {
    this.idUsuario = id(idUsuario); this.nombre = texto(nombre, 'Nombre');
    this.correo = texto(correo, 'Correo');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo)) throw new Error('Correo inválido');
    this.rol = instancia(rol, Rol); Object.freeze(this);
  }
  get activo() { return this.#activo; }
  activar() { this.#activo = true; }
  desactivar() { this.#activo = false; }
}

export class Paciente {
  constructor(idPaciente, expediente, nombres, apellidos, fechaNacimiento = null) {
    this.idPaciente = id(idPaciente); this.expediente = texto(expediente, 'Expediente');
    this.nombres = texto(nombres, 'Nombres'); this.apellidos = texto(apellidos, 'Apellidos');
    this.fechaNacimiento = fechaNacimiento === null ? null : new Date(fecha(fechaNacimiento)).toISOString();
    Object.freeze(this);
  }
  nombreCompleto() { return `${this.nombres} ${this.apellidos}`; }
}

export class TipoEstudio {
  constructor(idTipoEstudio, nombre, descripcion = '') {
    this.idTipoEstudio = id(idTipoEstudio); this.nombre = texto(nombre, 'Tipo de estudio');
    if (typeof descripcion !== 'string') throw new Error('Descripción inválida');
    this.descripcion = descripcion; Object.freeze(this);
  }
}

export class Archivo {
  constructor(idArchivo, claveAlmacenamiento, nombreOriginal, tipoMime, tamanoBytes) {
    this.idArchivo = id(idArchivo);
    this.claveAlmacenamiento = texto(claveAlmacenamiento, 'Clave');
    this.nombreOriginal = texto(nombreOriginal, 'Nombre del archivo');
    this.tipoMime = texto(tipoMime, 'Tipo MIME');
    if (!Number.isSafeInteger(tamanoBytes) || tamanoBytes <= 0) throw new Error('Tamaño inválido');
    this.tamanoBytes = tamanoBytes; Object.freeze(this);
  }
}

const propietarioArchivo = new WeakMap();

export class Estudio {
  #estado = 'EN_PREPARACION';
  #archivos = [];
  constructor(idEstudio, paciente, tipoEstudio, folio, fechaRealizacion) {
    this.idEstudio = id(idEstudio); this.paciente = instancia(paciente, Paciente);
    this.tipoEstudio = instancia(tipoEstudio, TipoEstudio); this.folio = texto(folio, 'Folio');
    this.fechaRealizacion = new Date(fecha(fechaRealizacion)).toISOString(); Object.freeze(this);
  }
  get estado() { return this.#estado; }
  get archivos() { return [...this.#archivos]; }
  agregarArchivo(archivo) {
    instancia(archivo, Archivo);
    if (this.#estado !== 'EN_PREPARACION') throw new Error('Solo se agregan archivos en preparación');
    if (this.#archivos.some(a => a.idArchivo === archivo.idArchivo || a.claveAlmacenamiento === archivo.claveAlmacenamiento))
      throw new Error('Archivo duplicado');
    if (propietarioArchivo.has(archivo)) throw new Error('Archivo ya asociado a un estudio');
    propietarioArchivo.set(archivo, this);
    this.#archivos.push(archivo);
  }
  publicar() {
    if (this.#estado !== 'EN_PREPARACION') throw new Error('Estado no válido para publicar');
    if (!this.#archivos.length) throw new Error('Se requiere al menos un archivo');
    this.#estado = 'PUBLICADO';
  }
  archivar() {
    if (this.#estado !== 'PUBLICADO') throw new Error('Solo se archivan estudios publicados');
    this.#estado = 'ARCHIVADO';
  }
}

export class AccesoEstudio {
  #revocado = false;
  constructor(estudio, usuario, fechaOtorgamiento, fechaExpiracion = null) {
    this.estudio = instancia(estudio, Estudio); this.usuario = instancia(usuario, Usuario);
    const inicio = fecha(fechaOtorgamiento);
    const fin = fechaExpiracion === null ? null : fecha(fechaExpiracion);
    if (fin !== null && fin <= inicio) throw new Error('La expiración debe ser posterior');
    this.fechaOtorgamiento = new Date(inicio).toISOString();
    this.fechaExpiracion = fin === null ? null : new Date(fin).toISOString(); Object.freeze(this);
  }
  get revocado() { return this.#revocado; }
  revocar() { this.#revocado = true; }
  esVigente(instante = new Date()) {
    const ahora = fecha(instante);
    return !this.#revocado && this.usuario.activo && this.estudio.estado === 'PUBLICADO'
      && ahora >= fecha(this.fechaOtorgamiento)
      && (this.fechaExpiracion === null || ahora < fecha(this.fechaExpiracion));
  }
}
