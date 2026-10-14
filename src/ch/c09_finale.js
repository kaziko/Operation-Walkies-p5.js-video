// c09_finale.js: the kids' chorus and the finale (178.10 to the end).
//   1 · 178.1-189.75  the chorus again, a cappella, as a child's crayon drawings (one sheet per line). Over the last
//                      line the camera pulls back: the sheets hang on a fridge and the real Jun Jun is reviewing them.
//   2 · 189.75-193.5  the band returns: curtain call. Everything drops away in the stop before "And tomorrow…".
//   3 · 193.5-197.58  her eyes in the dark (the last stare).
//   4 · 197.58-201.0  "we redeploy.": the last and biggest impact frame. Then the end card and the fade.
(() => {
  // =====================================================================================================
  // crayon kit (private): everything a six-year-old needs
  // =====================================================================================================
  const CB = 4;                                       // crayon boil, steps per second (calmer than the ink boil)
  let cb = 0;                                         // boil step of the frame being drawn; set from t by each shot
  const CR = { ink: mixCol(PAL.ink, PAL.paper, .1), orange: PAL.orange, pink: mixCol(PAL.pink, PAL.oxblood, .32), sage: mixCol(PAL.sage, PAL.ink, .25),
    blue: PAL.blue, sun: mixCol(PAL.lime, PAL.orange, .16), brown: PAL.furDk, tan: PAL.fur, coat: mixCol(PAL.orange, PAL.fur, .5), red: mixCol(PAL.orange, PAL.oxblood, .6) };
  // hash-seeded wobble: stable inside one boil step whatever else is drawn (the shared jit depends on call order)
  const wv = (seed, i, amp) => (hash(seed * 7.13 + i * 1.37 + cb * 3.71) - .5) * 2 * amp;
  const wobP = (pts, seed, amp) => pts.map((p, i) => [p[0] + wv(seed, i * 2, amp), p[1] + wv(seed, i * 2 + 1, amp)]);
  // the first fraction p of a polyline, by length: this is how a line gets drawn on
  function part(pts, p) {
    if (p >= 1) return pts;
    const d = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { d.push(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); L += d[i - 1]; }
    let rem = L * p; const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      if (rem >= d[i - 1]) { out.push(pts[i]); rem -= d[i - 1]; }
      else { const q = rem / (d[i - 1] || 1); if (q > .02) out.push([lerp(pts[i - 1][0], pts[i][0], q), lerp(pts[i - 1][1], pts[i][1], q)]); break; }
    }
    return out;
  }
  // a crayon line. p 0..1 draws it on.
  function cray(pts, col, w = 1, p = 1, seed = 1, curv = .5, br = 'charcoal') {
    if (p <= 0) return;
    const q = part(wobP(pts, seed, 2.2), p); if (q.length < 2) return;
    brush.seed(seed * 101 + cb * 7); inkLine(q, w, col, br, curv);
  }
  const clipX = (pts, xm) => {                        // the part of a polygon left of x = xm
    const out = [];
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], ia = a[0] <= xm, ib = b[0] <= xm; if (ia) out.push(a); if (ia !== ib) out.push([xm, lerp(a[1], b[1], (xm - a[0]) / (b[0] - a[0]))]); }
    return out;
  };
  // coloured in with a crayon: hatching that sweeps in from the left (p 0..1)
  function fillC(pts, col, o = {}) {
    const p = o.p ?? 1; if (p <= 0) return;
    let q = pts;
    if (p < 1) { let x0 = Infinity, x1 = -Infinity; for (const v of pts) { x0 = Math.min(x0, v[0]); x1 = Math.max(x1, v[0]); } q = clipX(pts, lerp(x0, x1, p)); if (q.length < 3) return; }
    brush.seed((o.seed || 1) * 131 + cb * 5);
    paint(q, { hatch: { d: o.d || 10, a: o.a ?? 50, b: o.b || 'cpencil', c: col, w: o.w || 2.3, o: { rand: o.rand ?? .22 } }, ink: null });
  }
  // a wobbly closed loop that overshoots its own start, the way a child closes a circle
  const blob = (cx, cy, rx, ry, seed, n = 16, irr = .07, over = 1.08, a0 = -1.9) => {
    const p = [], m = Math.ceil(n * over);
    for (let i = 0; i < m; i++) { const an = a0 + i / n * TAU, r = 1 + (hash(seed * 3.3 + (i % n) * 1.7) - .5) * 2 * irr + (i >= n ? .05 * (i - n + 1) : 0); p.push([cx + Math.cos(an) * rx * r, cy + Math.sin(an) * ry * r]); }
    return p;
  };
  // child's handwriting: uneven letters, written one at a time (o.d = seconds for the whole word)
  function hand(txt, x, y, size, col, age, o = {}) {
    if (age <= 0) return;
    const n = [...txt].length, shown = o.d ? Math.ceil(clamp(age / o.d) * n) : n, sd = o.seed ?? (x * .37 + y * .11);
    type(txt, x, y, size, { font: 'hand', col, align: o.align || 'left', rot: o.rot || 0, wear: 0, track: o.track ?? .05,
      per: i => i >= shown ? { alpha: 0 } : { rot: (hash(sd + i * 3.3) - .5) * (o.tilt ?? .3) + wv(sd + i, 1, .012), s: .82 + hash(sd + i * 5.1) * .4, dy: (hash(sd + i * 7.7) - .5) * .16 + wv(sd + i, 2, .006), col: o.cols ? o.cols[i % o.cols.length] : null } });
  }
  // a lyric line, word by word on the word times: words = [[txt, time, colour?], ...]
  function lyric(t, words, x, y, size, col, o = {}) {
    words.reduce((px, [w, tw, c], i) => {
      hand(w, px, y + (hash(i * 2.9 + x) - .5) * size * .2, size, c || col, t - tw, { d: Math.min(.3, w.length * .05), seed: x + i * 17.3, rot: (hash(i * 5.3 + y) - .5) * .07 + (o.rot || 0) });
      return px + typeW(w, size, { font: 'hand', track: .05 }) + size * (o.gap ?? .4);
    }, x);
  }
  // crayon texture for the lettering: wax streaks knocked out of whatever sits on the 2D layer right now.
  // (a deterministic texture, built once, like the shared print-wear pattern)
  let grainPat = null;
  function crayGrain(str = .85) {
    const c = g2d();
    if (!grainPat) {
      const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d'), rnd = lcg(41); g.strokeStyle = '#000'; g.lineCap = 'round';
      for (let i = 0; i < 560; i++) { const px = rnd() * 256, py = rnd() * 256, l = 4 + rnd() * 15, an = -.95 + (rnd() - .5) * .5; g.lineWidth = .7 + rnd() * 1.7; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(an) * l, py + Math.sin(an) * l); g.stroke(); }
      grainPat = c.createPattern(cv, 'repeat');
    }
    c.globalCompositeOperation = 'destination-out'; c.globalAlpha = str; c.fillStyle = grainPat; c.fillRect(-80, -80, 2080, 1240); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
  }
  // the sheet of paper. Local space: the drawing lives in 0..1920 x 0..1080, the paper runs 70 px past that.
  function paper() { rect2(-56, -52, 2060, 1220, PAL.ink); rect2(-70, -70, 2060, 1220, PAL.paper, { stroke: PAL.ink, lw: 5 }); flush2D(); }

  // ---------- the naive Jun Jun, front view. (cx, cy) = centre of the head, s = unit, a = seconds of drawing done ----------
  // mood: 'happy' (the smile she would never make) | 'stern' (same smile, plus eyebrows) | 'angry' (zigzag teeth)
  function kidJun(cx, cy, s, a, o = {}) {
    const mood = o.mood || 'happy', lw = clamp(s / 26, .45, 1.5) * 1.1, P = pts => pts.map(p => [cx + p[0] * s, cy + p[1] * s]);
    let sd = (o.seed || 1) * 50;
    const st = (t0, d) => clamp((a - t0) / d);
    const L = (pts, t0, d, col = CR.ink, w = 1, cv = .5) => cray(P(pts), col, w * lw, st(t0, d), sd++, cv);
    const F = (pts, col, t0, d, ang = 50) => fillC(P(pts), col, { p: st(t0, d), a: ang, d: s * .46, w: 1.9 * lw, seed: sd++ });
    const dot = (x, y, r, t0, col = CR.ink) => { sd++; if (a > t0) cray(P(blob(x, y, r, r, sd, 6, .1, 1.35)), col, lw * 1.9, 1, sd, .5); };
    const body = o.body !== false;
    // the colouring-in sits under the outline; it goes outside the lines a little
    F(blob(.15, .1, 5.6, 5.0, 2, 16, .06, 1), CR.coat, .55, .35);
    if (body) F(blob(-.1, 9.3, 4.5, 4.8, 3, 16, .06, 1), CR.coat, .78, .35, 62);
    L(blob(0, 0, 5.6, 5.0, 2, 16, .07), 0, .3);
    L([[-5.0, -2.4], [-4.7, -7.8], [-1.7, -4.7]], .24, .12, CR.ink, 1, 0); L([[1.7, -4.7], [4.7, -7.8], [5.0, -2.4]], .32, .12, CR.ink, 1, 0);
    if (body) {
      L([[-3.2, 4.6], [-4.6, 7.5], [-4.7, 11.2], [-3.5, 13.4], [0, 13.8], [3.5, 13.4], [4.7, 11.2], [4.6, 7.5], [3.2, 4.6]], .4, .22);
      L([[-2.6, 8.6], [-2.8, 13.5], [-.7, 13.6], [-.6, 9.0]], .58, .1, CR.ink, .9, .2); L([[.6, 9.0], [.7, 13.6], [2.8, 13.5], [2.6, 8.6]], .64, .1, CR.ink, .9, .2);
      const sp = []; for (let i = 0; i < 15; i++) { const an = 2.6 + i * .62, r = 2.8 - i * .165; sp.push([7.0 + Math.cos(an) * r, 9.6 + Math.sin(an) * r]); }
      L(sp, .7, .14);
      L([[-3.6, 5.8], [0, 7.3], [3.6, 5.8]], 1.42, .1, CR.blue, 1.5); dot(0, 8.0, .45, 1.5, CR.sun);
      for (let i = 0; i < 3; i++) for (const sg of [1, -1]) L([[sg * 4.5, 7.7 + i * 1.6], [sg * 3.2, 8.1 + i * 1.6]], 1.0 + i * .03, .06, CR.brown, 1.1, 0);
    }
    for (let i = -1; i <= 1; i++) L([[i * 1.3, -4.7], [i * 1.2 + .2, -3.2]], 1.0 + i * .03, .06, CR.brown, 1.2, 0);
    // face
    const ey = -1.2, ex = 2.35, ang = mood === 'angry';
    dot(-ex, ey, .42, 1.14); dot(ex, ey, .42, 1.18);
    if (mood === 'happy') for (const sg of [1, -1]) for (let i = 0; i < 3; i++) L([[sg * (ex - .5 + i * .55), ey - .95], [sg * (ex - .8 + i * .8), ey - 1.8]], 1.2, .05, CR.ink, .55, 0);
    else for (const sg of [1, -1]) L([[sg * 3.9, ey - 2.1 + (ang ? -.5 : 0)], [sg * 1.0, ey - 1.0 + (ang ? .3 : 0)]], 1.2, .06, CR.ink, ang ? 1.8 : 1.4, 0);
    dot(0, .25, .5, 1.24);
    if (ang) {
      L([[-3.3, 1.7], [3.3, 1.7], [3.3, 4.0], [-3.3, 4.0], [-3.3, 1.7]], 1.3, .12, CR.ink, 1, 0);
      L([[-3.3, 2.9], [-2.5, 2.1], [-1.7, 3.6], [-.9, 2.1], [-.1, 3.6], [.7, 2.1], [1.5, 3.6], [2.3, 2.1], [3.3, 3.0]], 1.4, .12, CR.ink, .8, 0);
    } else {
      F([[-3.5, 1.5], [3.5, 1.5], [2.8, 3.3], [1.3, 4.15], [-1.3, 4.15], [-2.8, 3.3]], CR.pink, 1.34, .1, 20);
      L([[-3.7, 1.45], [3.7, 1.45], [2.9, 3.4], [1.3, 4.3], [-1.3, 4.3], [-2.9, 3.4], [-3.7, 1.45]], 1.28, .14, CR.ink, 1, .35);
      for (const sg of [1, -1]) L(blob(sg * 4.45, .55, .7, .55, 9, 7, .1, 1.5), 1.4, .06, CR.pink, 1.2);
    }
    // crown: a zigzag, coloured yellow
    if (o.crown !== false) {
      const cr = [[-2.3, -4.8], [-2.8, -7.9], [-1.3, -6.4], [0, -8.4], [1.3, -6.4], [2.8, -7.9], [2.3, -4.8]];
      F(cr, CR.sun, 1.5, .1, 100); L(cr.concat([cr[0]]), 1.44, .14, CR.ink, .9, 0);
      for (const [gx, gy] of [[-2.8, -8.2], [0, -8.7], [2.8, -8.2]]) dot(gx, gy, .28, 1.58, CR.pink);
    }
  }
  // ---------- the naive Jun Jun on patrol, profile, faces +x. (x, y) = the ground under her ----------
  function kidJunSide(x, y, s, a, o = {}) {
    const lw = clamp(s / 26, .45, 1.5) * 1.1, P = pts => pts.map(p => [x + p[0] * s, y + p[1] * s]);
    let sd = (o.seed || 7) * 50;
    const st = (t0, d) => clamp((a - t0) / d);
    const L = (pts, t0, d, col = CR.ink, w = 1, cv = .5) => cray(P(pts), col, w * lw, st(t0, d), sd++, cv);
    const F = (pts, col, t0, d, ang = 50) => fillC(P(pts), col, { p: st(t0, d), a: ang, d: s * .46, w: 1.9 * lw, seed: sd++ });
    const dot = (px, py, r, t0, col = CR.ink) => { sd++; if (a > t0) cray(P(blob(px, py, r, r, sd, 6, .1, 1.35)), col, lw * 2.1, 1, sd, .5); };
    F(blob(0, -7.3, 6.8, 3.4, 4, 16, .05, 1), CR.coat, .5, .3); F(blob(7.7, -12.4, 4.0, 3.7, 5, 14, .05, 1), CR.coat, .62, .2, 65);
    L(blob(0, -7.3, 6.7, 3.3, 4, 16, .06), 0, .25);
    [[-4.9, -.5], [-3.2, .5], [3.0, -.5], [4.7, .5]].forEach(([lx, k], i) => L([[lx, -4.6], [lx + k, 0], [lx + k + 1.3, 0]], .22 + i * .04, .07, CR.ink, 1, 0));
    const sp = []; for (let i = 0; i < 14; i++) { const an = .9 - i * .62, r = 2.8 - i * .17; sp.push([-7.6 + Math.cos(an) * r, -11.4 + Math.sin(an) * r]); }
    L(sp, .38, .12);
    L(blob(7.7, -12.4, 3.9, 3.6, 5, 14, .06), .46, .2);
    L(blob(11.2, -11.2, 1.9, 1.5, 6, 9, .06), .6, .1);
    L([[5.0, -15.0], [5.5, -18.3], [7.3, -15.9]], .66, .07, CR.ink, 1, 0); L([[8.0, -15.9], [9.3, -18.4], [10.3, -15.0]], .7, .07, CR.ink, 1, 0);
    for (let i = 0; i < 5; i++) L([[-4.2 + i * 2.0, -10.3], [-4.6 + i * 2.0, -7.6]], .84 + i * .02, .05, CR.brown, 1.2, 0);
    L([[3.3, -10.5], [3.9, -4.2]], .94, .06, CR.blue, 1.6, 0);
    dot(8.4, -13.3, .46, .98); dot(12.8, -11.8, .5, 1.02);
    L([[6.4, -10.9], [8.2, -9.5], [10.6, -9.7], [12.4, -10.6]], 1.04, .08);
    const cr = [[5.5, -19.2], [5.0, -22], [6.5, -20.6], [7.7, -22.4], [8.9, -20.6], [10.4, -22], [9.9, -19.2]];
    F(cr, CR.sun, 1.16, .08, 100); L(cr.concat([cr[0]]), 1.1, .12, CR.ink, .9, 0);
  }
  // the Commander as a stick figure, flying flat behind the lead. (x, y) = his head; returns the lead hand
  function kidCmdr(x, y, s, a, seed = 11) {
    const lw = clamp(s / 22, .5, 1.4) * 1.25, P = pts => pts.map(p => [x + p[0] * s, y + p[1] * s]); let sd = seed * 50;
    const st = (t0, d) => clamp((a - t0) / d), L = (pts, t0, d, col = CR.ink, w = 1, cv = .5) => cray(P(pts), col, w * lw, st(t0, d), sd++, cv);
    L([[-2.0, .2], [-8.2, .7]], .1, .1, CR.sage, 2.4, 0);
    L(blob(0, 0, 1.9, 1.8, 3, 10, .06), 0, .14);
    L([[-1.5, -1.3], [-.9, -2.6], [-.3, -1.6], [.4, -2.7], [1.0, -1.5]], .14, .06, CR.red, 1.2, 0);
    L([[-2.8, .5], [.6, 2.6], [4.2, 2.0]], .2, .08, CR.ink, 1, .3); L([[-3.2, .4], [-5.4, 2.8]], .26, .05, CR.ink, 1, 0);
    L([[-8.2, .7], [-12.4, -.9], [-13.2, -1.6]], .3, .07, CR.ink, 1, 0); L([[-8.2, .7], [-12.5, 2.1], [-13.4, 1.6]], .35, .07, CR.ink, 1, 0);
    if (a > .42) { cray(P(blob(-.5, -.2, .2, .2, 4, 5, .1, 1.3)), CR.ink, lw * 1.2, 1, sd + 1); cray(P(blob(.7, -.2, .2, .2, 5, 5, .1, 1.3)), CR.ink, lw * 1.2, 1, sd + 2); cray(P(blob(.2, .9, .4, .5, 6, 7, .1, 1.2)), CR.ink, lw * .7, 1, sd + 3); }
    return [x + 4.2 * s, y + 2.0 * s];
  }
  // a stick soldier dog with a helmet and a flag. (x, y) = ground, faces +x
  function stickDog(x, y, s, a, seed = 1, flagCol = CR.pink) {
    const lw = clamp(s / 22, .5, 1.4) * 1.25, P = pts => pts.map(p => [x + p[0] * s, y + p[1] * s]); let sd = seed * 50 + 900;
    const st = (t0, d) => clamp((a - t0) / d), L = (pts, t0, d, col = CR.ink, w = 1, cv = .5) => cray(P(pts), col, w * lw, st(t0, d), sd++, cv);
    L([[-3.2, -3.2], [2.2, -3.3]], 0, .06, CR.ink, 1.1, 0);
    [[-3.2, -.5], [-2.3, .4], [1.4, -.4], [2.2, .5]].forEach(([lx, k], i) => L([[lx, -3.2], [lx + k, 0]], .05 + i * .02, .04, CR.ink, 1, 0));
    L([[-3.2, -3.2], [-4.4, -5.4]], .12, .04, CR.ink, 1, 0);
    const hel = [[1.5, -5.0], [1.8, -6.5], [3.4, -7.1], [5.0, -6.4], [5.3, -5.0]];
    fillC(P(hel), CR.sage, { p: st(.26, .08), a: 30, d: s * .5, w: 2 * lw, seed: sd++ });
    L(blob(3.4, -4.6, 1.6, 1.5, seed + 2, 9, .07), .14, .1);
    L(hel.concat([hel[0]]), .24, .08, CR.ink, .9, .3);
    if (a > .3) cray(P(blob(4.0, -4.7, .16, .16, 4, 5, .1, 1.3)), CR.ink, lw * 1.2, 1, sd + 1);
    L([[4.3, -4.0], [3.5, -3.7]], .32, .03, CR.ink, .7, 0);
    L([[.4, -3.2], [.8, -8.3]], .34, .06, CR.ink, .8, 0); L([[.8, -8.3], [-1.6, -7.6], [.7, -6.9]], .4, .06, flagCol, 1.3, 0);
  }
  // a dog biscuit, as drawn by someone who has seen one
  function kidBiscuit(x, y, s, rot, a, seed = 1) {
    if (a <= 0) return;
    const r = s * .19, h = s / 2, b = s * .15, pts = [], lobe = (cx, cy, a0) => { for (let i = 0; i <= 5; i++) { const q = a0 + i / 5 * Math.PI * 1.25; pts.push([cx + Math.cos(q) * r, cy + Math.sin(q) * r]); } };
    lobe(h - r * .6, -b, -Math.PI * .75); lobe(h - r * .6, b, -Math.PI * .5); lobe(-h + r * .6, b, Math.PI * .25); lobe(-h + r * .6, -b, Math.PI * .5);
    const W2 = rotPts(pts, rot).map((p, i) => [x + p[0] * (1 + (hash(seed * 9 + i) - .5) * .12), y + p[1] * (1 + (hash(seed * 5 + i) - .5) * .12)]);
    fillC(W2, CR.tan, { p: clamp((a - .1) / .12), a: 40 + seed * 31, d: 11, w: 2, seed: seed * 3 + 400 });
    cray(W2.concat([W2[0]]), CR.brown, 1.05, clamp(a / .16), seed * 3 + 401, .3);
  }
  // a sun with a face, for the corner of the page
  function kidSun(x, y, r, a, seed = 1) {
    fillC(blob(x, y, r, r, seed, 14, .05, 1), CR.sun, { p: clamp(a / .2), a: 35, d: 11, w: 2.4, seed: seed + 600 });
    cray(blob(x, y, r, r, seed, 14, .06), CR.orange, 1.1, clamp(a / .2), seed + 601);
    for (let i = 0; i < 11; i++) { const an = i / 11 * TAU + .2, r0 = r * 1.22, r1 = r * (1.65 + hash(seed + i) * .35); cray([[x + Math.cos(an) * r0, y + Math.sin(an) * r0], [x + Math.cos(an) * r1, y + Math.sin(an) * r1]], CR.orange, 1.2, clamp((a - .16 - i * .02) / .05), seed + 610 + i, 0); }
    if (a > .42) { for (const sg of [1, -1]) cray(blob(x + sg * r * .34, y - r * .2, r * .07, r * .07, 3, 5, .1, 1.3), CR.ink, 1.4, 1, seed + 630 + sg); cray([[x - r * .42, y + r * .2], [x, y + r * .52], [x + r * .42, y + r * .2]], CR.ink, 1, clamp((a - .42) / .08), seed + 640); }
  }
  function kidFlower(x, y, s, col, a, seed = 1) {
    cray([[x + 6, y], [x - 5, y - s * 1.1], [x, y - s * 2.2]], CR.sage, 1.2, clamp(a / .1), seed + 700, .6);
    cray([[x - 2, y - s * .9], [x + s * .7, y - s * 1.5], [x - 2, y - s * .9]], CR.sage, 1, clamp((a - .06) / .08), seed + 701, .6);
    for (let i = 0; i < 5; i++) { const an = i / 5 * TAU + seed; cray(blob(x + Math.cos(an) * s * .62, y - s * 2.2 + Math.sin(an) * s * .62, s * .36, s * .36, seed + i, 7, .1, 1.3), col, 1.3, clamp((a - .1 - i * .025) / .05), seed + 710 + i); }
    if (a > .26) cray(blob(x, y - s * 2.2, s * .16, s * .16, 2, 5, .1, 1.3), CR.sun, 2, 1, seed + 720);
  }
  function kidHouse(x, y, w, h, col, a, seed = 1, lit = false) {
    if (lit) fillC([[x, y - h], [x + w, y - h], [x + w, y], [x, y]], CR.orange, { p: clamp((a - .12) / .12), a: 60, d: 12, w: 2.2, seed: seed + 800 });
    cray([[x, y], [x + 4, y - h], [x + w - 3, y - h + 5], [x + w, y], [x, y]], col, 1.1, clamp(a / .12), seed + 801, 0);
    cray([[x - 14, y - h + 4], [x + w / 2, y - h - h * .55], [x + w + 14, y - h + 6]], col, 1.1, clamp((a - .08) / .07), seed + 802, 0);
    cray([[x + w * .38, y], [x + w * .38, y - h * .5], [x + w * .64, y - h * .5], [x + w * .64, y]], col, .9, clamp((a - .14) / .06), seed + 803, 0);
  }
  // a wobbly box around a word: the child's idea of a rubber stamp
  const kidBox = (x, y, w, h, rot, col, p, seed) => cray(rotPts([[-w / 2, -h / 2], [w / 2, -h / 2 + 6], [w / 2 - 5, h / 2], [-w / 2 + 4, h / 2 - 5], [-w / 2, -h / 2 - 14]], rot).map(q => [x + q[0], y + q[1]]), col, 1.5, p, seed, 0);

  // =====================================================================================================
  // the four drawings. Each is a pure function of song time, drawn in sheet space; a finished sheet just stays finished.
  // =====================================================================================================
  // 1 · "I love the smell of biscuits in the morning": the royal pose
  function sheet1(t) {
    paper();
    // the halo, as a sun
    fillC(blob(960, 612, 262, 254, 3, 22, .04, 1), CR.sun, { p: seg(t, 178.2, 178.7), a: 28, d: 13, w: 2.5, seed: 3 });
    for (let i = 0; i < 15; i++) { const an = Math.PI * .86 + i / 14 * Math.PI * 1.28, r1 = 352 + hash(i * 3.1) * 60; cray([[960 + Math.cos(an) * 294, 612 + Math.sin(an) * 286], [960 + Math.cos(an) * r1, 612 + Math.sin(an) * r1]], CR.orange, 1.3, seg(t, 178.5 + i * .03, 178.58 + i * .03), 20 + i, 0); }
    // the cushion
    const cu = [[660, 992], [960, 978], [1260, 992], [1282, 1034], [960, 1050], [638, 1034]];
    fillC(cu, CR.pink, { p: seg(t, 180.0, 180.3), a: 150, d: 11, w: 2.4, seed: 40 }); cray(cu.concat([cu[0]]), CR.ink, 1.1, seg(t, 179.9, 180.15), 41, .3);
    kidJun(960, 606, 28.5, (t - 178.72) * 1.1, { seed: 1 });
    [[255, 480, -.4], [1665, 480, .5], [440, 660, .3], [1490, 655, -.25], [170, 800, .9], [1750, 800, -.8], [490, 865, .15], [1430, 850, -.5]].forEach(([bx, by, br], i) => kidBiscuit(bx, by, 156 - (i % 3) * 14, br, t - (180.4 + i * .1), i + 1));
    kidSun(1752, 142, 70, t - 181.02, 5);
    lyric(t, [['I', 178.16], ['LOVE', 179.10, CR.pink], ['THE', 179.46], ['SMELL', 179.82, CR.sage], ['OF', 180.02]], 76, 100, 88, CR.blue);
    hand('BISCUITS', 960, 262, 212, CR.orange, t - 180.34, { align: 'center', d: .34, seed: 4, tilt: .2, cols: [CR.orange, CR.blue, CR.pink, CR.orange, CR.sage, CR.blue, CR.orange, CR.pink] });
    lyric(t, [['IN', 180.66], ['THE', 181.0]], 96, 975, 104, CR.blue);
    hand('MORNING', 1850, 972, 116, CR.orange, t - 181.12, { align: 'right', d: .3, seed: 9 });
    crayGrain();
  }
  // 2 · "Every block's a war zone, soldier, I'm warning"
  function sheet2(t) {
    paper();
    // warning tape along the top and bottom, as far as the yellow crayon lasted
    for (const [y0, ta] of [[8, 181.56], [1012, 181.8]]) {
      const p = seg(t, ta, ta + .7);
      fillC([[20, y0 + 4], [1900, y0], [1900, y0 + 58], [20, y0 + 62]], CR.sun, { p, a: y0 < 500 ? 80 : 100, d: 12, w: 2.4, seed: 50 + y0 });
      for (let i = 0; i < 13; i++) { const x = 60 + i * 148; cray([[x, y0 + 60], [x + 62, y0 + 2]], CR.ink, 2.2, clamp(p * 13 - i), 60 + i + y0, 0); }
    }
    // every block: four houses. Two of them are having a war.
    [[100, CR.blue, false], [305, CR.sage, true], [525, CR.pink, true], [745, CR.blue, false]].forEach(([hx, c, lit], i) => kidHouse(hx, 985, 172, 132 - (i % 2) * 16, c, t - (181.7 + i * .1), i + 1, lit));
    { const sc = []; for (let i = 0; i < 40; i++) { const an = i * 1.25, r = 16 + i * 2.3 + hash(i * 2.2) * 20; sc.push([500 + Math.cos(an) * r * 1.6 + i, 800 + Math.sin(an) * r * .6 - i * .8]); } cray(sc, CR.ink, 1.5, seg(t, 182.5, 183.0), 90, .7); }
    { const bu = burstPts(500, 800, 80, 168, 9, 4, .3, .62); cray(bu.concat([bu[0]]), CR.orange, 1.6, seg(t, 182.72, 183.05), 91, 0); }
    // soldier: the same princess, with eyebrows
    kidJun(1520, 338, 28, (t - 182.0) * 1.35, { seed: 2, mood: 'stern', body: false });
    [1130, 1400, 1670].forEach((dx, i) => stickDog(dx, 985, 24, (t - (182.92 + i * .12)) * 1.4, i + 1, [CR.pink, CR.blue, CR.orange][i]));
    lyric(t, [['EVERY', 181.54], ['BLOCK’S', 182.08], ['A', 182.30]], 88, 158, 86, CR.blue);
    hand('WAR', 110, 338, 262, CR.orange, t - 182.5, { d: .16, seed: 21, tilt: .2, cols: [CR.orange, CR.red, CR.orange] });
    hand('ZONE', 150, 560, 226, CR.sage, t - 182.72, { d: .16, seed: 22, tilt: .2, cols: [CR.sage, CR.blue, CR.sage, CR.blue] });
    hand('SOLDIER,', 1490, 588, 100, CR.pink, t - 182.9, { align: 'center', d: .26, seed: 23, rot: .04 });
    hand('I’M WARNING!', 1470, 728, 84, CR.red, t - 183.28, { align: 'center', d: .6, seed: 24, rot: -.05 });
    crayGrain();
    kidBox(1470, 730, 700, 128, -.05, CR.red, seg(t, 183.7, 183.98), 95);
  }
  // 3 · "Pass in peace, or you're catchin' that growl": both options on one page
  function sheet3(t) {
    paper();
    const tOr = 185.38;
    // option A: a sun, a heart, flowers
    fillC(blob(450, 640, 300, 280, 7, 22, .04, 1), mixCol(PAL.sage, PAL.paper, .1), { p: seg(t, 184.2, 184.7), a: 40, d: 15, w: 2.5, seed: 100 });
    { const hp = []; for (let i = 0; i <= 26; i++) { const q = i / 26 * TAU, hx = 16 * Math.pow(Math.sin(q), 3), hy = -(13 * Math.cos(q) - 5 * Math.cos(2 * q) - 2 * Math.cos(3 * q) - Math.cos(4 * q)); hp.push([815 + hx * 4.6, 470 + hy * 4.6]); } cray(hp, CR.pink, 1.5, seg(t, 185.0, 185.3), 101, .5); }
    kidJun(450, 590, 21, (t - 184.3) * 2.2, { seed: 3 });
    [[95, CR.pink], [225, CR.orange], [700, CR.pink], [850, CR.orange]].forEach(([fx, c], i) => kidFlower(fx, 1030, 50 + (i % 2) * 10, c, t - (184.5 + i * .12), i + 1));
    // the line down the middle
    cray([[1040, -40], [985, 300], [1010, 640], [950, 1120]], CR.ink, 1.6, seg(t, tOr - .16, tOr + .1), 110, .5);
    // option B
    { const zz = []; for (let i = 0; i < 15; i++) zz.push([1140 + i * 49, i % 2 ? 992 : 1030]); cray(zz, CR.orange, 1.6, seg(t, 186.45, 186.7), 111, 0);
      for (let i = 0; i < 7; i++) { const an = -2.7 + i * .38 + (i > 3 ? 1.1 : 0), c0 = [1500 + Math.cos(an) * 262, 540 + Math.sin(an) * 232], c1 = [1500 + Math.cos(an) * 335, 540 + Math.sin(an) * 292], nx = -Math.sin(an) * 14, ny = Math.cos(an) * 14;
        cray([c0, [lerp(c0[0], c1[0], .33) + nx, lerp(c0[1], c1[1], .33) + ny], [lerp(c0[0], c1[0], .66) - nx, lerp(c0[1], c1[1], .66) - ny], c1], CR.red, 1.3, seg(t, 186.2 + i * .03, 186.3 + i * .03), 120 + i, 0); } }
    kidJun(1500, 560, 31, (t - 185.5) * 2.2, { seed: 4, mood: 'angry', body: false });
    lyric(t, [['PASS', 184.18], ['IN', 184.72]], 96, 104, 96, CR.blue);
    hand('PEACE', 450, 250, 190, CR.pink, t - 185.0, { align: 'center', d: .3, seed: 31, tilt: .2, cols: [CR.pink, CR.blue, CR.orange, CR.pink, CR.blue] });
    lyric(t, [['OR', 185.38], ['YOU’RE', 185.56]], 1110, 92, 74, CR.blue, { gap: .34 });
    lyric(t, [['CATCHIN’', 185.72], ['THAT', 185.98]], 1150, 190, 74, CR.blue, { gap: .34 });
    hand('GROWL', 1490, 868, 200, CR.red, t - 186.28, { align: 'center', d: .3, seed: 32, tilt: .34, cols: [CR.red, CR.orange, CR.red, CR.ink, CR.red] });
    crayGrain();
  }
  // 4 · "Princess JunJun's on patrol, movin' through the prowl": the name card
  function sheet4(t) {
    paper();
    cray([[60, 952], [500, 940], [1000, 950], [1500, 938], [1860, 946]], CR.pink, 3.2, seg(t, 187.3, 187.75), 130, .5);
    for (let i = 0; i < 6; i++) { const y = 610 + i * 50 + hash(i) * 20, x0 = 60 + hash(i * 3) * 200; cray([[x0, y], [x0 + 150 + hash(i * 7) * 200, y + 3]], CR.blue, .9, seg(t, 187.8 + i * .04, 187.9 + i * .04), 131 + i, 0); }
    const hd = kidCmdr(470, 742, 18, (t - 187.74) * 1.6);
    cray([[1028, 722], [800, 810], [hd[0], hd[1]]], CR.sun, 1.3, seg(t, 187.66, 187.84), 140, .6); cray([[1028, 722], [800, 810], [hd[0], hd[1]]], CR.sage, .6, seg(t, 187.66, 187.84), 141, .6);
    kidJunSide(960, 940, 21, (t - 186.95) * 1.7, { seed: 7 });
    [[1300, 968], [1420, 934], [1540, 968], [1660, 936]].forEach(([px, py], i) => { if (t > 188.3 + i * .1) { cray(blob(px, py, 15, 12, i, 6, .1, 1.3), CR.ink, 1.6, 1, 150 + i); for (let j = -1; j <= 1; j++) cray(blob(px + j * 15 + 4, py - 22 - (j ? 0 : 6), 5, 5, i + j, 5, .1, 1.3), CR.ink, 1.1, 1, 160 + i * 3 + j); } });
    hand('PRINCESS', 960, 160, 222, CR.orange, t - 186.72, { align: 'center', d: .2, seed: 41, tilt: .2, cols: [CR.orange, CR.red] });
    hand('JUNJUN’S', 960, 392, 236, CR.blue, t - 186.92, { align: 'center', d: .46, seed: 42, tilt: .22, cols: [CR.blue, CR.pink, CR.sage, CR.blue, CR.orange, CR.sage, CR.pink, CR.blue] });
    lyric(t, [['ON', 187.44], ['PATROL', 187.54]], 1420, 760, 90, CR.red, { rot: -.09, gap: .3 });
    lyric(t, [['MOVIN’', 187.76], ['THROUGH', 188.28], ['THE', 188.62], ['PROWL', 188.82, CR.blue]], 110, 1020, 76, CR.sage, { gap: .36 });
    crayGrain();
    kidBox(1645, 748, 560, 150, -.09, CR.red, seg(t, 187.7, 188.0), 170);
  }

  // close-up camera for a sheet being drawn: a slow drift over [t0, t1]. Returns camBegin arguments.
  const closeUp = (i, t, t0, t1) => { const k = seg(t, t0, t1), d = i % 2 ? -1 : 1; return [960 + lerp(-16, 16, k) * d, 540 + lerp(9, -9, k) * d, lerp(1.025, 1.065, i === 1 ? 1 - k : k), lerp(-.006, .005, k) * d]; };
  // a new sheet is laid on top of the last one
  function layOn(q, cam) { const e = 1 - easeOut5(q); camBegin(cam[0] - e * 2300, cam[1] + e * 420, cam[2], cam[3] + e * .09); }
  const LINE = [178.1, 181.42, 184.06, 186.6], SHEETS = [sheet1, sheet2, sheet3, sheet4];
  function kids(i) {
    return (t, lt, dur) => {
      cb = Math.floor(t * CB);
      const cam = closeUp(i, t, LINE[i], LINE[i + 1]);
      bg(PAL.paper);
      if (i > 0 && lt < .3) { camBegin(...closeUp(i - 1, LINE[i], LINE[i - 1], LINE[i])); SHEETS[i - 1](t); camEnd(); layOn(lt / .3, cam); }
      else camBegin(...cam);
      SHEETS[i](t);
      camEnd();
    };
  }

  // ---------- the pull-back: the fridge, and the critic ----------
  // where each sheet hangs on the door (world = the final frame): centre, scale, tilt.
  // NOTE: p5.brush culls stamps by (local position + the matrix translation), which is only right near zoom 1. A sheet
  // drawn small must therefore have its local origin land inside the top-left half of the screen, or its lower
  // strokes vanish. That is why nothing hangs low on the door.
  const FR = [{ cx: 318, cy: 186, s: .3, r: -.07 }, { cx: 150, cy: 566, s: .3, r: .05 }, { cx: 1000, cy: 112, s: .27, r: .045 }, { cx: 672, cy: 524, s: .44, r: .016 }];
  // camera for drawing in sheet space while the main camera C = [cx, cy, zoom, rot] looks at the door
  function sheetCam(S, C) {
    const dx = (C[0] - S.cx) / S.s, dy = (C[1] - S.cy) / S.s, c = Math.cos(-S.r), sn = Math.sin(-S.r);
    camBegin(960 + dx * c - dy * sn, 540 + dx * sn + dy * c, C[2] * S.s, C[3] + S.r);
  }
  function fridge(t, lt, dur) {
    cb = Math.floor(t * CB);
    const S4 = FR[3], Z0 = 1 / S4.s, p = ease(seg(t, 187.25, 189.0)), Z = Math.exp(lerp(Math.log(Z0), 0, p));
    const pvx = (S4.cx * Z0 - 960) / (Z0 - 1), pvy = (S4.cy * Z0 - 540) / (Z0 - 1);          // the zoom pivot: a point that stays put
    const C = [pvx - (pvx - 960) / Z, pvy - (pvy - 540) / Z, Z, -S4.r * (1 - p)];
    if (lt < .3) {
      bg(PAL.paper); camBegin(...closeUp(2, LINE[3], LINE[2], LINE[3])); sheet3(t); camEnd();
      const e = 1 - easeOut5(lt / .3); sheetCam(S4, [C[0] - e * 2300 * S4.s, C[1] + e * 420 * S4.s, C[2], C[3] + e * .09]); sheet4(t); camEnd();
      return;
    }
    // the kitchen: a wall, a fridge door, a handle
    bg(PAL.pink);
    camBegin(...C);
    halftone(1330, -200, 900, 1500, { cell: 24, col: PAL.paper, grad: [0, 1300, 0, -100], alpha: .7 });
    rect2(-3000, -3000, 4336, 7000, PAL.white);
    halftone(-600, 560, 1930, 760, { cell: 24, col: PAL.pink, grad: [0, 640, 0, 1420], alpha: .75 });
    rect2(1336, -3000, 46, 7000, mixCol(PAL.white, PAL.ink, .22)); rect2(1326, -3000, 14, 7000, PAL.ink); rect2(1380, -3000, 10, 7000, PAL.ink);
    rect2(1202, 132, 58, 760, PAL.ink); rect2(1192, 122, 58, 760, PAL.sage, { stroke: PAL.ink, lw: 8 });
    camEnd();
    const vis = S => Math.abs((S.cx - C[0]) * Z) < 960 + 1060 * S.s * Z && Math.abs((S.cy - C[1]) * Z) < 540 + 640 * S.s * Z;
    [sheet1, sheet2, sheet3].forEach((fn, i) => { if (vis(FR[i])) { sheetCam(FR[i], C); fn(t); camEnd(); } });
    camBegin(...C);
    for (const [mx, my, col, r] of [[306, 14, PAL.blue, 20], [118, 388, PAL.orange, 18]]) circ2(mx, my, r, col, { stroke: PAL.ink, lw: 6 });
    camEnd();
    sheetCam(S4, C); sheet4(t); camEnd();
    // magnets (the ones on the big sheet sit on its top edge, just out of the close-up)
    camBegin(...C);
    circ2(296, 250, 24, PAL.lime, { stroke: PAL.ink, lw: 7 }); circ2(1052, 262, 24, PAL.orange, { stroke: PAL.ink, lw: 7 });
    [...'GOOD DOG'].forEach((ch, i) => { if (ch !== ' ') type(ch, 300 + i * 66 + (i > 4 ? 14 : 0), 925 + (hash(i * 3.7) - .5) * 30 + (i > 4 ? 22 : 0), 78, { col: [PAL.orange, PAL.blue, PAL.lime, PAL.pink, PAL.sage][i % 5], stroke: PAL.ink, strokeW: .1, rot: (hash(i * 9.1) - .5) * .5, wear: 0 }); });
    biscuit(672, 248, 100, .08, { col: PAL.pink });
    camEnd();
    // Her Highness reviews the portrait. One slow blink is the whole review.
    const q = easeOut(seg(t, 187.85, 189.0)), bl = t - 188.98, lidB = bl < 0 ? 0 : bl < .18 ? ease(bl / .18) : bl < .34 ? 1 : 1 - ease((bl - .34) / .22);
    if (q > 0) junjunSide(lerp(2990, 1915, q), lerp(1620, 1492, q), 50, { ...EXPR.judge, flip: true, look: [.9, -.6], lid: Math.max(.33, lidB), brow: lerp(.5, .32, seg(bl, .3, .5)), mouth: 'flat', head: { rot: -.1 }, shadow: false });
    const la = t - 188.3;
    if (la > 0) label(bl > .2 ? ['PORTRAIT UNDER REVIEW', 'VERDICT: NOT DISAPPROVED'] : [typed('PORTRAIT UNDER REVIEW', la, 44)], W - 64, 64, { size: 26, col: PAL.ink, bg: PAL.lime, align: 'right', screen: true, pad: 14 });
  }

  // =====================================================================================================
  // 2 · curtain call (the band is back)
  // =====================================================================================================
  function curtain(t, lt, dur) {
    const tCast = 190.85, tBow = 192.35, tDrop = 193.05, tDark = 193.34, GY = 968, u = 22;
    const s1 = slam(lt + .02, .1), s2 = slam(lt - .14, .1), b = bp(t), P = pulse(t, 5), step = Math.floor(b) + easeOut(frac(b) * 3);
    const [sx, sy] = shakeXY(t, (s1.shake + s2.shake + slam(lt - .27, .1).shake) * 18 + hit(t, tCast, 9) * 18 + hit(t, tBow, 9) * 14), dark = t >= tDark;
    const fall = d => easeIn(seg(t, tDrop + d, tDrop + d + .25)) * 1500, open = easeOut5(seg(lt, .04, .62)), bow = hit(t, tBow, 5);
    bg(dark ? PAL.ink : PAL.orange);
    camBegin(960 + sx, lerp(690, 540, open) + sy, lerp(1.5, 1, open) + seg(lt, .6, dur) * .045 + P * .01, 0);
    if (!dark) { sunburst(960, 500, { n: 16, col: PAL.paper, alpha: .2, rot: step * TAU / 32 }); halftone(0, 600, W, 400, { cell: 24, col: PAL.ink, grad: [0, 640, 0, 1150], alpha: .4 }); }
    type('PRINCESS', 960, 215 + fall(0), fitSize('PRINCESS', 1800), { col: PAL.ink, k: s1.k, alpha: s1.alpha, seed: 11 });
    // her name is split around her: JUN, the princess, JUN
    for (const [jx, sl, d] of [[372, s2, .05], [1548, slam(lt - .27, .1), .09]]) type('JUN', jx, 612 + fall(d), fitSize('JUN', 610), { col: PAL.paper, k: sl.k, alpha: sl.alpha, shadow: { col: PAL.ink, dx: .022, dy: .026 }, seed: 13 + jx });
    if (!dark) dryStroke(-80, GY + 78 + fall(.16), 2000, GY + 66 + fall(.16), 230, PAL.paper, { seed: 9, p: easeOut(seg(lt, .1, .4)) });
    if (!dark) { circ2(960, 470, 236 + P * 12, PAL.lime, { stroke: PAL.ink, lw: 10 }); const c = g2d(); c.strokeStyle = PAL.paper; c.lineWidth = 9 * (1 - frac(b)); c.globalAlpha = (1 - frac(b)) * .9; c.beginPath(); c.arc(960, 470, 246 + easeOut(frac(b)) * 180, 0, TAU); c.stroke(); c.globalAlpha = 1; }
    // the company, in order of appearance
    const inn = i => popIn(t - tCast - i * .045, .16), hop = i => Math.abs(Math.sin(clamp((t - tBow - i * .04) / .34) * Math.PI)) * 1.6;
    const who = (i, fn) => { const k = inn(i); if (k > 0 && !dark) { push(); translate(0, fall(.03 + i * .022) + (1 - k) * 60); fn(k); pop(); } };
    who(0, () => commander(452, GY, u, { pose: 'slump', face: 'dead', flip: true }));
    who(2, () => squirrel(596, GY - 20.3 * u - hop(2) * u, u * .8, { flip: true }));
    who(1, () => yorkie(240, GY - 3.3 * u, u, { bark: bow, hop: hop(1) }));
    who(3, () => squirrel(88, GY - hop(3) * u, u, {}));
    who(4, () => cat(1420, GY, u, { eyes: 1 - bow * .8 }));
    who(5, () => pup(1600, GY - hop(5) * u * .6, u, { flip: true, puff: bow }));
    who(6, () => hydrant(1800, GY, u));
    who(7, () => crow(1800, GY - 11.3 * u - hop(7) * u, u, { flip: true, cap: true, caw: bow, flap: t > tBow && t < tBow + .4 ? (t - tBow) * 5 : null }));
    // Her Highness does not take a bow. She closes her eyes at you.
    cushion(960, GY - 46, 620, { col: PAL.pink });
    junjunSit(960, GY - 30, 24, { ...EXPR.royal, lid: Math.max(dark ? .3 : .45, bow > .2 ? 1 : 0, blink(t, 4)), brow: dark ? .5 : .2, crown: seg(lt, .16, .36), hy: -P * .1 });
    // biscuits, thrown like roses
    for (let i = 0; i < 9; i++) {
      const a = t - tCast - .1 - i * .06; if (a <= 0) continue;
      const k = clamp(a / .55), x0 = 200 + hash(i * 3.1) * 1500, x1 = [705, 1225, 340, 1510, 820, 1115, 60, 1700, 560][i], y1 = GY + 22 + hash(i * 1.9) * 24;
      biscuit(lerp(x0, x1, k), lerp(1240, y1, k) - Math.sin(k * Math.PI) * (290 + hash(i * 7.7) * 130) + fall(.1 + i * .012) - (k >= 1 ? hop(i) * 24 : 0), 78 + hash(i * 4.3) * 26, (1 - easeOut(k)) * (6 + i) + hash(i * 9.1) * 3, {});
    }
    camEnd();
    // credits
    if (t < tDrop) [['INSURGENTS (2)', 124, 0], ['YORKIE PATROL', 336, 1], ['THE COMMANDER', 548, 2], ['SNIPER', 1420, 3], ['THE PUP', 1592, 4], ['CHECKPOINT + OFFICER', 1892, 5]].forEach(([tx, lx, i]) => {
      const a = t - (tCast + .5 + i * .14); if (a > 0) label(typed(tx, a, 50), lx, 1040, { size: 19, col: i % 2 ? PAL.lime : PAL.paper, bg: PAL.ink, align: i === 5 ? 'right' : 'center', screen: true, pad: 8 });
    });
    if (lt < .09) flash(1 - lt / .09, PAL.white);
  }

  // =====================================================================================================
  // 3 · "And tomorrow…": her eyes, close. The last stare.
  // =====================================================================================================
  function eyes(t, lt, dur) {
    const t0 = 193.5, tSay = 193.8, tLock = 196.1, tNarrow = 196.6, tEnd = 197.58, u = 140;
    const build = seg(t, t0 + .2, tEnd), lock = easeOut5((t - tLock) / .09), [sx, sy] = shakeXY(t, hit(t, tLock, 9) * 10 + hit(t, tNarrow, 9) * 7);
    const NIGHT = { fur: PAL.ink, white: PAL.ink, dark: PAL.ink, grey: PAL.ink, ink: PAL.ink, pink: PAL.ink, mouth: PAL.ink, harness: PAL.ink, trim: PAL.ink, eye: PAL.paper, iris: PAL.orange, gold: PAL.ink };
    bg(PAL.ink);
    camBegin(960 + sx, 540 + sy, lerp(1, 1.24, Math.pow(seg(t, t0, tEnd), 1.4)) + hit(t, tLock, 6) * .03, 0);
    junjunBust(960, 540 + .78 * u, u, { coat: NIGHT, bust: false, mouth: 'flat', brow: .8, look: t < tLock ? [lerp(-.5, -.72, seg(t, t0, tLock)), -.25] : [lerp(-.72, 0, lock), lerp(-.25, 0, lock)],
      lid: lerp(1, .2, easeOut5(lt / .1)) + .26 * ease(seg(t, tNarrow, tNarrow + .12)), iris: lerp(.95, .62, easeOut(seg(t, tLock, tLock + .2))) });
    speedLines(960, 540, { n: Math.round(lerp(26, 130, build)), r0: lerp(1500, 800, easeOut(build)) - hit(t, tLock, 5) * 90, r1: 2300, col: PAL.orange, w: [.004, lerp(.012, .034, build)], seed: 5, boil: true, boilRate: lerp(3, 12, build), ey: .47, jitter: .3 });
    for (let i = 0; i < 3; i++) { const a = t - (tLock + .04 + i * .16); if (a > 0) type('ゴ', 265 + i * 40 + Math.sin(i * 2.1) * 26, 770 - i * 138, 112 + i * 14, { font: 'jp', col: PAL.orange, k: popIn(a, .12), rot: -.18 + i * .05, wear: .2 }); }
    camEnd();
    letterbox(1, PAL.ink, 150);
    rect2(0, 148, W, 5, PAL.orange, { screen: true, alpha: seg(lt, 0, .1) }); rect2(0, H - 153, W, 5, PAL.orange, { screen: true, alpha: seg(lt, 0, .1) });
    label(typed('AND TOMORROW…', t - tSay, 17), 960, H - 108, { size: 62, col: PAL.paper, align: 'center', screen: true });
    const ja = t - 194.95; if (ja > 0) type('明日', W - 210, 76, 96, { font: 'jp', col: PAL.orange, k: popIn(ja, .14), screen: true, wear: .15 });
    hud(['NEXT OPERATION', 'T-MINUS ' + (t < tEnd ? '08:59:5' + Math.max(0, 9 - Math.floor(lt * 2)) : '')], { corner: 'tl', col: PAL.paper, alpha: seg(lt, .5, .7) });
    if (lt < .07) flash(1 - lt / .07, PAL.orange);
  }

  // =====================================================================================================
  // 4 · "we redeploy.": the last impact frame, then the end card
  // =====================================================================================================
  function redeploy(t, lt, dur) {
    const tWe = 197.58, tRe = 198.75, tJp = 199.25, tLast = 200.25;
    const a = t - tWe, a2 = t - tRe, a3 = t - tJp, a4 = t - tLast, big = a2 >= 0;
    const [sx, sy] = shakeXY(t, 40 * Math.exp(-a * 5) + (big ? 70 * Math.exp(-a2 * 4.5) : 0) + hit(t, tJp, 6) * 30 + hit(t, tLast, 5) * 46, 24);
    const inv = (a2 > .3 && a2 < .39) || (a4 > 0 && a4 < .09), ia = big ? a2 : a, punch = Math.exp(-ia * 14);
    camBegin(960 + sx, 540 + sy, (big ? 1.08 : 1.05) - .06 * easeOut(ia / .5) + seg(t, tRe, 201) * .03, (hash(Math.floor(t * 24)) - .5) * .034 * Math.exp(-ia * 5));
    impactFrame(960, 440, ia, { accent: PAL.orange, dark: inv ? PAL.white : PAL.ink, light: inv ? PAL.ink : PAL.white, seed: big ? 23 : 17, size: big ? 1.22 : .95 });
    // 再出撃: redeploy
    [...'再出撃'].forEach((ch, i) => { const k = t - (tJp + i * .07); if (k > 0) type(ch, 1650 + (i % 2) * 30, 150 + i * 200, 192, { font: 'jp', col: PAL.orange, stroke: PAL.ink, strokeW: .05, rot: .05 - i * .03, k: slam(k, .09).k, alpha: clamp(k / .04), wear: .15 }); });
    const ws = slam(a - .02, .1);
    type('WE', 285, 300, 470, { col: PAL.orange, stroke: PAL.ink, strokeW: .04, k: ws.k, alpha: ws.alpha, rot: -.07, shadow: { col: PAL.ink, dx: .03, dy: .034 }, seed: 3, wear: .25 });
    junjunBust(960, big ? 452 : 478, big ? 57 : 54, { ...EXPR.stare, mono: true, brow: 1, lid: big ? .2 : .26, iris: big ? .52 : .62, mouth: 'flat', rage: big ? .7 : .2, ear: big ? .22 : .08, crown: 1, tilt: -.03, sx: 1 + punch * .1, sy: 1 + punch * .1 });
    if (big) {
      const s = slam(a2 - .01, .1), jz = Math.exp(-a2 * 3) + hit(t, tLast, 4) * .8;
      type('REDEPLOY', 960, 880, fitSize('REDEPLOY', 1750), { col: PAL.white, stroke: PAL.ink, strokeW: .06, k: s.k, alpha: s.alpha, rot: -.012,
        per: i => ({ dy: (hash(i + Math.floor(t * 12)) - .5) * .03 * jz, rot: (hash(i * 3 + Math.floor(t * 12)) - .5) * .05 * jz }), wear: .2, seed: 9 });
    }
    camEnd();
    flash(1 - a / .09, PAL.white); if (big) flash(1 - a2 / .1, PAL.white);
    if (a4 > 0) { const k = popIn(a4, .12); poly2(rotPts([[-240, -78], [240, -78], [240, 78], [-240, 78]], -.1).map(q => [300 + q[0] * k, 600 + q[1] * k]), PAL.lime, { screen: true, stroke: PAL.ink, lw: 8 }); stamp('06:00 SHARP', 300, 600, { k, size: 82, rot: -.1, col: PAL.ink, screen: true, seed: 6 }); }
    label('THREAT LEVEL: AKITA', W - 64, 56, { size: 24, col: PAL.ink, bg: PAL.lime, align: 'right', screen: true, alpha: seg(a2, .4, .5), pad: 12 });
  }

  function endCard(t, lt, dur) {
    bg(PAL.ink);
    type('OPERATION WALKIES', 960, 390, fitSize('OPERATION WALKIES', 1700), { col: PAL.paper, seed: 2 });
    rect2(110, 548, 1700 * easeOut(seg(lt, .15, .6)), 10, PAL.orange);
    label(typed('TO BE CONTINUED — 06:00', lt - .55, 22), 110, 596, { size: 60, col: PAL.lime });
    const pa = lt - 1.75; if (pa > 0) { const k = popIn(pa, .16); pawPrint(1640, 800, 300 * k, .24, PAL.orange); }
    flash(seg(t, DUR - 1.05, DUR - .08), '#000000');
  }

  chapter('finale', 178.1, DUR + .1, [[LINE[0], kids(0)], [LINE[1], kids(1)], [LINE[2], kids(2)], [LINE[3], fridge], [189.75, curtain], [193.5, eyes], [197.58, redeploy], [201.0, endCard]]);
})();
