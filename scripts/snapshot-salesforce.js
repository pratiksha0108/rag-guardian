// Fetch data only. Never import or execute upstream code.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const revision = '7524748ece585fc08413b3fcfb2e5494e24f29ed';
const repository = 'trailheadapps/lwc-recipes';
const root = new URL('../datasets/salesforce-lwc/', import.meta.url);
const components = ['apexImperativeMethod', 'apexWireMethodWithParams', 'ldsCreateRecord', 'wireGetRecord', 'navToRecord', 'miscToastNotification'];
const paths = ['LICENSE.md', 'README.md', 'force-app/main/default/lwc/pubsub/README.md', ...components.flatMap(c => ['js', 'html'].map(ext => `force-app/main/default/lwc/${c}/${c}.${ext}`))];
const hash = data => createHash('sha256').update(data).digest('hex');
await mkdir(new URL('raw/', root), { recursive: true });
let existing;
try { existing = JSON.parse(await readFile(new URL('manifest.json', root), 'utf8')); } catch (e) { if(e.code !== 'ENOENT') throw e; }
const fetched = await Promise.all(paths.map(async path => {
  const url = `https://raw.githubusercontent.com/${repository}/${revision}/${path}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not fetch ${path}: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const file = path.replaceAll('/', '__');
  const sha256 = hash(bytes);
  const expected = existing?.files.find(f => f.path === path);
  if (expected && expected.sha256 !== sha256) throw new Error(`Integrity mismatch: ${path}`);
  return { path, file: `raw/${file}`, sha256, bytes: bytes.length, url: `https://github.com/${repository}/blob/${revision}/${path}`, data: bytes };
}));
const license = fetched.find(f => f.path === 'LICENSE.md');
if (!license.data.toString().includes('CC0 1.0 Universal')) throw new Error('Expected CC0 license not found. Stop for source review.');
for (const f of fetched) await writeFile(new URL(f.file, root), f.data);
const manifest = { schemaVersion: 1, assistantId: 'salesforce-lwc', repository, revision, retrievedAt: existing?.retrievedAt || new Date().toISOString(), license: 'CC0-1.0', purpose: 'Small educational source-code retrieval corpus, not general Salesforce documentation.', files: fetched.map(({data, ...metadata}) => metadata) };
await writeFile(new URL('manifest.json', root), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Verified ${fetched.length} pinned source files at ${revision}. No upstream code executed.`);
