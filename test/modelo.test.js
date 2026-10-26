import test from 'node:test';
import assert from 'node:assert/strict';
import {Rol,Usuario,Paciente,TipoEstudio,Archivo,Estudio,AccesoEstudio} from '../src/modelo.js';
function escenario() {
 const u=new Usuario(1,'Demo','demo@example.com',new Rol(1,'Consulta'));
 const e=new Estudio(1,new Paciente(1,'P1','Ana','Prueba'),new TipoEstudio(1,'RX'),'E1','2026-01-01');
 const f=new Archivo(1,'a.dcm','a.dcm','application/dicom',100);
 return {u,e,f};
}
test('impide publicar sin archivos',()=>{assert.throws(()=>escenario().e.publicar(),/archivo/);});
test('publica con archivo y protege colección',()=>{const {e,f}=escenario();e.agregarArchivo(f);e.archivos.pop();e.publicar();assert.equal(e.estado,'PUBLICADO');assert.equal(e.archivos.length,1);});
test('rechaza duplicados',()=>{const {e,f}=escenario();e.agregarArchivo(f);assert.throws(()=>e.agregarArchivo(f),/duplicado/);});
test('no admite archivos después de publicar',()=>{const {e,f}=escenario();e.agregarArchivo(f);e.publicar();assert.throws(()=>e.agregarArchivo(f),/preparación/);});
test('validación de tamaño y correo',()=>{assert.throws(()=>new Archivo(1,'x','x','x',0));assert.throws(()=>new Usuario(1,'X','incorrecto',new Rol(1,'R')));});
test('valida expiración',()=>{const {e,u}=escenario();assert.throws(()=>new AccesoEstudio(e,u,'2026-01-02','2026-01-01'));});
test('límites temporales del permiso',()=>{const {e,u,f}=escenario();e.agregarArchivo(f);e.publicar();const a=new AccesoEstudio(e,u,'2026-01-01','2026-01-02');assert.equal(a.esVigente('2025-12-31'),false);assert.equal(a.esVigente('2026-01-01'),true);assert.equal(a.esVigente('2026-01-02'),false);});
test('revocación bloquea acceso',()=>{const {e,u,f}=escenario();e.agregarArchivo(f);e.publicar();const a=new AccesoEstudio(e,u,'2026-01-01');a.revocar();assert.equal(a.esVigente('2026-01-03'),false);});
test('usuario inactivo bloquea y reactivación restaura acceso',()=>{const {e,u,f}=escenario();e.agregarArchivo(f);e.publicar();const a=new AccesoEstudio(e,u,'2026-01-01');u.desactivar();assert.equal(a.esVigente('2026-01-03'),false);u.activar();assert.equal(a.esVigente('2026-01-03'),true);});
test('archivo no publicado y archivado bloquean acceso',()=>{const {e,u,f}=escenario();const a=new AccesoEstudio(e,u,'2026-01-01');assert.equal(a.esVigente('2026-01-03'),false);e.agregarArchivo(f);e.publicar();e.archivar();assert.equal(a.esVigente('2026-01-03'),false);});
test('rechaza fecha inválida y relación equivocada',()=>{assert.throws(()=>new Estudio(1,{}, {},'E','incorrecto'));const {e,u}=escenario();assert.throws(()=>new AccesoEstudio(e,u,'incorrecto'));});
test('identidad pública inmutable',()=>{const {u}=escenario();assert.throws(()=>{u.idUsuario=2;},TypeError);});

test('un archivo no pertenece a dos estudios',()=>{const a=escenario(),b=escenario();a.e.agregarArchivo(a.f);assert.throws(()=>b.e.agregarArchivo(a.f),/asociado/);});
