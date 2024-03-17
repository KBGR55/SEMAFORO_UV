import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/style.css';
import logo_unl from '../images/logo_unl.png';

const Footer = () => {
  return (
    <footer className=" text-center">
      <div className="container p-2 pb-0">
        <section className="mb-4 transparent-background">
          <a className="btn btn-primary btn-floating m-1 ico github" href="https://github.com/KBGR55/semaforo_uv_frontend" role="button" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i>
          </a>
          <a className="btn btn-floating m-1 ico" href="https://unl.edu.ec/" target="_blank" rel="noopener noreferrer">
            <img src={logo_unl} alt="Logo UNL" />
          </a>
          <a className="btn btn-primary btn-floating m-1 ico github" href="mailto:semaforouv@gmail.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-google"></i>
          </a>
        </section>
      </div>
      <div className="text-center p-3 fondo-gis texto-primario">
        © 2023 DESARROLLADO:<a href="/"> GRUPO A - SEXTO - SEMÁFORO UV </a>
      </div>
    </footer>
  );
};

export default Footer;