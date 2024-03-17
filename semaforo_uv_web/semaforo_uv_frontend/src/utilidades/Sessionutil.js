//------------------TOKEN DE SESION------------------
export const saveToken = (token) => {
    localStorage.setItem("token", token);
}
 
export const getToken = () => {
    return localStorage.getItem('token');
}

export const borrarSesion=()=>{
    localStorage.clear();
}

export const estaSesion =()=>{
    var token = localStorage.getItem('token');
    return (token && (token != 'undefined' || token!=null || token!='null'));
}
//------------------ROL------------------
export const saveRol = (rol) => {
    localStorage.setItem('rol', rol);
}

export const getRol = () => {
    return localStorage.getItem('rol');
}
//------------------USUARIO------------------
export const saveUser = (user) => {
    const userJSON = JSON.stringify(user);
    localStorage.setItem('user', userJSON);
}

export const getUser = () => {
    const userJSON = localStorage.getItem('user');
    return JSON.parse(userJSON);
}
export const savetokenApi = (tokenapi) => {
    localStorage.setItem("tokenapi", tokenapi);
}
export const gettokenApi = () => {
    return localStorage.getItem('tokenapi');
}
//------------------Correo------------------
export const saveCorreo = (correo) => {
    localStorage.setItem('correo', correo);
}

export const getCorreo = () => {
    return localStorage.getItem('correo');
    
}