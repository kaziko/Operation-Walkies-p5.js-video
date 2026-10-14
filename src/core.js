// core.js: constants, palette, timing, camera, the brush paint wrapper, the 2D graphic layer, compositing and render hooks.
// The film is 1920 × 1080. studio.html?fmt=v gives the tall 1080 × 1920 frame of the Instagram trailer (src/reel.js).
const VERT = new URLSearchParams(location.search).get('fmt') === 'v';
const W = VERT ? 1080 : 1920, H = VERT ? 1920 : 1080, FPS = 24, BOIL = 8, DUR = SONG.dur;
const TAU = Math.PI * 2;
const PAL = {
  orange: '#F45116', paper: '#F6EAD2', ink: '#202027', lime: '#D9E94C', pink: '#E8AFC4',
  blue: '#2778E7', sage: '#A8B87A', violet: '#6D43B9', oxblood: '#9B3C39', white: '#FFFFFF',
  // Jun Jun's coat. Character-only colours, kept close to the orange / paper / ink identity.
  fur: '#DDA25C', furDk: '#4B3530', furGrey: '#A9A39B'
};

// ---------- math ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const frac = x => x - Math.floor(x);
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const easeIn = x => Math.pow(clamp(x), 3);
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const easeOut5 = x => 1 - Math.pow(1 - clamp(x), 5);
const backOut = (x, s = 1.9) => { x = clamp(x); return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
const elasticOut = x => { x = clamp(x); return x === 0 || x === 1 ? x : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (TAU / 3)) + 1; };
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const seg = (t, a, b) => clamp((t - a) / (b - a));                 // 0..1 progress of t through [a, b]
const wob = (t, f = 1, ph = 0) => Math.sin((t * f + ph) * TAU);
// Seeded by the boil frame (see draw), so linework "boils" at BOIL fps like animation drawn on threes.
const jit = a => (random() * 2 - 1) * a;
// keyframes: kf(t, [[t0, v0], [t1, v1], ...], easeFn). Values may be numbers or arrays of numbers.
function kf(t, keys, e = ease) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t < keys[i][0]) {
      const [a, va] = keys[i - 1], [b, vb] = keys[i], k = e((t - a) / (b - a));
      return Array.isArray(va) ? va.map((v, j) => lerp(v, vb[j], k)) : lerp(va, vb, k);
    }
  }
  return keys[keys.length - 1][1];
}
function mixCol(a, b, k) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), c = i => Math.round(lerp((pa >> i) & 255, (pb >> i) & 255, clamp(k)));
  return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1);
}
const rgba = (hex, a) => { const p = parseInt(hex.slice(1), 16); return `rgba(${p >> 16 & 255},${p >> 8 & 255},${p & 255},${a})`; };
// small deterministic camera shake, held for one boil frame so it reads as drawn, not as noise
const shakeXY = (t, amt, rate = 12) => { const f = Math.floor(t * rate); return [(hash(f * 1.7) - .5) * 2 * amt, (hash(f * 2.3 + 9) - .5) * 2 * amt]; };

// ---------- musical time (measured from the audio: see tools/analyze.py) ----------
// SONG.beats are the tracked quarter notes (about 90.7 BPM); beat 0 is a downbeat. The punk pulse is the eighth.
const BEATS = SONG.beats, BEAT = (BEATS[BEATS.length - 1] - BEATS[0]) / (BEATS.length - 1);
function bp(t) {                                                   // continuous beat position of song time t
  const n = BEATS.length;
  if (t <= BEATS[0]) return (t - BEATS[0]) / BEAT;
  if (t >= BEATS[n - 1]) return n - 1 + (t - BEATS[n - 1]) / BEAT;
  let lo = 0, hi = n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (BEATS[m] <= t) lo = m; else hi = m; }
  return lo + (t - BEATS[lo]) / (BEATS[lo + 1] - BEATS[lo]);
}
function beatT(b) {                                                // song time of beat position b
  const n = BEATS.length;
  if (b <= 0) return BEATS[0] + b * BEAT;
  if (b >= n - 1) return BEATS[n - 1] + (b - (n - 1)) * BEAT;
  const i = Math.floor(b); return lerp(BEATS[i], BEATS[i + 1], b - i);
}
const barT = (bar, beat = 0) => beatT(bar * 4 + beat);             // song time of a bar (+ beats into it)
const pulse = (t, k = 6) => Math.exp(-frac(bp(t)) * k);            // 1 exactly on each beat, decays after
const pulse2 = (t, k = 6) => Math.exp(-frac(bp(t) * 2) * k);       // same on the eighths (the punk pulse)
const barPulse = (t, k = 3) => Math.exp(-frac(bp(t) / 4) * 4 * k); // same on each downbeat
const hit = (t, t0, k = 8) => t < t0 ? 0 : Math.exp(-(t - t0) * k); // decaying accent after one moment

