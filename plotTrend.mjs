// plotTrend.mjs
import fs from 'fs';
import QuickChart from 'quickchart-js';

// ——————————————
// 1) Carga raw JSON de métricas
const rawLines = fs.readFileSync('full.json', 'utf8')
  .trim()
  .split('\n')
  .map(l => JSON.parse(l));

// Filtrar sólo los registros Point que queremos
const latencyPoints = rawLines.filter(r => r.type === 'Point' && r.metric === 'http_req_duration');
const tpsPoints     = rawLines.filter(r => r.type === 'Point' && r.metric === 'iterations');

if (latencyPoints.length === 0) {
  console.error('❌ No se encontraron puntos de http_req_duration en full.json');
  process.exit(1);
}

// ——————————————
// 2) Extraer arrays de tiempo y valor, normalizando tiempos a segundos
const startTime = latencyPoints[0].data.time;

const timesLat  = latencyPoints.map(p => (p.data.time  - startTime) / 1000);
const valuesLat = latencyPoints.map(p => p.data.value);

const timesTPS  = tpsPoints.map(p => (p.data.time  - startTime) / 1000);
const valuesTPS = tpsPoints.map(p => p.data.value);

// ——————————————
// 3) Función de muestreo para no exceder 250 puntos
function sampleSeries(times, values, maxPoints = 250) {
  const total = times.length;
  const step = Math.ceil(total / maxPoints);
  return {
    times:  times.filter((_, i) => i % step === 0).map(t => +t.toFixed(2)),
    values: values.filter((_, i) => i % step === 0).map(v => +v.toFixed(0)),
  };
}

const { times: sTimesLat, values: sValuesLat } = sampleSeries(timesLat, valuesLat);
const { times: sTimesTPS, values: sValuesTPS } = sampleSeries(timesTPS, valuesTPS);

// ——————————————
// 4) Generar gráfico de Trend de Latencias (muestreado)
async function makeChart({ times, values, title, yLabel, fileName }) {
  const qc = new QuickChart()
    .setConfig({
      type: 'line',
      data: {
        labels: times,
        datasets: [{
          label: yLabel,
          data: values,
          fill: false,
          tension: 0.1,
        }],
      },
      options: {
        scales: {
          x: { title: { display: true, text: 'Tiempo (s)' } },
          y: { title: { display: true, text: yLabel } },
        },
        plugins: {
          title: { display: true, text: title },
        },
      },
    })
    .setWidth(800)
    .setHeight(400);

  const img = await qc.toBinary();
  fs.writeFileSync(fileName, img);
  console.log(`👉 ${fileName} generado (${times.length} puntos)`);
}

(async () => {
  await makeChart({
    times: sTimesLat,
    values: sValuesLat,
    title: 'Trend de Latencias (muestreado)',
    yLabel: 'Latencia (ms)',
    fileName: 'trend_latency_sampled.png',
  });

  await makeChart({
    times: sTimesTPS,
    values: sValuesTPS,
    title: 'Trend de Iteraciones (muestreado)',
    yLabel: 'Iteraciones/s',
    fileName: 'trend_tps_sampled.png',
  });
})();
