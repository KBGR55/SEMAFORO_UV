import React from 'react';
import '../css/style.css';
import Footer from './Footer';
import BarraMenu from './BarraMenu';
import logo from '../logo.png';
import Comentario from './Comentario';

const Inicio = () => {
  return (
    <div >
      <header>
        <BarraMenu />
        <div className='header-content container'>
          <div className="content">
            <h1>¡BIENVENIDO AL SEMÁFORO UV!</h1>
            <p>Tu guía diaria para estar un paso adelante del sol,
               descubre las recomendaciones específicas para hoy y la intensidad de radiación ultravioleta, 
               mantente informado para cuidar tu piel y disfrutar responsablemente del sol. ¡Protegerte nunca fue tan fácil!</p>
          </div>
          <img src={logo} alt="ico" />
        </div>
      </header>
      <main className="services">
        <div className="service">
          <i className="fas fa-code"></i>
          <h3>API REST</h3>
          <p>Ofrece a los desarrolladores acceso directo a los datos sobre la radiación UV para sus proyectos,
            permite conectar fácilmente a la aplicación, amplía las posibilidades para integrar datos confiables
            y crea experiencias seguras para tus usuarios con nuestra API.
          </p>
        </div>
        <div className="service">
         <i className="fas fa-spray-can"></i>
          <h3>RECOMENDACIONES</h3>
          <p>Accede a recomendaciones diarias basadas en la radiación UV,
            protege tu piel con consejos personalizados según la intensidad del sol.
            ¡Disfruta del aire libre de manera segura con nuestras sugerencias!
          </p>
        </div>
        <div className="service">
        <i className="fas fa-chart-line"></i>
          <h3>GRÁFICA DE RADIACIÓN UV</h3>
          <p>Descubre la intensidad UV del día a través de nuestra gráfica, obtén datos actualizados del semáforo UV y 
            visualiza fácilmente la radiación solar diaria, conoce la exposición solar en tiempo real y toma decisiones 
            informadas para proteger tu piel. ¡Nuestra gráfica te muestra el camino hacia una exposición segura al sol!</p>
        </div>
      </main>
      <Comentario/>
      <Footer />
    </div>

  );
};

export default Inicio;