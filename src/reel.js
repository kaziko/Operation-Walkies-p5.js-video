// reel.js: the tall trailer for Instagram (1080 × 1920). Bars 14-19 of the film (the stare, the lunge, chorus 1)
// redrawn for a tall frame, then a call-to-action card over bars 20-21. It runs on song time, so every sync point
// is the film's own.
//   node render.mjs --fmt=v --scene=reel --clip=39.416:60.639 --fade=.03:1.6 --out=out/junjun-reel.mp4
// Instagram lays its own interface over the top and the bottom of a Reel: lettering that must be read stays inside
// y 230..1560, and nothing important sits at the far right below the middle (the like / share buttons).
(() => {
  const CX = 540, CY = 960;

  // ---------- bar 14 · "Eye contact's a contract, you bark — that's war" · THE STARE ----------
  function stare(t) {
    const t0 = barT(14), lt = t - t0, tLock = t0 + .34, tBark = 40.5, tWar = 41.08;
    if (t < tWar) {
      const build = seg(t, t0 + .2, tWar), u = 62, hy = 905, z = lerp(1, 1.14, ease(seg(t, t0, tWar)));
      const lookX = t < tLock ? -.65 : lerp(-.65, .92, easeOut5((t - tLock) / .09)), lookY = t < tLock ? .1 : -.3 * easeOut5((t - tLock) / .09);
      const tw = hit(t, tBark + .14, 14), irisR = lerp(.9, .5, easeOut(seg(t, tBark + .1, tBark + .3)));
      bg(PAL.orange);
      camBegin(CX, CY, z, 0);
      stareLines(CX, hy, build, { dim: .86, col: PAL.orange, n: 96, r0: 520, ey: 1.25 });
      // menace, lettered the manga way: it climbs both edges behind her
      [[112, 800], [972, 715], [100, 590], [985, 500]].forEach(([x, y], i) => { const a = t - (t0 + .5 + i * .26); if (a > 0) type('ゴ', x, y, 124 + i * 10, { font: 'jp', col: PAL.orange, k: popIn(a, .14), rot: -.18 + i * .05, alpha: .95, wear: .2 }); });
      junjunBust(CX, hy, u, { ...EXPR.stare, look: [lookX, lookY], lid: lerp(.3, .5, ease(seg(t, tLock + .2, tLock + .7))) - tw * .12, brow: lerp(.4, .95, build) + tw * .2, iris: irisR, browY: -tw * .1, ear: build * .12 });
      vibLines(CX, hy - 60, 470, 420, seg(t, tBark, tWar), { n: 16, sw: 1.5, len: 1.5, arc: [Math.PI * .95, Math.PI * 2.05], seed: 2 });
      camEnd();
      // cinematic bars carry the legal text
      const lb = easeOut(seg(lt, 0, .22));
      rect2(0, 0, W, 350 * lb, PAL.ink, { screen: true }); rect2(0, H - 500 * lb, W, 500 * lb, PAL.ink, { screen: true });
      type('EYE CONTACT’S', 70 - (1 - easeOut5((t - (t0 + .04)) / .2)) * 1000, 282, fitSize('EYE CONTACT’S', 900), { col: PAL.paper, align: 'left', screen: true, wear: .25 });
      const ca = t - (t0 + .58); if (ca > 0) type('A CONTRACT.', W - 70, 1506, fitSize('A CONTRACT.', 760), { col: PAL.lime, align: 'right', screen: true, k: slam(ca, .1).k, wear: .25 });
      const sa = t - (t0 + .95); if (sa > 0) { pawPrint(150, 1510, 130, -.3, PAL.orange, { screen: true, alpha: clamp(sa / .1) }); stamp('SIGNED', 320, 1642, { k: popIn(sa, .14), size: 56, col: PAL.orange, rot: -.07, screen: true }); }
      // the bark arrives in its own panel
      const pa = t - (tBark - .1);
      if (pa > 0) {
        const k = backOut(pa / .16, 1.3) * .8, c = g2d(true), px = 850, py = 1272;
        c.save(); c.translate(px, py); c.rotate(.05); c.scale(k, k);
        c.fillStyle = PAL.ink; c.fillRect(-196, -150, 412, 320); c.fillStyle = PAL.paper; c.fillRect(-210, -164, 412, 320); c.strokeStyle = PAL.ink; c.lineWidth = 9; c.strokeRect(-210, -164, 412, 320); c.restore();
        if (k > .72) {
          const yb = Math.max(hit(t, tBark, 10), hit(t, tBark + .2, 10));
          yorkie(px + 32, py + 96, 17, { flip: true, bark: yb, hop: yb * .7, shadow: false });
          type('YIP!', px - 88, py - 72, 62, { font: 'hand', col: PAL.oxblood, rot: -.14, k: 1 + yb * .25, screen: true, wear: .2 });
        }
      }
    } else {
      // impact frame: the one explosive beat, stacked for the tall frame
      const a = t - tWar, [sx, sy] = shakeXY(t, 46 * Math.exp(-a * 5), 24), inv = a > .33 && a < .41, dark = inv ? PAL.white : PAL.ink, light = inv ? PAL.ink : PAL.white;
      const k = easeOut5(a / .12), cx = CX, cy = 830;
      camBegin(CX + sx, CY + sy, 1.06 - .06 * easeOut(a / .5), (hash(Math.floor(t * 24)) - .5) * .03 * Math.exp(-a * 5));
      bg(dark);
      burst(cx, cy, 330 * k, 800 * k, { n: 18, seed: 11, col: PAL.orange, irr: .4, ey: 1.45, rot: a * .3 });
      burst(cx, cy, 250 * k, 640 * k, { n: 16, seed: 16, col: light, irr: .38, ey: 1.45, rot: .2 - a * .2 });
      speedLines(cx, cy, { n: 90, r0: 300, r1: 1800, col: dark, w: [.004, .028], seed: 11, boil: true, boilRate: 12, ey: 1.45 });
      halftone(0, 0, W, H, { cell: 22, ang: .45, col: dark, radial: [cx, cy, 420, 900], max: .8 });
      type('戦', 245, 455, 350, { font: 'jp', col: PAL.orange, stroke: PAL.ink, strokeW: .03, rot: -.1, k: slam(a - .04, .1).k, alpha: clamp((a - .04) / .04), wear: .15 });
      junjunBust(575, 850, 50, { ...EXPR.rage, mono: true, tilt: -.05, sx: 1 + Math.exp(-a * 14) * .1, sy: 1 + Math.exp(-a * 14) * .1 });
      const s = slam(a - .02, .1);
      type('WAR', CX, 1335, fitSize('WAR', 720), { col: PAL.white, stroke: PAL.ink, strokeW: .07, k: s.k, alpha: s.alpha, rot: .025, per: (i) => ({ dy: (hash(i + Math.floor(t * 12)) - .5) * .02 * Math.exp(-a * 3), rot: (hash(i * 3 + Math.floor(t * 12)) - .5) * .05 * Math.exp(-a * 3) }), wear: .2 });
      type('THAT’S', 235, 1085, 140, { font: 'hand', col: PAL.lime, stroke: PAL.ink, strokeW: .2, rot: -.12, alpha: clamp(a / .05), wear: 0 });
      camEnd();
      flash(1 - a / .09, PAL.white);
      label('THREAT LEVEL: AKITA', W - 64, 262, { size: 26, col: PAL.ink, bg: PAL.lime, align: 'right', screen: true, alpha: seg(a, .3, .4), pad: 12 });
    }
  }

  // ---------- bar 15 · "I'll lunge so hard I'll make my human hit the floor" ----------
  function lunge(t) {
    const t0 = barT(15), lt = t - t0, tHard = 42.56, tMake = 43.0, tHit = 43.54, tFloor = 43.96, u = 19, gy = 1240, sl = slam(lt, .1), dogX = 815;
    const [sx, sy] = shakeXY(t, sl.shake * 14 + hit(t, tHit, 7) * 40, 24), sF = fitSize('FLOOR', 940);
    bg(PAL.paper);
    camBegin(CX + sx, CY + sy, 1 + lt * .01, 0);
    halftone(0, 1480, W, 460, { cell: 24, col: PAL.orange, grad: [0, 1500, 0, 2300], alpha: .8 });
    type('I’LL', 76, 318, 104, { font: 'hand', col: PAL.ink, align: 'left', rot: -.04, wear: 0 });
    type('LUNGE', CX, 545, fitSize('LUNGE', 940), { col: PAL.orange, k: sl.k, alpha: sl.alpha, rot: -.02, seed: 22 });
    if (t > tFloor) { const sf = slam(t - tFloor, .09); type('FLOOR', CX, gy + capH(sF) / 2 + 6, sF, { col: PAL.ink, k: sf.k, alpha: sf.alpha, seed: 25 }); }
    else dryStroke(-200, gy + 44, 1300, gy + 36, 92, PAL.ink, { seed: 27 });
    // the human: relaxed, yanked, airborne, floored
    let hand;
    if (t < tHard) hand = commander(96 + lt * 44, gy, u, { pose: 'walk', walk: lt * 1.4, face: 'calm' });
    else if (t < tMake) { const a = seg(t, tHard, tMake); hand = commander(117 + a * 60, gy, u, { pose: 'stand', face: 'panic', lean: .25 + a * .3, arm: 1.5 }); }
    else if (t < tHit) { const a = seg(t, tMake, tHit); hand = commander(190 + easeIn(a) * 290, gy - u * (8 + Math.sin(a * Math.PI) * 7), u, { pose: 'dragged', face: 'panic' }); }
    else { const a = t - tHit; burst(450, gy - 8, 120 * easeOut(a / .1), 350 * easeOut(a / .1), { n: 13, seed: 4, col: PAL.orange, stroke: PAL.ink, lw: 7, ey: .5, alpha: 1 - seg(a, .5, .8) });
      hand = commander(420, gy, u, { pose: 'flat', face: 'dead' });
      for (let i = 0; i < 3; i++) { const sa = (i / 3 + t * .9) * TAU; poly2(burstPts(700 + Math.cos(sa) * 66, gy - 150 + Math.sin(sa) * 24, 9, 24, 4, i), PAL.lime, { stroke: PAL.ink, lw: 4 }); } }
    // she leans. One inch.
    junjunSide(dogX, gy, u, { ...EXPR.judge, look: [.5, 0], lean: .07 * easeOut5(seg(t, tHard - .06, tHard + .06)), leash: hand, slack: t < tHard ? .16 : 0, shadowOp: 0 });
    if (t > tHit && t < tHit + .5) type('HIT', 300, 905, 230, { col: PAL.ink, k: slam(t - tHit, .07).k, rot: .06, wear: .2 });
    camEnd();
    if (t > tHard) label(typed('LUNGE DISTANCE: 2.5 CM', t - tHard - .05, 44), W - 70, 738, { size: 30, col: PAL.oxblood, align: 'right', screen: true });
  }

  // ---------- bar 16 · "I love the smell of biscuits in the morning" · the royal pose ----------
  function biscuits(t) {
    const t0 = barT(16), lt = t - t0, b = bp(t), P = pulse(t, 5), step = Math.floor(b) + easeOut(frac(b) * 3);
    const tSmell = t0 + .56, tBis = t0 + 1.0, tMorn = t0 + 1.82, sb = slam(t - tBis, .12), [sx, sy] = shakeXY(t, sb.shake * 20);
    const GY = 1345, u = 27, hc = GY - 30 - 19.3 * u;
    bg(PAL.orange);
    camBegin(CX + sx, CY + sy, 1 + seg(lt, 0, 2.65) * .05 + P * .012, 0);
    sunburst(CX, hc + 40, { n: 16, col: PAL.paper, alpha: .2, rot: step * TAU / 32 });
    halftone(0, 1180, W, 760, { cell: 24, col: PAL.ink, grad: [0, 1250, 0, 2050], alpha: .36 });
    type('BISCUITS', CX, 452, fitSize('BISCUITS', 960), { col: PAL.paper, k: sb.k, alpha: sb.alpha, shadow: { col: PAL.ink, dx: .02, dy: .024 }, seed: 3 });
    // the small words arrive as they are sung
    { const ws = [['I', t0 - .5], ['LOVE', t0 - .16], ['THE', t0 + .28], ['SMELL', tSmell], ['OF', tSmell + .16]], sz = w => w === 'SMELL' ? 100 : 80, gap = 26;
      const total = ws.reduce((p, [w]) => p + typeW(w, sz(w), { font: 'hand' }) + gap, -gap);
      ws.reduce((x, [w, tw]) => { const a = t - tw, big = w === 'SMELL';
        if (a > 0) type(w, x, 272, sz(w), { font: 'hand', col: big ? PAL.lime : PAL.ink, align: 'left', k: popIn(a, .1), rot: -.02, stroke: big ? PAL.ink : null, strokeW: .14, wear: 0 });
        return x + typeW(w, sz(w), { font: 'hand' }) + gap; }, CX - total / 2); }
    // halo, beat rings
    circ2(CX, hc - 40, 212 + P * 12, PAL.lime, { stroke: PAL.ink, lw: 10 });
    { const c = g2d(); c.strokeStyle = PAL.paper; c.lineWidth = 9 * (1 - frac(b)); c.globalAlpha = (1 - frac(b)) * .9; c.beginPath(); c.arc(CX, hc - 40, 222 + easeOut(frac(b)) * 170, 0, TAU); c.stroke(); c.globalAlpha = 1; }
    // biscuits in orbit: the far half first, the near half after her
    const N = 8, orbit = front => { for (let i = 0; i < N; i++) {
      const a = i / N * TAU + t * 1.15, s = Math.sin(a), k = popIn(t - tBis - i * .035, .16); if ((s > 0) !== front || k <= 0) continue;
      biscuit(CX + Math.cos(a) * 440, GY - 400 + s * 150, (104 + s * 28) * k, a * 1.7 + t);
    } };
    orbit(false);
    cushion(CX, GY - 46, 660, { col: PAL.pink });
    const open = seg(lt, 2.2, 2.34);
    junjunSit(CX, GY - 30, u, { ...EXPR.smug, lid: lerp(1, .5, open), mouth: open > .5 ? 'flat' : 'smile', brow: lerp(-.1, .35, open), crown: seg(t, t0 + .2, t0 + .42), hy: -P * .13, tail: Math.sin(b * Math.PI) * .05 });
    orbit(true);
    // the last words, under the cushion
    const m = slam(t - tMorn, .1);
    if (t > tMorn - .22) type('IN THE', 205, 1502, 118, { col: PAL.ink, k: popIn(t - tMorn + .22, .12), rot: -.04 });
    if (m.alpha > 0) { type('MORNING', 690, 1500, 172, { col: PAL.paper, k: m.k, alpha: m.alpha, rot: .02, shadow: { col: PAL.ink } }); circ2(136, 1150, 70 * popIn(t - tMorn - .1, .14), PAL.lime, { stroke: PAL.ink, lw: 8 }); type('朝', 136, 1150, 88 * popIn(t - tMorn - .1, .14), { font: 'jp', col: PAL.ink, wear: 0 }); }
    camEnd();
  }

  // ---------- bar 17 · "Every block's a warzone, soldier — I'm warning" ----------
  function warzone(t) {
    const t0 = barT(17), lt = t - t0, tEvery = t0 + .19, tWar = t0 + .59, tZone = t0 + .83, tSol = t0 + 1.13, tWarn = t0 + 1.73;
    const sw = slam(t - tWar, .1), sz = slam(t - tZone, .1), [sx, sy] = shakeXY(t, (sw.shake + sz.shake) * 20 + [0, .26, .5].reduce((p, d) => p + hit(t, tWarn + d, 12), 0) * 12);
    const S = fitSize('ZONE', 800), wWar = typeW('WAR', S);
    bg(PAL.ink);
    camBegin(CX + sx, CY + sy, 1 + seg(lt, 0, 2.65) * .04, 0);
    // the neighbourhood as a tactical map: blocks light up on the eighths
    { const c = g2d(), line = mixCol(PAL.ink, PAL.paper, .16), n8 = Math.floor(bp(t) * 2); c.save(); c.translate(CX, CY); c.rotate(-.12); c.translate(-CX, -CY); c.lineWidth = 5;
      for (let i = -1; i < 6; i++) for (let j = -1; j < 10; j++) { const x = i * 250 - 60, y = j * 215 - 40, id = i * 7 + j * 3, on = hash(id + Math.floor(n8 / 2) * 5.1) > .84;
        if (on) { c.fillStyle = mixCol(PAL.ink, PAL.orange, .75); c.fillRect(x, y, 205, 170); } c.strokeStyle = line; c.strokeRect(x, y, 205, 170); }
      c.restore(); }
    if (t > tEvery) type('EVERY BLOCK’S A', 74, 262, 70, { font: 'hand', col: PAL.paper, align: 'left', k: popIn(t - tEvery, .1), rot: -.02, wear: 0 });
    type('WAR', 70 + wWar / 2, 480, S, { col: PAL.lime, k: sw.k, alpha: sw.alpha, rot: -.025, shadow: { col: PAL.orange, dx: .022, dy: .026 }, seed: 4 });
    type('ZONE', 70 + 400, 826, S, { col: PAL.paper, k: sz.k, alpha: sz.alpha, rot: -.025, shadow: { col: PAL.orange, dx: .022, dy: .026 }, seed: 6 });
    const cam = t >= tSol;
    junjunBust(650, 1275, 40, { ...(cam ? EXPR.judge : EXPR.sideEye), look: cam ? [0, .05] : [-.95, .05], tilt: cam ? -.035 * elasticOut((t - tSol) / .35) : 0, lid: Math.max(cam ? .52 : .5, blink(t, 3)) });
    if (cam) type('SOLDIER,', 222, 1085, 84, { font: 'hand', col: PAL.paper, k: popIn(t - tSol, .1), rot: -.05, wear: 0 });
    camEnd();
    hazard(0, 0, W, 96, t * 240, PAL.lime, PAL.ink, { screen: true }); hazard(0, H - 96, W, 96, -t * 240, PAL.lime, PAL.ink, { screen: true });
    [[0, 232, 1250, -.19, 74], [.26, 196, 1398, .07, 62], [.5, 335, 1520, -.06, 94]].forEach(([d, x, y, r, s], i) => stamp('WARNING', x, y, { k: popIn(t - tWarn - d, .12), size: s, rot: r, col: i === 2 ? PAL.lime : PAL.orange, seed: i + 2, screen: true }));
  }

  // ---------- bar 18 · "Pass in peace, or you're catchin' that growl" ----------
  function peaceGrowl(t) {
    const t0 = barT(18), lt = t - t0, tCut = t0 + 1.17, tGrowl = t0 + 1.83;
    if (t < tCut) {
      // option A: the calmest frame in the film
      bg(PAL.paper);
      camBegin(CX, CY - lt * 10, 1 + lt * .02, 0);
      circ2(CX, 880, 560 + Math.sin(t * 2) * 6, PAL.sage);
      type('PEACE', CX, 690, fitSize('PEACE', 800, { track: .05 }), { col: PAL.paper, track: .05, wear: .2, seed: 8 });
      type('PASS  IN', CX, 436, 88, { col: PAL.ink, track: .5, wear: .15 });
      for (let i = 0; i < 5; i++) { const fx = 140 + i * 200, k = popIn(t - (t0 + .1 + i * .12), .2); if (k > 0) { for (let p = 0; p < 5; p++) circ2(fx + Math.cos(p / 5 * TAU + i) * 22 * k, 1470 + Math.sin(p / 5 * TAU + i) * 22 * k, 16 * k, i % 2 ? PAL.pink : PAL.orange); circ2(fx, 1470, 10 * k, PAL.lime); } }
      junjunSit(CX, 1400, 21, { ...EXPR.shut, mouth: 'smile', tail: Math.sin(t * 5) * .08 });
      { const bx = lerp(190, 830, lt / 1.2), by = 905 + Math.sin(t * 7) * 40, fl = Math.abs(Math.sin(t * 22)); for (const s of [1, -1]) poly2([[bx, by], [bx + s * 46 * fl, by - 40], [bx + s * 54 * fl, by + 22]], PAL.pink, { stroke: PAL.ink, lw: 5, join: 'round' }); }
      camEnd();
      label('OPTION A  (RECOMMENDED)', 70, 262, { size: 30, col: PAL.ink, screen: true });
    } else {
      // option B
      const a = t - tGrowl, g = seg(t, tCut, tGrowl), [sx, sy] = shakeXY(t, 5 + clamp(a * 30, 0, 1) * 9, 12), u = 62, hy = 835;
      bg(PAL.orange);
      camBegin(CX + sx, CY + sy, 1 + g * .06 + clamp(a, 0, 1) * .04, 0);
      speedLines(CX, 900, { n: 70, r0: 450, r1: 1800, col: PAL.ink, boil: true, boilRate: 12, w: [.004, .03], ey: 1.45 });
      junjunBust(CX, hy, u, { ...EXPR.rage, iris: lerp(.8, .48, g), ear: .3 * g, tilt: (hash(Math.floor(t * 12)) - .5) * .012 });
      vibLines(CX, hy + 3.7 * u, 4.2 * u, 3.3 * u, .5 + g * .5, { n: 14, sw: 1.4, len: 1.3, seed: 9 });
      for (let i = 0; i < 4; i++) { const ka = t - (tCut + .2 + i * .14); if (ka > 0) type('ガルルル'[i], 150 + i * 150, 1200 + (i % 2) * 34, 112, { font: 'jp', col: PAL.paper, stroke: PAL.ink, strokeW: .1, k: popIn(ka, .1), rot: -.15 + hash(i + Math.floor(t * 8)) * .1, wear: .2 }); }
      if (a > 0) { const s = slam(a, .1); type('GROWL', CX, 1420, fitSize('GROWL', 900, { track: .02 }), { col: PAL.lime, stroke: PAL.ink, strokeW: .05, k: s.k, alpha: s.alpha, track: .02,
        per: i => ({ dx: (hash(i * 3.1 + Math.floor(t * 12)) - .5) * .035, dy: (hash(i * 7.7 + Math.floor(t * 12)) - .5) * .05, rot: (hash(i + Math.floor(t * 12) * 1.7) - .5) * .09 }), wear: .25 }); }
      camEnd();
      { const ws = [['OR', tCut + .02], ['YOU’RE', tCut + .08], ['CATCHIN’', tCut + .2], ['THAT', tCut + .42]], total = ws.reduce((p, [w]) => p + typeW(w, 64, { font: 'hand' }) + 22, -22);
        ws.reduce((x, [w, tw]) => { if (t > tw) type(w, x, 322, 64, { font: 'hand', col: PAL.paper, stroke: PAL.ink, strokeW: .2, align: 'left', screen: true, wear: 0, rot: -.01 }); return x + typeW(w, 64, { font: 'hand' }) + 22; }, CX - total / 2); }
      label('OPTION B', 70, 236, { size: 30, col: PAL.ink, bg: PAL.lime, screen: true, pad: 12 });
    }
    slashWipe((t - (tCut - .14)) / .28, PAL.ink, { seed: 3 });
  }

  // ---------- bar 19 · "Princess JunJun's on patrol, movin' through the prowl" · the name card ----------
  function nameCard(t) {
    const t0 = barT(19), lt = t - t0, tPat = t0 + .42, s1 = slam(lt + .02, .1), s2 = slam(lt - .16, .1), [sx, sy] = shakeXY(t, (s1.shake + s2.shake) * 18);
    const u = 27, GY = 1440, dogX = lerp(-330, 1500, lt / 2.65);
    bg(PAL.paper);
    camBegin(CX + sx + easeIn(seg(lt, 2.2, 2.65)) * 300, CY + sy, 1 + lt * .012, 0);
    type('PRINCESS', CX, 540, fitSize('PRINCESS', 980), { col: PAL.orange, k: s1.k, alpha: s1.alpha, seed: 11 });
    type('JUNJUN', CX, 852, fitSize('JUNJUN', 980), { col: PAL.ink, k: s2.k, alpha: s2.alpha, seed: 13 });
    dryStroke(20, GY + 38, 1070, GY + 26, 58, PAL.pink, { seed: 21, p: easeOut(seg(lt, .3, .6)) });
    streaks({ col: PAL.ink, n: 22, drift: -lt * 2000, th: [3, 11], len: [200, 700], area: [-200, 1010, W + 400, 380], alpha: .9 });
    type('ジュンジュン', CX, GY + 100, 54, { font: 'jp', col: PAL.ink, track: .5, alpha: seg(lt, .4, .55), wear: .1 });
    junjunSide(dogX, GY + 10, u, { ...EXPR.royal, walk: lt * 2.1, crown: 1, look: [.3, 0], leash: [dogX - 1000, 760], slack: .04 });
    camEnd();
    stamp('ON PATROL', 735, 318, { k: popIn(t - tPat, .12), size: 88, rot: -.06, col: PAL.oxblood, screen: true, seed: 5 });
    if (t > tPat + .2) { const k = popIn(t - tPat - .2, .12); rect2(205 - 118 * k, 318 - 44 * k, 236 * k, 88 * k, PAL.lime, { screen: true, stroke: PAL.ink, lw: 6 }); type('巡回中', 205, 318, 62 * k, { font: 'jp', col: PAL.ink, screen: true, wear: 0 }); }
  }

  // ---------- bars 20-21 · where to see the rest ----------
  // The song runs on under the card (verse 2 starts), so the cut feels like "to be continued".
  function endCard(t) {
    const t0 = barT(20), lt = t - t0, P = pulse(t, 5);
    const tB = barT(20, 1), tC = barT(20, 2), tD = barT(20, 3), tE = barT(21);
    const s1 = slam(lt - .04, .1), s2 = slam(t - tB, .1), s4 = slam(t - tD, .1), [sx, sy] = shakeXY(t, (s1.shake + s2.shake + s4.shake) * 14);
    bg(PAL.ink);
    camBegin(CX + sx, CY + sy, 1 + seg(lt, 0, 5.3) * .035, 0);
    sunburst(CX, 885, { n: 18, col: PAL.orange, alpha: .12, rot: t * .05 });
    halftone(0, 1380, W, 560, { cell: 24, col: PAL.orange, grad: [0, 1480, 0, 2050], alpha: .9, max: .8 });
    type('OPERATION', CX, 380, fitSize('OPERATION', 900), { col: PAL.paper, k: s1.k, alpha: s1.alpha, seed: 31 });
    type('WALKIES', CX, 592, fitSize('WALKIES', 900), { col: PAL.orange, k: s2.k, alpha: s2.alpha, shadow: { col: PAL.paper, dx: .016, dy: .02 }, seed: 33 });
    // she looks at you, checks that the link is there, and looks at you again
    const look = kf(t, [[tE + .3, [0, .05]], [tE + .4, [.55, .9]], [tE + 1.15, [.55, .9]], [tE + 1.25, [0, .05]]], easeOut), back = seg(t, tE + 1.25, tE + 1.4);
    junjunBust(CX, 885, 33, { ...EXPR.judge, look, lid: Math.max(.5 - back * .14, blink(t, 5, 3.1)), brow: .5 + back * .3, crown: seg(t, tB + .1, tB + .34) });
    camEnd();
    // the order: a lime band across the frame
    const kb = popIn(t - tC, .16), rot = -.025, R = (dx, dy) => [CX + dx * Math.cos(rot) - dy * Math.sin(rot), 1362 + dx * Math.sin(rot) + dy * Math.cos(rot)];
    if (kb > 0) {
      const c = g2d(true); c.save(); c.translate(CX, 1362); c.rotate(rot); c.scale(1, Math.min(kb, 1.06));
      c.fillStyle = PAL.orange; c.fillRect(-700, -146, 1400, 320); c.fillStyle = PAL.lime; c.fillRect(-700, -160, 1400, 320); c.restore();
      const a = t - tC - .1; if (a > 0) type('WATCH THE FULL OPERATION', ...R(0, -98), fitSize('WATCH THE FULL OPERATION', 930), { col: PAL.ink, rot, screen: true, k: popIn(a, .12), wear: .2, seed: 35 });
      if (s4.alpha > 0) type('ON YOUTUBE', ...R(0, 46), fitSize('ON YOUTUBE', 930), { col: PAL.ink, rot, screen: true, k: s4.k * (1 + P * .018), alpha: s4.alpha, wear: .25, seed: 37 });
    }
    // where the link is
    const kt = popIn(t - tE, .14);
    if (kt > 0) {
      const sz = 60, w = typeW('LINK IN BIO', sz) + 130, h = 98, x = 800, y = 1150 - P * 7, c = g2d(true);
      c.save(); c.translate(x, y); c.rotate(.045); c.scale(kt, kt); c.fillStyle = PAL.orange; c.fillRect(-w / 2 + 9, -h / 2 + 10, w, h); c.fillStyle = PAL.paper; c.fillRect(-w / 2, -h / 2, w, h); c.strokeStyle = PAL.ink; c.lineWidth = 7; c.strokeRect(-w / 2, -h / 2, w, h); c.restore();
      if (kt > .7) { type('LINK IN BIO', x + 34, y + 3, sz * kt, { col: PAL.ink, rot: .045, screen: true, wear: 0 }); pawPrint(x - w / 2 + 50, y, 56, .25, PAL.orange, { screen: true }); }
    }
    label(typed('MISSION FILE 001 // FULL REPORT RELEASED', lt - .5, 40), 70, 236, { size: 25, col: PAL.lime, screen: true });
  }

  const REEL = [[barT(14), stare], [barT(15), lunge], [barT(16), biscuits], [barT(17), warzone], [barT(18), peaceGrowl], [barT(19), nameCard], [barT(20), endCard]];
  const REEL_WIPES = [[barT(16), [PAL.ink, PAL.paper], 3, -.14], [barT(20), [PAL.ink, PAL.lime], 7, .12]];
  SCENES.reel = t => {
    let i = 0; while (i + 1 < REEL.length && t >= REEL[i + 1][0]) i++;
    REEL[i][1](t);
    if (CAM) camEnd();
    for (const [tw, cols, seed, ang] of REEL_WIPES) if (Math.abs(t - tw) < WIPE_TR) brushWipe((t - (tw - WIPE_TR)) / (2 * WIPE_TR), { cols, seed, ang });
  };
})();
