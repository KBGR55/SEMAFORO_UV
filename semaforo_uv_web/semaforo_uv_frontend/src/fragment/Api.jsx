import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-github'; // Actualizar importación del tema
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/ext-language_tools';
import { gettokenApi } from '../utilidades/Sessionutil';
import '../css/style.css';
import Footer from './Footer';
import BarraMenu from './BarraMenu';

const Api = () => {
  const [outputsGet, setOutputsGet] = useState({});
  const [outputsPost, setOutputsPost] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const URL_BACKEND_API = "https://computacion.unl.edu.ec/uv/api/";

  const token = {
    peticion1: { metodo: 'Token asignado', tokenApi: gettokenApi() },
  };

  const lista_peticiones_get = {
    peticion1: { metodo: 'GET - LISTA DISPOSITIVOS', peticion: URL_BACKEND_API + 'listar' },
    peticion2: { metodo: 'GET - LISTA DISPOSITIVOS ACTIVOS', peticion: URL_BACKEND_API + 'activos' },
    peticion3: { metodo: 'GET - ', peticion: URL_BACKEND_API + 'medicionPromedio' },
    peticion4: { metodo: 'GET - ', peticion: URL_BACKEND_API + 'medicionDispositivos' },
  };

  const lista_peticiones_post = {
    peticion1: { metodo: 'POST - PROMEDIO POR FECHAS', peticion: URL_BACKEND_API + 'medicionFechas' },
    peticion2: { metodo: 'POST - PROMEDIO POR SEMANAS', peticion: URL_BACKEND_API + 'medicionSemana' },
    peticion3: { metodo: 'POST - PROMEDIO POR DIA', peticion: URL_BACKEND_API + 'medicionDia' },
  };

  const executeGetRequest = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setOutputsGet({ ...outputsGet, [url]: JSON.stringify(data, null, 2) });
    } catch (error) {
      console.error('Error fetching API:', error);
      setOutputsGet({ ...outputsGet, [url]: `Error fetching API: ${error.message}` });
    }
  };

  const executePostRequest = async (url) => {
    try {
      console.log('startDate:', startDate, 'endDate:', endDate);
      console.log('url:', url);
      const token = gettokenApi();
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-token': token, // Incluir el token en el encabezado
        },
        body: JSON.stringify({ fechaInicio: startDate, fechaFin: endDate }),
      });
      
      console.log('response:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setOutputsPost({ ...outputsPost, [url]: JSON.stringify(data, null, 2) });
    } catch (error) {
      console.error('Error fetching API:', error);
      setOutputsPost({ ...outputsPost, [url]: `Error fetching API: ${error.message}` });
    }
  };
  const handleCopyToClipboard = (url) => {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = url;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    alert('Copied request to clipboard!');
  };

  // Obtener la fecha actual en formato ISO
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div>
      <header>
        <BarraMenu />
      </header>
      <main>
        <div className="p-4 row">
          <div className="col-sm-10 mt-5 mb-4 ml-4 ">
            <h2 className='texto-subtitulo-1'>Listado de peticiones disponibles</h2>
          </div>
        </div>
        <div className="container text-center crud shadow-lg mb-4">
          <h2 className='texto-primario-h2'>Token</h2>
          <div className="accordion p-2 mb-2" id="accordionGet">
            {Object.entries(token).map(([clave, valor], index) => (
              <div className="accordion-item mb-5" key={index}>
                <div className={`d-flex justify-content-between theme-ambiance`}>
                  <p className="accordion-header metodo" id={`headingGet${index + 1}`}>{valor.metodo}</p>
                  <div className="d-flex p-2">
                    <button
                      className="btn btn-primary btn-consola"
                      type="button"
                      onClick={() => handleCopyToClipboard(valor.tokenApi)}
                    >
                      <i className="far fa-copy"></i>
                    </button>
                  </div>
                </div>
                <div className="alert alert-info theme-ambiance" role="alert">
                  {valor.tokenApi}
                </div>
              </div>
            ))}
          </div>
          <h2 className='texto-primario-h2'>GET</h2>
          <div className="accordion p-2 mb-2" id="accordionGet">
            {Object.entries(lista_peticiones_get).map(([clave, valor], index) => (
              <div className="accordion-item mb-5" key={index}>
                <div className={`d-flex justify-content-between theme-ambiance`}>
                  <p className="accordion-header metodo" id={`headingGet${index + 1}`}>{valor.metodo}</p>
                  <div className="d-flex p-2">
                    <button
                      className="btn btn-primary btn-consola"
                      type="button"
                      onClick={() => handleCopyToClipboard(valor.peticion)}
                    >
                      <i className="far fa-copy"></i>
                    </button>
                    <button
                      className="btn btn-primary btn-consola"
                      type="button"
                      onClick={() => executeGetRequest(valor.peticion)}
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapseGet${index + 1}`}
                      aria-expanded="true"
                      aria-controls={`collapseGet${index + 1}`}
                    >
                      <i className="fas fa-play"></i>
                    </button>
                  </div>
                </div>
                <div className="alert alert-info theme-ambiance" role="alert">
                  {valor.peticion}
                </div>
                <div id={`collapseGet${index + 1}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} aria-labelledby={`headingGet${index + 1}`} data-bs-parent="#accordionGet">
                  <AceEditor
                    mode="json"
                    theme="ambiance"
                    name={`output-editor-get-${index}`}
                    editorProps={{ $blockScrolling: Infinity }}
                    value={outputsGet[valor.peticion] || ''}
                    style={{ height: '150px', fontSize: "20px", width: '100%' }}
                    readOnly={true} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="container text-center crud shadow-lg mb-4">
          <h2 className='texto-primario-h2'>POST</h2>
          <div className="mb-3 row">
            <div className="col-md-6">
              <label htmlFor="start-date" className="form-label">Fecha de inicio:</label>
              <input type="date" className="form-control border border-dark" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} max={currentDate} />
            </div>
            <div className="col-md-6">
              <label htmlFor="end-date" className="form-label">Fecha de fin:</label>
              <input type="date" className="form-control border border-dark" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} max={currentDate} />
            </div>
          </div>

          <div className="accordion p-2 mb-2" id="accordionPost">
            {Object.entries(lista_peticiones_post).map(([clave, valor], index) => (
              <div className="accordion-item mb-5" key={index}>
                <div className={`d-flex justify-content-between theme-ambiance`}>
                  <p className="accordion-header metodo" id={`headingPost${index + 1}`}>{valor.metodo}</p>
                  <div className="d-flex p-2">
                    <button
                      className="btn btn-primary btn-consola"
                      type="button"
                      onClick={() => handleCopyToClipboard(valor.peticion)}
                    >
                      <i className="far fa-copy"></i>
                    </button>
                    <button
                      className="btn btn-primary btn-consola"
                      type="button"
                      onClick={() => executePostRequest(valor.peticion)}
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapsePost${index + 1}`}
                      aria-expanded="true"
                      aria-controls={`collapsePost${index + 1}`}
                    >
                      <i className="fas fa-play"></i>
                    </button>
                  </div>
                </div>
                <div className="alert alert-info theme-ambiance" role="alert">
                  {valor.peticion}
                </div>
                <div id={`collapsePost${index + 1}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} aria-labelledby={`headingPost${index + 1}`} data-bs-parent="#accordionPost">
                  <AceEditor
                    mode="json"
                    theme="ambiance"
                    name={`output-editor-post-${index}`}
                    editorProps={{ $blockScrolling: Infinity }}
                    value={outputsPost[valor.peticion] || ''}
                    style={{ height: '150px', fontSize: "20px", width: '100%' }}
                    readOnly={true} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Api;