// ---------- camera ----------
// camBegin(cx, cy, zoom, rot): world point (cx, cy) lands at screen centre. The 2D layer follows the same camera
// (see g2d). One level only: always pair with camEnd().
let CAM = null;
function camBegin(cx = W / 2, cy = H / 2, zoom = 1, rot = 0) { flush2D(); push(); translate(W / 2, H / 2); rotate(rot); scale(zoom); translate(-cx, -cy); CAM = { cx, cy, zoom, rot }; }
function camEnd() { flush2D(); pop(); CAM = null; }
function toScreen(x, y) {
  if (!CAM) return [x, y];
  const c = Math.cos(CAM.rot), s = Math.sin(CAM.rot), dx = (x - CAM.cx) * CAM.zoom, dy = (y - CAM.cy) * CAM.zoom;
  return [W / 2 + dx * c - dy * s, H / 2 + dx * s + dy * c];
}

let T = 0, g2 = null, X2 = null, G2_DIRTY = false, scratchC = null, scratchX = null, grainC = null, speckC = null, outC = null, outX = null;

// ---------- geometry ----------
function rectPts(x, y, w, h, j = 0) {
  return [[x + jit(j), y + jit(j)], [x + w / 2 + jit(j), y + jit(j) * .5], [x + w + jit(j), y + jit(j)],
          [x + w + jit(j) * .5, y + h / 2], [x + w + jit(j), y + h + jit(j)], [x + w / 2 + jit(j), y + h + jit(j) * .5],
          [x + jit(j), y + h + jit(j)], [x + jit(j) * .5, y + h / 2]];
}
function ellPts(cx, cy, rx, ry, n = 28, j = 0, rot = 0) {
  const p = []; for (let i = 0; i < n; i++) { const a = rot + i / n * TAU; p.push([cx + Math.cos(a) * rx + jit(j), cy + Math.sin(a) * ry + jit(j)]); } return p;
}
function rrPts(x, y, w, h, r, j = 0) {
  const p = [], sg = 5, corner = (cx, cy, a0) => { for (let i = 0; i <= sg; i++) { const a = a0 + i / sg * Math.PI / 2; p.push([cx + Math.cos(a) * r + jit(j), cy + Math.sin(a) * r + jit(j)]); } };
  corner(x + w - r, y + r, -Math.PI / 2); corner(x + w - r, y + h - r, 0); corner(x + r, y + h - r, Math.PI / 2); corner(x + r, y + r, Math.PI);
  return p;
}
// jagged impact star: n spikes, outer radius varies per spike (seeded), optional ellipse squash
function burstPts(cx, cy, rIn, rOut, n = 14, seed = 1, irr = .35, ey = 1, rot = 0) {
  const p = [];
  for (let i = 0; i < n * 2; i++) {
    const a = rot + (i + (hash(seed + i * 3.1) - .5) * .5) * Math.PI / n;
    const r = i % 2 ? rIn * (1 + (hash(seed + i * 5.3) - .5) * irr) : rOut * (1 + (hash(seed + i * 7.7) - .5) * 2 * irr);
    p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * ey]);
  }
  return p;
}
const mirror = pts => pts.map(p => [-p[0], p[1]]).reverse();        // mirror a point list in x (keeps winding sane)
const scalePts = (pts, sx, sy = sx, ox = 0, oy = 0) => pts.map(p => [ox + p[0] * sx, oy + p[1] * sy]);
function rotPts(pts, a, ox = 0, oy = 0) { const c = Math.cos(a), s = Math.sin(a); return pts.map(p => { const x = p[0] - ox, y = p[1] - oy; return [ox + x * c - y * s, oy + x * s + y * c]; }); }

