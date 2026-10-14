// cast.js: the supporting cast and props. Small, simple, loud: they do the panicking so Jun Jun does not have to.
// Every figure is drawn around a ground point (x, y) with a unit u, like Jun Jun.

// Yorkie: the neighbour-dog enemy. About 9u long and 9u tall, faces +x (o.flip faces left).
// o.bark 0..1 opens the mouth, o.hop lifts it (units), o.scared 0..1 flattens ears and widens the eye, o.mono.
function yorkie(x, y, u, o = {}) {
  const SW = clamp(u / 16, .5, 2.6), ink = PAL.ink, mono = o.mono, tan = mono ? PAL.white : PAL.fur, steel = mono ? PAL.white : PAL.furGrey, bow = mono ? PAL.white : (o.bow || PAL.pink);
  const J = u * .03, S = pts => pts.map(p => [p[0] * u + jit(J), p[1] * u + jit(J)]);
  push(); translate(x, y - (o.hop || 0) * u); if (o.flip) scale(-1, 1); if (o.rot) rotate(o.rot);
  if (o.shadow !== false && !mono) paint(ellPts(0, .1 * u + (o.hop || 0) * u, 4.4 * u, .5 * u, 14), { wash: ink, ink: null });
  // tail, long-haired body with a ragged hem
  paint(S([[-3.6, -4.6], [-4.9, -7.2], [-4.0, -7.6], [-2.9, -5.0]]), { wash: steel, ink, sw: SW });
  const hem = [[-3.9, -5.0], [-4.3, -2.4], [-4.0, 0]]; for (let i = 0; i < 7; i++) hem.push([-3.4 + i * 1.05, -.9 - (i % 2) * .15], [-2.9 + i * 1.05, 0]);
  hem.push([3.6, -2.6], [3.2, -5.2], [0, -5.9]);
  paint(S(hem), { wash: steel, ink, sw: SW });
  for (let i = 0; i < 5; i++) inkLine(S([[-2.8 + i * 1.3, -4.6], [-3.0 + i * 1.3, -1.6]]), SW * .4, ink, 'inkfine', 0);
  // head: tan, big for the body, set low on the shoulders, with a top-knot and a bow
  const sc = o.scared || 0, hx = 3.3, hy = -6.0, hp = pts => S(pts.map(p => [hx + p[0], hy + p[1]]));
  paint(hp([[-2.3, -1.6], [-2.9, -4.0 + sc * 1.5], [-1.1, -2.5]]), { wash: tan, ink, sw: SW });
  paint(hp([[1.0, -2.5], [2.5, -4.2 + sc * 1.5], [2.4, -1.5]]), { wash: tan, ink, sw: SW });
  paint(hp([[-2.6, .2], [-2.5, -1.6], [-1.2, -2.6], [.9, -2.6], [2.5, -1.5], [3.3, -.2], [3.6, .8], [2.9, 1.3], [2.6, 2.6], [1.5, 1.9], [.7, 3.0], [-.3, 2.0], [-1.3, 2.9], [-1.9, 1.7], [-2.9, 2.2]]), { wash: tan, ink, sw: SW });
  paint(hp([[-.7, -2.4], [-.1, -4.4], [.8, -2.5]]), { wash: steel, ink, sw: SW * .8 });
  paint(hp([[-1.2, -4.3], [-.2, -3.8], [-1.1, -3.1]]), { wash: bow, ink, sw: SW * .7 }); paint(hp([[1.1, -4.4], [0, -3.8], [1.0, -3.1]]), { wash: bow, ink, sw: SW * .7 });
  inkLine(hp([[.2, -2.0], [.9, -.9]]), SW * .45, ink, 'inkfine', 0); inkLine(hp([[-.5, -2.1], [-.1, -1.1]]), SW * .45, ink, 'inkfine', 0);
  paint(ellPts((hx + 1.5) * u, (hy - .35) * u, u * (.36 + sc * .2), u * (.42 + sc * .25), 8), { wash: ink, ink: null });
  if (!mono) paint(ellPts((hx + 1.42) * u, (hy - .5) * u, u * .12, u * .12, 6), { wash: PAL.white, ink: null });
  paint(ellPts((hx + 3.35) * u, (hy + .35) * u, u * .46, u * .38, 8), { wash: ink, ink: null });
  const bk = o.bark || 0;
  if (bk > .05) paint(hp([[1.9, 1.15], [3.3, .95], [3.0, 1.2 + bk * 1.6], [2.1, 1.3 + bk * 1.2]]), { wash: mono ? ink : PAL.oxblood, ink, sw: SW * .6 });
  else inkLine(hp([[2.0, 1.2], [3.2, 1.05]]), SW * .6, ink, 'ink', 0);
  pop();
}

