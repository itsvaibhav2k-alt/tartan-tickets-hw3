# HW3 plan and evidence map

## B2: review before implementation

Built and tested: Story 1 browsing (four passing unit tests, successful Next.js production build).
Not built: Story 2 SSO, Story 3 purchases, Story 4 waitlist, Story 5 event management, Story 6 check-in.

Chosen: Story 4 only. No checkout, payment provider, account provider, database, or actual emails.

Assumptions needing explicit specification:
1. How should the app notify a waiting student without an email service? Proposed and documented: visible, labeled in-app simulation.
2. How does a seat become available without a purchase/cancellation workflow? Proposed and documented: a separate demo-only release button.
3. What happens if an offer expires? Proposed and documented: next waiting entry receives it on the next request, using server time.
4. What counts as the same demo user? Proposed and documented: trimmed, case-insensitive typed name within one browser demo. This cannot substitute for authentication.

These are coding-agent assumptions recorded for the student to review, not claims that the original spec supplied these details.

| Story 4 acceptance criterion | Test name | Passing |
|---|---|---|
| A release notifies the next person and holds one seat for 30 minutes | Story 4: releasing one seat notifies the first waiting name and holds it for exactly 30 minutes | Yes |
| FIFO and no duplicate seat allocation | Story 4: two released seats go to the first two waiting people without overselling | Yes |
| Unexpired hold remains exclusive | Story 4: no second person can claim someone else's held seat | Yes |
| Expired hold advances the queue | Story 4: at exactly 30 minutes the hold expires and the next person is notified | Yes |
| A valid claim consumes the hold exactly once | Story 4: an unexpired offer can be claimed once only | Yes |
| Required name and duplicate handling | Story 4: blank names and duplicate joins are rejected by the server | Yes |

The original TEST_SPEC.md is retained unchanged. It uses a different set of requirement numbers; this table is the explicit homework supplement.
