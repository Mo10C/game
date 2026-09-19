// Optional local preview. The game itself needs no Node.js or server.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const base = fs.existsSync(path.join(__dirname, 'dist', 'index.html')) ? path.join(__dirname, 'dist') : __dirname;
const args = process.argv.slice(2);
const flag = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
const port = Number(flag('--port') || process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.json':'application/json; charset=utf-8'};
http.createServer((req,res)=>{
  let requested;
  try { requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch {res.writeHead(400);res.end();return;}
  if(requested.endsWith('/'))requested+='index.html';
  const file=path.resolve(base,'.'+requested);
  if(!file.startsWith(base+path.sep)){res.writeHead(403);res.end();return;}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);});
}).listen(port,'0.0.0.0',()=>console.log(`Bloom Spire preview ready on port ${port}`));
