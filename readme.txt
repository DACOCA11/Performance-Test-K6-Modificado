Ejercicio de performance con K6
Autor: David Coronel
------------------------------------------
REQUISITOS PREVIOS
------------------------------------------

1. Sistema Operativo:
   - Windows 11

2. Herramientas y versiones utilizadas:
   - Visual Studio Code: v1.102.1
   - K6: v1.1.0
   - Node.js (opcional si se desea manejo de librerías JS externas): v18.x o superior

3. Archivos requeridos:
   - Script de prueba en K6 ( `performance-test.js`)
   - Archivo con datos de usuarios (`users.csv`)

------------------------------------------
PASOS PARA LA EJECUCIÓN
------------------------------------------
1. Abrir Visual Studio Code

   - Asegúrate de tener instalada la versión v1.102.1
   - Abrir la carpeta del proyecto que contiene el script K6 en este caso de nombre "k6Test"


2. Ejecutar la prueba con K6

- Abrir una terminal en VS Code (Ctrl + ñ)
- Ejecutar el comando:
  k6 run performance-test.js
  
3.Analizar y verificar los resultados

------------------------------------------
RESULTADOS QUE SE VAN A OBTENER
------------------------------------------

Al finalizar la ejecución, se mostrará un resumen con:
- Tiempo de respuesta (http_req_duration)
- Porcentaje de error (http_req_failed)
- Número de peticiones por segundo (throughput)


