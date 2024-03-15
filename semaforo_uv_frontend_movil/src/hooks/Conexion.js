const URL_BACKEND = "http://10.20.139.63:3000/api"
export const LoginPost= async (data,url) => {
    console.log(data);
    const headers = {
        "Accept": 'application/json',
        "Content-Type": 'application/json', 
    };
   
    const datos = await (await fetch(`${URL_BACKEND}/${url}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })).json();
    return datos;
}
export const PeticionGet = async (key, url) => {
    const headers = {
        "Content-Type": "application/json",
        "X-API-TOKEN": key
    };
    const datos = await (await fetch(`${URL_BACKEND}/${url}`, {
        method: "GET",
        headers: headers,
    })).json();
    return datos;
}
export const PeticionPost = async (key, url,data) => {
    const headers = {
        "Content-Type": "application/json",
        "X-API-TOKEN": key
    };
    const datos = await (await fetch(`${URL_BACKEND}/${url}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    })).json();
    return datos;
}