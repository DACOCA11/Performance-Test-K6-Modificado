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
   -package.json (configurado con "type": "module" y dependencia "quickchart-js") 


------------------------------------------
PASOS PARA LA EJECUCIÓN
------------------------------------------
1. Abrir Visual Studio Code

   - Asegúrate de tener instalada la versión v1.102.1
   - Abrir la carpeta del proyecto que contiene el script K6 en este caso de nombre "k6Test"


2. Ejecutar la prueba con K6

- Abrir una terminal en VS Code (Ctrl + ñ)
- Ejecutar el comando:
 k6 run \
  --out json=full.json \
  --summary-export=out.json \
  performance-test.js
--------------------------------------------------------
full.json contendrá todas las muestras temporales.
out.json incluirá los histogramas y percentiles agregados.
 -------------------------------------------------------- 
3.Genera los trends muestreados (latencia y TPS)
Ejecutar el comando:
node plotTrend.mjs

4.Genera el pie chart de éxito vs. fallos
Ejecutar el comando:
 node pieChart.mjs

5. Genera el bar chart de percentiles
Ejecutar el comando:
 node extraChart.mjs

6. Para revisar el resumen de los datos obtenidos abrir el archivo HTML desde la carpeta que lo contiene

------------------------------------------
RESULTADOS QUE SE VAN A OBTENER
------------------------------------------

Al finalizar la ejecución, se mostrará un resumen con:
- Tiempo de respuesta (http_req_duration)
- Porcentaje de error (http_req_failed)
- Número de peticiones por segundo (throughput)

