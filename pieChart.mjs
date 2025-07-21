
import fs from 'fs';
import QuickChart from 'quickchart-js';
const summary = JSON.parse(fs.readFileSync('out.json', 'utf8'));
const totalReqs = summary.metrics.http_reqs.count;
const fails     = summary.metrics.http_req_failed.fails;
const success   = totalReqs - fails;
(async () => {
  const qc = new QuickChart()
    .setConfig({
      type: 'pie',
      data: {
        labels: ['Success', 'Failed'],
        datasets: [{
          data: [success, fails]
        }]
      },
      options: {
        plugins: {
          title: { display: true, text: 'Éxito vs. Fallos de Requests' }
        }
      }
    })
    .setWidth(600)
    .setHeight(400);

  const img = await qc.toBinary();
  fs.writeFileSync('pie_success_fail.png', img);
  console.log('👉 pie_success_fail.png generado');
})();
