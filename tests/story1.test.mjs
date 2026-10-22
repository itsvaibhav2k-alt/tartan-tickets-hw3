import { test } from 'node:test';
import assert from 'node:assert/strict';
import { upcomingEvents, eventAction } from '../lib/events.mjs';

const now = Date.parse('2026-10-22T12:00:00Z');
const event = { id: 'music', title: 'Autumn Sessions', startsAt: '2026-11-07T23:00:00Z', location: 'Cohon Center', priceCents: 1200, capacity: 40, seatsRemaining: 8, status: 'published' };

test('Story 1: upcoming events include date, location, price and seats remaining', () => {
  const result = upcomingEvents([event], now);
  assert.equal(result.length, 1);
  assert.equal(result[0].startsAt, event.startsAt);
  assert.equal(result[0].location, 'Cohon Center');
  assert.equal(result[0].priceCents, 1200);
  assert.equal(result[0].seatsRemaining, 8);
});
test('Story 1: sold-out events show Join waitlist instead of Buy', () => {
  assert.equal(eventAction({ ...event, seatsRemaining: 0 }), 'Join waitlist');
});
test('Story 1: events with available seats show Buy', () => {
  assert.equal(eventAction(event), 'Buy');
});
test('Story 1: past and cancelled events are excluded, remaining events sorted by date', () => {
  const later = { ...event, id: 'later', startsAt: '2026-12-01T23:00:00Z' };
  const old = { ...event, id: 'old', startsAt: '2026-01-01T23:00:00Z' };
  const cancelled = { ...event, id: 'cancelled', status: 'cancelled' };
  assert.deepEqual(upcomingEvents([later, old, cancelled, event], now).map(e => e.id), ['music', 'later']);
});