// Dog biscuit (bone-shaped treat). s = length in px.
function biscuit(x, y, s, rot = 0, o = {}) {
  const col = o.col || PAL.paper, a = s / 2, b = s * .16, r = s * .17, pts = [];
  const lobe = (cx, cy, a0) => { for (let i = 0; i <= 6; i++) { const q = a0 + i / 6 * Math.PI * 1.25; pts.push([cx + Math.cos(q) * r, cy + Math.sin(q) * r]); } };
  lobe(a - r * .6, -b, -Math.PI * .75); lobe(a - r * .6, b, -Math.PI * .5); lobe(-a + r * .6, b, Math.PI * .25); lobe(-a + r * .6, -b, Math.PI * .5);
  push(); translate(x, y); rotate(rot);
  paint(pts, { wash: col, ink: o.ink === undefined ? PAL.ink : o.ink, sw: clamp(s / 70, .5, 2.4) });
  if (o.dots !== false) for (let i = -1; i <= 1; i++) paint(ellPts(i * s * .16, 0, s * .022, s * .022, 6), { wash: PAL.ink, ink: null });
  pop();
}

// Paw print (2D, flat). s = size in px.
function pawPrint(x, y, s, rot = 0, col = PAL.ink, o = {}) {
  const c = g2d(o.screen); c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col; c.globalAlpha = o.alpha ?? 1; c.beginPath();
  c.ellipse(0, s * .16, s * .3, s * .25, 0, 0, TAU);
  for (const [dx, dy, r] of [[-.36, -.14, .13], [-.13, -.36, .14], [.13, -.36, .14], [.36, -.14, .13]]) { c.moveTo(dx * s + r * s, dy * s); c.ellipse(dx * s, dy * s, r * s, r * s * 1.25, dx * .8, 0, TAU); }
  c.fill(); c.restore(); c.globalAlpha = 1;
}

// Royal cushion (brush): a flat pillow with tassels, centred on (x, y) = its top surface. w = width in px.
function cushion(x, y, w, o = {}) {
  const h = w * .2, col = o.col || PAL.pink, sw = clamp(w / 330, .6, 2.6), pts = [];
  for (let i = 0; i <= 10; i++) pts.push([x - w / 2 + i / 10 * w, y - Math.sin(i / 10 * Math.PI) * h * .22 + jit(2)]);
  for (let i = 0; i <= 10; i++) pts.push([x + w / 2 - i / 10 * w + (i === 0 ? w * .04 : i === 10 ? -w * .04 : 0), y + h * (.75 + Math.sin(i / 10 * Math.PI) * .3) + jit(2)]);
  for (const s of [1, -1]) { const tx = x + s * w * .52, ty = y + h * .35; paint([[tx, ty - h * .12], [tx + s * w * .07, ty + h * .5], [tx + s * w * .02, ty + h * .62], [tx - s * w * .03, ty + h * .1]], { wash: o.trim || PAL.lime, ink: PAL.ink, sw: sw * .7 }); }
  paint(pts, { wash: col, ink: PAL.ink, sw });
  inkLine([[x - w * .36, y + h * .5], [x, y + h * .64], [x + w * .36, y + h * .5]], sw * .5, PAL.ink, 'inkfine', .6);
}
// Hazard tape (2D): a band of diagonal stripes. off scrolls it (px).
function hazard(x, y, w, h, off = 0, a = PAL.lime, b = PAL.ink, o = {}) {
  const c = g2d(o.screen), sp = h * 1.1; c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.fillStyle = a; c.fillRect(x, y, w, h); c.fillStyle = b; c.beginPath();
  for (let sx = x - h * 2 - sp * 2 + ((off % (sp * 2)) + sp * 2) % (sp * 2); sx < x + w + h; sx += sp * 2) { c.moveTo(sx, y + h); c.lineTo(sx + h, y); c.lineTo(sx + h + sp, y); c.lineTo(sx + sp, y + h); c.closePath(); }
  c.fill(); c.restore();
}

