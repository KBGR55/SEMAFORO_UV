import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { LoginPost } from '../hooks/Conexion';
import { useNavigate } from 'react-router';
import mensajes from '../utilidades/Mensajes';
import logo from '../logo.png';
import Footer from './Footer';
import BarraMenu from './BarraMenu';
import '../css/style.css';

const Registro = () => {
  const navegation = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar si se está cargando o no

  const onSubmit = (data) => {
    setIsLoading(true); // Marcar como cargando antes de enviar la solicitud
    mensajes('Guardando información...', 'info', 'Información'); // Mostrar mensaje de guardado

    var datos = {
      "nombres": data.nombres,
      "apellidos": data.apellidos,
      "direccion": data.direccion,
      "fecha_nacimiento": data.fecha_nacimiento,
      "telefono": parseInt(data.telefono, 10),
      "cargo": data.cargo,
      "institucion": data.institucion,
      "correo": data.correo,
      "clave": data.clave,
    };

    LoginPost(datos, 'persona/guardar').then((info) => {
      setIsLoading(false); // Marcar como no cargando después de recibir la respuesta
      if (info.code !== 200) {
        mensajes(info.msg, "error", "error");
      } else {
        mensajes(info.msg, 'success', 'Exitoso');
        navegation("/iniciar-sesion");
      };
    });
  };

  const claveValue = watch('clave');

  return (
    <div className="background-radial-gradient overflow-hidden">
      <header>
        <BarraMenu />
      </header>
      <section>
        <div className="container align-items-center text-center text-lg-start my-5">
          <div className="mb-lg-0">
            <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
            <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
            <div className="card bg-glass">
              <div className="card-header">
                <span className="h1 fw-bold mb-4">Registro de usuarios</span>
              </div>
              <div className="card-body px-4 py-3">
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img src={logo} alt="logo" className="w-100 " />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body">
                      <div className="container">
                        <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                          <div className="col-md-4">
                            <div className={`input-field form-outline`} >
                              <em className="far fa-user"></em>
                              <input type="text" className="form-control" placeholder="Nombres" {...register('nombres', {
                                required: true,
                                pattern: /^[a-zA-Z\s]*$/ // Solo letras y espacios
                              })} />
                            </div>
                            {errors.nombres && errors.nombres.type === 'required' && <div className='alert alert-danger'>Ingrese sus nombre</div>}
                            {errors.nombres && errors.nombres.type === 'pattern' && <div className='alert alert-danger'>Ingrese solo letras</div>}
                          </div>
                          <div className="col-md-4">
                            <div className={`input-field form-outline`} >
                              <em className="far fa-user"></em>
                              <input type="text" className="form-control" placeholder="Apellidos" {...register('apellidos', {
                                required: true,
                                pattern: /^[a-zA-Z\s]*$/ // Solo letras y espacios
                              })} />
                            </div>
                            {errors.apellidos && errors.apellidos.type === 'required' && <div className='alert alert-danger'>Ingrese sus apellidos</div>}
                            {errors.apellidos && errors.apellidos.type === 'pattern' && <div className='alert alert-danger'>Ingrese solo letras</div>}
                          </div>
                          <div className="col-md-4">
                            <div className={`input-field form-outline`} >
                              <em className="far fa-map"></em>
                              <input type="text" className="form-control" placeholder="Dirección" {...register('direccion', { required: true })} />
                            </div>
                            {errors.direccion && errors.direccion.type === 'required' && <div className='alert alert-danger'>Ingrese su dirección</div>}
                          </div>
                          <div className="col-md-4">
                            <div className={`input-field form-outline`} >
                              <em className="far fa-calendar"></em>
                              <input
                                type="date"
                                className="form-control"
                                placeholder="Fecha Nacimiento"
                                {
                                ...register('fecha_nacimiento', {
                                  required: true,
                                  validate: (value) => {
                                    const today = new Date();
                                    const birthDate = new Date(value);

                                    const birthYear = birthDate.getFullYear();
                                    const currentYear = today.getFullYear();

                                    if (birthDate > today) {
                                      return "La fecha seleccionada no puede ser en el futuro";
                                    }

                                    const age = currentYear - birthYear;

                                    if (age > 150) {
                                      return "La edad no puede ser mayor a 150 años";
                                    }

                                    if (age < 18) {
                                      return "Debe ser mayor de edad"; // Verificar si la edad es mayor o igual a 18 años
                                    }

                                    return true;
                                  }
                                })
                                }
                              />
                            </div>
                            {errors.fecha_nacimiento && errors.fecha_nacimiento.type === 'required' && <div className='alert alert-danger'>Ingrese su fecha de nacimiento</div>}
                            {errors.fecha_nacimiento && <div className='alert alert-danger'>{errors.fecha_nacimiento.message}</div>}
                          </div>

                          <div className="col-md-4">
                            <div className={`input-field form-outline`} >
                              <em className="fa fa-phone"></em>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Teléfono"
                                {...register('telefono', {
                                  required: true,
                                  pattern: /^[0-9]{10}$/ 
                                })}
                              />
                            </div>
                            {errors.telefono && errors.telefono.type === 'required' && <div className='alert alert-danger'>Ingrese su teléfono</div>}
                            {errors.telefono && errors.telefono.type === 'pattern' && <div className='alert alert-danger'>Ingrese un teléfono válido (solo números y 10 dígitos)</div>}
                          </div>
                          <div className="col-md-4">
                            <div className={`input-field form-outline`} >
                              <em className="far fa-building"></em>
                              <input type="text" className="form-control" placeholder="Institución" {...register('institucion', { required: true })} />
                            </div>
                            {errors.institucion && errors.institucion.type === 'required' && <div className='alert alert-danger'>Ingrese la institución</div>}
                          </div>
                          <div className="col-md-4">
                            <div className={`input-field form-outline`} >
                              <em className="fa fa-briefcase"></em>
                              <input type="text" className="form-control" placeholder="Cargo" {...register('cargo', {
                                required: true,
                                pattern: /^[^@]+$/ // No permite el símbolo '@'
                              })} />
                            </div>
                            {errors.cargo && errors.cargo.type === 'required' && <div className='alert alert-danger'>Ingrese su cargo en la institución</div>}
                            {errors.cargo && errors.cargo.type === 'pattern' && <div className='alert alert-danger'>No se permite el símbolo '@'</div>}
                          </div>
                          <div className="col-md-4">
                            <div className={`input-field form-outline`} >
                              <em className="far fa-user"></em>
                              <input type="email" className="form-control" placeholder="Correo" {...register('correo', {
                                required: true,
                                pattern: /^\S+@\S+$/i // Patrón para validar el formato de correo electrónico
                              })} />
                            </div>
                            {errors.correo && errors.correo.type === 'required' && <div className='alert alert-danger'>Ingrese el correo</div>}
                            {errors.correo && errors.correo.type === 'pattern' && <div className='alert alert-danger'>Ingrese un correo válido</div>}
                          </div>
                          <div className="col-md-4">
                            <div className={`input-field form-outline`}>
                              <em className="fas fa-lock "></em>
                              <input type="password" className="form-control" placeholder="Clave" {...register('clave', {
                                required: true,
                                minLength: 7,
                                pattern: /^(?=.*[A-Z])(?=.*\d).*$/ // Al menos una letra mayúscula y un número
                              })} />
                            </div>
                            {errors.clave && errors.clave.type === 'required' && <div className='alert alert-danger'>Ingrese una clave</div>}
                            {errors.clave && errors.clave.type === 'minLength' && <div className='alert alert-danger'>La clave debe tener al menos 7 caracteres</div>}
                            {errors.clave && errors.clave.type === 'pattern' && <div className='alert alert-danger'>La clave debe contener al menos una letra mayúscula y un número</div>}
                          </div>
                          <div className="col-12 d-flex justify-content-end">
                            <button type="submit" className="boton btn btn-lg btn-block">REGISTRAR</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Registro;
