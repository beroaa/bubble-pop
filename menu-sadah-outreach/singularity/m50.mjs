// MASTERPIECE-50 state helper: node m50.mjs phase "<text>" | log "<msg>" | slot <slug> <pending|building|done> | eta <minutes>
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const F = join(dirname(fileURLToPath(import.meta.url)), 'm50-state.js');
const st = JSON.parse(readFileSync(F, 'utf8').replace(/^window\.M50_STATE = /, '').replace(/;\s*$/, ''));
const [cmd, a, b] = process.argv.slice(2);
if (cmd === 'phase') st.phase = a;
else if (cmd === 'log') { st.feed = [...(st.feed || []), { at: Date.now(), msg: a }].slice(-12); }
else if (cmd === 'slot') st.slots[a] = b;
else if (cmd === 'eta') st.etaAt = Date.now() + Number(a) * 60000;
st.generatedAt = Date.now();
writeFileSync(F, 'window.M50_STATE = ' + JSON.stringify(st) + ';\n');
console.log(cmd, 'ok');