// ---------- the Commander (the human on the other end of the lead) ----------
// About 34u tall with the same u as Jun Jun. (x, y) is the ground point under the hips (or the hip point when flying).
// o.pose: 'walk' (o.walk = phase) | 'stand' | 'dragged' (flying flat behind the lead) | 'flat' (face down on the floor)
//         | 'slump' (sat on the floor, done for the day)
// o.face: 'calm' | 'panic' | 'dead' | 'sleep'; o.flip faces left; o.arm overrides the lead-arm angle (rad from down, + forward).
// Returns the world position of the lead hand, so the lead can be drawn to it: junjunSide(..., { leash: commander(...) }).
function commander(x, y, u, o = {}) {
  const pose = o.pose || 'stand', SW = clamp(u / 20, .5, 3), ink = PAL.ink, mono = o.mono;
  const skin = mono ? PAL.white : PAL.paper, hood = mono ? PAL.white : (o.hood || PAL.sage), legC = mono ? PAL.white : (o.legs || PAL.ink), shoe = mono ? PAL.white : PAL.paper;
  const f = o.flip ? -1 : 1, ph = o.walk || 0;
  let lean = 0, hipY = -15, aArm = .9, bArm = -.3, aLeg = 0, bLeg = 0, kA = 0, kB = 0;
  if (pose === 'walk') { aLeg = Math.sin(ph * TAU) * .5; bLeg = -aLeg; kA = Math.max(0, -Math.cos(ph * TAU)) * .7; kB = Math.max(0, Math.cos(ph * TAU)) * .7; bArm = Math.sin(ph * TAU) * .4; lean = .06; hipY -= Math.abs(Math.sin(ph * TAU)) * .5; }
  if (pose === 'dragged') { lean = 1.42; hipY = 0; aArm = 1.62 - lean + .1; bArm = 1.5 - lean; aLeg = -.25 + Math.sin(T * 19) * .22; bLeg = .2 + Math.sin(T * 19 + 2) * .22; kA = .3; kB = .5; }
  if (pose === 'flat') { lean = 1.57; hipY = -1.6; aArm = .1; bArm = -.2; aLeg = -.06; bLeg = .08; }
  if (pose === 'slump') { lean = -.5; hipY = -1.8; aArm = -.2; bArm = -.5; aLeg = 1.35; bLeg = 1.5; kA = -.2; kB = -.5; }
  if (o.arm != null) aArm = o.arm; if (o.lean != null) lean = o.lean;
  const J = u * .03, cl = Math.cos(lean), sl = Math.sin(lean);
  // local (upright, hips at origin, +x forward) → world
  const Wp = (px, py) => [x + f * (px * cl - py * sl) * u, y + (hipY + px * sl + py * cl) * u];
  const limb = (a, b, wa, wb, col, sw = SW) => { const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
    paint([[a[0] + nx * wa * u + jit(J), a[1] + ny * wa * u + jit(J)], [b[0] + nx * wb * u, b[1] + ny * wb * u], [b[0] - nx * wb * u, b[1] - ny * wb * u], [a[0] - nx * wa * u + jit(J), a[1] - ny * wa * u + jit(J)]], { wash: col, ink, sw }); };
  const seg2 = (px, py, len, ang) => [px + Math.sin(ang) * len, py + Math.cos(ang) * len];
  const leg = (ang, knee, far) => { const k = seg2(0, 0, 7.5, ang), ft = seg2(k[0], k[1], 7.5, ang - knee); limb(Wp(0, 0), Wp(...k), 1.7, 1.4, far ? mixCol(legC, PAL.paper, mono ? 0 : .22) : legC); limb(Wp(...k), Wp(...ft), 1.4, 1.1, far ? mixCol(legC, PAL.paper, mono ? 0 : .22) : legC);
    const toe = seg2(ft[0], ft[1], 2.6, ang - knee + 1.45); limb(Wp(...ft), Wp(...toe), 1.25, 1.0, shoe, SW * .9); };
  const arm = (ang, far) => { const sh = [0, -11.5], el = seg2(sh[0], sh[1], 5.6, ang * .8), hd = seg2(el[0], el[1], 5.6, ang * 1.15); limb(Wp(...sh), Wp(...el), 1.5, 1.2, far ? mixCol(hood, ink, mono ? 0 : .25) : hood); limb(Wp(...el), Wp(...hd), 1.2, 1.0, far ? mixCol(hood, ink, mono ? 0 : .25) : hood);
    paint(ellPts(...Wp(...hd), u * 1.15, u * 1.15, 10), { wash: skin, ink, sw: SW * .8 }); return Wp(...hd); };
  if (o.shadow && !mono) paint(ellPts(x, y + .1 * u, 6 * u, .7 * u, 14), { wash: ink, ink: null });
  arm(bArm, true); leg(bLeg, kB, true); leg(aLeg, kA, false);
  // hoodie torso
  const t0 = Wp(-2.6, .6), t1 = Wp(2.6, .6), t2 = Wp(2.9, -12.6), t3 = Wp(-2.9, -12.6);
  paint([t0, t1, t2, Wp(0, -13.6), t3].map(p => [p[0] + jit(J), p[1] + jit(J)]), { wash: hood, ink, sw: SW });
  // head: round, a scribble of hair, one face
  const hc = Wp(.5, -16.6), hr = 3.3 * u, face = o.face || 'calm';
  paint(ellPts(hc[0], hc[1], hr, hr * 1.05, 16, J), { wash: skin, ink, sw: SW });
  const hp = (px, py) => Wp(.5 + px, -16.6 + py);
  paint([hp(-3.5, -.2), hp(-3.3, -2.6), hp(-1.4, -4.1), hp(1.4, -4.0), hp(3.2, -2.4), hp(1.6, -2.3), hp(.4, -3.0), hp(-1.4, -2.2), hp(-2.4, -.4)], { wash: mono ? PAL.ink : PAL.oxblood, ink, sw: SW * .8 });
  const eye = (ex, ey) => { const p = hp(ex, ey);
    if (face === 'dead') { const r = u * .6; inkLine([[p[0] - r, p[1] - r], [p[0] + r, p[1] + r]], SW * .6, ink, 'ink', 0); inkLine([[p[0] - r, p[1] + r], [p[0] + r, p[1] - r]], SW * .6, ink, 'ink', 0); }
    else if (face === 'sleep') inkLine([[p[0] - u * .6, p[1]], [p[0], p[1] + u * .3], [p[0] + u * .6, p[1]]], SW * .6, ink, 'ink', .6);
    else if (face === 'panic') { paint(ellPts(p[0], p[1], u * .85, u * .95, 10), { wash: PAL.white, ink, sw: SW * .5 }); paint(ellPts(p[0] + f * u * .2, p[1], u * .25, u * .25, 6), { wash: ink, ink: null }); }
    else paint(ellPts(p[0], p[1], u * .34, u * .42, 8), { wash: ink, ink: null }); };
  eye(.9, -.3); eye(2.5, -.3);
  const m = hp(1.8, 1.5);
  if (face === 'panic') paint(ellPts(m[0], m[1], u * .9, u * 1.05, 10), { wash: mono ? ink : PAL.oxblood, ink, sw: SW * .5 });
  else if (face === 'dead' || face === 'sleep') inkLine([hp(1.0, 1.6), hp(1.8, 1.3), hp(2.6, 1.7)], SW * .6, ink, 'ink', .6);
  else inkLine([hp(1.1, 1.4), hp(2.5, 1.5)], SW * .6, ink, 'ink', 0);
  if (face === 'panic' && !mono) for (let i = 0; i < 2; i++) { const p = hp(-2.6 - i * 1.5, -2.5 + i * 1.6 + Math.sin(T * 14 + i) * .4); paint([[p[0], p[1] - u * .9], [p[0] + u * .5, p[1] + u * .3], [p[0], p[1] + u * .7], [p[0] - u * .5, p[1] + u * .3]], { wash: PAL.blue, ink, sw: SW * .4 }); }
  return arm(aArm, false);
}

