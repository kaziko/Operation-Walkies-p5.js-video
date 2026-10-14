// junjun.js: Princess Jun Jun, a marbled tiger-brindle Akita. One rig, three views, all on-model.
//
//   junjunBust(x, y, u, o)   front head + ruff + harness; (x, y) is the centre of the head
//   junjunSit(x, y, u, o)    regal front sit; (x, y) is the ground point between the front paws
//   junjunSide(x, y, u, o)   profile body, standing or walking; (x, y) is the ground point under the body
//
// `u` is the head unit: the head is about 14u wide across the cheek fur and 14u tall with ears.
// Her acting is small on purpose: eyes, brows, a few degrees of head. The graphics around her do the shouting.
//
// Face options (all views): look [x, y] (-1..1 pupil), lid 0..1 (0 open, .5 judging, 1 shut), brow (-1 worried .. 1 angry),
//   browY, mouth ('flat' | 'frown' | 'smile' | 'pant' | 'snarl' | 'bark' | 'o'), ear (rad, + = pinned back), iris (radius
//   scale, small = rage pinpricks), rage 0..1 (nose wrinkles, vein), turn (-1..1 feature shift for a 3/4 look),
//   crown 0..1 (pop), mono (true = black / white only, for impact frames), tilt (rad, head only).
//   Singing: mouth 'sing' with open 0..1 and round 0..1; feed both from sing(t) for lip-sync.
const JJ_COAT = { fur: PAL.fur, white: PAL.paper, dark: PAL.furDk, grey: PAL.furGrey, ink: PAL.ink, pink: PAL.pink, mouth: PAL.oxblood, harness: PAL.blue, trim: PAL.lime, eye: PAL.white, iris: '#3B2219', gold: PAL.lime };
const JJ_MONO = { fur: PAL.white, white: PAL.white, dark: PAL.ink, grey: PAL.ink, ink: PAL.ink, pink: PAL.white, mouth: PAL.ink, harness: PAL.ink, trim: PAL.white, eye: PAL.white, iris: PAL.ink, gold: PAL.white };
// named expressions: spread one into the options, then override single values
const EXPR = {
  neutral: { lid: .28, brow: .25, mouth: 'flat' },
  judge: { lid: .52, brow: .55, mouth: 'frown' },                     // narrow-eyed judgment
  sideEye: { lid: .5, brow: .45, mouth: 'flat', look: [.95, .05] },
  stare: { lid: .12, brow: .7, mouth: 'flat', iris: .82 },            // wide, fixed
  deadpan: { lid: .6, brow: 0, mouth: 'flat' },
  inspect: { lid: .4, brow: .35, mouth: 'flat', look: [0, .7] },      // suspicious inspection, eyes down
  smug: { lid: .62, brow: -.1, mouth: 'smile' },
  rage: { lid: 0, brow: 1, mouth: 'snarl', iris: .5, rage: 1, ear: .28 },
  bark: { lid: .1, brow: 1, mouth: 'bark', iris: .6, rage: .8, ear: .3 },
  royal: { lid: .45, brow: .2, mouth: 'flat' },
  shut: { lid: 1, brow: .1, mouth: 'flat' },
  pant: { lid: .3, brow: 0, mouth: 'pant' }
};
// Lip-sync from the measured word timings. sing(t) → { open, round } for song time t; both are 0 between words.
// Use: const s = sing(t); junjunBust(x, y, u, { ...EXPR.royal, mouth: 'sing', open: s.open, round: s.round });
// Each word opens the mouth once per syllable (counted from its vowel groups); held notes stay open with a slight
// tremor. `round` follows the word's vowels (o / u = round).
function sing(t) {
  // Where the voice itself was measured (tools/lipsync.py: the bridge, the radio call sign), follow it: it is far tighter than the
  // transcript. The mouth leads the sound by about a frame, as a real one does.
  if (typeof LIP !== 'undefined') for (const L of LIP) if (t >= L.t0 && t < L.t0 + (L.v.length - 2) / L.rate) {
    const i = Math.floor((t + .035 - L.t0) * L.rate);
    return { open: Math.max(L.v[i] || 0, L.v[i + 1] || 0), round: L.r[i] || 0 };
  }
  const ws = SONG.words; let lo = 0, hi = ws.length - 1;
  if (t < ws[0][1]) return { open: 0, round: 0 };
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ws[m][1] <= t) lo = m; else hi = m; }
  if (ws[hi][1] <= t) lo = hi;
  const [w, s0, e0] = ws[lo], e = Math.max(e0, s0 + .14); if (t > e) return { open: 0, round: 0 };
  const n = Math.max(1, (w.toLowerCase().replace(/e\b/, '').match(/[aeiouy]+/g) || [1]).length), p = (t - s0) / (e - s0);
  const env = clamp((t - s0) / .05) * clamp((e - t) / .07), syl = .34 + .66 * Math.abs(Math.sin(p * n * Math.PI));
  return { open: clamp(env * syl * (1 + .05 * Math.sin(t * 34))), round: /[ou]/i.test(w) ? (/[aei]/i.test(w) ? .5 : .85) : .12 };
}
// A slow, rare blink (returns a lid value to max() with the pose lid). Jun Jun does not blink much.
function blink(t, seed = 0, every = 4.2) { const p = frac(t / every + hash(seed) * .9), d = .16 / every; return p < d ? Math.sin(p / d * Math.PI) : 0; }

const jjS = (pts, u, ox = 0, oy = 0, sx = 1) => pts.map(p => [(ox + p[0] * sx) * u, (oy + p[1]) * u]);
const jjSW = u => clamp(u / 22, .5, 3.6);
// a tiger stripe: a wedge from a broad base (x0, y0) to a point (x1, y1), with a slight curve
function jjStripe(x0, y0, x1, y1, w, u, col, bend = .12) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, mx = (x0 + x1) / 2 + nx * L * bend, my = (y0 + y1) / 2 + ny * L * bend;
  paint(jjS([[x0 - nx * w / 2, y0 - ny * w / 2], [mx - nx * w * .32, my - ny * w * .32], [x1, y1], [mx + nx * w * .32, my + ny * w * .32], [x0 + nx * w / 2, y0 + ny * w / 2]], u), { wash: col, ink: null });
}

