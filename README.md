### SEMÁFORO UV

Semáforo UV es un proyecto integrador de saberes desarrollado como parte del sexto ciclo de la carrera de Ciencias de la Computación en la Universidad Nacional de Loja.

---

### INSTRUCCIONES

#### WEB

> semaforo_uv_web

1. **Instalación de dependencias:**

   Para comenzar, instala las dependencias escribiendo `npm i` en la terminal de las siguientes carpetas:
   - SEMAFORO_UV/semaforo_uv_web/semaforo_uv_backend_grupo_a/
   - SEMAFORO_UV/semaforo_uv_web/semaforo_uv_frontend/

3. **Levantar el proyecto:**

   Para levantar el proyecto, escribe en la terminal:
   ```bash
   docker-compose up --build
   ```
5. **Configuración de la base de datos:**

   Accede a http://localhost:3000/privado/SEMAFORO-SEXTO-GRUPO-A para crear la base de datos.
7. **Creación de roles:**
    Realiza la petición para crear roles en http://localhost:3000/api/rol/guardar.
	- Crear Administrador:
      ```json
      {
        "tipo": "ADMINISTRADOR"
      }
      ```
    - Crear Usuario:
       ```json
      {
        "tipo": "USUARIO"
      }
      ```

5. **Insomnia:**

    Algunas de las peticiones del API están en el archivo `Insomnia_2024-03-15.json`.
6. **Acceso al sistema:**
   
    Una vez completados los pasos anteriores, accede a http://localhost:8080/.

#### MÓVIL
> semaforo_uv_frontend_movil

1. **Precondiciones:**
   
    Una de las precondiciones es tener Expo Go para la aplicación de React Native.
2. **Instalación de dependencias:**

   Para instalar las dependencias, ejecuta `npm i`.

3. **Inicialización:**
   
    Inicializa el proyecto con el comando `npm start`.
