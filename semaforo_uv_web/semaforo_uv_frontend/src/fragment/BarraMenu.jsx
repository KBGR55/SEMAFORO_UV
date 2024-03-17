import React, { useState } from 'react';
import { Navbar, Nav, Offcanvas } from 'react-bootstrap';
import { borrarSesion, getRol, getToken } from '../utilidades/Sessionutil';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const BarraMenu = () => {
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    return (
        <Navbar expand="lg" variant="fondo" className="navbar navbar-expand-lg">
            <div className='container-fluid'>
                <Navbar.Brand className="navbar-brand" href="/">SEMÁFORO UV</Navbar.Brand>
                <Navbar className="navbar-toggler fas fa-bars" aria-controls="offcanvasNavbar" onClick={() => setShowOffcanvas(!showOffcanvas)} />
                <div className="collapse navbar-collapse">
                    <NavLink classNameNav="navbar-nav ms-auto mb-2 mb-lg-0" />
                </div>
                <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end" target="#offcanvasNavbar">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>OPCIONES</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className="offcanvas-body">
                        <NavLink classNameNav="navbar-nav justify-content-end flex-grow-1 pe-3" />
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
        </Navbar>
    );
};

export default BarraMenu;
const navLinkStyle = {
    marginRight: '10px',
};

const NavLink = ({ classNameNav }) => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const token = getToken();

    const handleCerrarSesion = () => {
        borrarSesion();
        
        navigate('/');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <Nav className={classNameNav}>
            <Nav.Link href="/" style={navLinkStyle}><i className="fas fa-home"></i> Inicio</Nav.Link>
            <Nav.Link href="/radiacion" style={navLinkStyle}><i className="fas fa-sun"></i> Radiación UV</Nav.Link>
            {token && (<Nav.Link href="/perfil-usuario" style={navLinkStyle}><i className="fas fa-user"></i> Perfil</Nav.Link>)}
            {(getRol() === 'USUARIO') && <Nav.Link href="/api" style={navLinkStyle}><i className="fas fa-code"></i> Api</Nav.Link>}
            {getRol() === 'ADMINISTRADOR' && <Nav.Link href="/comentarios" style={navLinkStyle}><i className="fas fa-comments"></i> Comentarios</Nav.Link>}
            {getRol() === 'ADMINISTRADOR' && <Nav.Link href="/peticion-api" style={navLinkStyle}><i className="fas fa-users"></i> Usuarios</Nav.Link>}
            {!token && (
                <li className="nav-item dropdown" onClick={toggleDropdown}>
                    <span className="nav-link" style={navLinkStyle}><i className="fas fa-user-circle"></i> Mi cuenta</span>
                    <ul className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                        <Nav.Link href="/registro" className="dropdown-item" style={navLinkStyle}><i className="fas fa-user-plus"></i> Registrarse</Nav.Link>
                        <Nav.Link href="/iniciar-sesion" className="dropdown-item" style={navLinkStyle}><i className="fas fa-sign-in-alt"></i> Iniciar sesión</Nav.Link>
                    </ul>
                </li>
            )}
            {token && <Nav.Link href="/" onClick={handleCerrarSesion} style={navLinkStyle}><i className="fas fa-sign-out-alt"></i> Cerrar sesión</Nav.Link>}
            <Nav.Link href="/conocenos" style={navLinkStyle}><i className="fas fa-info-circle"></i> Conócenos</Nav.Link>
        </Nav>
    );
};
