// c07_chorus2.js: Chorus 2 (bars 50-53) and the guitar instrumental (bars 54-56).
// The four chorus compositions return inverted and louder, with the whole cast as her court; the instrumental is the
// roll call (one poster card per cast member) and ends on the throne. Jun Jun is exactly as still as in chorus 1.
// The chorus shots are private escalations of the CHORUS compositions in c03 (same layouts, same acting, same word hits).
(() => {
  const GY = 1000;

  // ---------- private helpers ----------
  // a rubber stamp on a paper plate with a hard ink shadow, so it reads on any ground (screen space)
  function plate(txt, x, y, size, rot, age, col = PAL.oxblood, seed = 3) {
    if (age <= 0) return;
    const k = popIn(age, .1), w = (typeW(txt, size, { track: .04 }) + size * 1.5) * k, h = size * 2 * k;
    const slab = (dx, dy) => rotPts([[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]], rot, x, y).map(p => [p[0] + dx, p[1] + dy]);
    poly2(slab(13, 15), PAL.ink, { screen: true }); poly2(slab(0, 0), PAL.paper, { screen: true, stroke: PAL.ink, lw: 6 });
    stamp(txt, x, y, { k, size, rot, col, screen: true, seed });
  }
  // police tape (screen space): hazard stripes, or a running line of text once `on`
  function tape(cy, h, off, txt, on) {
    if (!on) { hazard(0, cy - h / 2, W, h, off, PAL.lime, PAL.ink, { screen: true }); return; }
    const c = g2d(true), fs = h * .66; c.save(); c.fillStyle = PAL.lime; c.fillRect(0, cy - h / 2, W, h);
    c.fillStyle = PAL.ink; c.fillRect(0, cy - h / 2, W, h * .1); c.fillRect(0, cy + h * .4, W, h * .1);
    c.font = `400 ${fs}px ${FONT.hero}`; c.textBaseline = 'alphabetic'; c.textAlign = 'left';
    const w = c.measureText(txt).width, x0 = ((off % w) + w) % w - w;
    for (let x = x0; x < W; x += w) c.fillText(txt, x, cy + CAP.hero * fs / 2);
    c.restore();
  }
  const flower = (x, y, r, k, col, a0 = 0) => { if (k <= 0) return; for (let p = 0; p < 5; p++) circ2(x + Math.cos(p / 5 * TAU + a0) * r * 1.3 * k, y + Math.sin(p / 5 * TAU + a0) * r * 1.3 * k, r * k, col); circ2(x, y, r * .62 * k, PAL.lime); };
  const butterfly = (x, y, s, fl, col) => { for (const d of [1, -1]) poly2([[x, y], [x + d * 46 * s * fl, y - 40 * s], [x + d * 54 * s * fl, y + 22 * s]], col, { stroke: PAL.ink, lw: 5, join: 'round' }); };

  // ---------- bar 50 · "I love the smell of biscuits in the morning" · the royal pose, with her court ----------
  function biscuits2(t, lt) {
    const t0 = barT(50), b = bp(t), P = pulse(t, 5), step = Math.floor(b) + easeOut(frac(b) * 3), u = 24;
    const tSmell = t0 + .58, tBis = t0 + 1.0, tIn = t0 + 1.44, tMorn = t0 + 1.82, sb = slam(t - tBis, .12), sm = slam(t - tMorn, .1);
    const [sx, sy] = shakeXY(t, sb.shake * 34 + sm.shake * 16, 24), bs = fitSize('BISCUITS', 1800), hy0 = GY - 19.3 * u - 40;
    bg(PAL.ink);
    camBegin(960 + sx, 540 + sy, 1 + seg(lt, 0, 2.65) * .07 + P * .016, 0);
    sunburst(960, 560, { n: 16, col: PAL.orange, rot: step * TAU / 32 });
    sunburst(960, 560, { n: 16, col: PAL.oxblood, alpha: .6, rot: step * TAU / 32 + TAU / 64, duty: .2 });
    speedLines(960, 560, { n: 46, r0: 740, r1: 1700, col: PAL.paper, boil: true, w: [.002, .012] });
    halftone(-100, 620, W + 200, 480, { cell: 24, col: PAL.ink, grad: [0, 700, 0, 1180], alpha: .85 });
    // the word, with an outline echo thrown off on every beat
    if (t > tBis + .2) type('BISCUITS', 960, 300, bs, { col: null, stroke: PAL.lime, strokeW: .012, k: 1 + easeOut(frac(b)) * .13, alpha: 1 - frac(b), wear: 0 });
    type('BISCUITS', 960, 300, bs, { col: PAL.paper, k: sb.k, alpha: sb.alpha, shadow: { col: PAL.lime, dx: .02, dy: .024 }, seed: 3 });
    // halo, beat rings
    circ2(960, hy0, 250 + P * 16, PAL.lime, { stroke: PAL.ink, lw: 10 });
    { const c = g2d(); c.strokeStyle = PAL.paper; for (const d of [0, .5]) { const f = frac(b + d); c.lineWidth = 10 * (1 - f); c.globalAlpha = (1 - f) * .9; c.beginPath(); c.arc(960, hy0, 262 + easeOut(f) * 260, 0, TAU); c.stroke(); } c.globalAlpha = 1; }
    // the floor and the court: everyone she met this morning, in attendance
    rect2(-200, 992, W + 400, 300, PAL.oxblood, { stroke: PAL.ink, lw: 8 });
    const hop = pulse2(t, 7);
    commander(104, 1008, u, { pose: 'flat', face: 'dead' });
        pup(1420, 1008, u, { tuck: 1, face: 'scared', flip: true });
    squirrel(168, 908 - hop * 8, u * .9, {});
    yorkie(352, 908, u, { bark: hop, hop: hop * .5, shadow: false });
    cat(1700, 1008, u, { flip: true, ink: PAL.paper });
    // biscuits in orbit: the far half first, the near half after her
    const N = 12, orbit = front => { for (let i = 0; i < N; i++) {
      const a = i / N * TAU + t * 1.3, s = Math.sin(a), k = popIn(t - tBis - i * .03, .16); if ((s > 0) !== front || k <= 0) continue;
      biscuit(960 + Math.cos(a) * 500, 604 + s * 112, (116 + s * 30) * k, a * 1.7 + t, { col: i % 3 === 0 ? PAL.pink : PAL.paper });
    } };
    orbit(false);
    cushion(960, GY - 46, 700, { col: PAL.violet });
    const open = seg(lt, 2.2, 2.34);
    junjunSit(960, GY - 30, u, { ...EXPR.smug, lid: lerp(1, .5, open), mouth: open > .5 ? 'flat' : 'smile', brow: lerp(-.1, .35, open), crown: seg(t, t0 + .2, t0 + .42), hy: -P * .13, tail: Math.sin(b * Math.PI) * .05 });
    orbit(true);
    // flanks
    if (t > tIn) type('IN THE', 292, 610, 128, { col: PAL.paper, k: popIn(t - tIn, .12), rot: -.04, shadow: { col: PAL.ink } });
    if (sm.alpha > 0) {
      type('MORNING', 1545, 690, 172, { col: PAL.paper, k: Math.min(sm.k, 1.7), alpha: sm.alpha, rot: .035, shadow: { col: PAL.ink } });
      const k = popIn(t - tMorn - .1, .14); circ2(1795, 560, 70 * k, PAL.lime, { stroke: PAL.ink, lw: 8 }); type('朝', 1795, 560, 88 * k, { font: 'jp', col: PAL.ink, wear: 0 });
    }
    camEnd();
    // the small words arrive as they are sung
    [['I', t0 - 1], ['LOVE', t0 - .2], ['THE', t0 + .22], ['SMELL', tSmell], ['OF', tSmell + .14]].reduce((x, [w, tw]) => {
      const a = t - tw, big = w === 'SMELL', size = big ? 98 : 76;
      if (a > 0) type(w, x, 62, size, { font: 'hand', col: big ? PAL.lime : PAL.paper, align: 'left', k: popIn(a, .1), rot: -.02, stroke: PAL.ink, strokeW: big ? .18 : .22, wear: 0, screen: true });
      return x + typeW(w, size, { font: 'hand' }) + 28;
    }, 70);
    if (t >= tBis + .12) flash(1 - (t - tBis - .12) / .085, PAL.paper);
  }

  // ---------- bar 51 · "Every block's a warzone, soldier — I'm warning" · the map is on fire ----------
  function warzone2(t, lt) {
    const t0 = barT(51), tEvery = t0 + .2, tWar = t0 + .58, tZone = t0 + .84, tSol = t0 + 1.02, tWarn = t0 + 1.8, W3 = [0, .24, .48];
    const sw = slam(t - tWar, .1), sz = slam(t - tZone, .1), wh = W3.reduce((p, d) => p + hit(t, tWarn + d, 12), 0);
    const [sx, sy] = shakeXY(t, (sw.shake + sz.shake) * 30 + wh * 16, 24);
    bg(PAL.orange);
    camBegin(960 + sx, 540 + sy, 1 + seg(lt, 0, 2.65) * .05, 0);
    // the neighbourhood as a tactical map: more of it lights up, and it changes on every eighth
    { const c = g2d(), n8 = Math.floor(bp(t) * 2), grid = mixCol(PAL.orange, PAL.ink, .3); c.save(); c.translate(960, 540); c.rotate(-.12); c.translate(-960, -540); c.lineWidth = 5;
      for (let i = -1; i < 9; i++) for (let j = -1; j < 6; j++) { const x = i * 250 - 60, y = j * 215 - 40, id = i * 7 + j * 3, r = hash(id + n8 * 5.1);
        if (r > .6) { c.fillStyle = r > .8 ? PAL.ink : PAL.oxblood; c.fillRect(x, y, 205, 170); } c.strokeStyle = grid; c.strokeRect(x, y, 205, 170); }
      c.restore(); }
    flames(1440, 1040, 1250, 900, seg(lt, .3, 1.1), { a: PAL.ink, b: PAL.lime, n: 9 });
    type('WAR', 470, 345, 440, { col: PAL.lime, k: sw.k, alpha: sw.alpha, rot: -.025, shadow: { col: PAL.ink, dx: .026, dy: .03 }, seed: 4 });
    type('ZONE', 500, 735, 440, { col: PAL.paper, k: sz.k, alpha: sz.alpha, rot: -.025, shadow: { col: PAL.ink, dx: .026, dy: .03 }, seed: 6 });
    if (t > tEvery) type('EVERY BLOCK’S A', 110, 126, 62, { font: 'hand', col: PAL.paper, align: 'left', k: popIn(t - tEvery, .1), rot: -.02, stroke: PAL.ink, strokeW: .2, wear: 0 });
    const cam = t >= tSol;
    junjunBust(1440, 575, 47, { ...(cam ? EXPR.judge : EXPR.sideEye), look: cam ? [0, .05] : [-.95, .05], tilt: cam ? -.035 * elasticOut((t - tSol) / .35) : 0, lid: Math.max(cam ? .52 : .5, blink(t, 3)), crown: 1 });
    if (cam) type('SOLDIER,', 1500, 138, 112, { font: 'hand', col: PAL.paper, k: popIn(t - tSol, .1), rot: .045, stroke: PAL.ink, strokeW: .18, wear: 0 });
    { const k = popIn(t - tWarn, .12); if (k > 0) { poly2(rotPts([[925 - 62 * k, 800 - 112 * k], [925 + 62 * k, 800 - 112 * k], [925 + 62 * k, 800 + 112 * k], [925 - 62 * k, 800 + 112 * k]], .04, 925, 800), PAL.lime, { stroke: PAL.ink, lw: 7 });
      type('警', 925, 750, 88 * k, { font: 'jp', col: PAL.ink, wear: 0, rot: .04 }); type('戒', 921, 850, 88 * k, { font: 'jp', col: PAL.ink, wear: 0, rot: .04 }); } }
    camEnd();
    // the tapes start shouting on "warning"
    tape(43, 86, t * 420, 'WARNING  ///  ', t >= tWarn); tape(H - 43, 86, -t * 420, 'WARNING  ///  ', t >= tWarn + W3[1]);
    stamp('WARNING', 922, 470, { k: popIn(t - tWarn - W3[2], .12), size: 80, rot: -.15, col: PAL.ink, seed: 4, screen: true });
    for (const d of W3) { const a = t - tWarn - d; if (a >= 0) flash((1 - a / .05) * .55, PAL.paper); }
  }

  // ---------- bar 52 · "Pass in peace, or you're catchin' that growl" ----------
  function peaceGrowl2(t, lt) {
    const t0 = barT(52), tCut = t0 + 1.05, tGrowl = t0 + 1.77, a = t - tGrowl;
    if (t < tCut) {
      // option A: the calmest frame in the film, now with everybody in it
      const u = 15.5;
      bg(PAL.pink);
      camBegin(960, 540 - lt * 10, 1 + lt * .02, 0);
      circ2(960, 520, 590 + Math.sin(t * 2) * 6, PAL.sage);
      type('PEACE', 960, 440, 420, { col: PAL.paper, track: .05, wear: .2, seed: 8 });
      type('PASS  IN', 960, 150, 84, { col: PAL.ink, track: .5, wear: .15 });
      [[150, 330, 34], [262, 620, 26], [118, 800, 30], [1790, 300, 30], [1668, 585, 24], [1806, 790, 34]].forEach(([x, y, r], i) => flower(x, y, r, popIn(t - (t0 + .08 + i * .09), .2), [PAL.paper, PAL.orange, PAL.violet][i % 3], i));
      cat(236, 1000, u, {}); squirrel(452, 1000, u, {}); yorkie(676, 1000, u, {});
      pup(1250, 1000, u, { flip: true }); squirrel(1474, 1000, u, { flip: true }); crow(1690, 1000 - u, u * 1.3, { flip: true, cap: true });
      junjunSit(960, 1000, u, { ...EXPR.shut, mouth: 'smile', tail: Math.sin(t * 5) * .08 });
      for (let i = 0; i < 9; i++) flower(210 + i * 190 + (i % 2) * 30, 1040 + (i % 3) * 8, 13, popIn(t - (t0 + .1 + i * .07), .2), i % 2 ? PAL.paper : PAL.orange, i);
      butterfly(lerp(520, 1280, lt / 1.2), 300 + Math.sin(t * 7) * 46, 1, Math.abs(Math.sin(t * 22)), PAL.violet);
      butterfly(lerp(1500, 1020, lt / 1.2), 690 + Math.sin(t * 6 + 2) * 40, .8, Math.abs(Math.sin(t * 20 + 1)), PAL.orange);
      camEnd();
      label('OPTION A  (STRONGLY RECOMMENDED)', 70, 60, { size: 26, col: PAL.ink, screen: true });
    } else if (a < 0) {
      // option B, the build: the snarl in the dark
      const g = seg(t, tCut, tGrowl), [sx, sy] = shakeXY(t, 5 + g * 10, 12);
      bg(PAL.ink);
      camBegin(960 + sx, 540 + sy, 1 + g * .06, 0);
      speedLines(960, 640, { n: 70, r0: 760, r1: 1700, col: PAL.orange, boil: true, boilRate: 12, w: [.004, .03] });
      for (const fx of [110, 1810]) flames(fx, 1120, 760, 1060, .35 + g * .65, { a: PAL.oxblood, b: PAL.orange, n: 5 });
      junjunBust(960, 205, 100, { ...EXPR.rage, iris: lerp(.8, .48, g), ear: .3 * g, tilt: (hash(Math.floor(t * 12)) - .5) * .012 });
      vibLines(960, 205 + 3.7 * 100, 420, 330, .5 + g * .5, { n: 14, sw: 1.6, len: 1.5, seed: 9 });
      for (let i = 0; i < 4; i++) { const ka = t - (tCut + .16 + i * .13); if (ka > 0) type('ガルルル'[i], 150 + (i % 2) * 70, 250 + i * 180, 160, { font: 'jp', col: PAL.lime, stroke: PAL.ink, strokeW: .08, k: popIn(ka, .1), rot: -.15 + hash(i + Math.floor(t * 8)) * .1, wear: .2 }); }
      camEnd();
      const words = [['OR', tCut], ['YOU’RE', tCut + .06], ['CATCHIN’', t0 + 1.29], ['THAT', t0 + 1.47]], gap = 30;
      const tot = words.reduce((p, [w]) => p + typeW(w, 88, { font: 'hand' }) + gap, -gap);
      words.reduce((x, [w, tw]) => { if (t > tw) type(w, x, 992, 88, { font: 'hand', col: PAL.paper, stroke: PAL.ink, strokeW: .22, align: 'left', screen: true, wear: 0, rot: -.02, k: popIn(t - tw, .08) }); return x + typeW(w, 88, { font: 'hand' }) + gap; }, 960 - tot / 2);
      label('OPTION B  (NOT RECOMMENDED)', 70, 60, { size: 26, col: PAL.ink, bg: PAL.lime, screen: true, pad: 12 });
    } else {
      // "growl": impact frame, then the same frame released in full colour
      const mono = a < .3, inv = a > .125 && a < .21, [sx, sy] = shakeXY(t, 54 * Math.exp(-a * 4.5) + 7, 24), f12 = Math.floor(t * 12);
      const dark = inv ? PAL.white : PAL.ink, lite = inv ? PAL.ink : PAL.white;
      camBegin(960 + sx, 540 + sy, 1.13 - .07 * easeOut(a / .4), (hash(Math.floor(t * 24)) - .5) * .035 * Math.exp(-a * 5));
      if (mono) impactFrame(960, 330, a, { accent: PAL.lime, dark, light: lite, seed: 5, size: 1.5 });
      else { bg(PAL.lime); speedLines(960, 640, { n: 80, r0: 720, r1: 1700, col: PAL.ink, boil: true, boilRate: 12, w: [.004, .032] }); for (const fx of [110, 1810]) flames(fx, 1120, 760, 1100, 1, { a: PAL.ink, b: PAL.orange, n: 5 }); }
      junjunBust(960, 205, 100, { ...EXPR.rage, mono, iris: .48, ear: .3, tilt: (hash(f12) - .5) * .012, sx: 1 + Math.exp(-a * 14) * .06, sy: 1 + Math.exp(-a * 14) * .06 });
      if (!mono) vibLines(960, 205 + 3.7 * 100, 420, 330, 1, { n: 16, sw: 1.8, len: 1.6, seed: 9 });
      for (let i = 0; i < 4; i++) type('ガルルル'[i], 150 + (i % 2) * 70, 250 + i * 180, 170, { font: 'jp', col: mono ? lite : PAL.ink, stroke: mono ? dark : PAL.paper, strokeW: .08, rot: -.15 + hash(i + Math.floor(t * 8)) * .1, wear: .2 });
      const s = slam(a, .1);
      type('GROWL', 960, 900, 380, { col: mono ? lite : PAL.paper, stroke: mono ? dark : PAL.ink, strokeW: .06, shadow: mono ? null : { col: PAL.orange, dx: .03, dy: .035 }, k: s.k, alpha: s.alpha, track: .02,
        per: i => ({ dx: (hash(i * 3.1 + f12) - .5) * .04, dy: (hash(i * 7.7 + f12) - .5) * .06, rot: (hash(i + f12 * 1.7) - .5) * .1 }), wear: .25 });
      camEnd();
      flash(1 - a / .085, PAL.white);
      if (!mono) label('OPTION B  (NOT RECOMMENDED)', 70, 60, { size: 26, col: PAL.lime, bg: PAL.ink, screen: true, pad: 12 });
    }
    slashWipe((t - (tCut - .14)) / .28, PAL.ink, { seed: 3 });
  }

  // ---------- bar 53 · "Princess JunJun's on patrol, movin' through the prowl" · the name card, as a procession ----------
  function nameCard2(t, lt) {
    const t0 = barT(53), tPat = t0 + .42, s1 = slam(lt + .02, .1), s2 = slam(lt - .16, .1), P = pulse(t, 5);
    const [sx, sy] = shakeXY(t, (s1.shake + s2.shake) * 28 + hit(t, tPat, 12) * 12, 24);
    const u = 30, ph = lt * 1.92, dogX = lerp(-340, 2300, lt / 2.65), gy = GY + 10;
    bg(PAL.violet);
    camBegin(960 + sx + easeIn(seg(lt, 2.2, 2.65)) * 500, 540 + sy, 1 + lt * .012, 0);
    sunburst(960, 540, { n: 20, col: PAL.ink, alpha: .22 + P * .2, rot: t * .3 });
    type('PRINCESS', 960, 285, fitSize('PRINCESS', 1780), { col: PAL.orange, k: s1.k, alpha: s1.alpha, shadow: { col: PAL.ink }, seed: 11 });
    type('JUNJUN', 960, 715, fitSize('JUNJUN', 1780) * .86, { col: PAL.lime, k: s2.k, alpha: s2.alpha, shadow: { col: PAL.ink }, seed: 13 });
    dryStroke(-300, 978, 2700, 962, 60, PAL.orange, { seed: 21, p: easeOut(seg(lt, .3, .6)) });
    streaks({ col: PAL.paper, n: 30, drift: -lt * 2800, th: [3, 11], len: [240, 900], area: [-200, 60, W + 900, 930], alpha: .9 });
    type('ジュンジュン', 960, 1040, 50, { font: 'jp', col: PAL.paper, track: .5, alpha: seg(lt, .4, .55), wear: .1 });
    // paperwork goes on the wall, so she walks in front of it
    { const k = popIn(t - tPat, .12); if (k > 0) { const w = 560 * k, h = 190 * k, bx = 1520, by = 505;
      poly2(rotPts([[bx - w / 2, by - h / 2], [bx + w / 2, by - h / 2], [bx + w / 2, by + h / 2], [bx - w / 2, by + h / 2]], -.1, bx, by), PAL.paper, { stroke: PAL.ink, lw: 7 });
      stamp('ON PATROL', bx, by, { k, size: 100, rot: -.1, col: PAL.oxblood, seed: 5 }); } }
    if (t > tPat + .2) { const k = popIn(t - tPat - .2, .12); rect2(1700 - 118 * k, 668 - 44 * k, 236 * k, 88 * k, PAL.lime, { stroke: PAL.ink, lw: 6 }); type('巡回中', 1700, 668, 62 * k, { font: 'jp', col: PAL.ink, wear: 0 }); }
    // the procession: her court keeps up as best it can, the Commander flies from the lead like a flag
    const hp = Math.abs(Math.sin(lt * 9));
    crow(dogX - 700, 250 + Math.sin(lt * 7) * 30, u * .8, { flap: lt * 4, cap: true, caw: pulse2(t, 6) });
    pup(dogX - 1470, gy, u * .8, { face: 'scared', tuck: 1 });
    squirrel(dogX - 1120, gy, u * .8, { run: lt * 3.4 });
    yorkie(dogX - 760, gy, u * .8, { hop: hp * .9, bark: hp, shadow: false });
    const hand = commander(dogX - 1010, 606 + Math.sin(lt * 10) * 12, u, { pose: 'dragged', face: 'panic' });
    junjunSide(dogX, gy, u, { ...EXPR.royal, walk: ph, crown: 1, look: [.3, 0], leash: hand, slack: .02 });
    camEnd();
  }

  // ---------- bars 54-55 · the roll call: one poster card per cast member ----------
  function cardCam(t, t0, tSt) {
    const lt = t - t0, sa = t - tSt, [sx, sy] = shakeXY(t, Math.exp(-lt * 14) * 18 + (sa >= 0 ? Math.exp(-sa * 11) * 26 : 0), 24);
    camBegin(960 + sx, 540 + sy, 1.07 - .05 * easeOut5(lt / .18) + lt * .02, 0);
  }
  const hero = (txt, x, y, size, lt, o) => type(txt, x, y, size, { k: 1 + .2 * Math.exp(-lt * 22), ...o, shadow: { col: PAL.ink, dx: .022, dy: .026, ...(o.shadow || {}) } });
  const tag = (n, who, x, y, col = PAL.ink) => label([`ROLL CALL ${n}/6`, who], x, y, { size: 24, col, align: x > 960 ? 'right' : 'left', screen: true });

  function cardYorkie(t, lt) {
    const t0 = barT(54), tSt = barT(54, 1), y8 = pulse2(t, 7);
    bg(PAL.pink); cardCam(t, t0, tSt);
    sunburst(1400, 700, { n: 14, col: PAL.paper, alpha: .5, rot: -.1 + lt * .08 });
    halftone(-100, 700, W + 200, 480, { cell: 26, col: PAL.oxblood, grad: [0, 760, 0, 1260], alpha: .5 });
    hero('YORKIE', 960, 300, fitSize('YORKIE', 1700), lt, { col: PAL.ink, rot: -.02, shadow: { col: PAL.paper }, seed: 21 });
    dryStroke(-200, 1016, 2200, 1004, 120, PAL.ink, { seed: 31 });
    yorkie(1430, 992, 54, { flip: true, bark: y8, hop: y8 * .35 });
    type('YIP!', 905, 650, 120, { font: 'hand', col: PAL.oxblood, rot: -.14, k: .8 + y8 * .4, wear: .2 });
    camEnd();
    plate('NEUTRALISED', 520, 840, 112, -.08, t - tSt);
    tag(1, 'YORKIE PATROL', 70, 996, PAL.paper);
  }
  function cardSquirrels(t, lt) {
    const t0 = barT(54, 2), tSt = t0 + .33;
    bg(PAL.blue); cardCam(t, t0, tSt);
    streaks({ col: PAL.paper, n: 24, drift: -lt * 2600, th: [3, 10], len: [200, 800], area: [-200, 500, W + 400, 520], alpha: .55 });
    hero('SQUIRRELS', 960, 300, fitSize('SQUIRRELS', 1770), lt, { col: PAL.paper, rot: -.025, seed: 22 });
    dryStroke(-200, 1006, 2200, 994, 110, PAL.ink, { seed: 33 });
    for (let i = 0; i < 3; i++) squirrel(-120 + i * 560 + lt * 1150, 975, 44, { run: lt * 3.2 + i * .37 });
    camEnd();
    plate('AT LARGE', 1380, 590, 136, .07, t - tSt);
    tag(2, 'INSURGENTS', 70, 996, PAL.paper);
  }
  function cardCat(t, lt) {
    const t0 = barT(54, 3), tSt = t0 + .33;
    bg(PAL.ink); cardCam(t, t0, tSt);
    circ2(1340, 520, 430, PAL.orange);
    halftone(880, 60, 920, 920, { cell: 22, col: PAL.ink, radial: [1340, 520, 240, 470], alpha: .55 });
    hero('CAT', 70, 400, 640, lt, { col: PAL.paper, align: 'left', shadow: { col: PAL.orange }, seed: 23 });
    cat(1340, 1050, 74, { eyes: easeOut(seg(lt, .04, .18)) });
    camEnd();
    plate('STILL WATCHING', 545, 860, 98, -.06, t - tSt);
    tag(3, 'SNIPER', 70, 52, PAL.lime);
  }
  function cardCrows(t, lt) {
    const t0 = barT(55), tSt = t0 + .33;
    bg(PAL.lime); cardCam(t, t0, tSt);
    halftone(-100, -100, W + 200, 620, { cell: 24, col: PAL.orange, grad: [0, 420, 0, -160], alpha: .8 });
    hero('CROWS', 60, 800, 480, lt, { col: PAL.ink, align: 'left', rot: -.025, shadow: { col: PAL.paper }, seed: 24 });
    inkLine([[-200, 440], [960, 462], [2120, 436]], 2.6, PAL.ink, 'ink', .5);
    [[430, 446], [950, 456], [1470, 444]].forEach(([x, y], i) => {
      const cw = hit(t, t0 + i * .19, 7); crow(x, y - 44, 44, { caw: cw, cap: i === 1 });
      if (t > t0 + i * .19) type('CAW!', x + 225, y - 300 - i * 10, 124, { col: PAL.orange, stroke: PAL.ink, strokeW: .1, rot: -.18 + i * .05, k: .85 + cw * .35, wear: .2 });
    });
    camEnd();
    plate('LOUD', 1590, 800, 190, .08, t - tSt);
    tag(4, 'ROOFTOP OFFICERS', 70, 996);
  }
  function cardPup(t, lt) {
    const t0 = barT(55, 1), tSt = t0 + .33;
    bg(PAL.sage); cardCam(t, t0, tSt);
    sunburst(600, 700, { n: 14, col: PAL.ink, alpha: .12, rot: .2 });
    halftone(-100, 700, W + 200, 480, { cell: 26, col: PAL.ink, grad: [0, 780, 0, 1300], alpha: .5 });
    hero('PUP', 1860, 370, 660, lt, { col: PAL.paper, align: 'right', seed: 25 });
    dryStroke(-200, 1016, 2200, 1004, 120, PAL.ink, { seed: 35 });
    pup(600, 1000, 70, { tuck: 1, face: 'scared' });
    vibLines(640, 700, 370, 320, .9, { n: 12, sw: 1.6, len: 1.6, seed: 4 });
    camEnd();
    plate('RESPECTFUL', 1360, 850, 118, -.07, t - tSt);
    tag(5, 'ON THE LEFT', 70, 52);
  }
  function cardCommander(t, lt) {
    const t0 = barT(55, 2), tSt = barT(55, 3), sa = t - tSt;
    bg(PAL.orange); cardCam(t, t0, tSt);
    halftone(-100, 560, W + 200, 620, { cell: 24, col: PAL.ink, grad: [0, 640, 0, 1300], alpha: .4 });
    streaks({ col: PAL.ink, n: 14, drift: -lt * 1100, th: [3, 9], len: [200, 700], area: [-200, 700, W + 400, 230], alpha: .8 });
    hero('COMMANDER', 960, 265, fitSize('COMMANDER', 1790), lt, { col: PAL.paper, seed: 26 });
    dryStroke(-200, 1010, 2200, 1000, 150, PAL.paper, { seed: 37 });
    const hand = commander(640 + lt * 46, 955, 34, { pose: 'flat', face: 'dead', arm: -2.9 });
    inkLine([hand, [2150, hand[1] - 70]], 2.4, PAL.ink, 'ink', 0); inkLine([hand, [2150, hand[1] - 70]], 1.1, PAL.lime, 'ink', 0);
    if (sa > .25) label('LEAD: STILL IN HAND', hand[0] - 40, hand[1] - 150, { size: 26, col: PAL.ink, bg: PAL.lime, pad: 12 });
    camEnd();
    plate('DRAGGED 1.2 KM', 760, 610, 146, -.06, sa);
    tag(6, 'THE HUMAN', 1850, 1000);
  }

  // ---------- bar 56 · the throne: she does not move, everything else goes off ----------
  function throne(t, lt) {
    const B = [0, 1, 2, 3].map(i => barT(56, i)), tHold = B[3] + .34, tt = Math.min(t, tHold), a = B.map(x => t - x), u = 26, SY = 830, hy0 = SY - 19.3 * u;
    const boom = a.reduce((p, x) => p + (x >= 0 ? Math.exp(-x * 9) : 0), 0), [bx, by] = shakeXY(t, boom * 30, 24), K = i => a[i] < 0 ? 0 : easeOut5(a[i] / .16);
    const js = fitSize('JUN', 560), sL = slam(a[0] + .02, .1), sR = slam(a[1], .1);
    bg(PAL.ink);
    camBegin(960, 540, 1 + .05 * ease(seg(t, B[0], tHold)), 0);
    sunburst(960 + bx, hy0 + by, { n: 18, col: PAL.oxblood, rot: tt * .25 });
    burst(960 + bx, hy0 + by, 720 * K(0), 1560 * K(0), { n: 20, seed: 3, col: PAL.orange, irr: .3, ey: .8, rot: tt * .06, stroke: PAL.ink, lw: 10 });
    if (K(0) > 0) speedLines(960 + bx, hy0 + by, { n: 70, r0: 860, r1: 1800, col: PAL.ink, boil: true, boilRate: 12, w: [.004, .026] });
    burst(960 + bx, hy0 + by, 340 * K(1), 660 * K(1), { n: 16, seed: 9, col: PAL.ink, irr: .34, ey: .9, rot: -tt * .09 });
    burst(960 + bx, hy0 + by, 250 * K(2), 450 * K(2), { n: 14, seed: 14, col: PAL.lime, irr: .3, rot: tt * .12, stroke: PAL.ink, lw: 9 });
    circ2(960, hy0, 236 * (a[3] < 0 ? 0 : popIn(a[3], .14)), PAL.paper, { stroke: PAL.ink, lw: 10 });
    // biscuits: thrown out on the beats, then they hang in the air
    const REST = [[352, 172], [565, 108], [706, 206], [1222, 184], [1405, 104], [1600, 150], [1805, 112], [126, 772], [196, 1004], [596, 792], [1306, 742], [1562, 748], [1822, 764]];
    const bisc = near => { for (let i = 0; i < (near ? REST.length : 12); i++) {
      const ag = tt - B[near ? i % 4 : Math.floor(hash(i * 2.3) * 4)] - hash(i * 3.3) * .08; if (ag <= 0) continue;
      const q = easeOut5(ag / .55), ang = (i + hash(i * 1.7) * .8) / 12 * TAU, R = lerp(430, 900, hash(i * 5.1));
      const fx = 960 + Math.cos(ang) * R * 1.2, fy = 500 + Math.sin(ang) * R * .62; if (!near && fy < 250 && (Math.abs(fx - 960) < 240 || fx < 400)) continue;
      const [x, y] = near ? [lerp(960, REST[i][0], q), lerp(500, REST[i][1], q)] : [lerp(960, fx, q), lerp(500, fy, q)];
      biscuit(x, y, lerp(88, 140, hash(i * 9.7 + (near ? 40 : 0))) * Math.min(1, q * 2), i * 2.1 + q * 5 + ag * .3, { col: (i + (near ? 1 : 0)) % 3 ? PAL.paper : PAL.pink }); } };
    bisc(false);
    const [lx, ly] = shakeXY(t, (sL.shake + sR.shake) * 22, 24);
    type('JUN', 372 + lx, 470 + ly, js, { col: PAL.paper, k: sL.k, alpha: sL.alpha, rot: -.03, stroke: PAL.ink, strokeW: .03, shadow: { col: PAL.ink, dx: .03, dy: .036 }, seed: 41 });
    type('JUN', 1560 + lx, 470 + ly, js, { col: PAL.paper, k: sR.k, alpha: sR.alpha, rot: .03, stroke: PAL.ink, strokeW: .03, shadow: { col: PAL.ink, dx: .03, dy: .036 }, seed: 43 });
    bisc(true);
    // the throne and the Queen. No bob, no blink, no tail.
    cushion(960, SY + 174, 900, { col: PAL.pink }); cushion(960, SY + 72, 780, { col: PAL.violet }); cushion(960, SY - 16, 660, { col: PAL.pink });
    junjunSit(960, SY, u, { ...EXPR.royal, crown: 1 });
    if (a[3] > 0) { const k = popIn(a[3], .14); circ2(392, 880, 104 * k, PAL.lime, { stroke: PAL.ink, lw: 9 }); type('姫', 392, 880, 132 * k, { font: 'jp', col: PAL.ink, wear: 0 }); }
    camEnd();
    plate('UNIMPRESSED', 1512, 905, 96, -.07, a[2]);
    label(['ROLL CALL 7/6', 'HER MAJESTY'], 70, 52, { size: 24, col: PAL.paper, screen: true });
    for (let i = 1; i < 4; i++) if (a[i] >= 0) flash((1 - a[i] / (i === 3 ? .085 : .05)) * (i === 3 ? 1 : .6), PAL.white);
  }

  chapter('chorus2', barT(50), barT(57), [
    [barT(50), biscuits2], [barT(51), warzone2], [barT(52), peaceGrowl2], [barT(53), nameCard2],
    [barT(54), cardYorkie], [barT(54, 2), cardSquirrels], [barT(54, 3), cardCat], [barT(55), cardCrows], [barT(55, 1), cardPup], [barT(55, 2), cardCommander],
    [barT(56), throne]
  ]);
  wipeAt(barT(50), [PAL.ink, PAL.lime], 5);
})();