// ---------- brush paint wrapper ----------
// One call = one drawn shape: optional flat wash, optional hatch, optional ink outline (one continuous stroke).
function paint(pts, o = {}) {
  flush2D();
  if (o.wash || o.hatch) {
    if (o.wash) brush.wash(o.wash, o.washOp ?? 255); else brush.noWash();
    brush.noFill();
    if (o.hatch) { brush.hatch(o.hatch.d, o.hatch.a, o.hatch.o || { rand: .15 }); brush.hatchStyle(o.hatch.b || 'inkfine', o.hatch.c || PAL.ink, o.hatch.w || 1); } else brush.noHatch();
    brush.noStroke();
    if (o.curv) { brush.beginShape(o.curv); for (const p of pts) brush.vertex(p[0], p[1]); brush.endShape(true); }
    else brush.polygon(pts);
  }
  if (o.ink !== null) {
    brush.noWash(); brush.noFill(); brush.noHatch(); brush.set(o.br || 'ink', o.ink || PAL.ink, o.sw ?? 1);
    brush.beginShape(o.curv || 0); for (const p of pts) brush.vertex(p[0], p[1]); brush.endShape(true);
  }
}
function inkLine(pts, sw = 1, col = PAL.ink, br = 'ink', curv = .5) {
  flush2D(); brush.noFill(); brush.noWash(); brush.noHatch(); brush.set(br, col, sw); brush.spline(pts, curv);
}

// ---------- the 2D graphic layer ----------
// Flat poster graphics (colour fields, type, halftone, speed lines) are drawn with the canvas 2D API on one layer.
// g2d() hands out its context, already in camera space (pass true for screen space). The layer is flushed into the
// brush scene automatically before the next brush call, so painter's order between 2D and brush work is kept.
function g2d(screen = false) {
  const c = X2; G2_DIRTY = true;
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  if (CAM && !screen) { c.translate(W / 2, H / 2); c.rotate(CAM.rot); c.scale(CAM.zoom, CAM.zoom); c.translate(-CAM.cx, -CAM.cy); }
  return c;
}
function flush2D() {
  if (!G2_DIRTY) return;
  G2_DIRTY = false;
  // p5.brush defers washes and strokes; a tiny off-screen watercolor fill forces them to composite now, so
  // everything drawn before this call really lands under the 2D layer.
  push(); resetMatrix(); translate(-W / 2, -H / 2);
  brush.noStroke(); brush.noHatch(); brush.noWash(); brush.fill('#000000', 1); brush.fillBleed(0); brush.fillTexture(0, 0);
  brush.polygon([[-50, -50], [-40, -50], [-40, -40]]); brush.noFill();
  image(g2, 0, 0); pop();
  X2.setTransform(1, 0, 0, 1, 0, 0); X2.clearRect(0, 0, W, H);
}
// basic 2D shapes
function bg(col) { const c = g2d(true); c.fillStyle = col; c.fillRect(0, 0, W, H); }
function poly2(pts, fill, o = {}) {
  const c = g2d(o.screen); c.globalAlpha = o.alpha ?? 1; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (o.stroke) { c.lineJoin = o.join || 'miter'; c.lineWidth = o.lw || 6; c.strokeStyle = o.stroke; c.stroke(); }
  c.globalAlpha = 1;
}
function rect2(x, y, w, h, fill, o = {}) { poly2([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], fill, o); }
function circ2(x, y, r, fill, o = {}) {
  const c = g2d(o.screen); c.globalAlpha = o.alpha ?? 1; c.beginPath(); c.ellipse(x, y, r, r * (o.ey ?? 1), 0, 0, TAU);
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (o.stroke) { c.lineWidth = o.lw || 6; c.strokeStyle = o.stroke; c.stroke(); }
  c.globalAlpha = 1;
}

