// c01_intro.js: Intro (0 s to bar 8). Whispered and dark: ink frames, paper line, almost no colour, long holds.
// Colour arrives with "WAR". Word hits use the storyboard word times, nudged to the audio onsets where the whisper
// transcript is loose ("boots" 1.62, "paws" 5.40, "down" 5.72, "no" 14.04, the drone 18.96, the drum fill 22.58+).
(() => {
  const INK = PAL.ink, PAPER = PAL.paper;
  const T_BOOTS = 1.62, T_ON = 2.06, T_NAH = 3.2, T_PAW = 5.40, T_DOWN = 5.72, T_LEASH = 6.34, T_CLICK = 7.63, T_TIGHT = 7.87;
  const T_EYES = 8.25, T_STROLL = 10.2, T_NO = 14.04, T_PUSH = 14.62, T_THIS = 17.14, T_IS = 17.82, T_WAR = 18.12, T_DRONE = 18.96;
  const FLOOR = 905;                                // the hall floor
  const JX = 1300, JY = 590, JU = 56;               // her bust in the stroll card; the "no." cut holds her exactly here

  // Shared-code workaround: washes that are still pending when the very first brush stroke of a page session is drawn
  // get lost (the first frame a render worker draws loses the fill of its first shape). Every shot here starts with
  // one tiny stroke, under its own background, so the fills that follow are safe.
  const prime = () => inkLine([[2, 2], [5, 5]], .4, INK, 'inkfine', 0);

  // ---------- private props ----------
  // A human boot from the side, toe toward +x (o.flip: toward −x). (x, y) = ground under the ankle. About 9.6u tall,
  // 9.7u long. Paper leather and an ink sole, like the Commander's shoes; the trouser leg is ink with a paper edge,
  // so in the dark it is only a line. o.sy squashes it against the ground.
  function boot(x, y, u, o = {}) {
    const f = o.flip ? -1 : 1, vy = o.sy ?? 1, J = u * .03, SW = clamp(u / 16, .6, 2.8);
    const S = pts => pts.map(p => [x + f * p[0] * u + jit(J), y + p[1] * u * vy + jit(J)]);
    paint(S([[-2.5, -9.6], [1.9, -9.6], [2.0, -5.6], [3.7, -4.3], [5.5, -3.5], [6.5, -2.4], [6.7, -1.0], [-2.8, -1.0], [-2.9, -4.6]]), { wash: PAPER, ink: INK, sw: SW });
    paint(S([[-2.9, -1.0], [6.8, -1.0], [6.9, -.25], [6.5, 0], [.9, 0], [.6, -.42], [-.5, -.42], [-.8, 0], [-2.9, 0]]), { wash: INK, ink: INK, sw: SW * .6 });
    inkLine(S([[4.5, -3.95], [4.1, -2.6], [4.3, -1.05]]), SW * .7, INK, 'ink', .5);                     // toe cap
    inkLine(S([[.1, -9.5], [.3, -5.6], [2.6, -4.9]]), SW * .6, INK, 'ink', .3);                          // lace placket
    for (let i = 0; i < 4; i++) inkLine(S([[.2, -8.7 + i * .95], [1.95, -8.5 + i * .95]]), SW * .7, INK, 'ink', 0);
    paint(S([[-3.0, -8.7], [2.5, -8.7], [2.7, -44], [-3.2, -44]]), { wash: INK, ink: null });           // trouser leg
    for (const lx of [-3.0, 2.5]) inkLine(S([[lx, -8.7], [lx * 1.04, -20], [lx * 1.08, -32]]), SW * .3, PAPER, 'ink', 0);   // drawn from the hem up: started above the frame, this line did not print
    inkLine(S([[-3.0, -8.7], [2.5, -8.7]]), SW * .3, PAPER, 'ink', 0);
  }
  // Jun Jun's foreleg from the front, far too close to the lens. (x, y) = ground under the paw, p = px per unit:
  // the leg is 3.9p wide, the paw 6.5p. White leg, tan above the zigzag, like her sit pose. o.vx / o.vy stretch it.
  function bigPaw(x, y, p, o = {}) {
    const vx = o.vx ?? 1, vy = o.vy ?? 1, S = pts => pts.map(q => [x + q[0] * p * vx + jit(3), y + q[1] * p * vy + jit(3)]);
    const half = [[1.95, -15], [2.0, -3.3], [2.9, -2.5], [3.25, -1.3], [3.0, -.35], [2.4, 0], [1.7, 0], [1.55, -.3], [1.4, 0], [.15, 0], [0, -.32]];
    const leg = S(half.slice(0, -1).map(q => [-q[0], q[1]]).concat(half.slice().reverse()));
    paint(leg, { wash: PAPER, ink: null });
    paint(S([[-1.96, -15], [1.96, -15], [1.98, -9.0], [1.1, -7.9], [.4, -9.1], [-.5, -7.8], [-1.2, -9.0], [-1.98, -8.1]]), { wash: PAL.fur, ink: null });
    paint(S([[1.98, -10.6], [.2, -10.1], [1.98, -9.7]]), { wash: PAL.furDk, ink: null });
    paint(S([[-1.98, -12.2], [-.4, -11.8], [-1.98, -11.3]]), { wash: PAL.furDk, ink: null });
    paint(leg, { ink: INK, sw: 3.4 });
    for (const s of [-1, 1]) inkLine(S([[1.55 * s, -.3], [1.68 * s, -1.25], [1.45 * s, -2.1]]), 2.6, INK, 'ink', .6);
    inkLine(S([[0, -.32], [0, -1.4], [0, -2.3]]), 2.6, INK, 'ink', .4);
    for (const cx of [-2.3, -.78, .78, 2.3]) paint(S([[cx - .2, -.04], [cx + .2, -.04], [cx + .04, .3]]), { wash: INK, ink: null });   // claws
  }
  // The pool of light on the hall floor: a flat paper ellipse with a halftone rim.
  function pool(k) {
    const cx = 1080, cy = FLOOR + 22, rx = 770 * k, ry = 128 * k;
    circ2(cx, cy, rx, PAPER, { ey: ry / rx });
    halftone(cx - rx - 40, cy - ry - 40, rx * 2 + 80, ry * 2 + 80, { cell: 17, col: INK, size: (px, py) => clamp((Math.hypot((px - cx) / rx, (py - cy) / ry) - .58) / .38) });
  }
  function heart(x, y, s, col, ang = 0, o = {}) {
    if (s <= 0) return;
    const c = g2d(o.screen); c.save(); c.translate(x, y); c.rotate(ang); c.scale(s / 100, s / 100);
    c.beginPath(); c.moveTo(0, 40); c.bezierCurveTo(-74, -8, -44, -66, 0, -26); c.bezierCurveTo(44, -66, 74, -8, 0, 40); c.closePath();
    c.fillStyle = col; c.fill(); if (o.stroke) { c.lineJoin = 'round'; c.lineWidth = o.lw || 9; c.strokeStyle = o.stroke; c.stroke(); }
    c.restore();
  }
  function flower(x, y, r, k, ang = 0) {
    if (k <= 0) return;
    for (let i = 0; i < 5; i++) circ2(x + Math.cos(i / 5 * TAU + ang) * r * .6 * k, y + Math.sin(i / 5 * TAU + ang) * r * .6 * k, r * .47 * k, PAPER);
    circ2(x, y, r * .3 * k, PAL.oxblood);
  }

  // ---------- 0 – 6.34 · "Boots on?" "Nah. Paws down." · the front door ----------
  // One framing for both shots: the boots step into the light, then her paw answers.
  function hall(t) {
    const a = t - T_PAW, d = t - T_DOWN, sP = slam(a, .1), sD = slam(d, .1);
    const k = seg(t, 0, T_PAW), back = easeOut5(a / .1);                          // a slow push, undone by the slam
    const [sx, sy] = shakeXY(t, 34 * hit(t, T_PAW, 7) + 18 * hit(t, T_DOWN, 9));
    prime(); bg(INK);
    camBegin(lerp(960 + 80 * k, 960, back) + sx, lerp(540 + 40 * k, 540, back) + sy, lerp(1 + .08 * k, 1, back), 0);
    if (t > .62 || (t > .45 && t < .5)) pool(1 + .05 * hit(t, T_PAW, 12));        // the light flickers on
    if (a > 0) type('PAWS', 1360, 280, fitSize('PAWS', 800), { col: PAPER, k: sP.k, alpha: sP.alpha, rot: -.012, seed: 2 });
    if (d > 0) type('DOWN', 1360, 630, fitSize('DOWN', 800), { col: PAPER, k: sD.k, alpha: sD.alpha, rot: -.012, seed: 7 });
    // the boots: far one first. On the slam they leave the floor, and the frame.
    const fly = a > 0 ? Math.pow(a / .2, 1.6) * 1150 : 0, shuffle = 30 * ease(seg(t, 4.25, 4.42));
    if (fly < 1500) for (const [x, yo, tIn, sh] of [[1250, -26, .9, 1], [1560, 0, 1.26, 0]]) {
      if (t < tIn) continue;
      const e = seg(t, tIn, tIn + .25), bx = x + (1 - e) * 300 + sh * shuffle, by = FLOOR + yo - (1 - easeIn(e)) * 900 - fly;
      if (e >= 1 && a < 0) paint(ellPts(bx - 80, by + 6, 230, 22, 16), { wash: INK, ink: null });
      boot(bx, by, 40, { flip: true, sy: (a > 0 ? 1.22 : 1) - .1 * hit(t, tIn + .25, 16) });
    }
    if (a < 0) {
      // the question, and the answer
      if (t > T_BOOTS) type('boots', 500, 430, 104, { font: 'hand', col: PAPER, k: popIn(t - T_BOOTS, .12), rot: -.05, wear: .15 });
      if (t > T_ON) type('on?', 760, 414, 104, { font: 'hand', col: PAPER, k: popIn(t - T_ON, .12), rot: -.05, wear: .15 });
      if (t >= T_NAH) type('NAH.', 600, 660, 132, { col: PAPER, wear: .3, seed: 5 });
    }
    if (a > -.125) {
      const fall = 1 - seg(a, -.125, 0), squash = hit(t, T_PAW, 16);
      if (a >= 0) paint(ellPts(600, 1000, 420 + 60 * squash, 40, 18), { wash: INK, ink: null });
      bigPaw(600, 990 - fall * 1100, 100, { vx: 1 + .07 * squash - fall * .06, vy: 1 - .1 * squash + fall * .12 });
      if (a >= 0 && a < .24) for (let i = 0; i < 8; i++) {                         // the floor answers
        const q = i < 4 ? Math.PI + i * .13 : -(i - 4) * .13, r0 = 400 + a * 900, r1 = r0 + 30 + 150 * (1 - a / .24) * (.6 + hash(i * 3.1));
        inkLine([[600 + Math.cos(q) * r0, 960 + Math.sin(q) * r0 * .5], [600 + Math.cos(q) * r1, 960 + Math.sin(q) * r1 * .5]], 2.2, PAPER, 'ink', 0);
      }
    }
    camEnd();
    label(typed('06:00 // FRONT DOOR', t - .2, 13), 70, 56, { size: 28, col: PAPER, screen: true });
  }

  // ---------- 6.34 – 8.25 · "Leash clicks tight" · macro: the lead goes on ----------
  function leashClick(t, lt, dur) {
    const A = [640, 770], Q = [2080, 20], R = 150, aT = Math.atan2(Q[1] - A[1], Q[0] - A[0]), c1 = t - T_CLICK, c2 = t - T_TIGHT;
    const ang = c2 < 0 ? -.95 + .05 * hit(t, T_CLICK, 12) : lerp(-.95, aT, elasticOut(c2 / .4));
    const dx = Math.cos(ang), dy = Math.sin(ang), lift = c2 > 0 ? 14 * elasticOut(c2 / .4) : 0, ax = A[0] + dx * lift, ay = A[1] + dy * lift;
    const gap = c1 >= 0 ? 0 : kf(t, [[T_LEASH, 1500], [6.98, 150], [T_CLICK - .17, 150], [T_CLICK - .05, 196], [T_CLICK, 0]], easeOut) + Math.sin(t * 23) * 5 + Math.sin(t * 37) * 3;
    const hx = ax + dx * (R + 36 + gap), hy = ay + dy * (R + 36 + gap), ex = hx + dx * 196, ey = hy + dy * 196;      // hook loop, lead eye
    const [sx, sy] = shakeXY(t, 7 * hit(t, T_CLICK, 14) + 18 * hit(t, T_TIGHT, 8));
    const strapCol = mixCol(INK, PAPER, .13), sa = .09;
    prime(); bg(INK);
    camBegin(1010 + sx, 600 + sy, 1.4 + .1 * seg(lt, 0, dur), c2 > 0 ? -.016 * Math.exp(-c2 * 6) * Math.cos(c2 * 30) : 0);
    // the harness strap: a dark band with paper stitching
    { const c = g2d(), ux = Math.cos(sa), uy = Math.sin(sa), ox = A[0], oy = A[1] + 84 - lift * .6, hw = 96;
      const P = (s, w) => [ox + ux * s - uy * w, oy + uy * s + ux * w];
      poly2([P(-1400, -hw), P(1700, -hw), P(1700, hw), P(-1400, hw)], strapCol);
      c.strokeStyle = PAPER; c.lineWidth = 5; c.setLineDash([26, 20]);
      for (const w of [-hw + 22, hw - 22]) { c.beginPath(); c.moveTo(...P(-1400, w)); c.lineTo(...P(1700, w)); c.stroke(); }
      c.setLineDash([]);
      for (const w of [-hw, hw]) inkLine([P(-1400, w), P(1700, w)], 1.5, PAPER, 'ink', 0); }
    // the lime D-ring, then the tab that holds its bar
    { const c = g2d(); c.strokeStyle = PAL.lime; c.lineWidth = 46; c.lineJoin = 'round'; c.beginPath();
      c.arc(ax, ay, R, ang + Math.PI / 2, ang - Math.PI / 2, true); c.closePath(); c.stroke();
      c.save(); c.translate(ax, ay); c.rotate(ang); c.fillStyle = strapCol; c.fillRect(-52, -92, 86, 184);
      c.strokeStyle = PAPER; c.lineWidth = 5; c.strokeRect(-52, -92, 86, 184); c.fillStyle = PAPER;
      for (const y of [-58, 58]) { c.beginPath(); c.arc(-9, y, 9, 0, TAU); c.fill(); }
      c.restore(); }
    // the lead: slack, then one straight line across the frame
    { const c = g2d(), mx = (ex + Q[0]) / 2, my = (ey + Q[1]) / 2, vib = c2 > 0 ? 80 * Math.exp(-c2 * 7) * Math.cos(c2 * 62) : 0;
      const qx = c2 > 0 ? mx - Math.sin(aT) * vib : mx - 60 + Math.sin(t * 2.4) * 16, qy = c2 > 0 ? my + Math.cos(aT) * vib : my + 400 + Math.cos(t * 2.4) * 12;
      const path = () => { c.beginPath(); c.moveTo(ex, ey); c.quadraticCurveTo(qx, qy, Q[0], Q[1]); };
      c.lineCap = 'round'; c.strokeStyle = PAL.lime; c.lineWidth = 44; path(); c.stroke();
      c.lineCap = 'butt'; c.strokeStyle = INK; c.lineWidth = 4; c.setLineDash([24, 18]); path(); c.stroke(); c.setLineDash([]); }
    // the snap hook, paper-white: loop, neck, swivel, eye
    { const c = g2d(); c.save(); c.translate(hx, hy); c.rotate(ang); c.strokeStyle = PAPER; c.fillStyle = PAPER; c.lineCap = 'butt';
      c.lineWidth = 30; c.beginPath(); if (c1 < 0) c.arc(0, 0, 62, Math.PI + .62, Math.PI - .62); else c.arc(0, 0, 62, 0, TAU); c.stroke();
      if (c1 < 0) { c.lineWidth = 16; c.beginPath(); c.moveTo(-52, 38); c.lineTo(-8, 4); c.stroke(); }                 // the gate, open
      c.fillRect(70, -19, 66, 38); c.fillRect(118, -31, 24, 62);
      c.lineWidth = 22; c.beginPath(); c.arc(196, 0, 40, 0, TAU); c.stroke();
      if (c1 >= 0) { c.strokeStyle = INK; c.lineWidth = 5; c.beginPath(); c.moveTo(-74, 30); c.lineTo(-44, 42); c.stroke(); }
      c.restore();
      if (c1 >= 0 && c1 < .2) { c.strokeStyle = PAPER; c.lineWidth = 8; c.beginPath();                                 // click
        for (let i = 0; i < 7; i++) { const q = ang + Math.PI * (.55 + i / 6 * .9), r0 = 128 + c1 * 520, r1 = r0 + 90 * (1 - c1 / .2); c.moveTo(hx + Math.cos(q) * r0, hy + Math.sin(q) * r0); c.lineTo(hx + Math.cos(q) * r1, hy + Math.sin(q) * r1); }
        c.stroke(); } }
    if (c1 > 0) {
      type('CLICK', 1290, 835, 210, { col: PAPER, k: popIn(c1, .1), rot: -.035, wear: .35, seed: 3 });
      type('カチッ', 1530, 640, 64, { font: 'jp', col: PAPER, k: popIn(c1 - .06, .1), rot: .1, wear: .15 });
    }
    if (c2 > 0) type('tight.', 1150, 392, 84, { font: 'hand', col: PAL.lime, k: popIn(c2, .1), rot: aT, wear: 0 });
    camEnd();
    label(typed('06:00:06 // ARMING', lt - .15, 14), 70, 56, { size: 28, col: PAPER, screen: true });
  }

  // ---------- 8.25 – 10.2 · "time to clear this town" · two eyes open in the dark ----------
  // Her whole head is drawn in ink on ink: only the eyes are light. The brush line prints a shade darker than the flat
  // field, so her outline is just there, black on black.
  const NIGHT = { fur: INK, white: INK, dark: INK, grey: INK, ink: INK, pink: INK, mouth: INK, harness: INK, trim: INK, eye: PAPER, iris: '#3B2219', gold: INK };
  function eyesOpen(t, lt, dur) {
    const lid = kf(t, [[8.32, 1], [8.9, .26], [9.74, .26], [9.84, .55]], easeOut);
    const look = kf(t, [[9.32, [0, .1]], [9.42, [.9, .05]], [9.72, [.9, .05]], [9.82, [0, .1]]], easeOut5);
    prime(); bg(INK);
    camBegin(960, 540, 1 + lt * .022, 0);
    junjunBust(960, 650, 84, { coat: NIGHT, bust: false, lid, look, brow: .5 });
    camEnd();
  }

  // ---------- 10.2 – 14.04 · "They think it's just a stroll" · the fake-out: the one soft card in the film ----------
  const PANTS = [10.56, 10.74, 10.92, 11.08, 11.24, 11.4];                      // six little breaths in the audio
  function stroll(t, lt, dur) {
    const pant = PANTS.reduce((p, tp) => p + hit(t, tp, 16), 0), tStroll = 13.04, tHeart = 13.4;
    prime(); bg(INK);
    camBegin(960, 540 - lt * 5, 1 + lt * .009, 0);
    { const c = g2d(); c.fillStyle = PAL.pink; c.beginPath(); c.roundRect(40, 34, 1840, 1300, 76); c.fill();
      c.strokeStyle = PAPER; c.lineWidth = 15; c.lineCap = 'round'; c.setLineDash([.1, 36]); c.beginPath(); c.roundRect(82, 76, 1756, 1300, 46); c.stroke(); c.setLineDash([]); c.lineCap = 'butt'; }
    circ2(JX, JY - 50, 480, mixCol(PAL.pink, PAPER, .62));
    halftone(120, 110, 1680, 1000, { cell: 30, col: PAPER, radial: [JX, JY - 50, 480, 1500], alpha: .5, max: .7 });
    // flowers arrive on her breaths
    [[190, 950, 78], [1745, 190, 62], [420, 1000, 60], [1590, 150, 44], [640, 945, 70], [860, 1010, 52]].forEach(([x, y, r], i) =>
      flower(x, y, r, popIn(t - PANTS[i], .2), i * 1.3 + Math.sin(t * 1.6 + i) * .12));
    [['they', 10.22], ['think', 10.8]].reduce((x, [w, tw]) => {
      if (t > tw) type(w, x, 200, 112, { font: 'hand', col: INK, align: 'left', k: popIn(t - tw, .14), rot: -.03, wear: 0 });
      return x + typeW(w, 112, { font: 'hand' }) + 34; }, 150);
    [['it’s', 12.5], ['just', 12.7], ['a', 12.86]].reduce((x, [w, tw]) => {
      if (t > tw) type(w, x, 420, 124, { font: 'hand', col: INK, align: 'left', k: popIn(t - tw, .12), rot: -.03, wear: 0 });
      return x + typeW(w, 124, { font: 'hand' }) + 36; }, 150);
    if (t > tStroll) type('stroll', 150, 660, fitSize('stroll', 650, { font: 'hand' }), { font: 'hand', col: PAPER, stroke: INK, strokeW: .1, align: 'left', k: popIn(t - tStroll, .16), rot: -.045, wear: 0 });
    heart(815, 815, 150 * popIn(t - tHeart, .18) * (1 + pulse2(t, 7) * .06), PAL.oxblood, .22, { stroke: INK, lw: 9 });
    heart(880, 300, 64 * popIn(t - tHeart - .12, .18), PAPER, -.25); heart(1760, 480, 84 * popIn(t - tHeart - .22, .18), PAPER, .3);
    junjunBust(JX, JY, JU, { ...EXPR.pant, lid: .2, brow: -.4, hy: -pant * .1 - (t > 11.4 ? Math.abs(Math.sin((t - 11.4) * 19)) * .035 : 0), tilt: .075 * ease(seg(t, 12.9, 13.25)) });
    camEnd();
  }

  // ---------- 14.04 – 18.12 · "no." … "This is" · everything cute is gone; then the first stare, small ----------
  function hush(t, lt, dur) {
    const k = Math.pow(seg(t, T_PUSH, T_WAR), 1.5), u = lerp(JU, 126, k), s = u / JU, e0y = JY - .78 * JU;
    const ex = lerp(JX, 960, k), ey = lerp(e0y, 548, k), wx = x => ex + (x - JX) * s, wy = y => ey + (y - e0y) * s;     // the push, by hand
    const snap = easeOut5((t - (T_WAR - .2)) / .08);
    prime(); bg(INK);
    stareLines(960, 548, k * .75, { dim: 0, col: PAPER, n: 76, r0: 760 });
    if (t < 17) type('no.', wx(430), wy(610), 76 * s, { font: 'hand', col: PAPER, wear: 0 });
    junjunBust(ex, ey + .78 * u, u, { ...EXPR.deadpan, look: [0, .04], lid: lerp(kf(t, [[15.08, .6], [15.2, .5], [T_PUSH + 1, .5], [T_WAR - .3, .3]]), .1, snap),
      brow: lerp(kf(t, [[15.08, 0], [15.2, .3], [T_WAR - .3, .72]]), 1, snap), iris: lerp(lerp(1, .84, k), .62, snap), ear: .1 * snap });
    letterbox(easeOut(seg(t, T_PUSH, T_PUSH + .6)), INK, 150);
    // typed as she says it; the cursor waits for the third word
    const size = 50, o = { font: 'mono', col: PAPER, align: 'left', track: .28, wear: 0, screen: true }, x0 = 960 - typeW('THIS IS', size, o) / 2;
    const txt = t < T_IS ? typed('THIS', t - T_THIS, 16) : 'THIS ' + typed('IS', t - T_IS, 16);
    const wait = (t > T_THIS + .3 && t < T_IS) || t > T_IS + .16 ? (Math.floor(t * 5) % 2 ? ' █' : '') : '';
    if (t > T_THIS) type(txt + wait, x0, H - 76, size, o);
  }

  // ---------- 18.12 – 20.78 · "WAR" · impact frame 1 ----------
  function war(t, lt, dur) {
    const a = t - T_WAR, b = t - T_DRONE, s = slam(a - .02, .1), s2 = slam(b, .1), inv = a > .29 && a < .37;
    const [sx, sy] = shakeXY(t, 52 * Math.exp(-a * 4.5) + 22 * hit(t, T_DRONE + .1, 6), 24);
    prime();
    camBegin(960 + sx, 540 + sy, 1.07 - .07 * easeOut(a / .5) + seg(a, .5, dur) * .04, (hash(Math.floor(t * 24)) - .5) * .034 * Math.exp(-a * 5));
    impactFrame(590, 520, a, { accent: PAL.orange, dark: inv ? PAL.white : INK, light: inv ? INK : PAL.white, seed: 4, size: 1.04 });
    if (b > 0) type('戦', 1545, 262, 400, { font: 'jp', col: PAL.orange, stroke: INK, strokeW: .035, rot: .06, k: s2.k, alpha: s2.alpha, wear: .15, seed: 3 });
    junjunBust(585, 590, 76, { ...EXPR.rage, mono: true, tilt: .045, sx: 1 + Math.exp(-a * 14) * .1, sy: 1 + Math.exp(-a * 14) * .1 });
    const held = Math.exp(-Math.max(0, t - 19.4) * 5);                           // the word shakes for as long as it is held
    type('WAR', 1390, 760, fitSize('WAR', 900), { col: PAL.white, stroke: INK, strokeW: .07, shadow: { col: INK, dx: .03, dy: .036 }, k: s.k, alpha: s.alpha, rot: -.03, seed: 9, wear: .2,
      per: i => ({ dy: (hash(i + Math.floor(t * 12)) - .5) * .028 * held, rot: (hash(i * 3 + Math.floor(t * 12)) - .5) * .05 * held }) });
    label('THIS IS', 968, 508, { size: 34, col: PAL.white, bg: INK, pad: 13, rot: -.03, alpha: clamp(a / .05) });
    camEnd();
    flash(1 - a / .085, PAL.white);
    const la = t - 19.5; if (la > 0) label(typed('06:00:18 // WAR DECLARED. ON: EVERYONE.', la, 36), 64, H - 80, { size: 26, col: INK, bg: PAL.orange, screen: true, pad: 12 });
  }

  // ---------- bar 7 · the title card, slammed on in pieces; the drum fill does the stamping ----------
  function titleCard(t, lt, dur) {
    const t0 = barT(7), tWalk = barT(7, 1), tKanji = barT(7, 2), tStar = tWalk + .3, tStamp = 22.58, tSign = 22.9, tCrown = 23.08, tLook = 23.24;
    const s1 = slam(t - t0, .1), s2 = slam(t - tWalk, .1);
    const [sx, sy] = shakeXY(t, s1.shake * 12 + s2.shake * 18 + hit(t, tStamp, 9) * 26 + hit(t, tSign, 14) * 9 + hit(t, tCrown, 14) * 7);
    const sO = fitSize('OPERATION', 1130), sW = fitSize('WALKIES', 1790), yO = 64 + capH(sO) / 2, yW = 64 + capH(sO) + 50 + capH(sW) / 2;
    prime(); bg(INK);
    camBegin(960 + sx, 540 + sy, 1 + lt * .012, 0);
    type('OPERATION', 70 + 565, yO, sO, { col: PAPER, k: s1.k, alpha: s1.alpha, seed: 4 });
    if (t > tWalk) type('WALKIES', 960, yW, sW, { col: PAL.orange, k: s2.k, alpha: s2.alpha, seed: 12 });
    if (t > tKanji) { const kk = popIn(t - tKanji, .12); circ2(1575, yO, 138 * kk, PAL.orange); type('作戦', 1575, yO, 122 * kk, { font: 'jp', col: INK, wear: .1 }); }
    // the star of the film, as much of her as fits. Her eyes follow each piece as it lands.
    const look = kf(t, [[tWalk, [-.75, -.8]], [tWalk + .1, [-.1, -.9]], [tStamp, [-.1, -.9]], [tStamp + .1, [-.95, -.2]], [tLook, [-.95, -.2]], [tLook + .08, [0, .05]]], easeOut5);
    junjunBust(1500, 1002, 36, { ...EXPR.royal, bust: false, look, lid: t > tLook ? .56 : .42, crown: seg(t, tCrown, tCrown + .18) });
    stamp('CLASSIFIED', 500, yW + capH(sW) / 2 + 80, { k: popIn(t - tStamp, .1), size: 124, rot: -.07, col: PAL.lime, seed: 4 });
    label([typed('STARRING', t - tStar, 30), typed('PRINCESS JUNJUN', t - tStar - .3, 30)], 952, 958, { size: 30, col: PAPER });
    if (t > tSign) pawPrint(868, 1004, 96 * popIn(t - tSign, .1), .3, PAPER);
    camEnd();
    if (t >= tStamp) flash((1 - (t - tStamp) / .06) * .5, PAL.white);
  }

  chapter('intro', 0, barT(8), [
    [0, t => hall(t)], [T_NAH, t => hall(t)], [T_LEASH, leashClick], [T_EYES, eyesOpen], [T_STROLL, stroll], [T_NO, hush], [T_WAR, war], [barT(7), titleCard]
  ]);
})();
