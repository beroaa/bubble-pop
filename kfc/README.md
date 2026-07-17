# KFC Formula v2 — the menu factory

The v1 formula is one prompt that generates a menu: a lottery ticket — sometimes
RUSTIC-tier, sometimes not. v2 turns it into a **pipeline with quality gates**
so every menu that ships is at the bar, even at 1,000-per-sprint scale.

```
          ┌────────────────────────────────────────────────┐
          │                 TASTE SPEC                      │
          │   (RUSTIC + BEYT distilled into written law)    │
          └──────────────┬─────────────────────────────────┘
                         │ feeds every stage
   client brief ──► 1. GENERATOR ──► draft menu
                         │
                    2. CRITIC scores it 1-10 on every
                       dimension in critic-scorecard.md
                         │
                 pass? ──┴── no ──► 3. REGENERATOR fixes ONLY
                   │                  what the critic flagged,
                   yes                then back to the critic
                   │                  (max 3 loops, then human)
                   ▼
              4. SHIP + LOG every score to flywheel-log
                         │
              5. FLYWHEEL: patterns that win get promoted
                 into the Taste Spec; losers get banned.
                 The formula is smarter every batch.
```

## Files

| File | What it is |
|---|---|
| `taste-spec.md` | The law. Starts as a template — gets filled by distilling RUSTIC + BEYT. |
| `generator-prompt.md` | Stage 1 prompt. The current KFC formula pastes into its core slot. |
| `critic-scorecard.md` | Stage 2 prompt — the AI judge with per-dimension anchors and auto-reject red flags. |
| `regeneration-loop.md` | Stage 3 prompt + loop rules (targeted fixes, never full re-rolls). |
| `flywheel-log.md` | Stage 4/5 — the score + outcome log that makes the system self-improving. |

## How to run it today (manual, zero new tools)

1. Fill the client slots in `generator-prompt.md`, run it in your AI chat.
2. Paste the result into `critic-scorecard.md`'s prompt, run it.
3. If any gate fails, run `regeneration-loop.md` with the critic's notes.
4. Log the final scores in `flywheel-log.md`.

Same flow later becomes automated inside forge-daemon.py — the prompts are the
product; the daemon just loops them.

## Status

- [x] Pipeline architecture
- [x] Critic scorecard (4-lens expert panel, synthesized)
- [ ] Taste Spec distillation — **needs RUSTIC + BEYT screenshots/links**
- [ ] Current formula merged into generator — **needs the v1 formula pasted**
- [ ] 10-menu benchmark for real cost-per-menu — after the two above
