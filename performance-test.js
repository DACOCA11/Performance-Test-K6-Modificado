import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Counter } from 'k6/metrics';
// IMPORT NECESARIO para generar el informe HTML
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const loginErrors = new Counter('login_errors');

const users = new SharedArray('Usuarios Login', function () {
  return open('./users.csv')
    .split('\n')
    .filter(line => line.trim() !== '')
    .slice(1)
    .map(line => {
      const [user, passwd] = line.split(',');
      return { user: user.trim(), passwd: passwd.trim() };
    });
});

export const options = {
  vus: 20,            // 20 usuarios virtuales concurrentes
  duration: '10s',    // durante 10 segundos
  thresholds: {
    http_req_duration: ['p(95)<1500'],  // 95% de las solicitudes < 1.5 s
    http_req_failed:    ['rate<0.03'],   // < 3% de errores HTTP
    login_errors:       ['count<5'],     // < 5 errores de login
  },
};

export default function () {
  const u = users[Math.floor(Math.random() * users.length)];
  const payload = JSON.stringify({
    username: u.user,
    password: u.passwd,
  });
  const headers = { 'Content-Type': 'application/json' };

  const res = http.post('https://fakestoreapi.com/auth/login', payload, { headers });

  const success = check(res, {
    'status is 200': r => r.status === 200,
    'response has token': r => {
      try {
        return JSON.parse(r.body).token !== undefined;
      } catch {
        return false;
      }
    },
  });

  if (!success) {
    loginErrors.add(1);
  }

  // Sleep breve para ajustar TPS (~20 TPS con 20 VUs y 0.05s de sleep)
  sleep(0.05);
}

// Esta función se ejecuta al final del run y genera summary.html
export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data),
  };
}