// ---------- squirrel insurgent ---------- about 7u tall, faces +x; o.run (phase) stretches it into a bound; o.helmet.
function squirrel(x, y, u, o = {}) {
  const SW = clamp(u / 14, .5, 2.4), ink = PAL.ink, col = o.mono ? PAL.white : (o.col || PAL.oxblood), J = u * .03, S = pts => pts.map(p => [p[0] * u + jit(J), p[1] * u + jit(J)]);
  const st = o.run != null ? Math.sin(o.run * TAU) : 0, hop = o.run != null ? Math.abs(Math.sin(o.run * Math.PI)) * 2.2 : 0;
  push(); translate(x, y - hop * u); if (o.flip) scale(-1, 1); rotate(-st * .18);
  paint(S([[-2.2, -1.5], [-4.6, -2.6], [-5.8, -5.6], [-4.6, -8.3], [-2.4, -8.6], [-3.4, -6.6], [-3.0, -4.3], [-1.6, -3.0]]), { wash: col, ink, sw: SW, curv: .35 });   // tail
  paint(S([[-2.4, 0], [-2.6, -2.6], [-1.2, -4.6], [1.2, -4.9], [2.3, -3.2], [2.2, -1.0], [1.4, 0]]), { wash: col, ink, sw: SW, curv: .3 });
  paint(S([[.2, -.4], [.4, -2.6], [1.6, -3.2], [2.0, -1.2], [1.3, -.2]]), { wash: o.mono ? PAL.white : PAL.paper, ink: null });
  paint(S([[1.4, -1.6], [3.2 + st * .8, -1.8], [3.4 + st * .8, -1.0], [1.6, -.9]]), { wash: col, ink, sw: SW * .7 }); paint(S([[-1.6, 0], [1.0 - st, 0], [1.2 - st, -.7], [-1.4, -.9]]), { wash: col, ink, sw: SW * .7 });
  paint(S([[.6, -4.4], [.4, -6.6], [2.0, -7.7], [3.6, -7.0], [4.3, -5.6], [3.2, -4.4], [1.6, -4.0]]), { wash: col, ink, sw: SW, curv: .3 });   // head
  paint(S([[.9, -7.0], [.9, -8.6], [2.0, -7.6]]), { wash: col, ink, sw: SW * .8 });
  if (o.helmet !== false) paint(S([[.2, -6.4], [.6, -7.9], [2.2, -8.5], [3.6, -7.7], [4.0, -6.5]]), { wash: o.mono ? PAL.white : PAL.sage, ink, sw: SW * .9, curv: .3 });
  paint(ellPts(2.9 * u, -5.9 * u, u * .32, u * .38, 8), { wash: ink, ink: null }); paint(ellPts(4.2 * u, -5.4 * u, u * .26, u * .22, 6), { wash: ink, ink: null });
  pop();
}

