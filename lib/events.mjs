export function upcomingEvents(events, now = Date.now()) {
  return events.filter(event => event.status === 'published' && Date.parse(event.startsAt) > now)
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}
export function eventAction(event) {
  return event.seatsRemaining <= 0 ? 'Join waitlist' : 'Buy';
}
export function seedEvents() {
  return [
    { id: 'autumn-sessions', title: 'Autumn Sessions', club: 'CMU Music Club', category: 'Live music', startsAt: '2026-11-07T00:00:00Z', location: 'Cohon University Center', priceCents: 1200, capacity: 80, seatsRemaining: 18, status: 'published', description: 'An evening of student bands, acoustic sets, and new favorites.', color: 'coral' },
    { id: 'makers-night', title: 'After Hours: Makers Night', club: 'ScottyLabs', category: 'Make something', startsAt: '2026-11-13T23:00:00Z', location: 'Gates Hillman Center', priceCents: 0, capacity: 40, seatsRemaining: 7, status: 'published', description: 'Bring a curious mind. Leave with something you made.', color: 'blue' },
    { id: 'film-night', title: 'One More Scene', club: 'Film Club', category: 'Film & conversation', startsAt: '2026-11-15T00:00:00Z', location: 'McConomy Auditorium', priceCents: 500, capacity: 60, seatsRemaining: 0, status: 'published', description: 'A student-picked screening followed by a conversation worth staying for.', color: 'yellow' }
  ];
}
