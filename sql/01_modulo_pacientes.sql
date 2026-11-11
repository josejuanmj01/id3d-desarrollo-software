-- ID3D: estructura mínima para ejecutar la API de pacientes.
-- El modelo completo del proyecto incluye otras seis tablas.
-- Este script no elimina tablas ni registros existentes.

CREATE DATABASE IF NOT EXISTS id3d
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE id3d;

CREATE TABLE IF NOT EXISTS paciente (
    id_paciente INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    expediente VARCHAR(30) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    fecha_nacimiento DATE NULL,
    CONSTRAINT uq_paciente_expediente UNIQUE (expediente)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;