// ---------- front head (drawn at the origin) ----------
const JJ_HEAD_R = [[0, -4.7], [1.7, -4.75], [3.1, -4.45], [5.15, -2.6], [5.7, -1.2], [6.1, .2], [7.05, 1.0], [6.15, 1.5], [6.75, 2.75], [5.65, 2.9], [5.7, 4.05], [4.3, 4.0], [3.2, 4.9], [1.8, 5.5], [0, 5.7]];
const JJ_MASK_R = [[0, -.5], [.75, -1.0], [1.2, -2.1], [2.2, -3.25], [3.5, -3.1], [4.5, -2.0], [5.5, -.6], [6.1, .2], [7.05, 1.0], [6.15, 1.5], [6.75, 2.75], [5.65, 2.9], [5.7, 4.05], [4.3, 4.0], [3.2, 4.9], [1.8, 5.5], [0, 5.7]];
const jjFull = half => half.concat(half.slice(1, -1).map(p => [-p[0], p[1]]).reverse());

function jjHead(u, o = {}) {
  const C = o.mono ? JJ_MONO : (o.coat || JJ_COAT), SW = jjSW(u) * (o.swMul || 1), J = u * .02;
  const turn = o.turn || 0, tx = turn * .55, lid = clamp(o.lid ?? .28), brow = o.brow ?? .25, look = o.look || [0, 0], rage = o.rage || 0;
  const jp = pts => pts.map(p => [p[0] + jit(J), p[1] + jit(J)]);
  const head = jp(jjS(jjFull(JJ_HEAD_R), u));

  // ears go down first; the head wash covers their bases
  const earPts = [[5.35, -2.2], [6.05, -4.6], [5.75, -6.5], [5.3, -7.25], [4.75, -7.2], [3.7, -5.9], [2.7, -4.3], [3.8, -2.7]];
  const innerEar = [[5.05, -3.7], [5.4, -5.0], [5.15, -6.3], [4.2, -5.2], [3.9, -4.3]];
  for (const s of [1, -1]) {
    const er = (o.ear || 0) * s, piv = [4.1 * s, -3.4], f = pts => jp(jjS(rotPts(pts.map(p => [p[0] * s, p[1]]), er, piv[0], piv[1]), u));
    paint(f(earPts), { wash: C.fur, ink: C.ink, sw: SW });
    paint(f(innerEar), { wash: C.pink, ink: null });
    const a = rotPts([[4.75 * s, -4.3], [4.95 * s, -5.5]], er, piv[0], piv[1]), b = rotPts([[4.35 * s, -4.4], [4.45 * s, -5.0]], er, piv[0], piv[1]);
    inkLine(jjS(a, u), SW * .45, C.ink, 'inkfine', 0); inkLine(jjS(b, u), SW * .4, C.ink, 'inkfine', 0);
    jjStripe(...rotPts([[5.9 * s, -4.6], [5.45 * s, -6.2]], er, piv[0], piv[1]).flat(), .45, u, C.dark, .05 * s);
  }
  paint(head, { wash: C.fur, ink: null });
  // white face mask (urajiro): cheeks, muzzle and the two brow bumps; the tan widow's peak runs down between the eyes
  const mask = JJ_MASK_R.map((p, i) => i < 6 ? [p[0] + tx * (1 - i / 6), p[1]] : p), maskL = JJ_MASK_R.map((p, i) => i < 6 ? [-p[0] + tx * (1 - i / 6), p[1]] : [-p[0], p[1]]);
  paint(jjS(mask.concat(maskL.slice(1, -1).reverse()), u), { wash: C.white, ink: null });
  // brindle: forehead tiger stripes and grey cheek marbling
  jjStripe(tx * .5, -4.65, tx * .9, -2.2, .62, u, C.dark, 0);
  for (const s of [1, -1]) {
    jjStripe(1.35 * s, -4.72, .95 * s + tx * .5, -3.1, .55, u, C.dark, .12 * s);
    jjStripe(2.75 * s, -4.5, 2.2 * s, -3.6, .5, u, C.dark, .12 * s);
    jjStripe(.55 * s + tx * .7, -1.9, .42 * s + tx * .8, -.9, .3, u, C.dark, 0);
    jjStripe(4.3 * s, -3.4, 3.6 * s, -3.3, .42, u, C.dark, 0);
    jjStripe(5.5 * s, -1.5, 4.5 * s, -1.75, .5, u, C.dark, 0);
    jjStripe(6.45 * s, .75, 4.7 * s, .7, .62, u, C.grey, .12 * s);
    jjStripe(6.3 * s, 2.3, 4.9 * s, 2.0, .55, u, C.grey, -.1 * s);
    jjStripe(5.3 * s, 3.7, 4.2 * s, 3.2, .45, u, C.grey, .1 * s);
  }
  paint(head, { ink: C.ink, sw: SW * 1.15 });

  // eyes
  const ew = 1.0, eh = .62 * (1 + rage * .2), slant = .2, lidY = lerp(-eh, eh * .5, lid), ir = .58 * (o.iris ?? 1);
  for (const s of [1, -1]) {
    const cx = 2.62 * s + tx, cy = -.78, w = ew * (1 - .16 * turn * s);
    const top = ex => Math.max(-eh * Math.sqrt(Math.max(0, 1 - (ex / w) ** 2)), lidY), bot = ex => eh * .72 * Math.sqrt(Math.max(0, 1 - (ex / w) ** 2));
    const P = (ex, ey) => [(cx + ex * s) * u, (cy + ey - slant * ex) * u];   // ex > 0 = toward the outer corner
    const N = 10, upper = [], lower = [];
    for (let i = 0; i <= N; i++) { const ex = lerp(-w, w, i / N); upper.push(P(ex, top(ex))); lower.push(P(ex, bot(ex))); }
    if (lid < .97) {
      paint(upper.concat(lower.slice(1, -1).reverse()), { wash: C.eye, ink: null });
      const ix = clamp(look[0] * s, -1, 1) * (w - ir * .55) * .78, iy = look[1] * eh * .34 + .06, iris = [];
      for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, ex = clamp(ix + Math.cos(a) * ir, -w * .97, w * .97); iris.push(P(ex, clamp(iy + Math.sin(a) * ir, top(ex) + .02, bot(ex) - .02))); }
      paint(iris, { wash: C.iris, ink: null });
      const pr = ir * .52, pupil = [];
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, ex = clamp(ix + Math.cos(a) * pr, -w * .97, w * .97); pupil.push(P(ex, clamp(iy + Math.sin(a) * pr, top(ex) + .02, bot(ex) - .02))); }
      paint(pupil, { wash: C.ink, ink: null });
      const hx = ix - .2 * s, hy = iy - .22; if (hy - .12 > lidY && !o.mono) paint(ellPts(...P(hx, hy), u * .13, u * .13, 8), { wash: C.eye, ink: null });
      inkLine(lower, SW * .4, C.ink, 'inkfine', .3);
    }
    // heavy upper lid with a small outer flick: she is a princess
    inkLine(upper.concat([P(w + .26, top(w) - .22)]), SW * 1.05, C.ink, 'ink', .25);
    // brows: short, thick, on the white brow bumps
    const bc = [2.45 * s + tx, -2.45 - (o.browY || 0) - brow * .08], ba = -brow * .42 * s;
    const bp0 = [[-.98, -.3], [.25, -.34], [1.0, -.12], [1.0, .06], [.15, .3], [-.98, .34]].map(p => [bc[0] + p[0] * s, bc[1] + p[1]]);
    paint(jjS(rotPts(bp0, ba, bc[0], bc[1]), u), { wash: C.ink, ink: null });
  }

  // nose and mouth
  const nx = tx * 1.25, singOp = o.mouth === 'sing' ? clamp(o.open ?? 0) : 0, mouth = o.mouth === 'sing' ? (singOp > .06 ? 'sing' : 'flat') : (o.mouth || 'flat');
  const M = pts => jjS(pts, u, nx);
  if (rage > .05) for (let i = 0; i < 3; i++) inkLine(M([[-.75 + i * .12, .55 - i * .5], [0, .38 - i * .5], [.75 - i * .12, .55 - i * .5]]), SW * .5 * rage, C.ink, 'inkfine', .6);
  if (mouth === 'snarl' || mouth === 'bark') {
    const op = mouth === 'bark' ? 1.5 : 1, by = 3.0 + 1.75 * op;
    paint(M([[-2.5, 3.05], [-1.25, 2.75], [0, 2.95], [1.25, 2.75], [2.5, 3.05], [2.25, by - .5], [1.1, by + .1], [0, by + .22], [-1.1, by + .1], [-2.25, by - .5]]), { wash: C.mouth, ink: C.ink, sw: SW * .8 });
    if (mouth === 'bark') paint(M([[-1.1, by - .1], [-.6, by - 1.0], [0, by - .8], [.6, by - 1.0], [1.1, by - .1], [0, by + .15]]), { wash: C.pink, ink: C.ink, sw: SW * .4 });
    for (const s of [1, -1]) {
      paint(M([[1.0 * s, 2.82], [1.75 * s, 2.86], [1.4 * s, 3.95]]), { wash: C.eye, ink: C.ink, sw: SW * .45 });           // upper fangs
      paint(M([[.2 * s, 2.92], [.85 * s, 2.84], [.55 * s, 3.4]]), { wash: C.eye, ink: C.ink, sw: SW * .35 });
      paint(M([[.75 * s, by + .08], [1.45 * s, by - .08], [1.1 * s, by - .95]]), { wash: C.eye, ink: C.ink, sw: SW * .45 });    // lower fangs
    }
  } else if (mouth === 'sing') {
    // singing: the jaw drops under the fixed upper lip. open 0..1, round 0..1 (an "oh" against an "ah")
    const rd = clamp(o.round ?? 0), hw = lerp(2.1, 1.2, rd), hh = lerp(.45, 2.15, singOp), y0 = 3.12;
    inkLine(M([[0, 2.5], [0, y0]]), SW * .7, C.ink, 'ink', 0);
    paint(M([[-hw, y0 + .2], [-hw * .5, y0 + .03], [0, y0], [hw * .5, y0 + .03], [hw, y0 + .2], [hw * .84, y0 + hh * .68], [hw * .42, y0 + hh * .96], [0, y0 + hh], [-hw * .42, y0 + hh * .96], [-hw * .84, y0 + hh * .68]]), { wash: C.mouth, ink: C.ink, sw: SW * .8 });
    if (singOp > .3) paint(M([[-hw * .5, y0 + .06], [0, y0 + .03], [hw * .5, y0 + .06], [hw * .46, y0 + .4], [-hw * .46, y0 + .4]]), { wash: C.eye, ink: C.ink, sw: SW * .3 });
    if (hh > .95) paint(ellPts(nx * u, (y0 + hh * .74) * u, hw * .5 * u, hh * .24 * u, 10), { wash: C.pink, ink: null });
  } else if (mouth === 'pant') {
    paint(M([[-1.9, 3.3], [0, 3.1], [1.9, 3.3], [1.4, 4.7], [0, 5.0], [-1.4, 4.7]]), { wash: C.mouth, ink: C.ink, sw: SW * .7 });
    paint(M([[-.95, 3.7], [.95, 3.7], [1.05, 5.0], [.5, 5.75], [-.5, 5.75], [-1.05, 5.0]]), { wash: C.pink, ink: C.ink, sw: SW * .5, curv: .4 });
  } else if (mouth === 'o') {
    paint(ellPts(nx * u, 3.75 * u, u * .55, u * .62, 12), { wash: C.mouth, ink: C.ink, sw: SW * .6 });
  } else {
    const e = mouth === 'frown' ? .5 : mouth === 'smile' ? -.42 : .16;
    inkLine(M([[0, 2.5], [0, 3.2]]), SW * .7, C.ink, 'ink', 0);
    inkLine(M([[-2.45, 3.4 + e], [-1.4, 3.55 + e * .2], [0, 3.2], [1.4, 3.55 + e * .2], [2.45, 3.4 + e]]), SW * .85, C.ink, 'ink', .55);
  }
  paint(M([[-1.22, 1.05], [-.6, .82], [.6, .82], [1.22, 1.05], [1.18, 1.72], [.58, 2.4], [0, 2.56], [-.58, 2.4], [-1.18, 1.72]]), { wash: C.ink, ink: null, curv: .35 });
  for (const s of [1, -1]) inkLine(M([[1.75 * s, .55], [2.75 * s, 1.5], [2.95 * s, 2.7]]), SW * .42, C.ink, 'inkfine', .7);
  if (!o.mono) paint(ellPts((nx - .45) * u, 1.25 * u, u * .34, u * .13, 8, 0, -.2), { wash: C.white, ink: null });
  if (mouth !== 'snarl' && mouth !== 'bark') for (const s of [1, -1]) for (const [dx, dy] of [[1.3, 2.85], [1.95, 2.7], [1.62, 2.3]]) paint(ellPts((nx + dx * s) * u, dy * u, u * .075, u * .075, 6), { wash: C.ink, ink: null });
  if (rage > .5 && !o.mono) {                                                    // anime anger vein on the temple
    const vx = 4.3 * u, vy = -3.3 * u, r = u * .55;
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + .3; inkLine([[vx + Math.cos(a) * r * .35, vy + Math.sin(a) * r * .35], [vx + Math.cos(a + .5) * r, vy + Math.sin(a + .5) * r]], SW * .7, PAL.oxblood, 'ink', 0); }
  }
  // crown: small, tilted, slightly too small for the head (that is the joke)
  if (o.crown) {
    const k = backOut(o.crown); push(); translate(1.2 * u, -4.9 * u); rotate(.16); scale(k);
    paint(jjS([[-1.9, 0], [-2.2, -2.3], [-1.1, -1.25], [0, -2.9], [1.1, -1.25], [2.2, -2.3], [1.9, 0]], u), { wash: C.gold, ink: C.ink, sw: SW * .75 });
    paint(jjS([[-1.95, -.05], [1.95, -.05], [1.95, .55], [-1.95, .55]], u), { wash: C.pink, ink: C.ink, sw: SW * .6 });
    for (const [gx, gy] of [[-2.2, -2.3], [0, -2.9], [2.2, -2.3]]) paint(ellPts(gx * u, gy * u, u * .3, u * .3, 8), { wash: C.pink, ink: C.ink, sw: SW * .4 });
    pop();
  }
}

