# Stage 3 — Regeneration loop

Run this ONLY when the critic failed one or more gates. Never re-roll the whole
menu — targeted fixes preserve what already passed.

## Loop rules
- Maximum **3** regeneration rounds per menu. Still failing after 3 → human
  review (Ibrahim), and the failure pattern gets a row in `flywheel-log.md` —
  repeated failure patterns become new red flags in the scorecard or new law
  in the taste spec.
- Each round fixes ONLY the failed dimensions. Passing dimensions are frozen.
- Score must go up every round on every failed dimension; a dimension that
  drops after a "fix" is a red flag on the formula itself — log it.

## The prompt

---

You are revising a Menu Sadah e-menu that failed quality gates. The critic's
verdict is below. Fix ONLY what failed; do not touch anything that passed.

## Critic verdict
[►►► PASTE THE CRITIC'S FAILED DIMENSIONS + NOTES HERE ◄◄◄]

## Current menu
[►►► PASTE THE CURRENT HTML HERE ◄◄◄]

## Rules
1. Address every failed dimension using the critic's specific notes.
2. Frozen: every element the critic scored 8+. Change nothing about them.
3. State in 2 lines per failed dimension what you changed and why it will
   score higher.
4. Output the complete corrected single-file HTML.

Revise now.
