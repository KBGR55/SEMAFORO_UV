import React from 'react';
import '../css/style.css';
import Footer from './Footer';
import BarraMenu from './BarraMenu';
import member1 from '../images/members/member1.png';
import member2 from '../images/members/member2.png';
import member3 from '../images/members/member3.png';
import member4 from '../images/members/member4.png';
import member5 from '../images/members/member5.png';
import logo_semaforo from '../logo.png';
import logo_unl from '../images/logo_unl.png';

const Conocenos = () => {
  return (
    <div >
      <header>
        <BarraMenu />
      </header>
      <main >
        <div className="p-4 row">
          <div className="col-sm-10 mt-5 mb-4 ml-4 ">
            <h2 className='texto-subtitulo-1'>CONÓCENOS</h2>
          </div>
        </div>
        <div className='container-tabla p-2'>
          <div className='crud shadow-lg '>
            <div className="row">
              <div className="col-md-4 p-4 d-flex align-items-center justify-content-center order-md-first">
                <img src={logo_unl} alt="LOGO UNL" className="img-fluid" style={{ maxHeight: '100%' }} />
              </div>
              <div className="col-md-8 order-md-last">
                <div className="p-4">
                  <h4 className='texto-primario-h2'>MISIÓN DEL PROYECTO</h4>
                  <p style={{ textAlign: 'justify' }}>Nuestra misión es desarrollar y desplegar una solución innovadora y precisa para la detección de radiación ultravioleta (UV) adaptada a las particularidades de cada región geográfica. Nos comprometemos a proporcionar a las comunidades herramientas confiables y accesibles que les permitan tomar medidas preventivas contra la exposición excesiva al sol, salvaguardando así la salud y bienestar de las personas. A través de la integración de la tecnología y la educación, buscamos crear conciencia sobre los riesgos asociados con la radiación UV y promover hábitos de protección solar saludables.
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 order-md-first">
                <div className="p-4">
                  <h4 className='texto-primario-h2'>VISIÓN DEL PROYECTO</h4>
                  <p style={{ textAlign: 'justify' }}>Nuestra visión es ser reconocidos como creadores de ideas a nivel local, regional y eventualmente global en el desarrollo y aplicación de tecnologías innovadoras para la detección y monitoreo de la radiación UV. Aspiramos a establecer colaboraciones estratégicas con instituciones gubernamentales, organizaciones de salud, empresas privadas y comunidades locales para implementar soluciones integrales que mejoren la calidad de vida y promuevan la salud pública.
                  </p>
                </div>
              </div>
              <div className="col-md-4 p-4 d-flex align-items-center justify-content-center order-md-last">
                <img src={logo_semaforo} alt="LOGO CIS_UNL" className="img-fluid" style={{ maxHeight: '100%', height:'239px' }} />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 row">
          <div className="col-sm-10 mt-5 mb-4 ml-4 ">
            <h2 className='texto-subtitulo-1'>INTEGRANTES DEL GRUPO</h2>
          </div>
        </div>
        <div className='container-tabla p-2'>
          <div className='crud shadow-lg p-2 '>
            <div className="services" style={{ marginTop: 60 + 'px' }}>
              <div className="service">
                <a href={member1} target="_blank"><img className='member' src={member1} alt="img"></img></a>
                <h3><a href="https://github.com/Luchini8" style={{ color: '#36ab2b' }} target="_blank">LUIS COBOS</a></h3>
                <h4>Miembro del equipo</h4> <br />
                luis.cobos@unl.edu.ec <br />
                +593 99 603 6745 <br />
              </div>
              <div className="service">
                <a href={member2} target="_blank"><img className='member' src={member2} alt="img"></img></a>
                <h3><a href="https://github.com/KBGR55" style={{ color: '#36ab2b' }} target="_blank">KAREN GONZAGA</a></h3>
                <h4>Lider del equipo</h4> <br />
                karen.b.gonzaga@unl.edu.ec <br />
                +593 96 749 4872 <br />
              </div>
              <div className="service">
                <a href={member3} target="_blank"><img className='member' src={member3} alt="img"></img></a>
                <h3><a href="https://github.com/ahogadoenvasodeagua" style={{ color: '#36ab2b' }} target="_blank">DENNIS MACAS</a></h3>
                <h4>Miembro del equipo</h4> <br />
                dennis.macas@unl.edu.ec <br />
                +593 99 003 2217 <br />
              </div>
              <div className="service">
                <a href={member4} target="_blank"><img className='member' src={member4} alt="img"></img></a>
                <h3><a href="https://github.com/Jordy0101" style={{ color: '#36ab2b' }} target="_blank">JORDY TORRES</a></h3>
                <h4>Miembro del equipo</h4> <br />
                Jordy.w.torres@unl.edu.ec <br />
                +593 98 500 8371 <br />
              </div>
              <div className="service">
                <a href={member5} target="_blank"><img className='member' src={member5} alt="img"></img></a>
                <h3><a href="https://github.com/Pauli2412" style={{ color: '#36ab2b' }} target="_blank">PAULINA CHALCO</a></h3>
                <h4>Miembro del equipo</h4> <br />
                paulina.chalco@unl.edu.ec <br />
                +593 96 894 4820 <br />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Conocenos;
