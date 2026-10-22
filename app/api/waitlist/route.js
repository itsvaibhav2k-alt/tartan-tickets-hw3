import { createHandlers } from '../../../lib/http.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const stateKey = Symbol.for('tartan-tickets-demo-handlers');
const handlers = globalThis[stateKey] ??= createHandlers();
export const GET = handlers.GET;
export const POST = handlers.POST;
