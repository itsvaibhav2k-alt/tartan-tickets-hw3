# HW3 submission checklist

Vaibhav Maddhi · 70-445 · October 22, 2026

This is a completion checklist, not a finished homework submission or the student's personal analysis.

## Links

- Public app: https://tartan-tickets-hw3.vercel.app
- Public repository: https://github.com/itsvaibhav2k-alt/tartan-tickets-hw3
- Initial commit: https://github.com/itsvaibhav2k-alt/tartan-tickets-hw3/commit/561eb2e
- Story 4 commit: https://github.com/itsvaibhav2k-alt/tartan-tickets-hw3/commit/8f2ecce
- SEC-23 commit: https://github.com/itsvaibhav2k-alt/tartan-tickets-hw3/commit/60b829d
- Deployment dashboard: https://vercel.com/vaibhav-maddhis-projects/tartan-tickets-hw3
- Git connection settings: https://vercel.com/vaibhav-maddhis-projects/tartan-tickets-hw3/settings/git
- VS Code in the browser: https://github.dev/itsvaibhav2k-alt/tartan-tickets-hw3

## Part A — Initial build and publication

- [x] Original starter requirements, security, and test specifications preserved in `docs/`.
- [x] Story 1 app, initial failing/passing tests, and build.
- [x] `.gitignore` present in the first commit; tracked source checked for environment files and common key patterns.
- [x] Public GitHub repository and three implementation commits.
- [x] Public Vercel app; three separate production deployments reached Ready.
- [ ] Connect Vercel to GitHub and verify a future push triggers deployment automatically. CLI deployment is currently the working method.
- [ ] Capture the actual initial-commit file list and Vercel deployment-history screenshots.
- [ ] Post the repository and app links in the Canvas gallery if still accepted. No post has been made.

Evidence files: `evidence/A-first-story-failing.txt`, `A-first-story-passing.txt`, `A-build.txt`, `A-first-commit.txt`, and `vercel-deployments.txt`.

## Part B — New story

- [x] Story 4 scoped in requirements; planning assumptions explicitly documented.
- [x] Failing tests recorded before implementation, then passing tests/build.
- [x] Acceptance-criterion mapping in `HW3_TEST_PLAN.md`.
- [x] FIFO simulated notices, 30-minute holds, and single claims implemented.
- [x] Direct live endpoint checks, including invalid inputs, recorded in `evidence/live-api-checks.json`.
- [ ] Perform and capture at least three browser checks on the LIVE app. The direct HTTP results are not a substitute for browser screenshots.

Suggested browser checks:

| Check | Exact action | Expected result |
|---|---|---|
| Invalid name | Open One More Scene → Join waitlist; submit a blank name | Visible "Enter a demo name." error; empty queue |
| FIFO release | Add Alex Demo, then Blair Demo; select Simulate one seat released | Alex is offered a 30-minute hold; Blair stays waiting |
| Claim | Select Claim simulated seat; then Refresh status | Alex is claimed; Blair stays waiting; no real payment |
| Duplicate | Try Alex Demo again in that browser | Visible duplicate-name error; no extra entry |

Use a fresh private window if you want a new demo. Do not enter personal information. Serverless state can reset between requests; record the actual result if that occurs.

## Part C — Security fix

- [x] All original security rows audited in README.
- [x] New SEC-23 EARS rule added for trimmed demo names over 80 Unicode code points.
- [x] Failing security test evidence captured before the fix, then passing tests/build and audit update.
- [x] Live direct request with 81 characters rejected with HTTP 400 and unchanged queue size.
- [ ] Capture required before/after evidence screenshots from the real logs/audit.
- [ ] Write the required 2–3 sentence C-why explanation yourself. Explain the risk, server-side enforcement, and limits. Do not treat a simulated name as verified identity.

Before and after: `evidence/C-audit-before.txt`, `C-audit-after.txt`, `C-failing.txt`, `C-passing.txt`, `C-build.txt`.

## Part D — Student's manual classmate testing

- [ ] Choose a classmate's gallery app and read their requirements, security specification, and README.
- [ ] Personally make four manual attempts spanning at least three types. Follow the course's limits: no automation, scripts, loops, or load testing.
- [ ] Record exact input, expected behavior, actual observed result, relevant SEC rule, and severity for each attempt.
- [ ] Write your own analysis and EARS rule D1.

None of these attempts has been performed. Our automated checks target this project's own app and are not Part D evidence.

## Part E — Student's decision memo and cost exercise

- [ ] Write your own 300–400 word memo and launch decision supported by observed evidence.
- [ ] Address at least two unmet audit rows, one agent assumption, and a specification correction.
- [ ] Complete the Ridge cost table with current official model pricing and citations, measured tokenizer count, an output below 100 words, and up to five tool steps.
- [ ] Count each model call and cumulative conversation/tool history, then calculate 10,000 users/day, 30 days, hosting, and the required free-tier/privacy/latency discussion.

The memo, personal judgments, pricing research, and tokenizer exercise are not complete. AI may help explain the arithmetic or proofread your writing within the assignment's rules.

## Final submission

- [ ] Put your name at the top of the Word/PDF submission.
- [ ] Include the live app and public repository links, actual screenshots, and required tables/writing.
- [ ] Confirm the document follows Parts A–E and does not claim unavailable features or unperformed tests.
- [ ] Submit through Canvas. No Canvas submission has been made.
