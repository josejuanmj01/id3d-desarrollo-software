import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { validate as esUuid } from 'uuid';
import { crearApp } from '../src/api.js';

test('API integra Express, Zod y UUID',async () => {
  const servidor = createServer(crearApp());
  servidor.listen(0,'127.0.0.1');
  await once(servidor,'listening');
  const base='http://127.0.0.1:'+servidor.address().port;
  async function pedir(metodo,ruta,datos) {
    const r=await fetch(base+ruta,{method:metodo,headers:{'Content-Type':'application/json'},
      ...(datos===undefined?{}:{body:JSON.stringify(datos)})});
    return {status:r.status,datos:await r.json()};
  }
  try {
    let r=await pedir('GET','/api/salud');
    assert.equal(r.status,200);
    r=await pedir('POST','/api/pacientes',{expediente:'',nombres:'Ana',apellidos:'Prueba'});
    assert.equal(r.status,400);
    r=await pedir('POST','/api/pacientes',{expediente:'DEMO-001',nombres:'Ana',apellidos:'Prueba'});
    assert.equal(r.status,201);
    assert.ok(esUuid(r.datos.id));
    const pacienteId=r.datos.id;
    r=await pedir('POST','/api/pacientes',{expediente:'DEMO-001',nombres:'Otra',apellidos:'Persona'});
    assert.equal(r.status,409);
    r=await pedir('POST','/api/estudios',{pacienteId,tipoEstudio:'Tomografía dental 3D',
      fechaRealizacion:'2026-11-09T12:00:00Z'});
    assert.equal(r.status,201);
    assert.ok(esUuid(r.datos.id));
    const estudioId=r.datos.id;
    assert.notEqual(estudioId,pacienteId);
    r=await pedir('POST','/api/estudios/'+estudioId+'/publicar');
    assert.equal(r.status,409);
    r=await pedir('POST','/api/estudios/'+estudioId+'/archivos',
      {nombreOriginal:'ejemplo.dcm',tipoMime:'application/dicom',tamanoBytes:2048});
    assert.equal(r.status,201);
    r=await pedir('POST','/api/estudios/'+estudioId+'/publicar');
    assert.equal(r.status,200);
    assert.equal(r.datos.estado,'PUBLICADO');
    r=await pedir('POST','/api/estudios/'+estudioId+'/archivos',
      {nombreOriginal:'otro.dcm',tipoMime:'application/dicom',tamanoBytes:2048});
    assert.equal(r.status,409);
    r=await pedir('GET','/api/estudios/'+estudioId);
    assert.equal(r.status,200);
    assert.equal(r.datos.pacienteId,pacienteId);
    r=await pedir('GET','/api/estudios/inexistente');
    assert.equal(r.status,404);
  } finally {
    await new Promise((resolve,reject)=>servidor.close(e=>e?reject(e):resolve()));
  }
});
