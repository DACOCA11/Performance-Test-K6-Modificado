
import fs from 'fs';
import QuickChart from 'quickchart-js';
const summary = JSON.parse(fs.readFileSync('out.json', 'utf8'));
const dur = summary.metrics.http_req_duration;
const labels = [];
const values = [];
if (dur['p(90)'] !== undefined) {
  labels.push('p(90)');
  values.push(+dur['p(90)'].toFixed(0));
}
if (dur['p(95)'] !== undefined) {
  labels.push('p(95)');
  values.push(+dur['p(95)'].toFixed(0));
}

if (dur['p(99)'] !== undefined) {
  labels.push('p(99)');
  values.push(+dur['p(99)'].toFixed(0));
}

if (dur.max !== undefined) {
  labels.push('max');
  values.push(+dur.max.toFixed(0));
}
(async () => {
  const qc = new QuickChart()
    .setConfig({
      type: 'bar',
      data: { labels, datasets: [{ label: 'Latencia (ms)', data: values }] },
      options: {
        scales: {
          x: { title: { display: true, text: 'Percentil / max' } },
          y: { title: { display: true, text: 'Milisegundos' } }
        },
        plugins: { title: { display: true, text: 'Comparación de Percentiles' } }
      }
    })
    .setWidth(700)
    .setHeight(400);
  const img = await qc.toBinary();
  fs.writeFileSync('percentiles_latency.png', img);
  console.log('👉 percentiles_latency.png generado');
})();
