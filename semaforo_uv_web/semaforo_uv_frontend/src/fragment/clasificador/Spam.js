import { verificarOtrasPalabrasMalsonantes } from './malsonantes';

export const verificarSpam = (texto) => {
  // Diccionario de palabras de spam
  const palabrasDeSpam = {
    "agresión": true,
    "agresion": true,
    "alcohol": true,
    "asesinato": true,
    "asalto": true,
    "bonificación": true,
    "bonificacion": true,
    "bono": true,
    "cigarro": true,
    "casino": true,
    "descuento": true,
    "dinero": true,
    "discriminación": true,
    "discriminacion": true,
    "drogas": true,
    "efectivo": true,
    "estafa": true,
    "fácil": true,
    "facil": true,
    "fortuna": true,
    "ganancias": true,
    "ganar": true,
    "gratis": true,
    "inversión": true,
    "inversion": true,
    "joder": true,
    "lotería": true,
    "loteria": true,
    "marica": true,
    "mierda": true,
    "millonario": true,
    "odio": true,
    "oferta": true,
    "pendejo": true,
    "pendeja": true,
    "pornografía": true,
    "pornografia": true,
    "pornográfico": true,
    "premio": true,
    "prestamo": true,
    "préstamo": true,
    "promoción": true,
    "promocion": true,
    "rápido": true,
    "rapido": true,
    "robo": true,
    "sexo": true,
    "sorteo": true,
    "suscripción": true,
    "suscripcion": true,
    "terrorismo": true,
    "violación": true,
    "violacion": true,
    "violencia": true,
  };

  // Convertimos el texto a minúsculas para hacer la comparación sin distinción entre mayúsculas y minúsculas
  const textoEnMinusculas = texto.toLowerCase();

  // Dividimos el texto en palabras individuales utilizando una expresión regular más amplia
  const palabras = textoEnMinusculas.split(/\W+/);

  // Iteramos sobre cada palabra y verificamos si está en el diccionario de palabras de spam
  for (let palabra of palabras) {
    if (palabrasDeSpam[palabra]) {
      return "NO VALIDO";
    }
    // Verificar si la palabra contiene letras repetidas
  }
  // Si no se encontró ninguna palabra de spam en la lista anterior, llamamos a la función verificarOtrasPalabrasMalsonantes
  return verificarOtrasPalabrasMalsonantes(texto);
};

