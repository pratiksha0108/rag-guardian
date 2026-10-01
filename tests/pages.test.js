import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,existsSync} from 'node:fs';
test('Pages build uses subpath-safe links and an offline business adapter',()=>{
 execFileSync(process.execPath,['scripts/build-pages.js']);
 for(const name of ['index.html','behavior-lab.html','policy.js','lavender.css']){
  const text=readFileSync('dist/'+name,'utf8');assert.doesNotMatch(text,/(?:src|href)="\/(?!\/)|url\('\//);
 }
 assert.doesNotMatch(readFileSync('dist/business.js','utf8'),/fetch\(/);
 assert.ok(existsSync('dist/assets/guardian-parts.png'));
 assert.ok(existsSync('dist/policy-engine.js'));
});