// ---------- cat sniper ---------- a sitting silhouette, about 10u tall, with two lit eyes. o.eyes 0..1 opens them; o.col.
function cat(x, y, u, o = {}) {
  const col = o.col || PAL.ink, SW = clamp(u / 14, .5, 2.4), J = u * .03, S = pts => pts.map(p => [p[0] * u + jit(J), p[1] * u + jit(J)]), e = o.eyes ?? 1;
  push(); translate(x, y); if (o.flip) scale(-1, 1);
  paint(S([[-2.6, 0], [-5.6, -.6], [-6.6, -3.0], [-5.6, -5.0], [-5.0, -3.2], [-3.2, -2.0]]), { wash: col, ink: o.ink ?? null, sw: SW, curv: .4 });
  paint(S([[-3.0, 0], [-3.2, -3.6], [-1.8, -6.4], [-2.6, -8.4], [-2.3, -10.6], [-1.0, -9.3], [1.0, -9.3], [2.3, -10.6], [2.6, -8.4], [1.8, -6.2], [3.0, -3.2], [3.0, 0]]), { wash: col, ink: o.ink ?? null, sw: SW });
  if (e > .05) for (const s of [1, -1]) { paint([[s * 1.15 * u - .7 * u, -7.9 * u], [s * 1.15 * u, (-7.9 - .45 * e) * u], [s * 1.15 * u + .7 * u, -7.9 * u], [s * 1.15 * u, (-7.9 + .45 * e) * u]], { wash: o.eyeCol || PAL.lime, ink: null }); paint(rectPts(s * 1.15 * u - .08 * u, (-7.9 - .35 * e) * u, .16 * u, .7 * e * u), { wash: PAL.ink, ink: null }); }
  pop();
}

