// fx.js: the signature effects. Flat graphic marks go on the 2D layer; hand-drawn marks use p5.brush.
// Everything is a pure function of its arguments (seeded with hash), so frames can render in any order.

// ---------- manga focus lines (2D) ----------
// Sharp ink wedges pointing at (cx, cy) from outside the frame. o: n, r0 (tip radius), r1 (base radius),
// col, w [min, max] angular half-width (rad), seed, jitter (tip radius spread), ey (ellipse squash), boil.
function speedLines(cx, cy, o = {}) {
  const n = o.n || 70, r0 = o.r0 ?? 320, r1 = o.r1 ?? 1500, [w0, w1] = o.w || [.004, .022], ey = o.ey ?? 1;
  const seed = (o.seed || 1) + (o.boil ? Math.floor(T * (o.boilRate || BOIL)) * 13 : 0), jr = o.jitter ?? .45;
  const c = g2d(o.screen); c.fillStyle = o.col || PAL.ink; c.globalAlpha = o.alpha ?? 1; c.beginPath();
  for (let i = 0; i < n; i++) {
    const a = (i + hash(seed + i * 1.3)) / n * TAU, hw = lerp(w0, w1, Math.pow(hash(seed + i * 2.9), 2));
    const rt = r0 * (1 + (hash(seed + i * 4.1) - .3) * jr * 2);
    c.moveTo(cx + Math.cos(a) * rt, cy + Math.sin(a) * rt * ey);
    c.lineTo(cx + Math.cos(a - hw) * r1, cy + Math.sin(a - hw) * r1 * ey);
    c.lineTo(cx + Math.cos(a + hw) * r1, cy + Math.sin(a + hw) * r1 * ey);
    c.closePath();
  }
  c.fill(); c.globalAlpha = 1;
}
// Parallel motion streaks. o: ang, n, col, len [min, max], th [min, max], seed, drift (px of travel, loops), area [x, y, w, h].
function streaks(o = {}) {
  const n = o.n || 40, ang = o.ang || 0, [l0, l1] = o.len || [200, 900], [t0, t1] = o.th || [3, 14], seed = o.seed || 1;
  const [ax, ay, aw, ah] = o.area || [-200, -100, W + 400, H + 200], drift = o.drift || 0;
  const c = g2d(o.screen); c.save(); c.translate(W / 2, H / 2); c.rotate(ang); c.translate(-W / 2, -H / 2);
  c.fillStyle = o.col || PAL.ink; c.globalAlpha = o.alpha ?? 1; c.beginPath();
  for (let i = 0; i < n; i++) {
    const len = lerp(l0, l1, hash(seed + i * 3.3)), th = lerp(t0, t1, Math.pow(hash(seed + i * 5.9), 2));
    const span = aw + len, x = ax - len + ((hash(seed + i * 1.7) * span + drift * (.6 + hash(seed + i * 9.1) * .8)) % span + span) % span, y = ay + hash(seed + i * 7.3) * ah;
    c.moveTo(x, y); c.lineTo(x + len * .85, y - th / 2); c.lineTo(x + len, y); c.lineTo(x + len * .85, y + th / 2); c.closePath();
  }
  c.fill(); c.restore(); c.globalAlpha = 1;
}
// Poster sunburst: alternating wedges of colour b over whatever is already there.
function sunburst(cx, cy, o = {}) {
  const n = o.n || 16, rot = o.rot || 0, r = o.r || 2400, duty = o.duty ?? .5, c = g2d(o.screen);
  c.fillStyle = o.col || PAL.paper; c.globalAlpha = o.alpha ?? 1; c.beginPath();
  for (let i = 0; i < n; i++) {
    const a0 = rot + i / n * TAU, a1 = a0 + duty / n * TAU, r0 = o.r0 || 0;
    c.moveTo(cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0); c.lineTo(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r);
    c.lineTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r); c.lineTo(cx + Math.cos(a1) * r0, cy + Math.sin(a1) * r0); c.closePath();
  }
  c.fill(); c.globalAlpha = 1;
}

