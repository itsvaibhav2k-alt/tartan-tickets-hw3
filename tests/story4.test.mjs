import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDemo, applyAction } from '../lib/waitlist.mjs';
const now = Date.parse('2026-10-22T18:00:00Z');
const eventId = 'film-night';
const act = (state, action, data = {}, at = now) => applyAction(state, { action, eventId, ...data }, at);
const join = (state, name) => act(state, 'join', { name }).entry;

test('Story 4: releasing one seat notifies the first waiting name and holds it for exactly 30 minutes', () => {
 const s = createDemo(); const a = join(s, 'Alex Demo'); join(s, 'Blair Demo');
 const r = act(s, 'release');
 const offered = r.entries.find(e => e.id === a.id);
 assert.equal(offered.status, 'offered'); assert.equal(offered.holdUntil, now + 30 * 60 * 1000);
 assert.match(offered.notice, /Alex Demo/); assert.match(offered.notice, /30 minutes/);
 assert.equal(r.events.find(e => e.id === eventId).seatsRemaining, 0);
 assert.equal(r.entries[1].status, 'waiting');
});
test('Story 4: two released seats go to the first two waiting people without overselling', () => {
 const s = createDemo(); join(s, 'Alex'); join(s, 'Blair'); join(s, 'Casey');
 act(s, 'release'); const r = act(s, 'release');
 assert.deepEqual(r.entries.map(e=>e.status), ['offered','offered','waiting']);
 assert.equal(r.events.find(e=>e.id===eventId).seatsRemaining, 0);
});
test("Story 4: no second person can claim someone else's held seat", () => {
 const s=createDemo(); join(s,'Alex'); const b=join(s,'Blair'); act(s,'release');
 assert.throws(()=>act(s,'claim',{entryId:b.id}), /No active offer/);
 assert.equal(s.entries[0].status,'offered');
});
test('Story 4: at exactly 30 minutes the hold expires and the next person is notified', () => {
 const s=createDemo(); const a=join(s,'Alex'); join(s,'Blair'); act(s,'release');
 const before=act(s,'status',{},now+30*60*1000-1); assert.equal(before.entries[0].status,'offered');
 const r=act(s,'status',{},now+30*60*1000);
 assert.equal(r.entries[0].status,'expired'); assert.equal(r.entries[1].status,'offered');
 assert.equal(r.entries[1].holdUntil,now+60*60*1000);
 assert.throws(()=>act(s,'claim',{entryId:a.id},now+30*60*1000), /No active offer/);
});
test('Story 4: an unexpired offer can be claimed once only', () => {
 const s=createDemo(); const a=join(s,'Alex'); act(s,'release');
 const r=act(s,'claim',{entryId:a.id},now+1000);
 assert.equal(r.entries[0].status,'claimed');
 assert.equal(r.events.find(e=>e.id===eventId).seatsRemaining,0);
 assert.throws(()=>act(s,'claim',{entryId:a.id},now+2000), /No active offer/);
});
test('Story 4: blank names and duplicate joins are rejected by the server', () => {
 const s=createDemo();
 assert.throws(()=>join(s,'   '), /Enter a demo name/);
 join(s,' Alex '); assert.throws(()=>join(s,'aLEX'), /already on this waitlist/);
 assert.equal(s.entries.length,1);
});
test('Story 4: an expired hold with no waiting person restores availability',()=>{
 const s=createDemo();join(s,'Alex');act(s,'release');
 const r=act(s,'status',{},now+30*60*1000);
 assert.equal(r.events.find(e=>e.id===eventId).seatsRemaining,1);
});
test('Story 4: unknown events, unknown actions and joining a non-sold-out event are rejected',()=>{
 const s=createDemo();
 assert.throws(()=>applyAction(s,{action:'join',eventId:'missing',name:'Alex'},now),/Event not found/);
 assert.throws(()=>act(s,'delete'), /Unknown action/);
 assert.throws(()=>applyAction(s,{action:'join',eventId:'makers-night',name:'Alex'},now),/not sold out/);
});