// ---------- crow officer ---------- about 6u long, faces +x. o.caw 0..1 opens the beak, o.flap (phase) spreads wings.
function crow(x, y, u, o = {}) {
  const ink = PAL.ink, SW = clamp(u / 14, .5, 2.2), J = u * .03, S = pts => pts.map(p => [p[0] * u + jit(J), p[1] * u + jit(J)]), caw = o.caw || 0;
  push(); translate(x, y); if (o.flip) scale(-1, 1); rotate(-caw * .22);
  paint(S([[-4.6, -1.2], [-2.6, -3.4], [.4, -4.2], [1.4, -6.2], [3.0, -6.6], [3.9, -5.4], [3.2, -3.6], [2.0, -1.2], [-.6, -.3], [-3.0, -.6], [-5.8, .6]]), { wash: o.col || ink, ink: o.col ? ink : null, sw: SW, curv: .25 });
  paint(S([[3.6, -5.9], [6.0, -5.6 - caw * .9], [3.7, -5.0]]), { wash: o.mono ? PAL.white : PAL.orange, ink, sw: SW * .6 }); paint(S([[3.6, -5.1], [5.6, -4.8 + caw * .9], [3.4, -4.5]]), { wash: o.mono ? PAL.white : PAL.orange, ink, sw: SW * .6 });
  paint(ellPts(2.9 * u, -5.5 * u, u * .3, u * .3, 7), { wash: PAL.paper, ink: null });
  if (o.flap != null) { const a = Math.sin(o.flap * TAU); paint(S([[-2.2, -3.0], [-1.0, -3.6 - a * 5.5], [1.0, -3.2 - a * 4], [.8, -2.6]]), { wash: o.col || ink, ink: o.col ? ink : null, sw: SW }); }
  for (const lx of [-.6, .6]) inkLine(S([[lx, -.5], [lx + .2, 1.0]]), SW * .5, o.legCol || ink, 'inkfine', 0);
  if (o.cap) paint(S([[1.0, -6.3], [1.6, -7.5], [3.2, -7.7], [4.6, -6.6], [3.0, -6.5]]), { wash: PAL.lime, ink, sw: SW * .7 });
  pop();
}

// ---------- hydrant checkpoint ---------- about 11u tall, (x, y) = base centre.
function hydrant(x, y, u, o = {}) {
  const col = o.mono ? PAL.white : (o.col || PAL.oxblood), ink = PAL.ink, SW = clamp(u / 12, .5, 3), J = u * .03, S = pts => pts.map(p => [x + p[0] * u + jit(J), y + p[1] * u + jit(J)]);
  if (o.shadow !== false && !o.mono) paint(ellPts(x, y + .1 * u, 4.6 * u, .6 * u, 14), { wash: ink, ink: null });
  paint(S([[-3.4, 0], [-3.4, -1.1], [3.4, -1.1], [3.4, 0]]), { wash: col, ink, sw: SW });
  for (const s of [1, -1]) paint(S([[s * 2.2, -5.9], [s * 3.9, -5.9], [s * 3.9, -4.1], [s * 2.2, -4.1]]), { wash: col, ink, sw: SW });
  paint(S([[-2.4, -1.1], [-2.4, -7.4], [2.4, -7.4], [2.4, -1.1]]), { wash: col, ink, sw: SW });
  paint(S([[-2.9, -7.4], [-2.6, -8.6], [-1.4, -9.9], [0, -10.3], [1.4, -9.9], [2.6, -8.6], [2.9, -7.4]]), { wash: col, ink, sw: SW });
  paint(S([[-.6, -10.3], [-.6, -11.2], [.6, -11.2], [.6, -10.3]]), { wash: col, ink, sw: SW * .8 });
  paint(ellPts(x, y - 5 * u, u * 1.0, u * 1.0, 10), { wash: o.mono ? PAL.white : PAL.paper, ink, sw: SW * .7 });
  if (!o.mono) paint(S([[-2.0, -1.5], [-2.0, -7.0], [-1.3, -7.0], [-1.3, -1.5]]), { wash: mixCol(col, PAL.paper, .35), ink: null });
}