// ---------- halftone (2D) ----------
// Dots on a rotated grid inside [x, y, w, h]. size(px, py) returns 0..1 (dot fill); or pass o.grad = [x0, y0, x1, y1]
// for a linear ramp, or o.radial = [cx, cy, r0, r1] for a radial one (0 at r0, 1 at r1).
function halftone(x, y, w, h, o = {}) {
  const cell = o.cell || 20, ang = o.ang ?? .5, col = o.col || PAL.ink, c = g2d(o.screen);
  let f = o.size;
  if (!f && o.grad) { const [x0, y0, x1, y1] = o.grad, dx = x1 - x0, dy = y1 - y0, L = dx * dx + dy * dy; f = (px, py) => clamp(((px - x0) * dx + (py - y0) * dy) / L); }
  if (!f && o.radial) { const [rx, ry, r0, r1] = o.radial; f = (px, py) => clamp((Math.hypot(px - rx, py - ry) - r0) / (r1 - r0)); }
  if (!f) f = () => .5;
  const cs = Math.cos(ang), sn = Math.sin(ang), cx = x + w / 2, cy = y + h / 2, R = Math.hypot(w, h) / 2, N = Math.ceil(R / cell);
  c.fillStyle = col; c.globalAlpha = o.alpha ?? 1; c.beginPath();
  for (let i = -N; i <= N; i++) for (let j = -N; j <= N; j++) {
    const px = cx + (i * cs - j * sn) * cell, py = cy + (i * sn + j * cs) * cell;
    if (px < x || px > x + w || py < y || py > y + h) continue;
    const s = f(px, py); if (s < .04) continue;
    const r = cell * .72 * Math.sqrt(s) * (o.max ?? 1);
    c.moveTo(px + r, py); c.arc(px, py, r, 0, TAU);
  }
  c.fill(); c.globalAlpha = 1;
}

// ---------- ink bursts and splats (2D) ----------
function burst(cx, cy, rIn, rOut, o = {}) {
  poly2(burstPts(cx, cy, rIn, rOut, o.n || 14, o.seed || 1, o.irr ?? .35, o.ey ?? 1, o.rot || 0), o.col || PAL.white, { stroke: o.stroke, lw: o.lw, screen: o.screen, alpha: o.alpha });
}
// Ink splat: a blob with thrown droplets. k 0..1 grows it.
function splat(cx, cy, r, o = {}) {
  const seed = o.seed || 1, k = o.k ?? 1, c = g2d(o.screen); if (k <= 0) return;
  c.fillStyle = o.col || PAL.ink; c.globalAlpha = o.alpha ?? 1; c.beginPath();
  const n = 26;
  for (let i = 0; i <= n; i++) {
    const a = i / n * TAU, rr = r * k * (.7 + hash(seed + (i % n) * 2.3) * .45 + (hash(seed + (i % n) * 5.1) > .78 ? .5 : 0));
    const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr; i ? c.lineTo(px, py) : c.moveTo(px, py);
  }
  c.closePath();
  for (let i = 0; i < (o.drops ?? 14); i++) {
    const a = hash(seed + i * 9.7) * TAU, d = r * k * (1.25 + hash(seed + i * 3.9) * 1.5), rr = r * (.03 + hash(seed + i * 6.1) * .09) * k;
    c.moveTo(cx + Math.cos(a) * d + rr, cy + Math.sin(a) * d); c.ellipse(cx + Math.cos(a) * d, cy + Math.sin(a) * d, rr * 1.5, rr, a, 0, TAU);
  }
  c.fill(); c.globalAlpha = 1;
}

// ---------- B. manga impact frame ----------
// A whole-frame, high-contrast composition: dark field, a jagged light burst, focus lines and one palette accent.
// Draw the subject on top (junjun with { mono: true } reads best). age = seconds since the hit.
function impactFrame(cx, cy, age, o = {}) {
  const a = o.dark || PAL.ink, b = o.light || PAL.white, acc = o.accent || PAL.orange, k = easeOut5(age / .12), seed = o.seed || 7;
  bg(a);
  burst(cx, cy, 520 * k * (o.size || 1), 1250 * k * (o.size || 1), { n: 18, seed, col: acc, irr: .4, ey: .8, rot: age * .3 });
  burst(cx, cy, 400 * k * (o.size || 1), 980 * k * (o.size || 1), { n: 16, seed: seed + 5, col: b, irr: .38, ey: .8, rot: .2 - age * .2 });
  speedLines(cx, cy, { n: 90, r0: 430 * (o.size || 1), r1: 1700, col: a, w: [.004, .028], seed, boil: true, boilRate: 12, ey: .85 });
  if (o.half !== false) halftone(0, 0, W, H, { cell: 22, ang: .45, col: a, radial: [cx, cy, 520 * (o.size || 1), 1000 * (o.size || 1)], max: .8 });
}

