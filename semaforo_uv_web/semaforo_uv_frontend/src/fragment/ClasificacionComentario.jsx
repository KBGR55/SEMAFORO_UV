import React, { useState, useEffect } from 'react';
import '../css/style.css';
import Footer from './Footer';
import BarraMenu from './BarraMenu';
import { useNavigate } from "react-router";
import { PeticionGet } from '../hooks/Conexion';
import {  getToken } from '../utilidades/Sessionutil';
import mensajes from '../utilidades/Mensajes';

import BarsChart from '../utilidades/BarsChart';
import { differenceInMinutes } from 'date-fns';

const ClasificacionComentario = () => {
  const [negativos, setnegativo] = useState([]);
  const [positivos, setpositivo] = useState([]);
  const [comentarios, setComentarios] = useState([]);

  const cantidad_comentarios = [positivos, negativos];
  const clasificacion = ["POSITIVO", "NEGATIVO"];
  const obtenerFechaFormateada = (fechaString) => {
    const fecha = new Date(fechaString);
    fecha.setDate(fecha.getDate() + 1);
    const year = fecha.getFullYear();
    const month = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const day = ('0' + fecha.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };
  const comentariosFormateados = comentarios.map(comentario => ({
    nombre: comentario.persona ? `${comentario.persona.nombres} ${comentario.persona.apellidos}` : 'Anónimo',
    contenido: comentario.contenido,
    clasificacion: comentario.clasificacion,
    fecha_publicacion: obtenerFechaFormateada(comentario.fecha_publicacion)
}));

  const data = {
    listacolumna3: { nombreColumna: "NOMBRES", datos: comentariosFormateados.map(comentario => comentario.nombre) },
    listacolumna4: { nombreColumna: "COMENTARIO", datos: comentariosFormateados.map(comentario => comentario.contenido) },
    listacolumna5: { nombreColumna: "CLASIFICACIÓN", datos: comentariosFormateados.map(comentario => comentario.clasificacion) },
    listacolumna6: { nombreColumna: "FECHA PUBLICACIÓN", datos: comentariosFormateados.map(comentario => comentario.fecha_publicacion) }};

  useEffect(() => {
    const obtenerComentarios = async () => {
      try {
        const comentariosObtenidos = await obtenerComentariosDeLaBaseDeDatos();
        setComentarios(comentariosObtenidos);
      } catch (error) {
        console.error('Error al obtener comentarios:', error);
      }
    };

    obtenerComentarios();

  }, []);



  const dividirTextoEnLineas = (texto) => {
    const palabras = texto.split(' ');
    const lineas = [];
    let lineaActual = '';
    palabras.forEach(palabra => {
      if (lineaActual.split(' ').length < 7) {
        lineaActual += `${palabra} `;
      } else {
        lineas.push(lineaActual.trim());
        lineaActual = `${palabra} `;
      }
    });
    lineas.push(lineaActual.trim());
    return lineas;
  };

  const obtenerComentariosDeLaBaseDeDatos = async () => {
    try {
      const response = await PeticionGet(getToken(), 'comentario/clasificacion');

      if (response.code === 200) {
        const comentariosDesdeServidor = response.info;
        const cantidadNegativos = response.CN;
        const cantidadPositivos = response.CP;
        setnegativo(cantidadNegativos);
        setpositivo(cantidadPositivos);
        return comentariosDesdeServidor;
      } else {
        mensajes(response.msg, "error", "error");
        return [];
      }
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      mensajes('Error al obtener comentarios', "error", "error");
      return [];
    }
  };

  return (
    <div>
      <header>
        <BarraMenu />
      </header>
      <main>
        <div className="p-4 row">
          <div className="col-sm-10 mt-5 mb-4 ml-4 ">
            <h2 className='texto-subtitulo-1'>Listado de comentarios</h2>
          </div>
        </div>
        <div className="container-tabla p-3 rounded cart">
          <div className="row">
            <div className="col-md-8">
              <div className="container-tabla">
                <div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="col">
                    <div className="table-responsive">
                      {comentarios.length === 0 ? (
                        <div className="mensaje-vacio">No hay comentarios por mostrar</div>
                      ) : (
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th >Nombres</th>
                              <th >Comentario</th>
                              <th >Clasificacion</th>
                              <th >Fecha publicación</th>
                            </tr>
                          </thead>
                          <tbody>
                            {comentarios.map(comentario => (
                              <tr key={comentario.id}>
                                <td>{comentario.persona ? `${comentario.persona.nombres} ${comentario.persona.apellidos}` : 'Anónimo'}</td>
                                <td>
                                  {dividirTextoEnLineas(comentario.contenido).map((linea, index) => (
                                    <div key={index}>{linea}</div>
                                  ))}
                                </td>
                                <td>{comentario.clasificacion}</td>
                                <td>{obtenerFechaFormateada(comentario.fecha_publicacion)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div >
            </div>
            <div className="col-md-4">
              <BarsChart data={data} cantidad_comentarios={cantidad_comentarios} clasificacion={clasificacion} nombreFoto="clasificacion_comentarios"/>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClasificacionComentario;
