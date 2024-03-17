export const verificarOtrasPalabrasMalsonantes = (texto) => {
  // Diccionario de palabras malsonantes adicionales
  const otrasPalabrasMalsonantes = {
    "puta": true,
    "mierda": true,
    "joder": true,
    "cabrón": true,
    "cabron": true,
    "pendejo": true,
    "pendeja": true,
    "marica": true,
    "mariquita": true,
    "verga": true
  };

  // Convertimos el texto a minúsculas para hacer la comparación sin distinción entre mayúsculas y minúsculas
  const textoEnMinusculas = texto.toLowerCase();

  // Dividimos el texto en palabras individuales utilizando una expresión regular más amplia
  const palabras = textoEnMinusculas.split(/\W+/);

  // Iteramos sobre cada palabra y verificamos si está en el diccionario de palabras de spam
  for (let palabra of palabras) {
    if (otrasPalabrasMalsonantes[palabra]) {
      console.log('es malsonante');
      return "NO VALIDO";
    }
    // Verificar si la palabra contiene letras repetidas
  }

  // Si no se encontró ninguna palabra malsonante ni letras repetidas, retornamos "VALIDO"
  return "VALIDO";
};