// ---------- the pup on the left ---------- small white dog, about 8u tall, faces +x. o.puff 0..1 inflates the chest,
// o.tuck 0..1 tucks the tail and flattens the ears, o.face 'cocky' | 'scared'.
function pup(x, y, u, o = {}) {
  const ink = PAL.ink, SW = clamp(u / 14, .5, 2.6), J = u * .03, S = pts => pts.map(p => [p[0] * u + jit(J), p[1] * u + jit(J)]), pf = o.puff || 0, tk = o.tuck || 0, col = o.mono ? PAL.white : PAL.paper, spot = o.mono ? PAL.ink : (o.spot || PAL.violet);
  push(); translate(x, y); if (o.flip) scale(-1, 1);
  if (o.shadow !== false && !o.mono) paint(ellPts(0, .1 * u, 4.6 * u, .5 * u, 14), { wash: ink, ink: null });
  inkLine(S(tk > .5 ? [[-3.6, -4.2], [-4.2, -2.4], [-3.4, -1.2]] : [[-3.6, -4.6], [-4.8, -6.6], [-4.4, -8.0 + tk * 2]]), SW * 1.3, ink, 'ink', .6);
  for (const lx of [-2.8, -1.6, 1.6, 2.8]) paint(S([[lx - .5, -2.2], [lx + .5, -2.2], [lx + .6, 0], [lx - .6, 0]]), { wash: col, ink, sw: SW * .8 });
  paint(S([[-3.8, -4.8], [-3.6, -2.2], [0, -1.8 + pf * .2], [2.6, -1.9], [3.9 + pf * 1.9, -3.6 - pf * .6], [3.6 + pf * 1.2, -5.8 - pf * 1.2], [.4, -5.6], [-2.4, -5.6]]), { wash: col, ink, sw: SW, curv: .3 });
  paint(S([[-2.6, -5.5], [-.6, -5.5], [-.4, -3.8], [-2.2, -3.4]]), { wash: spot, ink: null });
  const hy = -7.6 - pf * 1.3 + tk * 1.2, hx = 3.4 + pf * .5 - tk * .6;
  paint(S([[hx - 2.2, hy + 1.4], [hx - 2.3, hy - 1.0], [hx - .6, hy - 2.1], [hx + 1.4, hy - 1.6], [hx + 3.2, hy - .2], [hx + 3.3, hy + .9], [hx + 1.0, hy + 1.8]]), { wash: col, ink, sw: SW, curv: .25 });
  paint(S([[hx - 1.9, hy - 1.4], [hx - 2.9, hy + .6 + tk], [hx - 1.6, hy + .9 + tk], [hx - .7, hy - 1.8]]), { wash: spot, ink, sw: SW * .8 });
  paint(ellPts((hx + .9) * u, (hy - .3) * u, u * (o.face === 'scared' ? .5 : .3), u * (o.face === 'scared' ? .6 : .36), 8), { wash: o.face === 'scared' ? PAL.white : ink, ink: o.face === 'scared' ? ink : null, sw: SW * .5 });
  if (o.face === 'scared') paint(ellPts((hx + 1.0) * u, (hy - .3) * u, u * .16, u * .16, 6), { wash: ink, ink: null });
  else paint(S([[hx + .2, hy - 1.2], [hx + 1.7, hy - .85], [hx + 1.7, hy - .6], [hx + .2, hy - .8]]), { wash: ink, ink: null });   // cocky brow
  paint(ellPts((hx + 3.2) * u, (hy + .2) * u, u * .38, u * .3, 7), { wash: ink, ink: null });
  inkLine(S(o.face === 'scared' ? [[hx + 1.4, hy + 1.3], [hx + 2.2, hy + 1.0], [hx + 2.9, hy + 1.3]] : [[hx + 1.4, hy + 1.0], [hx + 2.3, hy + 1.3], [hx + 3.0, hy + .9]]), SW * .6, ink, 'ink', .6);
  pop();
}
