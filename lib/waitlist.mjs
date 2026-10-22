import { seedEvents } from './events.mjs';
import { randomUUID } from 'node:crypto';
export function createDemo() { return { events: seedEvents().map(e => ({...e, sold: e.capacity - e.seatsRemaining})), entries: [] }; }
export class DemoError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
function available(state, event) {
  return event.capacity - event.sold - state.entries.filter(e => e.eventId === event.id && e.status === 'offered').length;
}
function offerAvailableSeats(state, now) {
  for (const event of state.events) {
    for (const entry of state.entries) {
      if (available(state, event) <= 0) break;
      if (entry.eventId === event.id && entry.status === 'waiting') {
        entry.status = 'offered'; entry.holdUntil = now + 30 * 60 * 1000;
        entry.notice = `${entry.name}, a seat is available! Your simulated hold lasts 30 minutes.`;
      }
    }
  }
}
function expireOffers(state, now) {
  for (const entry of state.entries) {
    if (entry.status === 'offered' && entry.holdUntil <= now) {
      entry.status = 'expired'; entry.notice = `${entry.name}, your seat offer expired.`;
    }
  }
  offerAvailableSeats(state, now);
}
function snapshot(state, now, entry) {
  return {
    events: state.events.map(e => ({ ...e, seatsRemaining: available(state, e) })),
    entries: state.entries.map(e => ({ ...e })), serverTime: now,
    ...(entry ? {entry: {...entry}} : {})
  };
}
export function applyAction(state, input, now = Date.now()) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new DemoError('Invalid request.');
  const { action, eventId, entryId } = input;
  if (!['status', 'join', 'release', 'claim'].includes(action)) throw new DemoError('Unknown action.');
  const event = state.events.find(e => e.id === eventId);
  if (action !== 'status' && !event) throw new DemoError('Event not found.', 404);
  expireOffers(state, now);
  let entry;
  if (action === 'join') {
    if (typeof input.name !== 'string' || !input.name.trim()) throw new DemoError('Enter a demo name.');
    const name = input.name.trim();
    if (state.entries.some(e => e.eventId === eventId && e.name.toLowerCase() === name.toLowerCase() && e.status !== 'expired')) {
      throw new DemoError('That name is already on this waitlist.', 409);
    }
    if (available(state, event) > 0) throw new DemoError('This event is not sold out.', 409);
    if (state.entries.length >= 100) throw new DemoError('This demo queue is full. Try a new browser demo.', 429);
    entry = { id: randomUUID(), eventId, name, status: 'waiting', joinedAt: now, holdUntil: null, notice: '' };
    state.entries.push(entry);
  } else if (action === 'release') {
    if (event.sold <= 0) throw new DemoError('No occupied seats remain to release.', 409);
    event.sold -= 1;
    offerAvailableSeats(state, now);
  } else if (action === 'claim') {
    entry = state.entries.find(e => e.id === entryId && e.eventId === eventId);
    if (!entry || entry.status !== 'offered') throw new DemoError('No active offer for this entry.', 409);
    entry.status = 'claimed'; entry.notice = `${entry.name}, your simulated seat is reserved. No payment was taken.`;
    event.sold += 1;
  }
  return snapshot(state, now, entry);
}
