// c03_chorus1.js: Chorus 1 (bars 16-19). The full graphic system: giant lettering, the royal pose, bursts.
// The four compositions here come back in chorus 2 (c07), bigger and louder. They take an `amp` level (0 = first
// chorus) and are exported on CHORUS so c07 can reuse them.
const CHORUS = {};
(() => {
  const GY = 1000;

  // ---------- "I love the smell of biscuits in the morning" · the royal pose ----------
  // t0 = the bar's start time; amp 0 / 1 = first / second chorus.
  CHORUS.biscuits = (t, t0, amp = 0) => {
    const lt = t - t0, b = bp(t), P = pulse(t, 5), step = Math.floor(b) + easeOut(frac(b) * 3);
    const tSmell = t0 + .56, tBis = t0 + 1.0, tMorn = t0 + 1.82, sb = slam(t - tBis, .12);
    const [sx, sy] = shakeXY(t, sb.shake * 20);
    bg(amp ? PAL.ink : PAL.orange);
    camBegin(960 + sx, 540 + sy, 1 + seg(lt, 0, 2.65) * .06 + P * .012, 0);
    sunburst(960, 560, { n: 16, col: amp ? PAL.orange : PAL.paper, alpha: amp ? 1 : .2, rot: step * TAU / 32 });
    if (amp) sunburst(960, 560, { n: 16, col: PAL.oxblood, alpha: .55, rot: step * TAU / 32 + TAU / 64, duty: .2 });
    halftone(0, 660, W, 420, { cell: 24, col: PAL.ink, grad: [0, 720, 0, 1220], alpha: amp ? .8 : .36 });
    type('BISCUITS', 960, 300, fitSize('BISCUITS', 1800), { col: PAL.paper, k: sb.k, alpha: sb.alpha, shadow: { col: amp ? PAL.lime : PAL.ink, dx: .02, dy: .024 }, seed: 3 });
    // the small words arrive as they are sung
    [['I', t0 - .5], ['LOVE', t0 - .16], ['THE', t0 + .28], ['SMELL', tSmell], ['OF', tSmell + .16]].reduce((x, [w, tw]) => {
      const a = t - tw, big = w === 'SMELL', size = big ? 96 : 76;
      if (a > 0) type(w, x, 58, size, { font: 'hand', col: big ? PAL.lime : (amp ? PAL.paper : PAL.ink), align: 'left', k: popIn(a, .1), rot: -.02, stroke: big ? PAL.ink : null, strokeW: .14, wear: 0 });
      return x + typeW(w, size, { font: 'hand' }) + 26;
    }, 70);
    // halo, beat rings
    circ2(960, GY - 19.3 * 24 - 40, 250 + P * 14, PAL.lime, { stroke: PAL.ink, lw: 10 });
    { const c = g2d(); c.strokeStyle = PAL.paper; c.lineWidth = 9 * (1 - frac(b)); c.globalAlpha = (1 - frac(b)) * .9; c.beginPath(); c.arc(960, GY - 19.3 * 24 - 40, 260 + easeOut(frac(b)) * 190, 0, TAU); c.stroke(); c.globalAlpha = 1; }
    // biscuits in orbit: the far half first, the near half after her
    const N = amp ? 12 : 8, orbit = front => { for (let i = 0; i < N; i++) {
      const a = i / N * TAU + t * 1.15, s = Math.sin(a), k = popIn(t - tBis - i * .035, .16); if ((s > 0) !== front || k <= 0) continue;
      biscuit(960 + Math.cos(a) * (640 + amp * 60), 640 + s * 135, (118 + s * 30) * k, a * 1.7 + t, { col: i % 3 === 0 && amp ? PAL.pink : PAL.paper });
    } };
    orbit(false);
    cushion(960, GY - 46, 700, { col: amp ? PAL.violet : PAL.pink });
    const open = seg(lt, 2.2, 2.34);
    junjunSit(960, GY - 30, 24, { ...EXPR.smug, lid: lerp(1, .5, open), mouth: open > .5 ? 'flat' : 'smile', brow: lerp(-.1, .35, open), crown: seg(t, t0 + .2, t0 + .42), hy: -P * .13, tail: Math.sin(b * Math.PI) * .05 });
    orbit(true);
    // flanks
    const m = slam(t - tMorn, .1);
    if (t > tMorn - .22) type('IN THE', 330, 840, 150, { col: amp ? PAL.paper : PAL.ink, k: popIn(t - tMorn + .22, .12), rot: -.04 });
    if (m.alpha > 0) { type('MORNING', 1560, 850, 200, { col: PAL.paper, k: m.k, alpha: m.alpha, rot: .035, shadow: { col: PAL.ink } }); circ2(1790, 660, 74 * popIn(t - tMorn - .1, .14), PAL.lime, { stroke: PAL.ink, lw: 8 }); type('朝', 1790, 660, 92 * popIn(t - tMorn - .1, .14), { font: 'jp', col: PAL.ink, wear: 0 }); }
    if (amp) speedLines(960, 540, { n: 60, r0: 900, r1: 1700, col: PAL.paper, boil: true, alpha: .9 });
    camEnd();
  };

  // ---------- "Every block's a warzone, soldier — I'm warning" ----------
  CHORUS.warzone = (t, t0, amp = 0) => {
    const lt = t - t0, tEvery = t0 + .19, tWar = t0 + .59, tZone = t0 + .83, tSol = t0 + 1.13, tWarn = t0 + 1.73;
    const sw = slam(t - tWar, .1), sz = slam(t - tZone, .1), [sx, sy] = shakeXY(t, (sw.shake + sz.shake) * 20 + [0, .26, .5].reduce((p, d) => p + hit(t, tWarn + d, 12), 0) * 12);
    const dark = amp ? PAL.oxblood : PAL.ink;
    bg(dark);
    camBegin(960 + sx, 540 + sy, 1 + seg(lt, 0, 2.65) * .04, 0);
    // the neighbourhood as a tactical map: blocks light up on the eighths
    { const c = g2d(), line = mixCol(dark, PAL.paper, .16), n8 = Math.floor(bp(t) * 2); c.save(); c.translate(960, 540); c.rotate(-.12); c.translate(-960, -540); c.lineWidth = 5;
      for (let i = -1; i < 9; i++) for (let j = -1; j < 6; j++) { const x = i * 250 - 60, y = j * 215 - 40, id = i * 7 + j * 3, on = hash(id + Math.floor(n8 / 2) * 5.1) > (amp ? .7 : .84);
        if (on) { c.fillStyle = amp ? PAL.orange : mixCol(dark, PAL.orange, .75); c.fillRect(x, y, 205, 170); } c.strokeStyle = line; c.strokeRect(x, y, 205, 170); }
      c.restore(); }
    if (t > tEvery) type('EVERY BLOCK’S A', 110, 150, 66, { font: 'hand', col: PAL.paper, align: 'left', k: popIn(t - tEvery, .1), rot: -.02, wear: 0 });
    type('WAR', 470, 345, 440, { col: PAL.lime, k: sw.k, alpha: sw.alpha, rot: -.025, shadow: { col: amp ? PAL.ink : PAL.orange, dx: .022, dy: .026 }, seed: 4 });
    type('ZONE', 500, 735, 440, { col: PAL.paper, k: sz.k, alpha: sz.alpha, rot: -.025, shadow: { col: amp ? PAL.ink : PAL.orange, dx: .022, dy: .026 }, seed: 6 });
    if (amp) flames(1440, 1010, 900, 760, seg(lt, .4, 1.2));
    const cam = t >= tSol;
    junjunBust(1440, 575, 47, { ...(cam ? EXPR.judge : EXPR.sideEye), look: cam ? [0, .05] : [-.95, .05], tilt: cam ? -.035 * elasticOut((t - tSol) / .35) : 0, lid: Math.max(cam ? .52 : .5, blink(t, 3)), crown: amp ? 1 : 0 });
    if (cam) type('SOLDIER,', 1440, 150, 118, { font: 'hand', col: PAL.paper, k: popIn(t - tSol, .1), rot: .045, wear: 0 });
    camEnd();
    hazard(0, 0, W, 86, t * 240, PAL.lime, PAL.ink, { screen: true }); hazard(0, H - 86, W, 86, -t * 240, PAL.lime, PAL.ink, { screen: true });
    [[0, 1010, 430, -.19, 92], [.26, 820, 905, .07, 76], [.5, 1120, 640, -.06, 118]].forEach(([d, x, y, r, s], i) => stamp('WARNING', x, y, { k: popIn(t - tWarn - d, .12), size: s, rot: r, col: i === 2 ? PAL.lime : PAL.orange, seed: i + 2, screen: true }));
  };

  // ---------- "Pass in peace, or you're catchin' that growl" ----------
  CHORUS.peaceGrowl = (t, t0, amp = 0) => {
    const lt = t - t0, tCut = t0 + 1.17, tGrowl = t0 + 1.83;
    if (t < tCut) {
      // option A: the calmest frame in the film
      bg(PAL.paper);
      camBegin(960, 540 - lt * 10, 1 + lt * .02, 0);
      circ2(960, 520, 590 + Math.sin(t * 2) * 6, amp ? PAL.pink : PAL.sage);
      type('PEACE', 960, 440, 420, { col: PAL.paper, track: .05, wear: .2, seed: 8 });
      type('PASS  IN', 960, 150, 84, { col: PAL.ink, track: .5, wear: .15 });
      for (let i = 0; i < 5; i++) { const fx = 330 + i * 320 + (i > 1 ? 0 : -40), k = popIn(t - (t0 + .1 + i * .12), .2); if (k > 0) { for (let p = 0; p < 5; p++) circ2(fx + Math.cos(p / 5 * TAU + i) * 20 * k, 925 + Math.sin(p / 5 * TAU + i) * 20 * k, 15 * k, i % 2 ? PAL.pink : PAL.orange); circ2(fx, 925, 9 * k, PAL.lime); } }
      junjunSit(960, 1000, 15.5, { ...EXPR.shut, mouth: 'smile', tail: Math.sin(t * 5) * .08 });
      { const bx = lerp(520, 1280, lt / 1.2) , by = 300 + Math.sin(t * 7) * 46, fl = Math.abs(Math.sin(t * 22)); for (const s of [1, -1]) poly2([[bx, by], [bx + s * 46 * fl, by - 40], [bx + s * 54 * fl, by + 22]], PAL.pink, { stroke: PAL.ink, lw: 5, join: 'round' }); }
      camEnd();
      label('OPTION A  (RECOMMENDED)', 70, 60, { size: 26, col: PAL.ink, screen: true });
    } else {
      // option B
      const a = t - tGrowl, g = seg(t, tCut, tGrowl), [sx, sy] = shakeXY(t, 5 + clamp(a * 30, 0, 1) * 9, 12);
      bg(amp ? PAL.ink : PAL.orange);
      camBegin(960 + sx, 540 + sy, 1 + g * .06 + clamp(a, 0, 1) * .04, 0);
      speedLines(960, 640, { n: 70, r0: 760, r1: 1700, col: amp ? PAL.orange : PAL.ink, boil: true, boilRate: 12, w: [.004, .03] });
      if (amp) flames(960, 1100, 1900, 900, g);
      junjunBust(960, 250, 100, { ...EXPR.rage, iris: lerp(.8, .48, g), ear: .3 * g, tilt: (hash(Math.floor(t * 12)) - .5) * .012 });
      vibLines(960, 250 + 3.7 * 100, 420, 330, .5 + g * .5, { n: 14, sw: 1.6, len: 1.5, seed: 9 });
      for (let i = 0; i < 4; i++) { const ka = t - (tCut + .2 + i * .14); if (ka > 0) type('ガルルル'[i], 150 + (i % 2) * 70, 250 + i * 180, 150, { font: 'jp', col: amp ? PAL.lime : PAL.ink, k: popIn(ka, .1), rot: -.15 + hash(i + Math.floor(t * 8)) * .1, wear: .2 }); }
      if (a > 0) { const s = slam(a, .1); type('GROWL', 960, 925, 330, { col: PAL.lime, stroke: PAL.ink, strokeW: .05, k: s.k, alpha: s.alpha, track: .02,
        per: i => ({ dx: (hash(i * 3.1 + Math.floor(t * 12)) - .5) * .035, dy: (hash(i * 7.7 + Math.floor(t * 12)) - .5) * .05, rot: (hash(i + Math.floor(t * 12) * 1.7) - .5) * .09 }), wear: .25 }); }
      camEnd();
      const words = [['OR', tCut + .02], ['YOU’RE', tCut + .08], ['CATCHIN’', tCut + .2], ['THAT', tCut + .42]];
            words.reduce((x, [w, tw]) => { if (t > tw) type(w, x, 46, 58, { font: 'hand', col: PAL.paper, stroke: PAL.ink, strokeW: .2, align: 'left', screen: true, wear: 0, rot: -.01 }); return x + typeW(w, 58, { font: 'hand' }) + 22; }, 330);
      label('OPTION B', 70, 60, { size: 26, col: PAL.ink, bg: PAL.lime, screen: true, pad: 12 });
    }
    slashWipe((t - (tCut - .14)) / .28, PAL.ink, { seed: 3 });
  };

  // ---------- "Princess JunJun's on patrol, movin' through the prowl" · the name card ----------
  CHORUS.nameCard = (t, t0, amp = 0) => {
    const lt = t - t0, tPat = t0 + .42, s1 = slam(lt + .02, .1), s2 = slam(lt - .16, .1), [sx, sy] = shakeXY(t, (s1.shake + s2.shake) * 18);
    const u = 30, ph = lt * 1.6 * (1 + amp * .2), dogX = lerp(-340, 2300, lt / 2.65);
    bg(amp ? PAL.violet : PAL.paper);
    camBegin(960 + sx + easeIn(seg(lt, 2.2, 2.65)) * 500, 540 + sy, 1 + lt * .012, 0);
    if (amp) sunburst(960, 540, { n: 20, col: PAL.ink, alpha: .25, rot: t * .3 });
    type('PRINCESS', 960, 285, fitSize('PRINCESS', 1780), { col: PAL.orange, k: s1.k, alpha: s1.alpha, shadow: amp ? { col: PAL.ink } : null, seed: 11 });
    type('JUNJUN', 960, 715, fitSize('JUNJUN', 1780) * .86, { col: amp ? PAL.lime : PAL.ink, k: s2.k, alpha: s2.alpha, shadow: amp ? { col: PAL.ink } : null, seed: 13 });
    dryStroke(40, 978, 1900, 962, 60, amp ? PAL.orange : PAL.pink, { seed: 21, p: easeOut(seg(lt, .3, .6)) });
    streaks({ col: amp ? PAL.paper : PAL.ink, n: 26, drift: -lt * 2400, th: [3, 11], len: [240, 900], area: [-200, 60, W + 400, 930], alpha: .9 });
    type('ジュンジュン', 960, 1040, 50, { font: 'jp', col: amp ? PAL.paper : PAL.ink, track: .5, alpha: seg(lt, .4, .55), wear: .1 });
    junjunSide(dogX, GY + 10, u, { ...EXPR.royal, walk: ph, crown: 1, look: [.3, 0], shadowOp: amp ? 255 : 255, leash: amp ? null : [dogX - 1500, 420], slack: .04 });
    camEnd();
    stamp('ON PATROL', 1560, 150, { k: popIn(t - tPat, .12), size: 104, rot: -.1, col: amp ? PAL.paper : PAL.oxblood, screen: true, seed: 5 });
    if (t > tPat + .2) { const k = popIn(t - tPat - .2, .12); rect2(1740 - 118 * k, 262 - 44 * k, 236 * k, 88 * k, PAL.lime, { screen: true, stroke: PAL.ink, lw: 6 }); type('巡回中', 1740, 262, 62 * k, { font: 'jp', col: PAL.ink, screen: true, wear: 0 }); }
  };

  chapter('chorus1', barT(16), barT(20), [
    [barT(16), t => CHORUS.biscuits(t, barT(16), 0)], [barT(17), t => CHORUS.warzone(t, barT(17), 0)],
    [barT(18), t => CHORUS.peaceGrowl(t, barT(18), 0)], [barT(19), t => CHORUS.nameCard(t, barT(19), 0)]
  ]);
  wipeAt(barT(16), [PAL.ink, PAL.paper], 3);
  wipeAt(barT(20), [PAL.ink, PAL.blue], 7, .12);
})();
