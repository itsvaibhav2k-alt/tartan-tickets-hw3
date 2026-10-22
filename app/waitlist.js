'use client';
import {useState,useEffect,useRef} from 'react';

export default function Waitlist({event,onUpdate,onClose}) {
 const [entries,setEntries]=useState([]), [name,setName]=useState(''), [ready,setReady]=useState(false);
 const [busy,setBusy]=useState(false), [error,setError]=useState(''), [message,setMessage]=useState('');
 const [serverTime,setServerTime]=useState(null);
 const lock=useRef(false), panel=useRef(null);
 function accept(data) {setEntries(data.entries);setServerTime(data.serverTime);onUpdate(data.events);setReady(true);}
 useEffect(()=>{let active=true; panel.current?.scrollIntoView({behavior:'smooth',block:'start'});
  fetch('/api/waitlist',{cache:'no-store'}).then(async r=>{if(!r.ok)throw new Error('Could not load this demo. Use Refresh status to retry.');return r.json();}).then(data=>{if(active)accept(data);}).catch(e=>{if(active)setError(e.message);});
  return ()=>{active=false;};
 },[]);
 async function send(action,extra={}) {
  if(lock.current)return;lock.current=true;setBusy(true);setError('');setMessage('');
  try {
   const response=await fetch('/api/waitlist',action==='status'?{cache:'no-store'}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,eventId:event.id,...extra})});
   const data=await response.json();if(!response.ok)throw new Error(data.error||'The request was refused.');accept(data);
   if(action==='join'){setName('');setMessage(`${data.entry.name} joined the waitlist.`);}
   if(action==='release')setMessage('One seat was released in this demo. Check the queue below for the next offer.');
   if(action==='claim')setMessage('Simulated reservation confirmed. No payment was taken.');
  }catch(e){setError(e.message||'Connection lost. Refresh before trying again.');}
  finally{lock.current=false;setBusy(false);}
 }
 const queue=entries.filter(e=>e.eventId===event.id);
 const hasWaitlist=event.id==='film-night'||queue.length>0||event.seatsRemaining===0;
 return <section className="waitlist-panel" ref={panel} aria-labelledby="waitlist-heading">
  <div className="section-heading"><div><p className="eyebrow">YOUR CAMPUS PLAN</p><h2 id="waitlist-heading">{event.title}</h2></div><button className="refresh" onClick={onClose}>Close ×</button></div>
  {!hasWaitlist ? <div className="notice"><strong>Checkout is outside this homework's scope.</strong><p>This prototype implements browsing and waitlists. To try the working feature, close this panel and choose “Join waitlist” on One More Scene.</p></div> : <>
   <p className="panel-intro">Join with a made-up name. When a seat opens, the next person gets an in-app notice and a 30-minute hold.</p>
   <form className="join-form" onSubmit={e=>{e.preventDefault();send('join',{name});}}>
    <div><label htmlFor="demo-name">Demo name</label><input id="demo-name" value={name} onChange={e=>setName(e.target.value)} maxLength={80} placeholder="e.g. Alex Demo" autoComplete="off"/><small>Use a made-up name. No email or sign-in needed.</small></div>
    <button className="primary" type="submit" disabled={busy||!ready}>{busy?'Working…':'Join waitlist ↗'}</button>
   </form>
   {error&&<p className="notice error" role="alert">{error}</p>}{message&&<p className="notice" role="status">{message}</p>}
   <div className="queue-header"><h3>Your browser's demo queue</h3><button className="refresh" onClick={()=>send('status')} disabled={busy}>Refresh status ↻</button></div>
   {!ready?<p role="status">Loading your demo…</p>:queue.length===0?<p className="queue-empty">The queue is empty. Add Alex Demo, then Blair Demo to see how the order works.</p>:<ol className="queue">{queue.map(entry=><li key={entry.id}>
    <div><strong>{entry.name}</strong><span className={`status status-${entry.status}`}>{entry.status}</span>{entry.notice&&<p>{entry.notice}</p>}{entry.status==='offered'&&<p className="expiry">Expires {new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'numeric',minute:'2-digit',second:'2-digit'}).format(new Date(entry.holdUntil))} ET · {Math.max(0,Math.ceil((entry.holdUntil-serverTime)/60000))} min at last refresh</p>}</div>
    {entry.status==='offered'&&<button className="primary" disabled={busy} onClick={()=>send('claim',{entryId:entry.id})}>Claim simulated seat</button>}
   </li>)}</ol>}
   <div className="simulation"><div><strong>Try the release → offer flow</strong><p>This button simulates an attendee giving up one seat. It does not affect a real booking.</p></div><button className="secondary" disabled={busy||!ready} onClick={()=>send('release')}>Simulate one seat released</button></div>
   <p className="state-note">Offers expire using server time. Refresh status checks expirations and advances the queue. Each browser has an isolated demo. Shared inventory and verified identities are not implemented.</p>
  </>}
 </section>;
}
