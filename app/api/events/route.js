import { seedEvents, upcomingEvents } from '../../../lib/events.mjs';
export const dynamic = 'force-dynamic';
export function GET() { return Response.json({ events: upcomingEvents(seedEvents()) }, { headers: { 'Cache-Control': 'no-store' } }); }
