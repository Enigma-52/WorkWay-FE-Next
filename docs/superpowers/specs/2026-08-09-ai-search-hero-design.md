# AI search hero — design idea (next phase, post-launch)

Status: **idea capture, not approved/scoped** — deliberately deferred until
the current pricing/Pro-plan deployment is live. Written so the reasoning
doesn't have to be reconstructed from chat history when this gets picked up.

## The idea

Replace the homepage Hero's current CTAs ("Browse Jobs" / "How it works")
with a single natural-language search box — e.g. *"SWE jobs at SpaceX,
remote, senior level"*. On submit:

1. If signed out → open the sign-in modal with `callbackUrl=/chat?q=<query>`
   (the callback-URL threading built for exactly this already exists —
   `AuthModal`, `middleware.ts`, `AuthRedirectGate`, magic-link's
   `callbackUrl` param).
2. After sign-in → land on `/chat` with that query already sent, so it reads
   as one continuous action, not "stop, sign in, start over."
3. `/jobs` stays exactly as-is underneath for manual/filter-based browsing —
   demoted to a secondary link under the search box, not removed. It's the
   indexed, SEO-load-bearing surface; the AI box is a new front door, not a
   replacement for the old one.

## Why this is worth doing (not just "add AI because AI")

- **It's the right shape of problem for an LLM.** Compound intent like "swe
  jobs at spacex" mixes a company lookup with a domain/role filter — that's
  exactly what breaks a dropdown-filter UI and is trivial for a model with
  tool access to real search functions.
- **It's already de-risked.** `WorkWay--BE/src/services/chatService.js` is
  not a naive chat wrapper — its system prompt is explicit ("retrieve real
  jobs using tools only, never invent data") and it uses real function
  calling against the actual job-search DAOs. The hallucinated-listings risk
  that would otherwise be the top concern for a jobs platform doing this is
  already solved by existing code.
- **It reframes a liability into the funnel.** The research that led here
  found `/chat` live, fully built, and reachable with zero auth — real
  LLM spend per message, gated only by a per-IP rate limit. That's being
  closed independently of this idea (see the growth-strategy doc), but this
  design turns the same feature into the *primary* homepage acquisition
  mechanic instead of just closing a hole.
- **Resume-personalized results as a Pro perk** falls out of this almost for
  free: the Talent Profile's resume and chat's tool-calling already both
  exist — personalizing chat answers with a user's own background is a new
  prompt, not new infrastructure.

## What has to be true before this ships

- **Per-user message quotas, not just per-IP.** Once chat is the homepage's
  primary CTA instead of a side feature, volume assumptions change
  completely. This is the one item that must land *with* this feature, not
  after — matches the "AI chat: Pro = unlimited/priority" lever already
  identified in the growth-strategy doc.
- **`/jobs` must stay one click away and still feel like the primary way to
  browse for anyone who doesn't want to "talk."** Don't let the AI box
  become the only path in from the homepage.
- Decide whether the box also needs a plain-text fallback path (e.g., typing
  something that isn't really a natural-language query) so it doesn't feel
  broken for someone who just types "engineer" expecting classic search.

## Explicitly not decided yet

- Exact copy/placeholder text for the search box.
- Whether resume-personalization ships in the same release or is a fast
  follow.
- Whether the free tier gets any chat access at all, or if chat itself
  becomes Pro-only outright (simpler, but loses it as a login-funnel tool —
  needs a real decision, not a default).

## Related

- Growth strategy doc (login/Pro conversion levers) — the chat-gating and
  quota items there are prerequisites for this, not duplicates of it.
- `FEATURES.md` → Analytics section has the existing `source`-tagged
  sign-in event instrumentation this should reuse for measurement.
