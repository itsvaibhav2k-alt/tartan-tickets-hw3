'use client';
import { useState } from 'react';
import { eventAction } from '../lib/events.mjs';

export default function EventBrowser({ initialEvents }) {
  const [events, setEvents] = useState(initialEvents);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function refresh() {
    setBusy(true); setError('');
    try { const response = await fetch('/api/events'); if (!response.ok) throw new Error('Could not load events. Please try again.'); setEvents((await response.json()).events); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  return <>
    <header className="header"><a className="brand" href="/" aria-label="Tartan Tickets home"><span className="brand-icon">t.</span>tartan tickets</a><span className="course-label">CMU / STUDENT PROTOTYPE</span></header>
    <main>
      <section className="hero"><div><p className="eyebrow">GOOD PEOPLE. GREAT PLANS.</p><h1>Your next<br />campus plan<span>.</span></h1><p className="intro">A little less scrolling. A little more showing up.<br />Find something worth stepping out for.</p><a className="browse-link" href="#events">Explore upcoming events <span>↗</span></a></div><div className="ticket-art" aria-hidden="true"><div className="ticket-top">TARTAN TICKETS <span>01 / 03</span></div><p>SEE YOU<br /><em>THERE.</em></p><div className="ticket-bottom"><span>MADE FOR<br />CAMPUS LIFE</span><span className="barcode">|||| ||| || ||||| |||</span></div></div></section>
      <section id="events" aria-labelledby="events-heading"><div className="section-heading"><div><p className="eyebrow">ON THE CALENDAR</p><h2 id="events-heading">Coming up on campus</h2></div><button className="refresh" onClick={refresh} disabled={busy}>{busy ? 'Loading…' : 'Refresh events ↻'}</button></div>
        {error && <p className="notice error" role="alert">{error}</p>}
        {message && <p className="notice" role="status">{message}</p>}
        {events.length === 0 ? <p className="empty">No upcoming events yet.</p> : <div className="events">{events.map((event, index) => <article className="event" key={event.id}>
          <div className={`event-art ${event.color}`} aria-hidden="true"><span className="poster-club">{event.club}</span><span className="poster-number">0{index + 1}</span><span className="poster-word">{['TURN<br/>IT UP.', 'MAKE<br/>A NIGHT.', 'ONE MORE<br/>SCENE.'][index]?.split('<br/>').map((line, i) => <span key={i}>{line}<br /></span>)}</span><span className="poster-category">{event.category} ↗</span></div>
          <div className="event-info"><p className="event-date">{new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(event.startsAt))} ET</p><h3>{event.title}</h3><p className="location">{event.location}</p><p className="description">{event.description}</p><div className="event-meta"><strong>{event.priceCents === 0 ? 'Free' : `$${(event.priceCents / 100).toFixed(2)}`}</strong><span className={event.seatsRemaining === 0 ? 'sold-out' : 'availability'}>{event.seatsRemaining === 0 ? 'Sold out' : `${event.seatsRemaining} seats remaining`}</span></div><button className={event.seatsRemaining === 0 ? 'secondary action' : 'primary action'} onClick={() => setMessage(`${eventAction(event)}: this initial version supports browsing only. This action is not built yet.`)}>{eventAction(event)} <span>↗</span></button></div>
        </article>)}</div>}
      </section>
      <aside className="demo-note"><strong>A class prototype, with real learning.</strong><p>Sample events only. No real payments, sign-in, or database. Do not enter personal information. Server data resets on deploy and may reset between requests.</p></aside>
    </main><footer><span>tartan tickets</span><span>Built by Vaibhav Maddhi · 70-445 · HW3</span></footer>
  </>;
}
