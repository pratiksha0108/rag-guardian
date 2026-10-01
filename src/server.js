import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { compare, importReport } from './engine.js';
import { documents, profiles } from './data.js';
import { assistants, loadDataset } from './datasets.js';
import { answerQuestion, evaluateDataset } from './retrieval.js';

const files = { '/': ['../public/index.html', 'text/html'], '/app.js': ['../public/app.js', 'text/javascript'], '/style.css': ['../public/style.css', 'text/css'], '/datasets': ['../public/datasets.html', 'text/html'], '/datasets.js': ['../public/datasets.js', 'text/javascript'] };
export function createServer() {
  return http.createServer(async (req, res) => {
    const send = (status, body, type = 'application/json') => { res.writeHead(status, { 'Content-Type': type + '; charset=utf-8', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store', 'Content-Security-Policy': "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'" }); res.end(type === 'application/json' ? JSON.stringify(body) : body); };
    try {
      const url = new URL(req.url, 'http://localhost');
      if (req.method === 'GET' && url.pathname === '/api/datasets') return send(200, assistants.map(a=>{ const d=loadDataset(a.id); return {...a,documents:d.documents.length,developmentCases:d.cases.length,reservedCases:d.reservedCount}; }));
      const datasetRoute=url.pathname.match(/^\/api\/datasets\/([a-z-]+)(?:\/(evaluate|query))?$/);
      if (datasetRoute) {
        const [,id,action]=datasetRoute;
        if(url.searchParams.has('split') && url.searchParams.get('split')!=='dev') return send(400,{error:'Reserved questions are excluded from the web workflow. Freeze the pipeline before a separate reserved evaluation.'});
        if(req.method==='GET' && !action) { const d=loadDataset(id); return send(200,d); }
        if(req.method==='GET' && action==='evaluate') return send(200,evaluateDataset(id));
        if(req.method==='POST' && action==='query') {
          if(req.headers.origin && req.headers.origin!==`http://${req.headers.host}`) return send(403,{error:'Cross-origin queries are not allowed.'});
          let body=''; for await(const chunk of req) { body+=chunk; if(Buffer.byteLength(body)>10000) return send(413,{error:'Query limit is 10 KB.'}); }
          const input=JSON.parse(body); return send(200,answerQuestion(id,input.question,input.role));
        }
      }
      if (req.method === 'GET' && url.pathname === '/api/data') return send(200, { documents, profiles });
      if (req.method === 'GET' && url.pathname === '/api/compare') return send(200, compare(url.searchParams.get('candidate') || 'candidate', Number(url.searchParams.get('quality') ?? 80)));
      if (req.method === 'POST' && url.pathname === '/api/import') {
        const origin = req.headers.origin;
        if (origin && origin !== `http://${req.headers.host}`) return send(403, { error: 'Cross-origin imports are not allowed.' });
        let body = '';
        for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > 2_000_000) return send(413, { error: 'Import limit is 2 MB.' }); }
        return send(200, importReport(JSON.parse(body)));
      }
      if (req.method === 'GET' && files[url.pathname]) { const [path, type] = files[url.pathname]; return send(200, await readFile(new URL(path, import.meta.url)), type); }
      send(404, { error: 'Not found' });
    } catch (error) { send(400, { error: error instanceof SyntaxError ? 'Invalid JSON. Check the trace file format.' : error.message }); }
  });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4317);
  createServer().listen(port, '127.0.0.1', () => console.log(`RAG Guardian is ready at http://127.0.0.1:${port}`));
}
