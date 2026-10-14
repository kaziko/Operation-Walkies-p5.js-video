// c05_breakdown.js: Double-time breakdown (bars 28-37). The fastest, most typographic part: one idea per half bar,
// the palette flips on every idea. The lyric claims explosive speed and violence; Jun Jun is cut in as held, rigid,
// deadpan poses while the lettering, the streaks and every other animal go wild.
(() => {
  const GY = 940;                                    // ground line for full-body shots
  // stable per-letter jitter, held for 1/r s (so type "boils" on twos)
  const jig = (i, t, r = 12) => hash(i * 7.31 + Math.floor(t * r) * 3.17) - .5;
  const rattle = (t, amt, r = 12) => i => ({ dx: jig(i, t, r) * amt, dy: jig(i + 40, t, r) * amt * 1.5, rot: jig(i + 80, t, r) * amt * 2.6 });

  // ---------- private props ----------
  // A generic mutt in flat silhouette, faces +x; (x, y) = ground under the body. About (legs + 8.4)u tall, 13u long.
  // o: col, line (detail colour), legs (length), snout, ear ('up' | 'flop'), fat, tail (-1..1), run (gallop phase),
  // bark 0..1, eye ('dot' | 'wide'), tongue, hop, flip. Returns the muzzle point (world).
  function mutt(x, y, u, o = {}) {
    const col = o.col || PAL.ink, L = o.legs ?? 4.6, sn = o.snout ?? 2.6, bk = o.bark || 0, J = u * .03, f = o.flip ? -1 : 1;
    const S = pts => pts.map(p => [p[0] * u + jit(J), p[1] * u + jit(J)]), by = -L, hy0 = by - 6.9, run = o.run;
    const th = run == null ? 0 : Math.sin(run * TAU), air = run == null ? (o.hop || 0) : Math.max(0, th) * 1.0 + .25, fat = o.fat || 0;
    push(); translate(x, y - air * u); if (o.flip) scale(-1, 1); if (run != null) rotate(Math.cos(run * TAU) * .07);
    const leg = (hx, a) => { const fx = hx + Math.sin(a) * L, fy = by + Math.cos(a) * L; paint(S([[hx - 1.0, by - 1.2], [hx + 1.0, by - 1.2], [fx + .5, fy - .7], [fx + 1.35, fy], [fx - .45, fy]]), { wash: col, ink: null }); };
    leg(-4.3, -th * 1.05 - .14); leg(-3.4, -th * 1.05 + .08); leg(2.9, th * 1.05 - .08); leg(3.8, th * 1.05 + .14);
    const tl = o.tail ?? .6;
    paint(S([[-4.8, by - 3.5], [-5.5, by - 2.3], [-7.8, by - 4.2 - tl * 2.4], [-7.2, by - 5.0 - tl * 2.4]]), { wash: col, ink: null });
    paint(S([[-5.3, by - .9], [-5.7, by - 2.7], [-4.6, by - 3.9], [0, by - 3.7], [3.4, by - 4.4], [4.9, by - 2.8], [4.3, by + .2 + fat * .4], [1, by - .1 + fat], [-3, by - 1.1 + fat * 1.6]]), { wash: col, ink: null, curv: .3 });
    paint(S([[2.2, by - 3.6], [3.3, hy0 - .4], [3.9, hy0 - 1.4], [5.0, hy0 - 1.7], [6.2, hy0 - 1.1], [6.9, hy0 - .35], [6.8 + sn, hy0 - .1], [7.2 + sn, hy0 + .3], [7.0 + sn, hy0 + .7], [5.8, hy0 + .95], [4.9, by - 2.4]]), { wash: col, ink: null });
    const jaw = rotPts([[4.9, hy0 + .5], [6.6 + sn * .9, hy0 + .85], [6.5 + sn * .9, hy0 + 1.4], [4.9, hy0 + 1.8]], bk * .5, 5.0, hy0 + 1.0);
    if (bk > .1) paint(S([[5.3, hy0 + .7], [6.8 + sn, hy0 + .55], jaw[1]]), { wash: o.mouth || PAL.oxblood, ink: null });
    if (o.tongue) paint(S([[5.6 + sn * .5, hy0 + 1.0], [6.5 + sn * .5, hy0 + 1.2], [4.4 + sn * .5, hy0 + 3.0 + th * .5], [3.9 + sn * .5, hy0 + 2.4 + th * .5]]), { wash: PAL.pink, ink: PAL.ink, sw: clamp(u / 30, .4, 1.2) });
    paint(S(jaw), { wash: col, ink: null });
    const fl = run == null ? 0 : .5 + th * .5;                                   // a flop ear streams back at a gallop
    if (o.ear === 'flop') paint(S([[3.6, hy0 - 1.3], [4.7, hy0 - 1.2], [4.5 - fl * 1.2, hy0 + .7 - fl * .9], [3.5 - fl * 2.6, hy0 + 2.3 - fl * 2.4], [2.6 - fl * 2.4, hy0 + 1.6 - fl * 2.2], [2.9 - fl, hy0 - .1 - fl * .4]]), { wash: mixCol(col, PAL.paper, .3), ink: null });
    else paint(S([[3.6, hy0 - .3], [3.5, hy0 - 3.1], [5.1, hy0 - 1.3]]), { wash: col, ink: null });
    const wide = o.eye === 'wide';
    paint(ellPts(5.4 * u, (hy0 - .1) * u, u * (wide ? .68 : .3), u * (wide ? .74 : .34), 10), { wash: PAL.white, ink: null });
    if (wide) paint(ellPts(5.6 * u, (hy0 - .1) * u, u * .22, u * .22, 6), { wash: PAL.ink, ink: null });
    pop();
    return [x + f * (6.2 + sn * .55) * u, y - air * u + (hy0 + .75) * u];
  }
  // a strip of tape slapped on (2D)
  function tape(x, y, w, h, rot, k, txt) {
    if (k <= 0) return;
    const c = g2d(); c.save(); c.translate(x, y); c.rotate(rot); c.scale(k, k);
    c.beginPath(); c.moveTo(-w / 2, -h / 2); c.lineTo(w / 2, -h / 2); for (let i = 1; i <= 4; i++) c.lineTo(w / 2 + (i % 2 ? h * .16 : 0), -h / 2 + i / 4 * h);
    c.lineTo(-w / 2, h / 2); for (let i = 1; i <= 4; i++) c.lineTo(-w / 2 - (i % 2 ? h * .16 : 0), h / 2 - i / 4 * h); c.closePath();
    c.fillStyle = PAL.lime; c.fill(); c.lineWidth = Math.max(4, h * .1); c.lineJoin = 'round'; c.strokeStyle = PAL.ink; c.stroke();
    c.fillStyle = PAL.ink; c.font = `400 ${h * .72}px ${FONT.hero}`; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.fillText(txt, 0, CAP.hero * h * .72 / 2);
    c.restore();
  }
  // A gnawed bone, drawn along +x around the origin: knob on the left, splintered to a point on the right.
  // cut = where the shaft breaks (fraction of len from the centre), bw = shaft half-width.
  function shardPts(len, cut, bw) {
    const a = len / 2, r = bw * 1.5, pts = [[cut * len, -bw], [a, -bw * .25], [(cut + .14) * len, bw * .1], [(cut + .24) * len, bw * .8], [(cut - .02) * len, bw]];
    const lobe = (cx, cy, a0) => { for (let i = 0; i <= 6; i++) { const q = a0 + i / 6 * Math.PI * 1.25; pts.push([cx + Math.cos(q) * r, cy + Math.sin(q) * r]); } };
    lobe(-a + r * .6, bw * 1.05, Math.PI * .25); lobe(-a + r * .6, -bw * 1.05, Math.PI * .5);
    return pts;
  }
  // four-point gleam (2D)
  function gleam(x, y, r, rot, col = PAL.white) {
    if (r <= 0) return; const pts = [];
    for (let i = 0; i < 8; i++) { const q = rot + i / 8 * TAU, rr = i % 2 ? r * .13 : r * (i % 4 ? .62 : 1); pts.push([x + Math.cos(q) * rr, y + Math.sin(q) * rr]); }
    poly2(pts, col, { stroke: PAL.ink, lw: 6, join: 'round' });
  }
  // Draw 2D-layer content (no brush calls inside fn) on one side of the line (x0, y0) → (x1, y1) only. side = ±1.
  function clipSide(x0, y0, x1, y1, side, fn) {
    const c = g2d(), dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L * 5000, uy = dy / L * 5000, nx = -dy / L * 5000 * side, ny = dx / L * 5000 * side;
    c.save(); c.beginPath(); c.moveTo(x0 - ux, y0 - uy); c.lineTo(x1 + ux, y1 + uy); c.lineTo(x1 + ux + nx, y1 + uy + ny); c.lineTo(x0 - ux + nx, y0 - uy + ny); c.closePath(); c.clip();
    fn(); c.restore();
  }
  // a word cut in two along a line: the halves part by `gap` and slide along the cut by `slide`
  function splitType(txt, x, y, size, o, ln, gap, slide = 0) {
    const [x0, y0, x1, y1] = ln, L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
    for (const sd of [1, -1]) { const ox = (-uy * gap + ux * slide) * sd, oy = (ux * gap + uy * slide) * sd; clipSide(x0 + ox, y0 + oy, x1 + ox, y1 + oy, sd, () => type(txt, x + ox, y + oy, size, o)); }
  }
  // paper boat, drawn at the origin (keel centre on the waterline); part 0 = sail, 1 = hull (the passenger goes between)
  function boat(s, part) {
    const P = pts => pts.map(p => [p[0] * s + jit(s * .02), p[1] * s + jit(s * .02)]), sw = clamp(s / 22, 1, 3.2);
    if (!part) { paint(P([[-2.3, -1.7], [0, -5.8], [2.3, -1.7]]), { wash: PAL.white, ink: PAL.ink, sw }); inkLine(P([[0, -5.5], [0, -1.8]]), sw * .5, PAL.ink, 'inkfine', 0); }
    else { paint(P([[-6.2, -2.7], [-2.3, -1.8], [2.3, -1.8], [6.2, -2.7], [3.6, .9], [-3.6, .9]]), { wash: PAL.white, ink: PAL.ink, sw }); inkLine(P([[-2.3, -1.7], [0, .8], [2.3, -1.7]]), sw * .5, PAL.ink, 'inkfine', 0); }
  }
  // a flat sea with a scalloped, crested top edge (2D)
  function sea(yTop, ph, col) {
    const pts = []; for (let x = -500; x <= W + 500; x += 48) pts.push([x, yTop + Math.sin(x * .011 + ph) * 22 + Math.sin(x * .027 - ph * 1.6) * 10]);
    poly2(pts.concat([[W + 500, H + 600], [-500, H + 600]]), col);
    const c = g2d(); c.strokeStyle = PAL.white; c.lineWidth = 12; c.lineJoin = 'round'; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
    c.strokeStyle = PAL.ink; c.lineWidth = 5; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1] - 9) : c.moveTo(p[0], p[1] - 9)); c.stroke();
  }
  // hand-lettered words that pop in on their vocal times, set left to right from x
  function handRow(t, words, x, y, size, o = {}) {
    words.reduce((px, [w, tw]) => { if (t > tw) type(w, px, y, size, { font: 'hand', col: PAL.ink, align: 'left', k: popIn(t - tw, .1), rot: -.02, wear: 0, ...o }); return px + typeW(w, size, { font: 'hand' }) + size * .34; }, x);
  }

  // ---------- bar 28a · "Bark, bark, barkin'" · one held bark pose, three slams, each bigger ----------
  function barks(t, lt, dur) {
    const t1 = barT(28) - .07, t2 = 76.88, t3 = 77.08, hx = 1350, hy = 450, u = 52, pose = { ...EXPR.bark, look: [-.15, 0] };
    if (t < t3) {
      const two = t >= t2, s1 = slam(t - t1, .12), s2 = slam(t - t2, .1), [sx, sy] = shakeXY(t, (s1.shake + s2.shake) * 24, 24);
      bg(two ? PAL.ink : PAL.orange);
      camBegin(960 + sx, 540 + sy, 1 + lt * .05, 0);
      halftone(-100, 560, W + 200, 640, { cell: 24, col: two ? PAL.orange : PAL.ink, grad: [0, 600, 0, 1200], alpha: two ? .9 : .42 });
      type('BARK', 420, 240, fitSize('BARK', 640), { col: two ? PAL.orange : PAL.paper, k: s1.k, alpha: s1.alpha, rot: -.05, shadow: two ? null : { col: PAL.ink, dx: .02, dy: .024 }, seed: 3 });
      if (two) type('BARK', 520, 700, fitSize('BARK', 930), { col: PAL.lime, k: s2.k, alpha: s2.alpha, rot: .03, seed: 5 });
      junjunBust(hx, hy, u, pose);
      camEnd();
    } else {
      // impact frame 1 of 2: the same pose, in black and white
      const a = t - t3, [sx, sy] = shakeXY(t, 50 * Math.exp(-a * 4) + 5, 24), s = slam(a - .02, .1), inv = a > .3 && a < .38;
      camBegin(960 + sx, 540 + sy, 1.1 - .1 * easeOut(a / .4), jig(1, t, 24) * .05 * Math.exp(-a * 5));
      impactFrame(hx - 80, hy + 60, a, { accent: PAL.orange, dark: inv ? PAL.white : PAL.ink, light: inv ? PAL.ink : PAL.white, seed: 21, size: 1.05 });
      type('ワン！', 380, 270, 250, { font: 'jp', col: PAL.orange, stroke: PAL.ink, strokeW: .04, rot: -.1, k: slam(a - .06, .1).k, alpha: clamp((a - .06) / .04), wear: .15 });
      junjunBust(hx, hy, u, { ...pose, mono: true, sx: 1 + Math.exp(-a * 14) * .08, sy: 1 + Math.exp(-a * 14) * .08 });
      type('BARK', 600, 850, fitSize('BARK', 1130), { col: PAL.white, stroke: PAL.ink, strokeW: .06, k: s.k, alpha: s.alpha, rot: -.025, per: rattle(t, .03 * Math.exp(-a * 3) + .006), wear: .2, seed: 7 });
      camEnd();
      flash(1 - a / .08, PAL.white);
    }
  }

  // ---------- bar 28b · "like a full-on riot" · everyone riots; she sits ----------
  function riot(t, lt, dur) {
    const tR = 78.2, a = t - tR, on = a >= 0, s = slam(a, .1), [sx, sy] = shakeXY(t, s.shake * 28 + (on ? 5 : 0), 12);
    const hop = (i, f = 2) => on ? Math.abs(Math.sin((bp(t) * f + hash(i)) * Math.PI)) : 0;
    bg(PAL.oxblood);
    camBegin(960 + sx, 540 + sy, 1 + lt * .03 + (on ? pulse2(t, 8) * .014 : 0), 0);
    speedLines(960, 600, { n: on ? 80 : 26, r0: 760, r1: 1700, col: PAL.ink, boil: true, boilRate: 12, w: [.004, .03] });
    type('RIOT', 960, 380, fitSize('RIOT', 1640), { col: PAL.paper, k: s.k, alpha: s.alpha, shadow: { col: PAL.ink, dx: .02, dy: .024 }, per: rattle(t, .014), seed: 7 });
    if (on) for (let i = 0; i < 3; i++) splat([230, 1720, 1560][i], [640, 170, 760][i], [70, 54, 44][i], { col: PAL.lime, seed: i + 3, k: easeOut((a - i * .05) / .1), drops: 9 });
    if (on) handRow(t, [['LIKE A', 77.4], ['FULL-ON', 77.78]], 80, 84, 96, { col: PAL.lime });
    else { type('LIKE A', 520, 170, 130, { font: 'hand', col: PAL.paper, rot: -.06, wear: .1 }); type('FULL-ON', 960, 400, 380, { font: 'hand', col: PAL.lime, rot: -.05, k: popIn(lt + .04, .1) * (1 + lt * .25), per: rattle(t, .012), wear: .2 }); }
    // the insurgency: squirrels bounce through, crows flap, the small dogs lose their minds
    for (let i = 0; i < 4; i++) {
      const p = frac((on ? a : 0) * .75 + i * .27 + .1), dir = i % 2 ? -1 : 1, x = dir > 0 ? lerp(-140, 2060, p) : lerp(2060, -140, p), y = 930 - Math.abs(Math.sin(p * Math.PI * 3 + i)) * (300 + i * 90);
      if (on) squirrel(x, y, 17, { run: p * 6, flip: dir < 0 });
    }
    crow(210 + jig(1, t) * (on ? 40 : 0), 330 - hop(7) * 60, 26, { caw: on ? 1 : 0, flap: on ? t * 5 : null });
    crow(1730 + jig(2, t) * (on ? 40 : 0), 420 - hop(8) * 60, 24, { flip: true, caw: on ? 1 : 0, flap: on ? t * 5 + .4 : null, cap: true });
    junjunSit(960, 1215, 27, { ...EXPR.deadpan, lid: Math.max(.58, blink(t, 5)) });
    yorkie(300, 1030, 30, { bark: hop(1) > .4 ? 1 : 0, hop: hop(1) * 5 });
    push(); translate(1640, 1030 - hop(3) * 110); rotate(on ? jig(5, t) * .5 : 0); pup(0, 0, 31, { flip: true, puff: on ? .8 : 0, shadow: false }); pop();
    camEnd();
  }

  // ---------- bar 29 · "Every mutt in the cut better keep it quiet" ----------
  function quiet(t, lt, dur) {
    const tQ = 80.78, taps = [79.72, 80.02, 80.3], sq = slam(t - tQ, .1);
    const [sx, sy] = shakeXY(t, sq.shake * 24 + taps.reduce((p, tw) => p + hit(t, tw, 16), 0) * 9, 24);
    bg(PAL.paper);
    camBegin(960 + sx - (1 - easeOut5(lt / .18)) * 500, 540 + sy, 1, 0);
    halftone(-300, 500, W + 600, 700, { cell: 24, col: PAL.orange, grad: [0, 540, 0, 1150], alpha: .85 });
    dryStroke(-500, GY + 62, 2500, GY + 50, 150, PAL.ink, { seed: 8 });
    handRow(t, [['EVERY', 78.9], ['MUTT', 79.02], ['IN THE', 79.42], ['CUT', 79.72]], 80, 66, 80);
    if (sq.alpha > 0) type('QUIET', 610, 292, fitSize('QUIET', 900), { col: PAL.orange, k: sq.k, alpha: sq.alpha, rot: -.03, shadow: { col: PAL.ink, dx: .02, dy: .024 }, seed: 4 });
    [[185, 37, { legs: 5.4, snout: 3.2, ear: 'flop' }], [580, 35, { legs: 2.5, snout: 1.7, col: PAL.oxblood }], [935, 33, { legs: 6.0, snout: 2.6 }]].map(([x, u, v], i) => {
      const shut = t >= taps[i], yap = !shut && hash(i * 3.3 + Math.floor(t * 10)) > .42 ? 1 : 0;
      const m = mutt(x, GY + 8, u, { ...v, bark: yap, eye: shut ? 'wide' : 'dot', hop: yap * .5, tail: shut ? -.9 : .8, mouth: PAL.pink });
      if (yap) for (let j = 0; j < 3; j++) { const q = -.75 + j * .5; inkLine([[m[0] + u * 2.4 + Math.cos(q) * u * 1.2, m[1] + Math.sin(q) * u * 1.2], [m[0] + u * 2.4 + Math.cos(q) * u * 3.6, m[1] + Math.sin(q) * u * 3.6]], 2, PAL.ink, 'ink', 0); }
      return [m, u];
    }).forEach(([m, u], i) => tape(m[0] + u * .9, m[1] + u * .1, u * 5.6, u * 1.9, [-.2, .14, -.12][i], popIn(t - taps[i], .09), 'QUIET'));
    junjunBust(1672, 560, 48, { ...EXPR.sideEye, look: [-.95, .12], lid: t < 80.6 ? .5 : .62, brow: t < 80.6 ? .6 : .8 });
    camEnd();
  }

  // ---------- bar 30a · "Leash tight, but I still might…" ----------
  function leash(t, lt, dur) {
    const tT = 81.66, sL = slam(lt + .05, .1), sT = slam(t - tT, .1), tw = hit(t, tT, 4), [sx, sy] = shakeXY(t, (sL.shake + sT.shake) * 16, 24);
    const u = 34, dx = 1420, ring = [dx + 2.8 * u, GY - 13.85 * u], far = [-300, 40], ang = Math.atan2(ring[1] - far[1], ring[0] - far[0]);
    bg(PAL.pink);
    camBegin(960 + sx, 540 + sy, 1 + lt * .04, 0);
    halftone(-200, 560, W + 400, 640, { cell: 24, col: PAL.paper, grad: [0, 600, 0, 1200], alpha: .9 });
    dryStroke(-500, GY + 66, 2500, GY + 52, 150, PAL.ink, { seed: 14 });
    type('LEASH', 520, 118, 150, { font: 'hand', col: PAL.ink, rot: ang, k: sL.k, alpha: sL.alpha, wear: .15 });
    type('TIGHT', 540, 640, 380, { col: PAL.ink, rot: ang, k: sT.k, alpha: sT.alpha, track: lerp(0, .1, easeOut(seg(t, tT + .1, tT + .7))), per: i => ({ dy: jig(i, t, 24) * .05 * tw }), seed: 6 });
    // the lead: a plucked string across the whole frame
    { const c = g2d(), amp = 4 + tw * 30, sgn = Math.floor(t * 24) % 2 ? 1 : -1, P = (q, d) => [lerp(far[0], ring[0], q) - Math.sin(ang) * d, lerp(far[1], ring[1], q) + Math.cos(ang) * d];
      const path = (k) => { c.beginPath(); for (let i = 0; i <= 30; i++) { const p = P(i / 30, Math.sin(i / 30 * Math.PI * 3) * amp * k); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.stroke(); };
      c.lineCap = 'round'; c.lineJoin = 'round';
      c.strokeStyle = PAL.ink; c.lineWidth = 4; path(-sgn * 1.5); path(sgn * 2.1);
      c.lineWidth = 38; path(sgn); c.strokeStyle = PAL.lime; c.lineWidth = 22; path(sgn); }
    junjunSide(dx, GY, u, { ...EXPR.deadpan, look: [.2, 0], lid: .46, shadowOp: 0 });
    vibLines(ring[0], ring[1], 70, 70, .4 + tw, { n: 7, arc: [Math.PI * .9, Math.PI * 1.9], seed: 4 });
    handRow(t, [['BUT', 82.0], ['I', 82.22], ['STILL', 82.34]], 110, 1006, 84, { col: PAL.paper });
    camEnd();
    if (lt > .5) label(typed('OTHER END: COMMANDER', lt - .5, 60), 70, 290, { size: 30, col: PAL.lime, bg: PAL.ink, pad: 12, screen: true });
  }

  // ---------- bar 30b · "…bite" · a bite out of the word ----------
  function bite(t, lt, dur) {
    const a = t - 82.92, R = 250, [sx, sy] = shakeXY(t, hit(t, 82.92, 10) * 30, 24);
    bg(PAL.violet);
    camBegin(960 + sx, 540 + sy, 1.02 + hit(t, 82.92, 7) * .05, -.02);
    type('MIGHT', 90, 110, 110, { font: 'hand', col: PAL.lime, align: 'left', rot: -.03, wear: 0 });
    const m = type('BITE', 930, 600, fitSize('BITE', 1560), { col: PAL.paper, shadow: { col: PAL.ink, dx: .018, dy: .022 }, seed: 12 });
    const bx = 930 + m.w / 2 - 150, by = 600 - m.cap / 2 + 120;
    if (a >= 0) {                                                                // the missing mouthful, with tooth marks
      circ2(bx, by, R, PAL.violet);
      for (let i = 0; i < 14; i++) { const q = i / 14 * TAU; circ2(bx + Math.cos(q) * R * .93, by + Math.sin(q) * R * .93, R * .22, PAL.violet); }
      for (let i = 0; i < 12; i++) { const q = 1.2 + hash(i * 3.7) * 3.6, v = 500 + hash(i * 5.1) * 900, px = bx + Math.cos(q) * v * a, py = by + Math.sin(q) * v * a + 1800 * a * a, r = 16 + hash(i * 2.3) * 28;
        poly2(rotPts([[px - r, py - r * .6], [px + r * .8, py - r], [px + r, py + r * .7], [px - r * .5, py + r]], a * 14 + i, px, py), PAL.paper, { stroke: PAL.ink, lw: 5, join: 'round' }); }
    }
    if (a > -.11 && a < .07) {                                                   // the jaws: on screen for four frames
      const gapJ = a < 0 ? lerp(520, 0, easeIn(1 + a / .11)) : 0, c = g2d(), n = 6, tw = R * 2.3 / n;
      c.translate(bx, by); c.rotate(-.6); c.lineJoin = 'round';
      for (const sd of [-1, 1]) {
        const jy = sd * (gapJ / 2 + 4);
        c.fillStyle = PAL.ink; c.beginPath(); c.ellipse(0, jy, R * 1.3, R * 1.05, 0, sd < 0 ? Math.PI : 0, sd < 0 ? TAU : Math.PI); c.closePath(); c.fill();
        c.fillStyle = PAL.oxblood; c.beginPath(); c.ellipse(0, jy + sd * 26, R * 1.08, R * .78, 0, sd < 0 ? Math.PI : 0, sd < 0 ? TAU : Math.PI); c.closePath(); c.fill();
        c.fillStyle = PAL.white; c.strokeStyle = PAL.ink; c.lineWidth = 7;
        for (let i = 0; i < n; i++) { const x0 = -R * 1.15 + i * tw + (sd > 0 ? tw / 2 : 0); if (sd > 0 && i === n - 1) continue; c.beginPath(); c.moveTo(x0, jy); c.lineTo(x0 + tw, jy); c.lineTo(x0 + tw / 2, jy - sd * (i === 1 || i === n - 2 ? 120 : 84)); c.closePath(); c.fill(); c.stroke(); }
      }
    }
    camEnd();
  }

  // ---------- bar 30c · "ignite" · the word burns; she is fine ----------
  function ignite(t, lt, dur) {
    const a = t - 83.24, s = slam(lt + .02, .1), k = easeOut(seg(lt, 0, .3)), [sx, sy] = shakeXY(t, s.shake * 22 + 4, 12);
    bg(PAL.ink);
    camBegin(960 + sx, 560 + sy, 1 + lt * .09, 0);
    type('IGNITE', 960, 232, fitSize('IGNITE', 1560), { col: PAL.paper, k: s.k, alpha: s.alpha, seed: 2,
      per: i => ({ dy: jig(i, t, 10) * .03, rot: jig(i + 9, t, 10) * .03, col: hash(i * 3.1 + Math.floor(t * 10)) > .6 ? PAL.lime : PAL.paper }) });
    flames(960, 1130, 2300, 900, k, { n: 9 });
    junjunBust(960, 640, 50, { ...EXPR.deadpan, lid: .56, look: [0, .05] });
    flames(960, 1180, 2200, 230, k, { n: 12, a: PAL.oxblood, b: PAL.orange });
    camEnd();
  }

  // ---------- bar 31 · "Any dog tryna front gonna lose that fight" · the fight card ----------
  function card(t, lt, dur) {
    const tDog = 84.3, tVs = 84.92, tLose = 85.58, tWin = 86.26, inL = easeOut5((lt + .07) / .14), inR = easeOut5((t - (tDog - .1)) / .14), sV = slam(t - tVs, .1);
    const [sx, sy] = shakeXY(t, sV.shake * 24 + hit(t, tDog + .03, 14) * 14 + hit(t, tWin + .1, 12) * 12, 24), oL = (inL - 1) * 1200, oR = (1 - inR) * 1200;
    const lost = i => t >= tLose + i * .09;
    bg(PAL.ink);
    camBegin(960 + sx, 540 + sy, 1 + lt * .012, 0);
    if (inR <= 0) { halftone(900, -100, 1200, 1300, { cell: 26, col: PAL.blue, grad: [1000, 0, 2300, 0], alpha: .9 }); type('?', 1500, 520, 700, { col: PAL.blue, rot: .08, k: popIn(lt, .12), seed: 2 }); }
    poly2([[-300 + oL, -200], [1110 + oL, -200], [830 + oL, 1280], [-300 + oL, 1280]], PAL.orange);
    poly2([[1110 + oR, -200], [2220 + oR, -200], [2220 + oR, 1280], [830 + oR, 1280]], PAL.blue);
    if (inL >= 1) halftone(-100, 500, 1000, 700, { cell: 24, col: PAL.ink, grad: [0, 560, 0, 1250], alpha: .4 });
    if (inR >= 1) speedLines(1480, 620, { n: 44, r0: 620, r1: 1500, col: PAL.ink, boil: true, w: [.004, .02] });
    junjunBust(395 + oL, 560, 45, { ...EXPR.judge, look: [.85, .05], lid: Math.max(.52, blink(t, 2)) });
    type('JUNJUN', 400 + oL, 955, fitSize('JUNJUN', 700), { col: PAL.paper, stroke: PAL.ink, strokeW: .05, rot: -.02, k: slam(lt - .04, .1).k, seed: 3 });
    if (inR > .6) {
      const q = i => jig(i, t, 12) * (lost(i) ? 9 : 3);
      crow(1330 + oR + q(5), 300, 27, { flip: true, flap: t * 4, caw: lost(5) ? 0 : 1 });
      commander(1560 + oR + q(2), 866, 17.5, { pose: 'stand', face: 'panic', flip: true });
      cat(1850 + oR, 866, 22, { flip: true, eyes: lost(4) ? .35 : 1 });
      yorkie(1150 + oR + q(0), 866, 27, { flip: true, scared: lost(0) ? 1 : 0, bark: lost(0) ? 0 : (hash(Math.floor(t * 9)) > .5 ? 1 : 0) });
      squirrel(1375 + oR + q(1), 866, 22, { flip: true });
      pup(1730 + oR + q(3), 866, 25, { flip: true, puff: lost(3) ? 0 : .8, tuck: lost(3) ? 1 : 0, face: lost(3) ? 'scared' : 'cocky' });
    }
    type('EVERYONE', 1440 + oR, 968, fitSize('EVERYONE', 780), { col: PAL.lime, stroke: PAL.ink, strokeW: .05, rot: .015, seed: 5 });
    poly2([[1096, -200], [1124, -200], [844, 1280], [816, 1280]], PAL.ink, { alpha: inR >= 1 ? 1 : 0 });
    if (sV.alpha > 0) { burst(985, 600, 120 * sV.k, 190 * sV.k, { n: 12, seed: 4, col: PAL.lime, stroke: PAL.ink, lw: 10, rot: t * .4, irr: .22 }); type('VS', 985, 600, 190, { col: PAL.ink, k: sV.k, rot: -.08, wear: .2 }); }
    [[1150, 720, -.14], [1375, 760, .1], [1560, 500, -.08], [1730, 740, .12], [1810, 610, -.2], [1340, 262, .08]].forEach(([x, y, r], i) => stamp('LOSE', x, y, { k: popIn(t - tLose - i * .09, .1), size: 60, rot: r, col: PAL.paper, seed: i + 2 }));
    stamp('WINNER', 690, 140, { k: popIn(t - tWin, .12), size: 84, rot: -.07, col: PAL.ink, seed: 9 });
    camEnd();
    if (inR >= 1) label('MAIN EVENT // PAVEMENT // 06:14', W - 64, 52, { size: 22, col: PAL.paper, align: 'right', screen: true });
  }

  // ---------- bar 32 · "Dartin' through yards, disregardin' the guard" · the yard darts; she walks ----------
  function dartin(t, lt, dur) {
    const u = 33, ph = bp(t) - bp(barT(32)) + .1, dogX = 900, wx = lt * 3100, tG = 88.9, s = slam(lt + .04, .1);
    const [sx, sy] = shakeXY(t, s.shake * 20 + 3, 12);
    bg(PAL.lime);
    camBegin(960 + sx - (1 - easeOut5(lt / .2)) * 700, 560 + sy, 1.04, -.012);
    type('DARTIN’', 1010, 300, fitSize('DARTIN’', 1700), { col: PAL.ink, skew: -.26, k: s.k, alpha: s.alpha, per: rattle(t, .008), seed: 8 });
    streaks({ col: PAL.paper, n: 30, drift: -lt * 5200, len: [300, 1100], th: [4, 18], area: [-300, 60, W + 600, 800], seed: 3 });
    // the fence: rails, then pickets smeared by speed
    rect2(-300, 600, W + 600, 36, PAL.paper, { stroke: PAL.ink, lw: 7 }); rect2(-300, 760, W + 600, 36, PAL.paper, { stroke: PAL.ink, lw: 7 });
    for (let i = 0; i < 6; i++) { const x = 2500 - (((wx + i * 560) % 3360) + 3360) % 3360; poly2([[x, 480], [x + 60, 420], [x + 150, 480], [x + 110, 900], [x - 40, 900]], PAL.paper, { stroke: PAL.ink, lw: 8, join: 'round' }); }
    rect2(-400, GY - 12, W + 800, 400, PAL.ink);
    streaks({ col: PAL.lime, n: 16, drift: -lt * 6400, len: [200, 700], th: [3, 9], area: [-300, GY + 4, W + 600, 150], seed: 9 });
    // the guard goes by behind her, barking; she does not look
    { const gx = 2200 - (t - 88.55) * 1800; if (gx > -300 && gx < 2300) { const yb = hash(Math.floor(t * 12)) > .4 ? 1 : 0; yorkie(gx, GY, 24, { flip: true, bark: yb, hop: yb * .8, shadow: false }); type('YIP!', gx - 70, GY - 310, 84, { font: 'hand', col: PAL.oxblood, rot: -.12, wear: .1 }); } }
    junjunSide(dogX, GY, u, { ...EXPR.neutral, walk: ph, look: [.3, 0], lid: Math.max(.3, blink(t, 4)), shadowOp: 0 });
    // a post whips through the foreground
    { const x = 2700 - frac(lt * 1.25 + .62) * 7200; poly2([[x + 120, -200], [x + 420, -200], [x + 180, 1300], [x - 120, 1300]], PAL.ink); }
    camEnd();
    handRow(t, [['THROUGH', 87.34], ['YARDS,', 87.52]], 70, 1014, 76, { col: PAL.paper });
    handRow(t, [['DISREGARDIN’', 88.06]], 760, 1014, 76, { col: PAL.lime });
    hud(['GROUND SPEED: 4 KM/H'], { corner: 'tl', col: PAL.lime, bg: PAL.ink, size: 24 });
    if (t > tG) label('THE GUARD: DISREGARDED', W - 70, 1000, { size: 26, col: PAL.ink, bg: PAL.lime, align: 'right', screen: true, pad: 12, alpha: clamp((t - tG) / .06) });
  }

  // ---------- bar 33a · "I'm hard as a shard" · the bone as a blade ----------
  function hard(t, lt, dur) {
    const tS = 90.2, s = slam(lt + .03, .1), a = t - tS, k = easeOut5(a / .1), [sx, sy] = shakeXY(t, s.shake * 28 + hit(t, tS + .06, 10) * 22, 24);
    const ln = [-100, 870, 2020, 235], ang = Math.atan2(ln[3] - ln[1], ln[2] - ln[0]), size = fitSize('HARD', 1500), o = { col: PAL.orange, seed: 9, shadow: { col: PAL.oxblood, dx: .022, dy: .026 } };
    bg(PAL.ink);
    camBegin(960 + sx, 540 + sy, 1 + lt * .05, 0);
    halftone(-100, -100, W + 200, H + 200, { cell: 26, col: PAL.oxblood, radial: [960, 540, 380, 1500], max: .82 });
    type('I’M', 90, 100, 110, { font: 'hand', col: PAL.paper, align: 'left', rot: -.03, wear: 0 });
    if (a < 0) type('HARD', 960, 560, size, { ...o, k: s.k, alpha: s.alpha }); else splitType('HARD', 960, 560, size, o, ln, k * 30, k * 70);
    if (a >= 0) {
      const off = (1 - k) * -1900, cx = 960 + Math.cos(ang) * off, cy = 552 + Math.sin(ang) * off;
      push(); translate(cx, cy); rotate(ang); paint(shardPts(1640, -.24, 62), { wash: PAL.paper, ink: PAL.ink, sw: 2.8 }); inkLine([[-600, -22], [-240, -14], [300, -8]], .9, PAL.ink, 'inkfine', 0); pop();
      const tx = 960 + Math.cos(ang) * 820, ty = 552 + Math.sin(ang) * 820;
      gleam(tx, ty, 190 * popIn(a - .08, .12) * (1 + .12 * Math.sin(t * 30)), a * 1.5);
      type('AS A SHARD', 1300, 880, 110, { font: 'hand', col: PAL.lime, rot: ang, k: popIn(a, .1), wear: 0 });
    }
    camEnd();
  }

  // ---------- bar 33b · "from a bone that I gnawed" · she chews, deadpan ----------
  function gnaw(t, lt, dur) {
    const tG = 91.64, u = 64, hx = 1010, hy = 440, chew = Math.floor(t * 7) % 2, s = slam(t - tG, .1), [sx, sy] = shakeXY(t, s.shake * 20, 24);
    bg(PAL.pink);
    camBegin(960 + sx, 540 + sy, 1 + lt * .05, 0);
    halftone(-100, 300, W + 200, 900, { cell: 26, col: PAL.orange, radial: [hx, hy + 100, 420, 1200], alpha: .9 });
    junjunBust(hx, hy, u, { ...EXPR.deadpan, lid: .55, look: [0, .05], hy: chew * .07 });
    push(); translate(hx - .5 * u, hy + (3.42 + chew * .07) * u); rotate(-.06 + chew * .035);
    paint(shardPts(17.5 * u, .12, .62 * u), { wash: PAL.white, ink: PAL.ink, sw: 2.4 }); pop();
    for (const sd of [1, -1]) paint([[hx + sd * .85 * u - .34 * u, hy + (2.86 + chew * .07) * u], [hx + sd * .85 * u + .34 * u, hy + (2.86 + chew * .07) * u], [hx + sd * .85 * u, hy + (3.7 + chew * .07) * u]], { wash: PAL.white, ink: PAL.ink, sw: 1.2 });
    for (let i = 0; i < 5; i++) { const p = frac(t * 2.2 + hash(i) * 3), x = hx + (hash(i * 3.1) - .5) * 5 * u, y = hy + 4 * u + p * p * 420; circ2(x, y, 7 + hash(i * 7.7) * 7, PAL.white, { stroke: PAL.ink, lw: 3 }); }
    if (s.alpha > 0) type('GNAWED', 960, 925, fitSize('GNAWED', 1240), { col: PAL.paper, stroke: PAL.ink, strokeW: .05, k: s.k, alpha: s.alpha, rot: -.02, seed: 4 });
    camEnd();
    handRow(t, [['FROM A', 90.68], ['BONE', 91.02], ['THAT I', 91.3]], 70, 70, 84);
    label('EXHIBIT A: BONE', 80, 560, { size: 30, col: PAL.lime, bg: PAL.ink, pad: 12, screen: true, alpha: seg(lt, .12, .2) });
  }

  // ---------- bar 34a · "Charge every yard" · the word charges; she stands ----------
  function charge(t, lt, dur) {
    const s = slam(lt + .03, .1), u = 34, [sx, sy] = shakeXY(t, s.shake * 28 + 3, 12);
    bg(PAL.blue);
    camBegin(960 + sx + lt * 30, 540 + sy, 1 + lt * .04, 0);
    streaks({ col: PAL.ink, n: 26, drift: -lt * 4600, len: [300, 1200], th: [4, 20], area: [-300, 40, W + 600, 860], seed: 5 });
    type('CHARGE', 1030, 320, fitSize('CHARGE', 1800), { col: PAL.paper, skew: -.2, k: s.k, alpha: s.alpha, shadow: { col: PAL.ink, dx: .02, dy: .024 }, per: rattle(t, .008), seed: 6 });
    streaks({ col: PAL.paper, n: 14, drift: -lt * 6200, len: [200, 800], th: [3, 10], area: [-300, 560, W + 600, 330], seed: 11 });
    dryStroke(-500, GY + 62, 2500, GY + 48, 150, PAL.ink, { seed: 5 });
    handRow(t, [['EVERY', 92.56], ['YARD', 92.92]], 900, 700, 130, { col: PAL.lime, stroke: PAL.ink, strokeW: .14 });
    { const k = popIn(lt - .22, .14); if (k > 0) { circ2(1650, 870, 118 * k, PAL.lime, { stroke: PAL.ink, lw: 9 }); type('出撃', 1650, 870, 100 * k, { font: 'jp', col: PAL.ink, wear: 0 }); } }
    junjunSide(430, GY, u, { ...EXPR.deadpan, look: [.3, 0], lid: .46 });
    camEnd();
    label('STATUS: CHARGING (STATIONARY)', 70, 1000, { size: 28, col: PAL.ink, bg: PAL.lime, pad: 12, screen: true, alpha: seg(lt, .5, .56) });
  }

  // ---------- bar 34b · "like a bullet from a gun" · a completely rigid dog crosses the frame ----------
  function bullet(t, lt, dur) {
    const tB = 93.66, tGun = 94.28, s = slam(t - tB, .1), u = 30, y = 900, x = lerp(-260, 2420, seg(t, 93.4, 94.42)), [sx, sy] = shakeXY(t, s.shake * 22 + 4, 24);
    bg(PAL.paper);
    camBegin(960 + sx, 540 + sy, 1.03, -.01);
    streaks({ col: PAL.orange, n: 22, drift: -lt * 7000, len: [400, 1300], th: [6, 26], seed: 2 });
    type('BULLET', 980, 320, fitSize('BULLET', 1720), { col: PAL.ink, skew: -.24, k: s.k, alpha: s.alpha, per: rattle(t, .008), seed: 8 });
    streaks({ col: PAL.ink, n: 34, drift: -lt * 9000, len: [300, 1200], th: [3, 12], seed: 7 });
    { const k = popIn(t - tGun, .1); if (k > 0) { burst(150, 700, 150 * k, 300 * k, { n: 11, seed: 6, col: PAL.lime, stroke: PAL.ink, lw: 9 }); type('ドン', 250, 700, 150 * k, { font: 'jp', col: PAL.orange, stroke: PAL.ink, strokeW: .05, rot: -.1, wear: .1 }); } }
    // her wake and bow shock
    { const c = g2d(); c.fillStyle = PAL.ink; c.beginPath(); for (let i = 0; i < 9; i++) { const yy = y - (2 + i * 2.4) * u + jig(i, t) * 14, len = 500 + hash(i * 3.3 + Math.floor(t * 12)) * 900, th = 5 + hash(i * 5.1) * 12; c.moveTo(x - 8.5 * u, yy - th); c.lineTo(x - 8.5 * u - len, yy); c.lineTo(x - 8.5 * u, yy + th); c.closePath(); } c.fill(); }
    junjunSide(x, y, u, { ...EXPR.deadpan, look: [.3, 0], lid: .46, shadow: false });
    for (let i = 0; i < 3; i++) { const r = (5 + i * 2.6) * u, cx = x + (10.5 + i * 1.2) * u - r, cy = y - 15.5 * u, pts = []; for (let j = 0; j <= 8; j++) { const q = -.75 + j / 8 * 1.5; pts.push([cx + Math.cos(q) * r, cy + Math.sin(q) * r * 1.25]); } inkLine(pts, 2.4 - i * .5, PAL.ink, 'ink', .5); }
    camEnd();
    label('CALIBRE: 32 KG', W - 70, 990, { size: 30, col: PAL.lime, bg: PAL.ink, pad: 14, align: 'right', screen: true, alpha: seg(t, tB + .1, tB + .16) });
    type('LIKE A', 70, 62, 84, { font: 'hand', col: PAL.ink, align: 'left', rot: -.02, wear: 0, screen: true });
  }

  // ---------- bar 35 · "Outrun any hound in the midday sun" · hounds sprint in place; she strolls past ----------
  function outrun(t, lt, dur) {
    const tSun = 96.8, s = slam(lt + .02, .1), u = 29, ph = bp(t) - bp(94.52) + .2, dogX = 250 + ph * 7.74 * u * 1.12, [sx, sy] = shakeXY(t, s.shake * 22, 24);
    bg(PAL.orange);
    camBegin(960 + sx + lt * 20, 540 + sy, 1 + lt * .012, 0);
    sunburst(1640, 300, { n: 18, col: PAL.paper, alpha: .16, rot: t * .25 });
    circ2(1640, 300, 262 + pulse(t, 6) * 10, PAL.lime, { stroke: PAL.ink, lw: 10 });
    if (t > tSun) type('SUN', 1640, 290, 270, { col: PAL.ink, k: slam(t - tSun, .1).k, rot: .03, seed: 3 });
    type('OUTRUN', 590, 235, fitSize('OUTRUN', 1060), { col: PAL.paper, k: s.k, alpha: s.alpha, rot: -.03, shadow: { col: PAL.ink, dx: .02, dy: .024 }, seed: 5 });
    handRow(t, [['ANY', 95.14], ['HOUND', 95.58]], 84, 462, 104);
    halftone(-200, 640, W + 500, 520, { cell: 24, col: PAL.ink, grad: [0, 700, 0, 1240], alpha: .45 });
    dryStroke(-500, GY + 96, 2700, GY + 84, 150, PAL.ink, { seed: 7 });
    streaks({ col: PAL.paper, n: 18, drift: -lt * 3800, len: [200, 700], th: [3, 9], area: [-300, GY + 30, W + 600, 110], seed: 4 });
    // the pack: flat out, getting nowhere
    for (let i = 2; i >= 0; i--) {
      const hx = 560 + i * 390 - lt * 125 + jig(i, t, 8) * 8, run = t * 4.3 + i * .37, m = mutt(hx, GY + 30, 31, { legs: 6, snout: 3.2, ear: 'flop', run, bark: 1, tongue: true, eye: 'wide', tail: -.2, line: PAL.orange });
      for (let j = 0; j < 2; j++) { const p = frac(t * 3.1 + i * .31 + j * .5), px = m[0] - 150 - p * 150, py = m[1] - 70 - Math.sin(p * Math.PI) * 50; poly2([[px, py - 24], [px + 15, py + 9], [px, py + 21], [px - 15, py + 9]], PAL.blue, { stroke: PAL.ink, lw: 4, join: 'round', alpha: p < .9 ? 1 : 0 }); }
      for (let j = 0; j < 3; j++) { const p = frac(t * 2.6 + i * .4 + j * .33); circ2(hx - 220 - p * 190, GY + 20 - p * 50, 28 * (1 - p) + 6, PAL.paper, { stroke: PAL.ink, lw: 4 }); }
    }
    junjunSide(dogX, GY + 94, u, { ...EXPR.royal, walk: ph, look: [.3, 0], lid: Math.max(.5, blink(t, 2)), shadowOp: 0 });
    camEnd();
    if (t > 96.28) label('MIDDAY: 12:00', 1300, 590, { size: 30, col: PAL.lime, bg: PAL.ink, pad: 14, screen: true, alpha: clamp((t - 96.28) / .05) });
  }

  // ---------- bar 36a · "Tail's a whip" ----------
  function whip(t, lt, dur) {
    const tW = 97.64, a = t - tW, s = slam(a, .1), u = 118, tx = 500, ty = 470, [sx, sy] = shakeXY(t, s.shake * 26, 24);
    bg(PAL.violet);
    camBegin(960 + sx, 540 + sy, 1 + lt * .05, 0);
    halftone(-100, -100, W + 200, H + 200, { cell: 26, col: PAL.ink, radial: [tx, ty, 520, 1500], alpha: .5 });
    junjunSide(tx + 6.9 * u, ty + 15.3 * u, u, { shadow: false, tailWag: a > 0 ? -.05 * Math.exp(-a * 9) * Math.cos(a * 40) : 0 });
    if (a > -.06) {                                                              // the crack: a lash drawn off the tail
      const q = easeOut5((a + .06) / .1), pts = [[tx + 250, ty - 250], [tx + 520, ty - 430], [tx + 900, ty - 330], [tx + 1130, ty - 380]].map((p, i, arr) => [lerp(arr[0][0], p[0], q), lerp(arr[0][1], p[1], q)]);
      inkLine(pts, 3.4, PAL.ink, 'ink', .8); inkLine(pts, 1.4, PAL.lime, 'ink', .8);
      if (a > 0) burst(pts[3][0] + 30, pts[3][1], 60 * popIn(a, .08), 150 * popIn(a, .08), { n: 9, seed: 5, col: PAL.white, stroke: PAL.ink, lw: 8, rot: a * 2 });
    }
    vibLines(tx, ty, 3.6 * u, 3.6 * u, clamp(1 - a * 2.5) * (a > 0 ? 1 : 0), { n: 10, sw: 1.6, len: 1.6, arc: [Math.PI * .7, Math.PI * 1.9] });
    if (s.alpha > 0) type('WHIP', 1240, 640, fitSize('WHIP', 1080), { col: PAL.lime, stroke: PAL.ink, strokeW: .05, k: s.k, alpha: s.alpha, rot: -.05, shadow: { col: PAL.ink, dx: .022, dy: .026 }, seed: 5 });
    camEnd();
    type('TAIL’S A', 1010, 330, 130, { font: 'hand', col: PAL.paper, align: 'left', rot: -.05, wear: 0, screen: true, k: popIn(lt + .05, .1) });
    label('FIG. 1: WHIP (FLUFFY)', 70, 984, { size: 30, col: PAL.ink, bg: PAL.lime, pad: 12, screen: true, alpha: seg(lt, .2, .26) });
  }

  // ---------- bar 36b · "jaws a clip" ----------
  function jaws(t, lt, dur) {
    const tC = 98.26, s = slam(t - tC, .1), u = 76, [sx, sy] = shakeXY(t, s.shake * 26, 24);
    bg(PAL.lime);
    camBegin(960 + sx, 540 + sy, 1.04 + lt * .08, 0);
    halftone(-100, -100, W + 200, H + 200, { cell: 26, col: PAL.orange, radial: [640, 500, 500, 2600], max: .9 });
    junjunBust(640, 420, u, { ...EXPR.deadpan, lid: .6, look: [.5, .1], brow: .2 });
    if (s.alpha > 0) type('CLIP', 1370, 800, fitSize('CLIP', 900), { col: PAL.ink, k: s.k, alpha: s.alpha, rot: -.03, shadow: { col: PAL.paper, dx: .024, dy: .028 }, seed: 4 });
    camEnd();
    type('JAWS A', 1250, 150, 150, { font: 'hand', col: PAL.ink, align: 'left', rot: -.04, wear: .1, screen: true, k: popIn(lt, .1) });
    if (t > tC + .1) label('CAPACITY: 42 TEETH', 1262, 320, { size: 34, col: PAL.lime, bg: PAL.ink, pad: 14, screen: true });
  }

  // ---------- bar 36c · "I unload when I grip" · a tug of war she is not taking part in ----------
  function grip(t, lt, dur) {
    const tG = 99.58, s = slam(t - tG, .1), u = 60, hx = 960, hy = 370, ry = hy + 3.42 * u, [sx, sy] = shakeXY(t, s.shake * 28 + 3, 12);
    bg(PAL.oxblood);
    camBegin(960 + sx, 540 + sy, 1 + lt * .05, 0);
    speedLines(hx, hy + 120, { n: 70, r0: 700, r1: 1700, col: PAL.ink, boil: true, boilRate: 12, w: [.004, .026] });
    const hand = commander(1850, ry + 20 + Math.sin(t * 17) * 50, 17, { pose: 'dragged', face: 'panic', flip: true, arm: 2.9 });
    junjunBust(hx, hy, u, { ...EXPR.deadpan, lid: .6 });
    // the rope: taut, humming, and going nowhere
    { const c = g2d(), sgn = Math.floor(t * 24) % 2 ? 1 : -1, L = [370, ry + Math.sin(t * 23) * 30], mL = [hx - 2.2 * u, ry], mR = [hx + 2.2 * u, ry];
      const path = () => { c.beginPath(); c.moveTo(L[0], L[1]); for (let i = 1; i <= 10; i++) c.lineTo(lerp(L[0], mL[0], i / 10), lerp(L[1], mL[1], i / 10) + Math.sin(i / 10 * Math.PI * 2) * 9 * sgn); c.lineTo(mR[0], mR[1]); for (let i = 1; i <= 10; i++) c.lineTo(lerp(mR[0], hand[0], i / 10), lerp(mR[1], hand[1], i / 10) + Math.sin(i / 10 * Math.PI * 2) * 9 * -sgn); c.stroke(); };
      c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = PAL.ink; c.lineWidth = 40; path(); c.strokeStyle = PAL.paper; c.lineWidth = 25; path();
      c.strokeStyle = PAL.ink; c.lineWidth = 5; c.beginPath(); for (let x = L[0] + 20; x < hand[0] - 10; x += 34) { const y = x < mL[0] ? lerp(L[1], mL[1], (x - L[0]) / (mL[0] - L[0])) : x > mR[0] ? lerp(mR[1], hand[1], (x - mR[0]) / (hand[0] - mR[0])) : ry; c.moveTo(x - 7, y + 11); c.lineTo(x + 7, y - 11); } c.stroke();
      for (const sd of [1, -1]) paint([[hx + sd * 1.25 * u - .36 * u, ry - .62 * u], [hx + sd * 1.25 * u + .36 * u, ry - .62 * u], [hx + sd * 1.25 * u, ry + .28 * u]], { wash: PAL.white, ink: PAL.ink, sw: 1.2 });
      // the Yorkie has the other end, in principle
      push(); translate(L[0], L[1]); rotate(.35 + Math.sin(t * 19) * .5); yorkie(-5.9 * 28, 4.8 * 28, 28, { scared: 1, bark: 1, shadow: false }); pop(); }
    vibLines(hx, ry, 5.4 * u, 1.6 * u, .8, { n: 8, sw: 1.3, seed: 6 });
    if (s.alpha > 0) type('GRIP', 960, 880, fitSize('GRIP', 980), { col: PAL.lime, stroke: PAL.ink, strokeW: .05, k: s.k, alpha: s.alpha, rot: -.02, per: rattle(t, .012), seed: 6 });
    camEnd();
    handRow(t, [['I', 98.68], ['UNLOAD', 98.8]], 70, 70, 96, { col: PAL.paper, screen: true });
    handRow(t, [['WHEN', 99.08], ['I', 99.42]], 1500, 70, 96, { col: PAL.paper, screen: true });
  }

  // ---------- bar 37 · "If you sniff too long you gon' sink this ship" ----------
  function ship(t, lt, dur) {
    const tLong = 100.82, tSink = 101.5, tShip = 102.06;
    if (t < tShip) {
      const a = t - tSink, sS = slam(a, .1), down = easeIn(seg(a, .1, .68)), bx = 1010, wy = 760, bs = 84, sn = Math.max(hit(t, 100.2, 9), hit(t, 100.42, 9), hit(t, 100.64, 9));
      const [sx, sy] = shakeXY(t, sS.shake * 34, 24), rock = a < .1 ? Math.sin(t * 4.5) * .05 : lerp(.02, -.55, easeOut(seg(a, .1, .55)));
      const wave = Math.floor(t * 8) / 8 * 4;
      bg(PAL.pink);
      camBegin(960 + sx, 540 + sy, 1 + seg(lt, 0, 1.5) * .05, 0);
      sunburst(bx, wy, { n: 14, col: PAL.paper, alpha: .35, rot: -t * .05 });
      sea(wy - 50, wave * .7 + 2, PAL.violet);                                   // far swell
      if (a < 0 && t >= tLong) { const n = Math.min(9, 1 + Math.floor((t - tLong) / .055)); type('L' + 'O'.repeat(n) + 'NG', 80, 262, 300, { col: PAL.ink, align: 'left', per: rattle(t, .006), seed: 3 }); }
      if (a >= 0) type('SINK', 960, wy - 310 + down * 640, fitSize('SINK', 1560), { col: PAL.ink, k: sS.k, alpha: sS.alpha, rot: -.05 * down, seed: 8 });
      push(); translate(bx, wy + Math.sin(t * 4.5 + 1) * 8 + (a > 0 ? Math.exp(-a * 16) * 40 : 0) + down * 660); rotate(rock);
      boat(bs, 0);
      push(); translate(bs * 1.9, -bs * 1.85); rotate(a < 0 ? .2 + sn * .1 : -.3); pup(0, 0, 30, { face: a < 0 ? 'cocky' : 'scared', tuck: a < 0 ? 0 : 1, shadow: false }); pop();
      boat(bs, 1); pop();
      [[100.2, 1640, 560, 104, -.12], [100.42, 1730, 430, 124, .1], [100.64, 1640, 290, 144, -.06]].forEach(([tw, x, y, sz, r]) => { if (t < tLong + .12 && t > tw) type('SNIFF', x, y, sz, { font: 'hand', col: PAL.ink, k: popIn(t - tw, .1), rot: r, wear: .2 }); });
      sea(wy, wave, PAL.blue);
      halftone(-300, wy, W + 600, 700, { cell: 24, col: PAL.ink, grad: [0, wy + 20, 0, wy + 480], alpha: .7 });
      if (a > .08) {                                                             // the splash
        const p = a - .08;
        for (let i = 0; i < 16; i++) { const q = -Math.PI * (.12 + hash(i * 3.1) * .76), v = 600 + hash(i * 7.3) * 900, px = bx + (hash(i) - .5) * 800 + Math.cos(q) * v * p, py = wy + Math.sin(q) * v * p + 2200 * p * p; if (py < wy + 20) circ2(px, py, 16 + hash(i * 2.1) * 26, PAL.white, { stroke: PAL.ink, lw: 5 }); }
        for (let i = 0; i < 7; i++) { const pb = frac(p * 1.6 + hash(i * 4.1)); circ2(bx - 300 + hash(i * 9.1) * 600, wy + 300 - pb * 270, 10 + hash(i) * 16, null, { stroke: PAL.white, lw: 6 }); }
      }
      camEnd();
      handRow(t, a < 0 ? [['IF', 100.02], ['YOU', 100.1], ['SNIFF', 100.2], ['TOO', 100.4]] : [['YOU', 101.16], ['GON’', 101.36]], 70, 70, 84, a < 0 ? { screen: true } : { screen: true, col: PAL.paper, stroke: PAL.ink, strokeW: .2 });
    } else {
      // impact frame 2 of 2: the last hit of the breakdown, and the loudest frame so far (three bursts, two accents)
      const a = t - tShip, tRe = barT(37, 3), re = t - tRe, [sx, sy] = shakeXY(t, 64 * Math.exp(-a * 3.5) + 14 + hit(t, tRe, 6) * 40, 24), inv = re > 0 && re < .085;
      const dark = inv ? PAL.white : PAL.ink, light = inv ? PAL.ink : PAL.white, u = 55, hx = 960, hy = 372, pp = 1 + Math.exp(-a * 14) * .1 + hit(t, tRe, 14) * .06;
      const k = easeOut5(a / .12), sd = 31 + (re > 0 ? 9 : 0), cy = hy + 70;
      bg(dark);
      camBegin(960 + sx, 540 + sy, 1.14 - .13 * easeOut(a / .3) + a * .035, jig(2, t, 24) * .07 * (Math.exp(-a * 4) + .3));
      burst(hx, cy, 640 * k, 1560 * k, { n: 20, seed: sd + 9, col: PAL.orange, irr: .4, ey: .8, rot: -a * .25 });
      burst(hx, cy, 540 * k, 1280 * k, { n: 18, seed: sd, col: PAL.lime, irr: .4, ey: .8, rot: a * .3 });
      burst(hx, cy, 440 * k, 1010 * k, { n: 16, seed: sd + 5, col: light, irr: .38, ey: .8, rot: .2 - a * .2 });
      speedLines(hx, cy, { n: 110, r0: 480, r1: 1900, col: dark, w: [.004, .03], seed: sd, boil: true, boilRate: 12, ey: .85 });
      halftone(-300, -300, W + 600, H + 600, { cell: 22, ang: .45, col: dark, radial: [hx, cy, 570, 1060], max: .8 });
      // wreckage, thrown clear
      { const p = easeOut(a / .5), g = a * a * 240;
        push(); translate(lerp(960, 1620, p), lerp(700, 250, p) + g); rotate(a * 5 + .4); boat(46, 0); boat(46, 1); pop();
        push(); translate(lerp(960, 250, p), lerp(700, 560, p) + g); rotate(-a * 7); pup(0, 70, 30, { mono: true, face: 'scared', tuck: 1, shadow: false }); pop(); }
      vibLines(hx, hy, 8.4 * u, 7.6 * u, 1, { n: 14, sw: 1.8, len: 1.7, arc: [Math.PI * 1.05, Math.PI * 1.95], seed: 3 });
      type('ドン', 330, 215, 270, { font: 'jp', col: PAL.orange, stroke: dark, strokeW: .05, rot: -.1, k: slam(a - .05, .1).k, alpha: clamp((a - .05) / .04), per: rattle(t, .02), wear: .15 });
      junjunBust(hx, hy, u, { ...EXPR.judge, lid: .5, brow: .8, mono: true, sx: pp, sy: pp });
      { const s = slam(a - .02, .1), size = 372 / capH(1), o = { col: PAL.white, stroke: PAL.ink, strokeW: .07, k: s.k, alpha: s.alpha, per: rattle(t, .03 * Math.exp(-a * 2) + .014, 24), wear: .2, seed: 5 };
        if (a < .12) type('SHIP', 960, 905, size, o); else splitType('SHIP', 960, 905, size, { ...o, k: 1, alpha: 1 }, [330, 1230, 1560, 600], easeOut5((a - .12) / .12) * 22 + hit(t, tRe, 8) * 18, easeOut5((a - .12) / .12) * 40); }
      type('THIS', 470, 690, 120, { font: 'hand', col: PAL.lime, stroke: PAL.ink, strokeW: .2, rot: -.12, alpha: clamp(a / .05), wear: 0 });
      camEnd();
      flash(Math.max(1 - a / .09, re > 0 ? .85 - re / .05 : 0), PAL.white);
    }
  }

  chapter('breakdown', barT(28), barT(38), [
    [barT(28), barks], [barT(28, 2), riot], [barT(29), quiet], [barT(29, 3), leash], [82.58, bite], [83.2, ignite],
    [83.94, card], [barT(32), dartin], [89.6, hard], [90.95, gnaw], [91.9, charge], [93.4, bullet],
    [94.52, outrun], [97.1, whip], [97.94, jaws], [98.68, grip], [100.0, ship]
  ]);
})();