// ---------- print texture ----------
function lcg(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
// Fine grain and fibres, multiplied over the frame so flat colour reads as ink on paper.
function makeGrain() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'), rnd = lcg(5);
  const id = c.createImageData(W, H), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const v = 255 - (rnd() < .5 ? rnd() * rnd() * 46 : 0); d[i] = v; d[i + 1] = v - 1; d[i + 2] = v - 3; d[i + 3] = 255; }
  c.putImageData(id, 0, 0);
  c.lineWidth = 1.2;
  for (let i = 0; i < 900; i++) { const x = rnd() * W, y = rnd() * H, l = 8 + rnd() * 30, a = rnd() * TAU; c.strokeStyle = `rgba(90,70,50,${.03 + rnd() * .05})`; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a + .6) * l * .5, y + Math.sin(a + .6) * l * .5, x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }
  const vr = Math.min(W, H), g = c.createRadialGradient(W / 2, H / 2, vr * .55, W / 2, H / 2, vr * 1.15); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(70,45,30,.28)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  return cv;
}
// Sparse screen-print pinholes and scratches: light marks drawn over the frame.
function makeSpeck() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'), rnd = lcg(23);
  for (let i = 0; i < 520; i++) { const x = rnd() * W, y = rnd() * H, r = .6 + rnd() * rnd() * 3.2; c.fillStyle = `rgba(246,234,210,${.25 + rnd() * .5})`; c.beginPath(); c.ellipse(x, y, r, r * (.5 + rnd()), rnd() * 3, 0, TAU); c.fill(); }
  for (let i = 0; i < 26; i++) { const x = rnd() * W, y = rnd() * H, l = 30 + rnd() * 160, a = -.2 + rnd() * .4; c.strokeStyle = `rgba(246,234,210,${.1 + rnd() * .22})`; c.lineWidth = .6 + rnd() * 1.2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }
  return cv;
}

// ---------- brushes ----------
function defineBrushes() {
  brush.add('ink', { type: 'default', weight: 6, scatter: .22, sharpness: .85, grain: 44, opacity: 245, spacing: .18, pressure: [1.2, .8], rotate: 'natural', noise: .08 });
  brush.add('inkfine', { type: 'default', weight: 2.8, scatter: .15, sharpness: .85, grain: 40, opacity: 240, spacing: .2, pressure: [1.1, .8], rotate: 'natural', noise: .08 });
  brush.add('dry', { type: 'default', weight: 26, scatter: 5.5, sharpness: .35, grain: 5, opacity: 150, spacing: .5, pressure: [1.15, .55], rotate: 'natural', noise: .3 });
  brush.add('rough', { type: 'default', weight: 9, scatter: 1.6, sharpness: .5, grain: 9, opacity: 215, spacing: .3, pressure: [1.25, .6], rotate: 'natural', noise: .2 });
}