// ---------- ruff, chest and harness under a front head ----------
function jjBust(u, o = {}) {
  const C = o.mono ? JJ_MONO : (o.coat || JJ_COAT), SW = jjSW(u), J = u * .02, jp = pts => pts.map(p => [p[0] + jit(J), p[1] + jit(J)]);
  const ruffR = [[0, 4.2], [4.6, 3.1], [6.5, 4.7], [6.0, 5.5], [7.7, 6.8], [7.1, 7.7], [8.6, 9.4], [8.9, 14], [0, 14]];
  const ruff = jp(jjS(jjFull(ruffR), u));
  paint(ruff, { wash: C.fur, ink: null });
  for (const s of [1, -1]) { jjStripe(7.6 * s, 7.4, 5.6 * s, 8.1, .7, u, C.dark, .1 * s); jjStripe(8.5 * s, 10.0, 6.3 * s, 10.4, .7, u, C.dark, .1 * s); jjStripe(8.8 * s, 12.4, 6.9 * s, 12.6, .6, u, C.dark, .1 * s); jjStripe(6.2 * s, 5.2, 4.9 * s, 5.9, .5, u, C.dark, 0); }
  paint(jjS(jjFull([[0, 5.2], [2.6, 5.8], [3.2, 6.9], [4.3, 7.9], [3.7, 9.0], [4.2, 11], [3.6, 14], [0, 14]]), u), { wash: C.white, ink: null });
  paint(jjS([[-4.6, 4.3], [4.6, 4.3], [5.9, 5.5], [3.2, 6.7], [0, 7.3], [-3.2, 6.7], [-5.9, 5.5]], u), { hatch: { d: u * .34, a: .9, b: 'inkfine', c: C.dark, w: clamp(u / 60, .35, 1.1), o: { rand: .25 } }, ink: null });
  paint(ruff, { ink: C.ink, sw: SW * 1.1 });
  if (o.harness !== false) {
    for (const s of [1, -1]) paint(jjS([[5.3 * s, 6.3], [6.6 * s, 7.4], [1.2 * s, 12.1], [.3 * s, 10.6]], u), { wash: C.harness, ink: C.ink, sw: SW * .8 });
    paint(jjS([[-1.7, 10.2], [1.7, 10.2], [2.0, 14], [-2.0, 14]], u), { wash: C.harness, ink: C.ink, sw: SW * .8 });
    for (const s of [1, -1]) inkLine(jjS([[5.7 * s, 7.15], [.95 * s, 11.2]], u), SW * .35, C.trim, 'inkfine', 0);
    paint(ellPts(0, 9.3 * u, u * .75, u * .75, 12), { wash: C.trim, ink: C.ink, sw: SW * .6 });         // ID tag
  }
}
function junjunBust(x, y, u, o = {}) {
  push(); translate(x, y); if (o.rot) rotate(o.rot); if (o.sx || o.sy) scale(o.sx ?? 1, o.sy ?? 1);
  if (o.bust !== false) jjBust(u, o);
  push(); translate((o.hx || 0) * u, (o.hy || 0) * u); if (o.tilt) rotate(o.tilt); jjHead(u, o); pop();
  pop();
}

