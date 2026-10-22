import { randomBytes } from 'node:crypto';
import { createDemo, applyAction, DemoError } from './waitlist.mjs';

export function createHandlers() {
  const sessions = new Map();
  const lifetime = 2 * 60 * 60 * 1000;
  function session(request) {
    const now = Date.now();
    for (const [id, data] of sessions) if (now - data.touchedAt > lifetime) sessions.delete(id);
    const raw = (request.headers.get('cookie') || '').split(';').map(s => s.trim()).find(s => s.startsWith('tartan_demo='))?.slice(12);
    let id = /^[a-f0-9]{32}$/.test(raw || '') && sessions.has(raw) ? raw : null;
    if (!id) {
      if (sessions.size >= 500) sessions.delete(sessions.keys().next().value);
      id = randomBytes(16).toString('hex');
      sessions.set(id, { state: createDemo(), touchedAt: now });
    }
    const data = sessions.get(id); data.touchedAt = now;
    return { id, state: data.state };
  }
  function response(data, status, id, request) {
    const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
    if (id) headers['Set-Cookie'] = `tartan_demo=${id}; HttpOnly; SameSite=Strict; Path=/; Max-Age=7200${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
    return Response.json(data, {status, headers});
  }
  async function handle(request) {
    let id;
    try {
      const origin = request.headers.get('origin');
      if (origin && origin !== new URL(request.url).origin) throw new DemoError('Request origin is not allowed.', 403);
      let input = {action:'status'};
      if (request.method === 'POST') {
        const body = await request.text();
        if (Buffer.byteLength(body, 'utf8') > 16384) throw new DemoError('Request is too large.', 413);
        try { input = JSON.parse(body); } catch { throw new DemoError('Invalid JSON.'); }
      }
      const data = session(request); id = data.id;
      // No await inside state mutation: one request's inventory update is synchronous.
      const result = applyAction(data.state, input);
      return response(result, input.action === 'join' ? 201 : 200, id, request);
    } catch (error) {
      return response({error: error instanceof DemoError ? error.message : 'Something went wrong. Please try again.'}, error instanceof DemoError ? error.status : 500, id, request);
    }
  }
  return { GET: handle, POST: handle };
}