// ---------- frame ----------
async function setup() {
  createCanvas(W, H, WEBGL); pixelDensity(1); noLoop();
  brush.scaleBrushes(5); defineBrushes();
  g2 = createGraphics(W, H); g2.pixelDensity(1); X2 = g2.drawingContext;
  scratchC = document.createElement('canvas'); scratchC.width = W; scratchC.height = H; scratchX = scratchC.getContext('2d');
  grainC = makeGrain(); speckC = makeSpeck();
  outC = document.getElementById('out'); outC.width = W; outC.height = H; outC.style.aspectRatio = `${W} / ${H}`; if (VERT) outC.style.width = 'min(100%, 420px)'; outX = outC.getContext('2d');
  await loadFonts();
  initType();
  window.ready = true;
  if (!location.search.includes('render')) devUI();
}
function draw() {
  if (!window.ready) return;
  CAM = null; G2_DIRTY = false; X2.setTransform(1, 0, 0, 1, 0, 0); X2.clearRect(0, 0, W, H);
  push(); translate(-W / 2, -H / 2);
  // Seed p5 and p5.brush from the boil frame, so a frame's linework depends only on its timestamp.
  const sd = 1000 + Math.floor(T * BOIL); randomSeed(sd); noiseSeed(77); brush.seed(sd); brush.noiseSeed(77);
  bg(PAL.paper);
  const R = p5.instance._renderer, depth = R._pushPopDepth;
  try { drawWorld(T); }
  catch (e) {
    // A broken shot must not take the whole render down: report it, unwind, and mark the frame.
    console.error(`SHOT ERROR at t=${T.toFixed(3)}: ${e.message}\n${(e.stack || '').split('\n').slice(1, 4).join('\n')}`);
    while (R._pushPopDepth > depth) pop();
    CAM = null; window.SHOT_ERRORS = (window.SHOT_ERRORS || 0) + 1;
    bg(PAL.oxblood); type('SHOT ERROR', W / 2, H / 2, 200, { col: PAL.white, wear: 0 }); label(String(e.message).slice(0, 90), W / 2, H / 2 + 170, { align: 'center', col: PAL.white, size: 28 });
  }
  flush2D();
  pop();
}
function composite() {
  const c = outX;
  c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
  c.drawImage(drawingContext.canvas, 0, 0, W, H);
  c.globalCompositeOperation = 'multiply'; c.drawImage(grainC, 0, 0);
  c.globalCompositeOperation = 'source-over'; c.globalAlpha = .55; c.drawImage(speckC, 0, 0); c.globalAlpha = 1;
  // the film ends on true black: fade the last second over the print texture as well
  const fk = seg(T, DUR - 1.05, DUR - .2); if (fk > 0) { c.globalAlpha = fk; c.fillStyle = '#000'; c.fillRect(0, 0, W, H); c.globalAlpha = 1; }
}
// The first frame a page draws can lose brush fills (p5.brush sets itself up lazily), so it is drawn twice.
let PRIMED = false;
const prime = async t => { if (!PRIMED) { PRIMED = true; T = t; await redraw(); } };
window.renderAt = async (t, type = 'image/png', q = .92) => { await prime(t); T = t; await redraw(); composite(); return outC.toDataURL(type, q); };
// Contact sheet of several times, for quick visual checks: returns { url, ms[] }.
window.renderSheet = async (times, cols = 3, w = 640) => {
  const h = Math.round(w * H / W), rows = Math.ceil(times.length / cols), sc = document.createElement('canvas');
  sc.width = cols * w; sc.height = rows * h; const c = sc.getContext('2d'), ms = [];
  await prime(times[0]);
  for (let i = 0; i < times.length; i++) {
    const t0 = performance.now(); T = times[i]; await redraw(); composite(); ms.push(Math.round(performance.now() - t0));
    const x = (i % cols) * w, y = Math.floor(i / cols) * h;
    c.drawImage(outC, x, y, w, h); c.fillStyle = 'rgba(0,0,0,.7)'; c.fillRect(x, y, 84, 24); c.fillStyle = '#fff'; c.font = '15px sans-serif'; c.fillText(times[i].toFixed(2) + 's', x + 6, y + 17);
  }
  return { url: sc.toDataURL('image/jpeg', .88), ms };
};
window.gpuInfo = () => { const gl = drawingContext, e = gl.getExtension('WEBGL_debug_renderer_info'); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); };

function devUI() {
  const s = document.getElementById('scrub'), lab = document.getElementById('tt');
  s.max = DUR;
  let busy = false, want = null;
  const go = async () => { if (busy) return; busy = true; while (want != null) { const t = want; want = null; const t0 = performance.now(); await window.renderAt(t); lab.textContent = `${t.toFixed(2)}s  ·  bar ${Math.floor(bp(t) / 4)}  ·  ${Math.round(performance.now() - t0)} ms/frame`; } busy = false; };
  s.addEventListener('input', () => { want = +s.value; go(); });
  const q = new URLSearchParams(location.search);
  if (q.get('scene')) window.SCENE = q.get('scene');
  want = +(q.get('t') || 0); s.value = want; go();
}
