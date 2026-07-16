export const meta = {
  name: 'menu-enhance-swarm',
  description: 'Multi-dimensional audit -> verify -> improve -> re-verify across all menus',
  phases: [
    { title: 'Audit', detail: '3 specialist lenses per menu, in parallel' },
    { title: 'Verify', detail: 'adversarially filter findings' },
    { title: 'Improve', detail: 'apply surviving fixes, enrich visuals' },
    { title: 'Re-verify', detail: 'stress harness gate' },
  ],
}

// Slugs come via args (workflow scripts have no fs access). Launch with:
//   Workflow({ scriptPath, args: ["three-coffee","maqha-noon", ...] })
const slugs = Array.isArray(args) ? args : (args && args.slugs) || []
if (!slugs.length) { log('No slugs passed via args — nothing to enhance.'); return [] }
log(`Enhance swarm over ${slugs.length} menus: ${slugs.join(', ')}`)

const HOUSE = `Menu Sadah standard: self-contained bilingual (AR+EN) menu at menus/<slug>/index.html. English item name slightly BIGGER than its Arabic. Tabular price numerals. Signature hero animation tailored to the brand, reduced-motion safe. Sticky nav with OPAQUE background. No horizontal overflow at 375px. Each menu must be unmistakably ITS OWN brand — never a recolour of another. External images are blocked (CSP) — use inline SVG/CSS illustration, never external <img> URLs.`

const LENSES = [
  { key: 'brand-visual', focus: `BRAND IDENTITY + IMAGERY. Is this unmistakably its own brand and unlike the other menus? Audit palette, type pairing, mark/logo treatment, voice, and especially the VISUAL SYSTEM: does every section/item carry coherent imagery (inline SVG/CSS illustration, iconography, texture) tuned to the concept, or is it bare text? Flag generic drift and any place a tailored visual should exist. Also judge the hero animation's fit to the brand.` },
  { key: 'content-type', focus: `CONTENT + BILINGUAL + TYPOGRAPHY. Audit Arabic correctness (script, diacritics, RTL, natural phrasing — flag machine-translation errors), item/section realism and pricing, EN-larger-than-AR sizing, tabular numerals, hierarchy, spacing rhythm, dotted-leader and price-column alignment.` },
  { key: 'robust-a11y', focus: `ROBUSTNESS + ACCESSIBILITY + WEIGHT. Audit responsiveness (375/414/768/1280), overflow risks, JS errors, reduced-motion handling, sticky-nav opacity, colour contrast, focus states, semantics, tap-target size, and dead/bloated CSS.` },
]

const FINDINGS = {
  type: 'object', additionalProperties: false,
  properties: { findings: { type: 'array', items: {
    type: 'object', additionalProperties: false,
    properties: {
      dimension: { type: 'string' },
      severity: { type: 'string', enum: ['low', 'med', 'high'] },
      issue: { type: 'string' },
      fix: { type: 'string', description: 'concrete, specific change' },
      regression_risk: { type: 'boolean' },
    }, required: ['dimension', 'severity', 'issue', 'fix', 'regression_risk'],
  } } }, required: ['findings'],
}
const VERIFIED = {
  type: 'object', additionalProperties: false,
  properties: {
    keep: { type: 'array', items: { type: 'object', additionalProperties: false,
      properties: { issue: { type: 'string' }, fix: { type: 'string' }, severity: { type: 'string' } },
      required: ['issue', 'fix'] } },
    dropped: { type: 'integer' },
  }, required: ['keep'],
}
const IMPROVED = {
  type: 'object', additionalProperties: false,
  properties: {
    changed: { type: 'boolean' },
    changelog: { type: 'array', items: { type: 'string' } },
    self_check: { type: 'string' },
  }, required: ['changed', 'changelog'],
}
const HARNESS = {
  type: 'object', additionalProperties: false,
  properties: { pass: { type: 'boolean' }, issues: { type: 'array', items: { type: 'string' } } },
  required: ['pass'],
}

const results = await pipeline(slugs,
  // 1) AUDIT — 3 lenses in parallel per menu
  (slug) => parallel(LENSES.map(L => () =>
    agent(
      `Read menus/${slug}/index.html and audit it through ONE lens.\n\n${HOUSE}\n\nLENS — ${L.focus}\n\nReturn concrete, high-signal findings only (skip nitpicks that don't improve the guest's experience). For each: dimension, severity, the specific issue, the exact fix, and whether applying it risks regressing something that already works.`,
      { label: `audit:${slug}:${L.key}`, phase: 'Audit', schema: FINDINGS }
    ).then(r => (r && r.findings) || [])
  )).then(lists => ({ slug, findings: lists.filter(Boolean).flat() })),

  // 2) VERIFY — adversarially filter to real, high-value, non-regressing fixes
  (a) => {
    if (!a || !a.findings.length) return { slug: a && a.slug, keep: [] }
    return agent(
      `You are a skeptical design director. Menu: menus/${a.slug}/index.html. Here are proposed findings:\n${JSON.stringify(a.findings, null, 2)}\n\nRead the file to check each against reality. KEEP only findings that are (a) real, (b) genuinely improve the menu, and (c) will not regress something already working. Drop duplicates, nitpicks, and anything speculative. Merge overlapping fixes. Return the prioritized keep-list.`,
      { label: `verify:${a.slug}`, phase: 'Verify', schema: VERIFIED }
    ).then(v => ({ slug: a.slug, keep: (v && v.keep) || [] }))
  },

  // 3) IMPROVE — apply surviving fixes, enrich visuals; edit only this menu's file
  (b) => {
    if (!b || !b.keep.length) return { slug: b && b.slug, changed: false, changelog: [] }
    return agent(
      `Improve menus/${b.slug}/index.html by applying these verified fixes:\n${JSON.stringify(b.keep, null, 2)}\n\n${HOUSE}\n\nRules: edit ONLY menus/${b.slug}/index.html (Read then Edit/Write). Make it MORE tailored to this brand — deepen the visual/imagery system so no section is bare text (inline SVG/CSS illustration + iconography coherent with the concept). NEVER regress anything already working; keep it self-contained; keep 0 horizontal overflow at 375px. Do not touch git or other menus. Return a short changelog of what you changed.`,
      { label: `improve:${b.slug}`, phase: 'Improve', schema: IMPROVED }
    ).then(r => ({ slug: b.slug, changed: !!(r && r.changed), changelog: (r && r.changelog) || [] }))
  },

  // 4) RE-VERIFY — harness gate
  (c) => agent(
    `Run exactly: node menus/_kit/verify.mjs ${c.slug}\nReturn the parsed result: pass (the process exit code is 0) and any issues array from the JSON it prints. Do not edit anything.`,
    { label: `reverify:${c.slug}`, phase: 'Re-verify', schema: HARNESS }
  ).then(h => ({ slug: c.slug, changed: c.changed, changelog: c.changelog, pass: !!(h && h.pass), issues: (h && h.issues) || [] }))
)

return results.filter(Boolean)
