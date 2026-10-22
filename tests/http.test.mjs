import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHandlers} from '../lib/http.mjs';
const url='https://example.test/api/waitlist';
function post(body,cookie='',origin='https://example.test') { return new Request(url,{method:'POST',headers:{'content-type':'application/json',cookie,origin},body:JSON.stringify(body)}); }
test('Story 4 API: a browser can join, receive an offer and claim; another browser has an isolated demo',async()=>{
 const h=createHandlers();
 const first=await h.GET(new Request(url));const cookie=first.headers.get('set-cookie').split(';')[0];
 const join=await h.POST(post({action:'join',eventId:'film-night',name:'Alex'},cookie));assert.equal(join.status,201);
 const entry=(await join.json()).entry;
 const release=await h.POST(post({action:'release',eventId:'film-night'},cookie));assert.equal((await release.json()).entries[0].status,'offered');
 const claim=await h.POST(post({action:'claim',eventId:'film-night',entryId:entry.id},cookie));assert.equal((await claim.json()).entries[0].status,'claimed');
 const other=await h.GET(new Request(url));assert.equal((await other.json()).entries.length,0);
});
test('Story 4 API: a direct blank-name request is refused with HTTP 400',async()=>{
 const h=createHandlers();const r=await h.POST(post({action:'join',eventId:'film-night',name:' '}));assert.equal(r.status,400);
 assert.match((await r.json()).error,/Enter a demo name/);
});
test('API: malformed JSON and a cross-origin write are refused',async()=>{
 const h=createHandlers();
 assert.equal((await h.POST(new Request(url,{method:'POST',body:'{'}))).status,400);
 assert.equal((await h.POST(post({action:'join',eventId:'film-night',name:'Alex'},'','https://other.test'))).status,403);
});