// ---------- regal front sit ----------
function junjunSit(x, y, u, o = {}) {
  const C = o.mono ? JJ_MONO : (o.coat || JJ_COAT), SW = jjSW(u), J = u * .02, jp = pts => pts.map(p => [p[0] + jit(J), p[1] + jit(J)]);
  push(); translate(x, y - 19.3 * u); if (o.rot) rotate(o.rot); if (o.sx || o.sy) scale(o.sx ?? 1, o.sy ?? 1);
  // tail: a fat curl held high on her left (screen right)
  { const tw = (o.tail || 0), cx = 8.6, cy = 9.8;
    push(); translate(6.5 * u, 14 * u); rotate(tw); translate(-6.5 * u, -14 * u);
    const tp = []; for (let i = 0; i < 22; i++) { const a = i / 22 * TAU, r = 3.5 * (1 + (i % 2 ? .1 : -.02)); tp.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 1.08]); }
    paint(jp(jjS(tp, u)), { wash: C.fur, ink: C.ink, sw: SW });
    paint(ellPts((cx + .5) * u, (cy + .5) * u, 1.9 * u, 2.1 * u, 14), { wash: C.white, ink: null });
    inkLine(jjS([[cx + 2.2, cy + 1.6], [cx + 1.6, cy - 1.4], [cx - .8, cy - 1.7], [cx - 1.2, cy + .4], [cx + .2, cy + .9]], u), SW * .6, C.ink, 'ink', .8);
    jjStripe(cx + 3.3, cy - 1.6, cx + 1.9, cy - 1.0, .6, u, C.dark); jjStripe(cx + 1.2, cy - 3.6, cx + .6, cy - 2.2, .6, u, C.dark); jjStripe(cx - 2.2, cy - 2.9, cx - 1.3, cy - 1.9, .5, u, C.dark);
    pop(); }
  const body = jp(jjS(jjFull([[0, 3.6], [5.4, 4.3], [7.3, 8], [8.0, 12.5], [8.4, 16.0], [7.5, 18.7], [4.5, 19.3], [0, 19.3]]), u));
  paint(body, { wash: C.fur, ink: null });
  for (const s of [1, -1]) for (let i = 0; i < 4; i++) jjStripe((7.6 + i * .25) * s, 9.2 + i * 2.2, (5.2 + i * .2) * s, 9.9 + i * 2.2, .75, u, C.dark, .12 * s);
  paint(jjS(jjFull([[0, 5.2], [3.4, 6.2], [4.3, 9], [4.2, 13], [3.8, 19.3], [0, 19.3]]), u), { wash: C.white, ink: null });
  paint(body, { ink: C.ink, sw: SW * 1.1 });
  for (const s of [1, -1]) {                                                    // hind feet, then the straight front legs
    paint(jp(jjS([[4.0 * s, 17.6], [6.4 * s, 17.3], [8.3 * s, 18.2], [8.4 * s, 19.3], [4.0 * s, 19.3]], u)), { wash: C.white, ink: C.ink, sw: SW * .85, curv: .3 });
    for (const tx of [5.9, 7.0]) inkLine(jjS([[tx * s, 18.5], [tx * s, 19.2]], u), SW * .4, C.ink, 'inkfine', 0);
    const lg = jp(jjS([[.55 * s, 9.2], [3.5 * s, 9.2], [3.55 * s, 17.5], [4.0 * s, 18.6], [3.9 * s, 19.3], [.4 * s, 19.3], [.55 * s, 17.5]], u));
    paint(lg, { wash: C.white, ink: null });
    paint(jjS([[.55 * s, 9.2], [3.5 * s, 9.2], [3.52 * s, 12.2], [2.8 * s, 13.4], [2.1 * s, 12.4], [1.4 * s, 13.6], [.55 * s, 12.2]], u), { wash: C.fur, ink: null });
    jjStripe(3.5 * s, 10.3, 1.6 * s, 10.6, .55, u, C.dark, 0);
    inkLine(lg.slice(1, 6), SW * .9, C.ink, 'ink', 0); inkLine([lg[5], lg[6], lg[0]], SW * .9, C.ink, 'ink', 0);
    for (const tx of [1.5, 2.6]) inkLine(jjS([[tx * s, 18.4], [tx * s, 19.2]], u), SW * .4, C.ink, 'inkfine', 0);
  }
  jjBust(u, o);
  push(); translate((o.hx || 0) * u, (o.hy || 0) * u); if (o.tilt) rotate(o.tilt); jjHead(u, o); pop();
  pop();
}

