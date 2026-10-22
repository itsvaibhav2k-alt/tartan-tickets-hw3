# Tartan Tickets — HW3

Vaibhav Maddhi · CMU 70-445 AI for Business Leaders · Fall 2026.

Built from the three official Canvas Starter A files in `docs/`.

## Run

Node.js 22 or newer. Run `npm install`, `npm test`, `npm run build`, and `npm run dev`. Open http://localhost:3000.

## Initial build: Story 1

Browse upcoming events with dates (Eastern time), locations, prices and seats remaining. Sold-out events show Join waitlist instead of Buy. In this first version, these action buttons explain that their workflows are not yet built. Refresh reloads events from the server. Empty and error states are included.

## Homework non-goals

- No real payments or payment provider. Future payment demonstrations must use a Simulated payment button.
- No real authentication or university SSO. Any identity simulation uses a typed name, not a sign-in provider.
- No database. Data is held in server memory and resets on every deploy; serverless instances may also reset it between requests or maintain separate copies. This prototype cannot guarantee shared inventory or persistence for real users.
- No real email service. Any notifications must be explicitly labeled as a simulation.
- No model calls and no API keys.

## Specification discrepancies

The supplied TEST_SPEC.md references REQ-1.1–REQ-8.5, whereas requirements.md defines six stories without those identifiers. SECURITY_SPEC.md references assumptions A1–A12 that do not appear in the supplied requirements. Data retention also conflicts: requirements.md says one year; SEC-18 says 90 days. Original materials are preserved. Homework tests reference the actual story numbers and scoped acceptance criteria; the full original test plan is not claimed as implemented.

## Security spec audit

| Rule | Status | Evidence / remaining work |
|---|---|---|
| SEC-1 | Not at all | No CMU SSO; prototype only. |
| SEC-2 | Not at all | No authenticated sessions or expiry. |
| SEC-3 | Partly | Local development uses HTTP; verify hosted HTTPS and HSTS after deployment. |
| SEC-4 | Not at all | No verified roles or club membership. |
| SEC-5 | Not at all | No protected club resources or denied-access audit. |
| SEC-6 | Not at all | No ticket ownership or private ticket route. |
| SEC-7 | Not at all | No Stripe Checkout; no payment/card data accepted. |
| SEC-8 | Not at all | Checkout is not implemented. |
| SEC-9 | Not at all | No Stripe webhook route or signature handling. |
| SEC-10 | Not at all | No Stripe event processing. |
| SEC-11 | Partly | No secrets are needed; gitignore excludes environment files. Production secrets management is absent. |
| SEC-12 | Not at all | No payout account management or approvals. |
| SEC-13 | Not at all | No issued tickets or QR tokens. |
| SEC-14 | Not at all | No check-in workflow or concurrency protection. |
| SEC-15 | Not at all | No scan rate limit or officer alerts. |
| SEC-16 | Not at all | No checkout workflow or hoarding protection. |
| SEC-17 | Not at all | No purchase workflow. |
| SEC-18 | Not at all | No durable retention/deletion policy; memory reset is not an implemented retention schedule. |
| SEC-19 | Not at all | No officer exports or export logs. |
| SEC-20 | Partly | React renders seed event text as text; no officer-entry workflow or explicit regression test yet. |
| SEC-21 | Not at all | No sensitive-action audit logs. |
| SEC-22 | Not at all | No durable append-only admin-only audit store. |

Tests are written before implementation. Original command output is retained separately as homework evidence. Do not use this prototype for real ticket sales.

## Story 4: waitlist implementation

Open One More Scene and choose Join waitlist. Add Alex Demo and then Blair Demo. Use Simulate one seat released. Alex receives an in-app notice and a server-timed 30-minute hold; Blair remains waiting. Claim simulated seat confirms Alex once. Refresh status checks expiry and passes an expired hold to the next waiting entry. Blank names and duplicate joins are refused server-side. No real email is sent.

The queue is an isolated browser demo keyed by an opaque HttpOnly cookie. This is not identity verification: anyone using that browser can act for its demo entries. Multiple Vercel instances can lose or diverge on state. All tests of queue ordering and inventory apply to one server instance.

Part B validation: 15 tests passed, including 8 new story tests and 3 request-handler tests, and the production build passed. See docs/HW3_TEST_PLAN.md for acceptance mapping. Stories 2, 3, 5 and 6 remain out of scope.