// ---------- A. stare backdrop ----------
// Darkens / simplifies the background and grows radial ink lines behind the head. k 0..1 = how far the stare has built.
function stareLines(cx, cy, k, o = {}) {
  if (k <= 0) return;
  const c = g2d(o.screen); c.fillStyle = o.dark || PAL.ink; c.globalAlpha = (o.dim ?? .82) * ease(k); c.fillRect(-4000, -4000, 8000 + W, 8000 + H); c.globalAlpha = 1;
  speedLines(cx, cy, { n: Math.round(lerp(20, o.n || 84, k)), r0: lerp(1100, o.r0 || 430, easeOut(k)), r1: 1900, col: o.col || PAL.orange, w: [.003, lerp(.01, .024, k)], seed: o.seed || 3, boil: true, boilRate: lerp(3, 10, k), ey: o.ey ?? .9, screen: o.screen });
}

// ---------- C. rage aura (brush) ----------
// Irregular ink strokes radiating from around a centre. intensity 0..1 adds strokes, length and weight.
function rageAura(cx, cy, r, intensity, o = {}) {
  if (intensity <= 0) return;
  const n = Math.round(lerp(8, o.n || 34, intensity)), f = Math.floor(T * lerp(6, 14, intensity)), col = o.col || PAL.ink, ey = o.ey ?? 1;
  for (let i = 0; i < n; i++) {
    const s = f * 17 + i * 3.7 + (o.seed || 0), a = (i + hash(s) * .9) / n * TAU;
    const r0 = r * (1 + hash(s + 1) * .12), len = r * lerp(.12, .55, intensity) * (.4 + hash(s + 2) * 1.2), big = hash(s + 3) > .7;
    const x0 = cx + Math.cos(a) * r0, y0 = cy + Math.sin(a) * r0 * ey, x1 = cx + Math.cos(a) * (r0 + len), y1 = cy + Math.sin(a) * (r0 + len) * ey;
    const bend = (hash(s + 4) - .5) * len * .35, mx = (x0 + x1) / 2 - Math.sin(a) * bend, my = (y0 + y1) / 2 + Math.cos(a) * bend;
    inkLine([[x1, y1], [mx, my], [x0, y0]], (big ? 3.2 : 1.1) * lerp(.7, 1.5, intensity) * (o.sw || 1), col, 'ink', .6);
  }
}
// Rising flame tongues behind a subject: two flat layers that flicker on the boil. (cx, baseY) = bottom centre,
// w / h = overall size at intensity 1. o: a (outer colour), b (inner colour), n (tongues).
function flames(cx, baseY, w, h, intensity, o = {}) {
  if (intensity <= 0) return;
  const f = Math.floor(T * 10), n = o.n || 7;
  for (let L = 0; L < 2; L++) {
    const sc = L ? .7 : 1, ww = w * sc, sp = ww / n, pts = [[cx - ww / 2 - sp * .2, baseY]];
    for (let i = 0; i < n; i++) {
      const x = cx - ww / 2 + (i + .5) * sp, mid = 1 - Math.pow(Math.abs((i + .5) / n - .5) * 2, 1.6) * .6;
      const hh = h * sc * intensity * mid * (.6 + hash(f * 7.3 + i * 3.1 + L * 50) * .55), sway = (hash(f * 3.7 + i * 9.3 + L * 20) - .5) * sp * .9;
      pts.push([x - sp * .5, baseY - hh * .16], [x - sp * .42, baseY - hh * .5], [x + sway, baseY - hh], [x + sp * .2, baseY - hh * .62], [x + sp * .44, baseY - hh * .3]);
    }
    pts.push([cx + ww / 2 + sp * .2, baseY]);
    poly2(pts, L ? (o.b || PAL.lime) : (o.a || PAL.orange), { stroke: PAL.ink, lw: L ? 6 : 9, join: 'round' });
  }
}

// ---------- D. vibration lines (brush) ----------
// Short hand-drawn zigzags around an ellipse (rx, ry): trembling, growl, restrained rage. arc = [a0, a1] limits where.
function vibLines(cx, cy, rx, ry, amt, o = {}) {
  if (amt <= 0) return;
  const n = o.n || 10, [a0, a1] = o.arc || [0, TAU], f = Math.floor(T * (o.rate || 12));
  for (let i = 0; i < n; i++) {
    const s = f * 31 + i * 5.3 + (o.seed || 0), a = lerp(a0, a1, (i + hash(s) * .7) / n), d = 1.06 + hash(s + 1) * .1 * (1 + amt);
    const len = lerp(18, 54, hash(s + 2)) * (o.len || 1) * lerp(.7, 1.4, amt), zz = 7 * lerp(.6, 1.6, amt) * (o.zz || 1);
    const bx = cx + Math.cos(a) * rx * d, by = cy + Math.sin(a) * ry * d, tx = -Math.sin(a), ty = Math.cos(a), pts = [];
    for (let q = 0; q <= 4; q++) { const u = (q / 4 - .5) * len, w = (q % 2 ? 1 : -1) * zz; pts.push([bx + tx * u + Math.cos(a) * w, by + ty * u + Math.sin(a) * w]); }
    inkLine(pts, (o.sw || .8), o.col || PAL.ink, 'ink', 0);
  }
}

