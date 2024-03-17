import React, { useState, useEffect } from 'react';
import { differenceInMinutes } from 'date-fns';
import '../css/style_comentario.css';
import logo_cis from '../images/logo_cis.svg';
import { useForm } from 'react-hook-form';
import { PeticionPost, PeticionGet } from '../hooks/Conexion';
import mensajes from '../utilidades/Mensajes';
import { getRol ,getToken} from '../utilidades/Sessionutil';
import { verificarSpam } from './clasificador/Spam';

const Comentario = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
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

  async function performSentimentAnalysis(comentario) {
    const formdata = new FormData();
    formdata.append("key", "7d88c4fc998216e3345c8643fdfbbcee");
    formdata.append("txt", comentario);
    formdata.append("lang", "es");

    const requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };
    try {
      const response = await fetch("https://api.meaningcloud.com/sentiment-2.1", requestOptions);
      const data = await response.json();

      console.log("API Response:", data); // Muestra toda la respuesta de la API

      const scoreTag = data.score_tag;
      console.log("Score Tag:", scoreTag + "EEEEEEEEEEEEEEEEEE");
      return scoreTag;
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
      throw error; // Propaga el error para que pueda ser manejado en la llamada a la función
    }
  }

  const obtenerComentariosDeLaBaseDeDatos = async () => {
    try {
      const response = await PeticionGet(getToken(), 'comentario/clasificacion');

      if (response.code === 200) {
        const comentariosDesdeServidor = response.info;
        console.log('Comentarios obtenidos:', comentariosDesdeServidor);
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

  const handleNuevoComentarioChange = (event) => {
    setNuevoComentario(event.target.value);
  };

  const onSubmit = async (data) => {
    const verificado = verificarSpam(data.comentario);
    console.log(verificado);
    if (verificado === "NO VALIDO") {
      mensajes('Lo sentimos, tu comentario contiene palabras inapropiadas. Por favor, vuelve a intentarlo.', "warning", "warning");
    } else if (verificado === "VALIDO") {
      
      if (!data.comentario.trim()) {
        mensajes('Por favor, escribe un comentario antes de enviar.', "warning", "warning");
      } else {
      const clasifi = await performSentimentAnalysis(data.comentario);
      //__________________________________________________________________QUITAR SI ES NECESARIO__________________________________________

      //Se quema el dato para no consumir todas las peiticion gratuitas del API
      //const clasifi= "N";

        var datos = {
          "comentario": data.comentario,
          "clasificacion": clasifi
        };

        PeticionPost(getToken(), 'comentario/guardar', datos).then((info) => {
          if (info.code !== 200) {
            mensajes(info.msg, "error", "error");
          } else {
            mensajes(info.msg, 'success', 'Exitoso');

            window.location.reload()
            setNuevoComentario('');
          }
        });
      }

    }


  };

  return (
    <div className='container-tabla p-2'>
      <div className='crud shadow-lg '>
        <div className="col-sm-10 mt-4 ml-4 p-4">
          <h2 className='texto-subtitulo-1'>Comentarios</h2>
        </div>
        <div class="row">
          <div class="col-md-4 p-4 align-items-center justify-content-center order-md-first">
            <img src={logo_cis} alt="LOGO CIS_UNL" className="img-fluid" style={{ maxWidth: '100%' }} />
          </div>
          <div class="col-md-8 order-md-last">
            <div className="p-4">
              <ul className={`crud shadow-lg p-3 ${comentarios.length > 4 ? 'scrollable' : ''}`}>
                {comentarios.length === 0 && (
                  <li className="no-comentarios">
                    No hay comentarios por mostrar
                  </li>
                )}
                {comentarios.map(comentario => (
                  <li className="shadow-lg mb-3 " key={comentario.id}>
                    <div className="comment-main-level">
                      <div className="comment-box">
                        <div className="comment-head">
                          <h6 className="comment-name by-author">
                            {comentario.persona ? `${comentario.persona.nombres} ${comentario.persona.apellidos}` : 'Anónimo'}
                          </h6>
                          <span>hace {differenceInMinutes(new Date(), comentario.fecha_publicacion)} minutos</span>
                        </div>
                        <div className="comment-content" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                          {comentario.contenido}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {getToken() && getRol() === 'USUARIO' && (
                <form onSubmit={handleSubmit(onSubmit)} className="comment-form crud shadow-lg">
                  <div className="row p-2">
                    <div className="col-8">
                      <textarea class="form-control" rows="1"
                        onChange={handleNuevoComentarioChange}
                        placeholder="Escribe tu comentario aquí..."
                        {...register('comentario', {
                          required: true,
                          pattern: /^.{1,200}$/ // Expresión regular para aceptar entre 1 y 200 caracteres
                        })}
                        required
                      />
                    </div>
                    <div className="col-4 d-flex align-items-end justify-content-end">
                      <button type="submit" className="boton btn btn-lg">Comentar</button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Comentario;