// ---------- profile head (drawn at the origin, facing +x) ----------
function jjHeadSide(u, o = {}) {
  const C = o.mono ? JJ_MONO : (o.coat || JJ_COAT), SW = jjSW(u), J = u * .02, jp = pts => pts.map(p => [p[0] + jit(J), p[1] + jit(J)]);
  const lid = clamp(o.lid ?? .3), brow = o.brow ?? .3, mouth = o.mouth || 'flat', er = o.ear || 0;
  const ear = (dx, col, sw) => paint(jp(jjS(rotPts([[-2.6 + dx, -2.3], [-2.35 + dx, -4.6], [-1.75 + dx, -5.9], [-1.2 + dx, -5.85], [.2 + dx, -3.0]], -er, -1 + dx, -2.8), u)), { wash: col, ink: C.ink, sw });
  ear(1.5, o.mono ? C.fur : mixCol(C.fur, C.dark, .35), SW * .9);
  const open = mouth === 'snarl' ? .55 : mouth === 'bark' ? 1 : mouth === 'pant' ? .5 : mouth === 'sing' ? clamp(o.open ?? 0) * .8 : 0;
  if (open) {                                                                    // lower jaw swings down behind the muzzle
    push(); translate(1.5 * u, 1.9 * u); rotate(open * .5); translate(-1.5 * u, -1.9 * u);
    paint(jjS([[1.4, 1.4], [3.9, 1.3], [4.15, 1.95], [3.5, 2.65], [2.0, 2.85]], u), { wash: C.mouth, ink: C.ink, sw: SW * .8 });
    if (mouth === 'pant') paint(jjS([[2.4, 1.85], [4.2, 1.85], [4.9, 2.55], [4.4, 3.05], [2.7, 2.6]], u), { wash: C.pink, ink: C.ink, sw: SW * .5, curv: .3 });
    else paint(jjS([[3.3, 1.45], [3.9, 1.4], [3.65, .7]], u), { wash: C.eye, ink: C.ink, sw: SW * .4 });
    paint(jjS([[1.4, 2.15], [3.8, 2.2], [3.6, 2.7], [2.0, 2.9]], u), { wash: C.white, ink: C.ink, sw: SW * .8 });
    pop();
  }
  const SIL = [[-3.3, .8], [-3.15, -1.5], [-1.9, -3.05], [.3, -3.2], [1.7, -2.4], [2.3, -1.25], [3.7, -1.0], [4.45, -.55], [4.6, .5], [4.2, 1.15], [4.05, 1.95], [2.3, 2.5], [1.0, 3.3], [-.3, 2.9], [-.8, 4.05], [-1.9, 3.15], [-2.8, 3.95], [-3.3, 2.2]];
  const sil = jp(jjS(SIL, u));
  paint(sil, { wash: C.fur, ink: null });
  paint(jjS([[2.0, -1.2]].concat(SIL.slice(6, 16), [[-1.5, 1.2], [-.5, -.2], [.3, -1.4], [1.2, -1.95]]), u), { wash: C.white, ink: null });
  jjStripe(-.5, -3.2, 0, -1.7, .55, u, C.dark, .1); jjStripe(-1.8, -3.0, -1.3, -1.6, .5, u, C.dark, .1); jjStripe(-3.1, -1.2, -1.7, -.6, .5, u, C.dark, 0);
  jjStripe(-3.3, 1.2, -1.9, 1.3, .5, u, C.grey, .1); jjStripe(-1.0, 3.2, -.6, 2.0, .45, u, C.grey, 0); jjStripe(.9, 3.1, .8, 2.2, .4, u, C.grey, 0);
  paint(sil, { ink: C.ink, sw: SW * 1.1 });
  ear(0, C.fur, SW);
  paint(jjS(rotPts([[-2.0, -2.8], [-1.95, -4.3], [-1.6, -5.1], [-.55, -3.2]], -er, -1, -2.8), u), { wash: C.pink, ink: null });
  // eye, brow, nose, mouth
  const ex0 = 1.3, ey0 = -1.0, w = .7, eh = .46, lidY = lerp(-eh, eh * .5, lid), ir = .42 * (o.iris ?? 1), look = o.look || [0, 0];
  const top = ex => Math.max(-eh * Math.sqrt(Math.max(0, 1 - (ex / w) ** 2)), lidY), bot = ex => eh * .7 * Math.sqrt(Math.max(0, 1 - (ex / w) ** 2));
  const P = (ex, ey) => [(ex0 + ex) * u, (ey0 + ey + .12 * ex) * u], up = [], lo = [];
  for (let i = 0; i <= 8; i++) { const ex = lerp(-w, w, i / 8); up.push(P(ex, top(ex))); lo.push(P(ex, bot(ex))); }
  if (lid < .97) {
    paint(up.concat(lo.slice(1, -1).reverse()), { wash: C.eye, ink: null });
    const ix = .12 + look[0] * .22, iy = .04 + look[1] * .12, iris = [];
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, ex = clamp(ix + Math.cos(a) * ir, -w * .96, w * .96); iris.push(P(ex, clamp(iy + Math.sin(a) * ir, top(ex) + .02, bot(ex) - .02))); }
    paint(iris, { wash: C.ink, ink: null });
    if (!o.mono && iy - .2 > lidY) paint(ellPts(...P(ix - .1, iy - .15), u * .09, u * .09, 6), { wash: C.eye, ink: null });
  }
  inkLine([P(-w - .22, top(-w) - .18)].concat(up), SW * .9, C.ink, 'ink', .25);
  const bc = [1.2, -2.05 - (o.browY || 0)]; paint(jjS(rotPts([[-.8, -.24], [.2, -.3], [.85, -.1], [.85, .05], [.1, .26], [-.8, .28]].map(p => [bc[0] + p[0], bc[1] + p[1]]), brow * .4, bc[0], bc[1]), u), { wash: C.ink, ink: null });
  paint(jjS([[3.7, -1.0], [4.5, -.65], [4.8, .05], [4.4, .62], [3.7, .3]], u), { wash: C.ink, ink: null, curv: .3 });
  if (open) { paint(jjS([[2.8, 1.5], [3.4, 1.55], [3.15, 2.3]], u), { wash: C.eye, ink: C.ink, sw: SW * .4 }); inkLine(jjS([[4.15, 1.05], [3.0, 1.55], [1.9, 1.4], [1.45, 1.65]], u), SW * .75, C.ink, 'ink', .4); }
  else { const e = mouth === 'frown' ? .3 : mouth === 'smile' ? -.25 : .08; inkLine(jjS([[4.2, 1.05], [3.1, 1.6], [2.1, 1.45], [1.6, 1.62 + e]], u), SW * .75, C.ink, 'ink', .5); }
  if (o.rage > .05) for (let i = 0; i < 3; i++) inkLine(jjS([[2.6 + i * .42, -1.05], [2.75 + i * .42, -.45]], u), SW * .45, C.ink, 'inkfine', 0);
  if (o.crown) { const k = backOut(o.crown); push(); translate(-.7 * u, -3.3 * u); rotate(-.12); scale(k);
    paint(jjS([[-1.6, 0], [-1.85, -2.0], [-.9, -1.1], [0, -2.5], [.9, -1.1], [1.85, -2.0], [1.6, 0]], u), { wash: C.gold, ink: C.ink, sw: SW * .7 }); pop(); }
}

