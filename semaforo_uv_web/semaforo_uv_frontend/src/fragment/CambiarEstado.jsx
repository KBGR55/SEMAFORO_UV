import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import '../css/style.css';
import {PeticionPost} from '../hooks/Conexion';
import mensajes from '../utilidades/Mensajes';
import {getToken } from '../utilidades/Sessionutil';

const CambiarEstado = ({usuario, handleChange }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const editar = async () => {
        var datos = {
            estado:usuario.estado,
            external_id:usuario.external_id
        };

        PeticionPost(getToken(), `cuenta/modificar_estado`, datos).then((info) => {
            if (info.code !== 200) {
                mensajes(info.msg, 'error', 'Error');
            } else {
            mensajes(info.msg);
               setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        });
    }

    return (
        <div className="crud shadow-lg p-3 mb-2 mt-2 bg-body rounded modal-content">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title ">Editar datos del estudiante</h4>
                            <form className="form-sample" onSubmit={handleSubmit(() => editar())}>
                                <p className="card-description texto-primario">Datos personales</p>
                                <p className="card-description">Cuenta:
                                    <span className="mx-2 badge rounded-pill bg-secondary">{usuario.correo}</span></p>
                                <div className="row">
                                    {/** ESCOGER TIPO DE IDENTIFICACION */}
                                    <div className="form-group">
                                        <label>Estado</label>
                                        <select className="form-control" {...register('estado', { required: true })} value={usuario.estado} onChange={handleChange}>
                                            <option value="">Seleccione un estado</option>
                                            <option value="ACEPTADO">ACEPTADO</option>
                                            <option value="ESPERA">ESPERA</option>
                                            <option value="RECHAZADO">RECHAZADO</option>
                                        </select>
                                        {errors.estado && errors.estado.type === 'required' && (
                                            <div className="alert alert-danger">Seleccione un estado</div>
                                        )}
                                    </div>
                                    <div className="mb-4" ></div> {/* Espacio adicional */}
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button
                                        className="btn btn-dark btn-lg btn-block"
                                        type="submit"
                                        style={{ backgroundColor: '#212A3E', width: '100%' }}
                                    >
                                        Guardar cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


}

export default CambiarEstado;