// ---------- dry-brush stroke (brush + 2D) ----------
// A broad dry-brush band from (x0, y0) to (x1, y1): a flat ragged core plus bristle streaks that run past its ends.
// p 0..1 draws it on from the start point.
function dryStroke(x0, y0, x1, y1, width, col, o = {}) {
  const p = o.p ?? 1; if (p <= 0) return;
  const seed = o.seed || 1, L = Math.hypot(x1 - x0, y1 - y0) * p, ang = Math.atan2(y1 - y0, x1 - x0), n = o.bristles || Math.round(width / 9);
  const c = g2d(o.screen); c.save(); c.translate(x0, y0); c.rotate(ang); c.fillStyle = col; c.globalAlpha = o.alpha ?? 1; c.beginPath();
  for (let i = 0; i < n; i++) {
    const y = (i / (n - 1) - .5) * width, edge = Math.abs(i / (n - 1) - .5) * 2, th = width / n * (1.25 - edge * .4 + hash(seed + i * 2.1) * .5);
    const s = -hash(seed + i * 4.3) * width * .12 * (1 + edge), e = L + (hash(seed + i * 7.7) - .35) * width * (.25 + edge * .5);
    // a bristle: mostly solid, with a few dry gaps toward the end
    let x = s; const gaps = hash(seed + i * 3.3) > .45 ? 1 + Math.floor(hash(seed + i * 8.9) * 3) : 0;
    for (let g = 0; g <= gaps; g++) {
      const xe = g === gaps ? e : lerp(L * .45, e, (g + hash(seed + i * 1.9 + g * 5)) / (gaps + 1));
      if (xe > x) { c.moveTo(x, y - th / 2); c.lineTo(xe, y - th / 2 + (hash(seed + i + g) - .5) * 2); c.lineTo(xe + th * 2, y); c.lineTo(xe, y + th / 2); c.lineTo(x, y + th / 2); c.closePath(); }
      x = xe + 8 + hash(seed + i * 6.1 + g * 3) * width * .35;
    }
  }
  c.fill(); c.restore(); c.globalAlpha = 1;
}

// ---------- F. brush-wipe transition ----------
// Broad dry-brush bands sweep across to cover the old shot (p 0→.5), the shot changes under full cover, then the
// bands drag off (p .5→1). Call it last in the frame (screen space). o: cols, ang, n, seed.
function brushWipe(p, o = {}) {
  if (p <= 0 || p >= 1) return;
  const cols = o.cols || [PAL.ink, PAL.orange], n = o.n || 5, ang = o.ang ?? -.14, seed = o.seed || 1, bh = (H + 520) / n;
  const c0 = CAM; CAM = null;
  const c = g2d(true); c.save(); c.translate(W / 2, H / 2); c.rotate(ang); c.translate(-W / 2, -H / 2);
  const xf = c.getTransform(); c.restore();
  for (let i = 0; i < n; i++) {
    const d = [0, .2, .08, .26, .14, .05][i % 6], y = -260 + (i + .5) * bh, col = cols[i % cols.length];
    const q = p < .5 ? easeOut(clamp((p * 2 - d) / (1 - d))) : easeIn(clamp(((p - .5) * 2 - d * .6) / (1 - d * .6)));
    const xa = -500, xb = W + 500, dir = i % 2 ? -1 : 1;
    let s, e;
    if (p < .5) { s = dir > 0 ? xa : xb; e = lerp(s, dir > 0 ? xb : xa, q); } else { e = dir > 0 ? xb : xa; s = lerp(dir > 0 ? xa : xb, e, q); }
    if (Math.abs(e - s) < 20) continue;
    // transform the band's endpoints by the tilt, then draw it as one dry stroke
    const P = (x, yy) => { const pt = new DOMPoint(x, yy).matrixTransform(xf); return [pt.x, pt.y]; };
    const [sx, sy] = P(s, y), [ex, ey] = P(e, y);
    dryStroke(sx, sy, ex, ey, bh * 1.22, col, { seed: seed + i * 11, screen: true, bristles: 34 });
  }
  CAM = c0;
}
// A single diagonal slash wipe: a hard-edged ink shape that crosses the frame (for fast cuts on a hit).
function slashWipe(p, col = PAL.ink, o = {}) {
  if (p <= 0 || p >= 1) return;
  const lead = lerp(-700, W + 700, easeOut(clamp(p * 2))), tail = lerp(-700, W + 700, easeIn(clamp(p * 2 - 1))), sk = o.skew ?? 420;
  const pts = [[tail - sk, H + 60], [tail + sk, -60]], seed = o.seed || 2;
  for (let i = 0; i <= 8; i++) pts.push([lead + sk - i / 8 * sk * 2 + (i % 2 ? 60 + hash(seed + i) * 90 : 0), -60 + i / 8 * (H + 120)]);
  poly2(pts, col, { screen: true });
}

