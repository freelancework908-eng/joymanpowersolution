import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { app } from '../server/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5098;
const BASE_URL = `http://localhost:${PORT}`;

// Mount static SPA serving from dist/ on the test server to simulate Vercel / production static serving
const distIndex = path.resolve(__dirname, '../dist/index.html');
const indexHtmlContent = fs.existsSync(distIndex) ? fs.readFileSync(distIndex, 'utf-8') : '<!doctype html><html><body>Root</body></html>';

// Attach fallback route for frontend routes to mimic Vercel rewrite
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(indexHtmlContent);
});

async function runRouteTests() {
  console.log('--- TESTING ALL PRODUCTION & LOCAL ROUTES ---');

  const server = http.createServer(app).listen(PORT);
  console.log(`Server listening on ${BASE_URL}\n`);

  const tests = [
    // Public Frontend Routes (Must serve index.html with 200 OK)
    { path: '/', expectedStatus: 200, expectHtml: true, desc: 'Homepage direct access' },
    { path: '/jobs', expectedStatus: 200, expectHtml: true, desc: 'Jobs listing page' },
    { path: '/jobs/60001', expectedStatus: 200, expectHtml: true, desc: 'Job detail page' },
    { path: '/contact', expectedStatus: 200, expectHtml: true, desc: 'Contact page' },
    { path: '/about', expectedStatus: 200, expectHtml: true, desc: 'About page' },
    { path: '/reviews', expectedStatus: 200, expectHtml: true, desc: 'Reviews page' },
    { path: '/gallery', expectedStatus: 200, expectHtml: true, desc: 'Gallery page' },

    // Admin Frontend Routes
    { path: '/admin/login', expectedStatus: 200, expectHtml: true, desc: 'Admin login page' },
    { path: '/admin/dashboard', expectedStatus: 200, expectHtml: true, desc: 'Admin dashboard route' },
    { path: '/admin/jobs', expectedStatus: 200, expectHtml: true, desc: 'Admin jobs management' },

    // Backend API Routes (Must NOT return HTML, must return JSON)
    { path: '/api/health', expectedStatus: 200, expectJson: true, desc: 'API health check' },
    { path: '/api/public/jobs', expectedStatus: 200, expectJson: true, desc: 'Public jobs API' },
    { path: '/api/public/categories', expectedStatus: 200, expectJson: true, desc: 'Public categories API' },
    { path: '/api/public/banner', expectedStatus: 200, expectJson: true, desc: 'Public banner API' },
    { path: '/api/public/reviews', expectedStatus: 200, expectJson: true, desc: 'Public reviews API' },
    { path: '/api/public/gallery', expectedStatus: 200, expectJson: true, desc: 'Public gallery API' },
    { path: '/api/public/settings', expectedStatus: 200, expectJson: true, desc: 'Public company settings API' }
  ];

  let passedCount = 0;

  for (const t of tests) {
    try {
      const res = await fetch(`${BASE_URL}${t.path}`);
      const contentType = res.headers.get('content-type') || '';
      const isStatusOk = res.status === t.expectedStatus;

      let isContentOk = true;
      if (t.expectHtml) {
        const text = await res.text();
        isContentOk = contentType.includes('text/html') && text.includes('Joy Manpower Solution');
      } else if (t.expectJson) {
        const json = await res.json();
        isContentOk = contentType.includes('application/json') && (json.success !== undefined || json.status === 'ok');
      }

      const pass = isStatusOk && isContentOk;
      if (pass) passedCount++;

      console.log(`${pass ? '✅ PASS' : '❌ FAIL'} - ${t.desc} (${t.path}) [Status: ${res.status}, Type: ${contentType.split(';')[0]}]`);
    } catch (err) {
      console.log(`❌ FAIL - ${t.desc} (${t.path}) - Error: ${err.message}`);
    }
  }

  server.close();

  console.log(`\nResults: ${passedCount} / ${tests.length} routes passed.`);
  process.exit(passedCount === tests.length ? 0 : 1);
}

runRouteTests();
