import EventBrowser from './event-browser';
import { seedEvents, upcomingEvents } from '../lib/events.mjs';
export const dynamic = 'force-dynamic';
export default function Home() { return <EventBrowser initialEvents={upcomingEvents(seedEvents())} />; }