// ---------- G. judgement annotations ----------
// Targeting reticle (2D): corner brackets + cross + optional caption. k = pop-in progress.
function reticle(cx, cy, r, o = {}) {
  const k = o.k ?? 1; if (k <= 0) return;
  const c = g2d(o.screen), col = o.col || PAL.lime, R = r * lerp(1.8, 1, easeOut(k)), a = r * .38;
  c.save(); c.translate(cx, cy); c.rotate((1 - easeOut(k)) * .6 + (o.rot || 0)); c.strokeStyle = col; c.lineWidth = o.lw || 6; c.lineCap = 'square'; c.globalAlpha = clamp(k * 3);
  for (let i = 0; i < 4; i++) { c.rotate(Math.PI / 2); c.beginPath(); c.moveTo(R - a, -R); c.lineTo(R, -R); c.lineTo(R, -R + a); c.stroke(); }
  c.beginPath(); c.moveTo(-r * .22, 0); c.lineTo(r * .22, 0); c.moveTo(0, -r * .22); c.lineTo(0, r * .22); c.stroke();
  c.restore(); c.globalAlpha = 1;
}
// Dossier card: a paper slip with a header bar and typed lines. age drives the teletype.
function dossier(x, y, title, lines, age, o = {}) {
  if (age <= 0) return;
  const size = o.size || 24, w = o.w || 470, lh = size * 1.5, h = size * 2.6 + lines.length * lh, k = backOut(age / .2, 1.2), rot = o.rot ?? -.03;
  const c = g2d(o.screen); c.save(); c.translate(x, y); c.rotate(rot); c.scale(k, k);
  c.fillStyle = PAL.ink; c.fillRect(10, 12, w, h); c.fillStyle = o.bg || PAL.paper; c.fillRect(0, 0, w, h);
  c.fillStyle = o.head || PAL.ink; c.fillRect(0, 0, w, size * 1.8);
  c.font = `700 ${size}px ${FONT.mono}`; c.textBaseline = 'middle'; c.fillStyle = o.headCol || PAL.lime; c.fillText(title, size * .6, size * .95);
  c.fillStyle = PAL.ink; c.font = `500 ${size}px ${FONT.mono}`;
  lines.forEach((l, i) => c.fillText(typed(l, age - .2 - i * .28, 34), size * .6, size * 2.7 + i * lh));
  c.restore();
}
// Corner frame data: tiny running annotation in a screen corner (timecode, sector, status).
function hud(lines, o = {}) {
  const corner = o.corner || 'tl', x = corner.includes('l') ? 64 : W - 64, y = corner.includes('t') ? 56 : H - 56 - (lines.length - 1) * 30;
  label(lines, x, y, { size: o.size || 21, col: o.col || PAL.ink, align: corner.includes('l') ? 'left' : 'right', screen: true, alpha: o.alpha ?? 1, bg: o.bg, pad: 10 });
}
// Screen flash (2D, screen space).
function flash(k, col = PAL.white) { if (k > .01) { const c = g2d(true); c.globalAlpha = clamp(k); c.fillStyle = col; c.fillRect(0, 0, W, H); c.globalAlpha = 1; } }
// Letterbox bars for "cinematic" moments. k 0..1.
function letterbox(k, col = PAL.ink, h = 120) { if (k > 0) { rect2(0, 0, W, h * k, col, { screen: true }); rect2(0, H - h * k, W, h * k, col, { screen: true }); } }
