import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHandlers} from '../lib/http.mjs';
const url='https://example.test/api/waitlist';
function request(name,cookie='') {return new Request(url,{method:'POST',headers:{'content-type':'application/json',cookie},body:JSON.stringify({action:'join',eventId:'film-night',name})});}
test('SEC-23: the server rejects a name longer than 80 characters without adding it to the waitlist',async()=>{
 const h=createHandlers();const start=await h.GET(new Request(url));const cookie=start.headers.get('set-cookie').split(';')[0];
 const r=await h.POST(request('A'.repeat(81),cookie));
 assert.equal(r.status,400,'Overlong direct API requests must be rejected');
 assert.match((await r.json()).error,/80/);
 const after=await h.GET(new Request(url,{headers:{cookie}}));assert.equal((await after.json()).entries.length,0);
});
test('SEC-23: exactly 80 characters after trimming are accepted',async()=>{
 const h=createHandlers();const r=await h.POST(request('  '+'A'.repeat(80)+'  '));
 assert.equal(r.status,201);assert.equal((await r.json()).entry.name.length,80);
});
test('SEC-23: the server counts Unicode code points and rejects 81 non-ASCII characters',async()=>{
 const h=createHandlers();assert.equal((await h.POST(request('🎟'.repeat(81)))).status,400);
 assert.equal((await h.POST(request('🎟'.repeat(80)))).status,201);
});