// ---------- profile body: standing guard and the slow, deliberate walk ----------
// o.walk = stride phase (cycles, 1 = one full stride) or null to stand; o.face = 'side' | 'front'; o.flip faces left;
// o.leash = [x, y] world point the lead runs to; o.tailWag; o.lean (rad, forward lean for pulling / lunging);
// o.head = { dx, dy, rot } nudges the head (in units / rad); o.legs = { fn, ff, rn, rf: [swing, bend, lift] } poses
// single legs (front / rear, near / far) by hand.
function junjunSide(x, y, u, o = {}) {
  const C = o.mono ? JJ_MONO : (o.coat || JJ_COAT), SW = jjSW(u), J = u * .02, jp = pts => pts.map(p => [p[0] + jit(J), p[1] + jit(J)]);
  const far = o.mono ? C.fur : mixCol(C.fur, C.dark, .38), farW = o.mono ? C.white : mixCol(C.white, C.dark, .28);
  const ph = o.walk, bob = ph == null ? 0 : -Math.abs(Math.sin(ph * TAU * 2)) * .14;
  const leg = (hx, hy, off, isFar, rear) => {
    let th = 0, bend = 0, lift = 0;
    if (ph != null) {
      const p = frac(ph + off), A = o.stride ?? .3;
      if (p < .62) th = lerp(A, -A, p / .62); else { const s = (p - .62) / .38; th = lerp(-A, A, ease(s)); bend = Math.sin(s * Math.PI) * .7; lift = Math.sin(s * Math.PI) * .45; }
    }
    const pose = o.legs && o.legs[(rear ? 'r' : 'f') + (isFar ? 'f' : 'n')]; if (pose) { th = pose[0] ?? th; bend = pose[1] ?? 0; lift = pose[2] ?? 0; }
    const rest = rear ? [[0, 0, 2.15], [1.15, 3.4, 1.4], [-.85, 6.2, .84], [-.3, 8.0, .76]] : [[0, 0, 1.6], [-.2, 3.0, 1.15], [.1, 6.4, .84], [.15, 7.8, .78]];
    const c = Math.cos(th), sn = Math.sin(th), k = bend ? 1 : rest[3][1] / (-rest[3][0] * sn + rest[3][1] * c);   // stance: the leg extends, the paw stays down
    const ch = rest.map(([px, py, w]) => [hx + (px * c + py * sn) * k, hy + (-px * sn + py * c) * k - lift, w]);
    if (bend) { const cb = Math.cos(bend), sb = Math.sin(bend), [jx, jy] = ch[1]; for (let i = 2; i < 4; i++) { const vx = ch[i][0] - jx, vy = ch[i][1] - jy; ch[i][0] = jx + vx * cb - vy * sb; ch[i][1] = jy + vx * sb + vy * cb; } }
    const L = [], R = [];
    ch.forEach((p, i) => { const a = ch[Math.max(0, i - 1)], b = ch[Math.min(3, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; L.push([p[0] - dy / d * p[2] * -1, p[1] + dx / d * p[2] * -1]); R.push([p[0] + dy / d * p[2] * -1, p[1] - dx / d * p[2] * -1]); });
    const pr = bend * .9, cp = Math.cos(pr), sp = Math.sin(pr), [ax, ay] = ch[3];
    const paw = [[-.85, .72], [1.7, .72], [1.85, .1]].map(([px, py]) => [ax + px * cp - py * sp, Math.min(0, ay + px * sp + py * cp)]);
    const outline = [L[0], L[1], L[2], L[3], ...paw, R[3], R[2], R[1], R[0]].map(p => [p[0] * u + jit(J), p[1] * u + jit(J)]);
    const m = (a, b, q) => [lerp(a[0], b[0], q) * u, lerp(a[1], b[1], q) * u];
    paint(outline, { wash: isFar ? farW : C.white, ink: null });
    paint([m(L[0], L[0], 0), m(L[1], L[1], 0), m(L[1], L[2], .55), m(ch[1], ch[2], .2), m(R[1], R[2], .55), m(R[1], R[1], 0), m(R[0], R[0], 0)], { wash: isFar ? far : C.fur, ink: null });
    if (!isFar) { const a = m(R[0], R[1], .55), b = m(L[0], L[1], .7); jjStripe(a[0] / u, a[1] / u, b[0] / u, b[1] / u, .5, u, C.dark, 0); }
    inkLine(outline, SW * (isFar ? .8 : .95), C.ink, 'ink', .12);
    inkLine([m(ch[3], ch[3], 0), m(ch[3], ch[3], 0)].map((p, i) => [p[0] + (.75 + i * .02) * u * cp, Math.min(-.05 * u, p[1] + (.3 + i * .4) * u)]), SW * .4, C.ink, 'inkfine', 0);
  };
  push(); translate(x, y); if (o.flip) scale(-1, 1);
  if (o.shadow !== false && !o.mono) paint(ellPts(.8 * u, .1 * u, 9.6 * u, .85 * u, 20), { wash: o.shadowCol || C.ink, washOp: o.shadowOp ?? 255, ink: null });
  if (o.lean) { translate(-6 * u, 0); rotate(-o.lean); translate(6 * u, 0); }
  translate(0, bob * u);
  if (o.sq) scale(1 + o.sq * .5, 1 - o.sq);
  leg(-6.5, -8.72, .5, true, true); leg(3.6, -8.52, .75, true, false);                         // far legs
  const TORSO = [[3.6, -16.9], [8.6, -15.0], [8.2, -13.6], [8.9, -12.9], [7.9, -12.1], [8.4, -11.1], [7.4, -10.3], [7.3, -9.0], [6.6, -7.5], [4.8, -5.9], [1.0, -5.5], [-2.5, -6.0], [-4.8, -7.0], [-6.4, -7.4], [-8.1, -9.0], [-8.4, -11.2], [-7.3, -12.7], [-3.0, -13.0], [1.6, -13.6], [2.6, -15.3]];
  const torso = jp(jjS(TORSO, u));
  paint(torso, { wash: C.fur, ink: null });
  paint(jjS(TORSO.slice(1, 13).concat([[-3.0, -7.6], [1.0, -7.3], [4.3, -8.3], [5.6, -10.2], [6.3, -12.6], [7.2, -14.6]]), u), { wash: C.white, ink: null });
  for (let i = 0; i < 7; i++) { const sx = -6.6 + i * 1.45, top = -12.95 - (i > 4 ? (i - 4) * .3 : 0); jjStripe(sx, top, sx - .75, top + 3.0 + hash(i * 3.3) * 1.3, .75, u, C.dark, .1); }
  for (let i = 0; i < 3; i++) jjStripe(-8.2 + i * .2, -10.6 + i * 1.1, -6.2, -10.2 + i * 1.2, .6, u, C.dark, .1);
  jjStripe(3.0, -15.4, 4.6, -13.2, .7, u, C.dark, .1); jjStripe(4.4, -16.8, 6.0, -14.4, .7, u, C.dark, .1);
  paint(jjS([[6.4, -7.6], [4.8, -5.9], [1.0, -5.5], [-2.5, -6.0], [-4.8, -7.0], [-3.0, -7.9], [1.0, -7.4], [4.3, -8.4]], u), { hatch: { d: u * .3, a: .9, b: 'inkfine', c: C.dark, w: clamp(u / 60, .35, 1.1), o: { rand: .25 } }, ink: null });
  paint(torso, { ink: C.ink, sw: SW * 1.1 });
  leg(-5.7, -8.72, 0, false, true); leg(4.5, -8.52, .25, false, false);                        // near legs
  // harness: girth strap behind the foreleg, chest strap, lime trim, D-ring on the back
  if (o.harness !== false) {
    paint(jjS([[2.0, -13.6], [3.7, -13.7], [3.9, -6.0], [2.4, -5.72]], u), { wash: C.harness, ink: C.ink, sw: SW * .8 });
    paint(jjS([[3.5, -13.5], [3.8, -12.0], [7.45, -9.3], [7.35, -10.8]], u), { wash: C.harness, ink: C.ink, sw: SW * .8 });
    inkLine(jjS([[2.85, -13.4], [3.1, -6.1]], u), SW * .35, C.trim, 'inkfine', 0);
    paint(ellPts(2.8 * u, -13.85 * u, u * .5, u * .5, 10), { wash: C.trim, ink: C.ink, sw: SW * .5 });
  }
  // tail: a fat curl carried over the croup
  { push(); translate(-7.2 * u, -12.4 * u); rotate((o.tailWag || 0) + (ph != null ? Math.sin(ph * TAU * 2) * .04 : 0)); translate(7.2 * u, 12.4 * u);
    const cx = -6.9, cy = -15.3, tp = []; for (let i = 0; i < 22; i++) { const a = i / 22 * TAU, r = 3.15 * (1 + (i % 2 ? .1 : -.02)); tp.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    paint(jp(jjS(tp, u)), { wash: C.fur, ink: C.ink, sw: SW });
    paint(ellPts((cx + .35) * u, (cy + .5) * u, 1.7 * u, 1.75 * u, 14), { wash: C.white, ink: null });
    inkLine(jjS([[cx - 1.9, cy + 2.0], [cx - 2.1, cy - .9], [cx - .2, cy - 1.9], [cx + 1.5, cy - .5], [cx + .9, cy + 1.0], [cx - .3, cy + .6]], u), SW * .6, C.ink, 'ink', .8);
    jjStripe(cx - 2.9, cy - 1.2, cx - 1.6, cy - .8, .55, u, C.dark); jjStripe(cx - .6, cy - 3.3, cx - .3, cy - 2.0, .55, u, C.dark); jjStripe(cx + 2.9, cy - 1.0, cx + 1.7, cy - .6, .5, u, C.dark);
    pop(); }
  const hd = o.head || {};
  push(); translate((7.5 + (hd.dx || 0)) * u, (-17.5 + (hd.dy || 0)) * u); rotate(hd.rot || 0);
  if (o.face === 'front') { translate(-.3 * u, -.2 * u); jjHead(u * .7, o); } else jjHeadSide(u * 1.12, o);
  pop();
  pop();
  // the lead: lime, taut or slack, from the D-ring to a world point
  if (o.leash) {
    const f = o.flip ? -1 : 1, ax = x + f * 2.8 * u, ay = y + (bob - 13.85) * u, [bx, by] = o.leash, sag = (o.slack ?? .12) * Math.hypot(bx - ax, by - ay);
    const pts = [[ax, ay], [(ax + bx) / 2, (ay + by) / 2 + sag], [bx, by]];
    inkLine(pts, SW * 1.25, C.ink, 'ink', .7); inkLine(pts, SW * .62, C.trim, 'ink', .7);
  }
}
