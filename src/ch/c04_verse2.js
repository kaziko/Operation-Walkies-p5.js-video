// c04_verse2.js: Verse 2 (bars 20-27). The enemy factions, one accent colour and one gag each: blue squirrels and
// the alley cat, violet crows, the oxblood hydrant, sage territory, the violet-patched pup. Jun Jun is unmoved by all
// of them. The chapter ends on the second stare of the film, bigger than the one in bar 14.
(() => {
  // a flat rotated card on the 2D layer, centred on (x, y), with a hard ink drop
  const card = (x, y, w, h, rot, col, o = {}) => {
    const k = o.k ?? 1; if (k <= 0) return;
    const c = g2d(o.screen), d = o.drop ?? 12; c.save(); c.translate(x, y); c.rotate(rot); c.scale(k * (o.kx ?? 1), k * (o.ky ?? 1)); c.globalAlpha = o.alpha ?? 1;
    if (d) { c.fillStyle = o.dropCol || PAL.ink; c.fillRect(-w / 2 + d, -h / 2 + d * 1.2, w, h); }
    c.fillStyle = col; c.fillRect(-w / 2, -h / 2, w, h);
    if (o.stroke) { c.strokeStyle = o.stroke; c.lineWidth = o.lw || 6; c.strokeRect(-w / 2, -h / 2, w, h); }
    c.restore(); c.globalAlpha = 1;
  };
  // (dx, dy) on a card that sits at (x, y), turned by rot and scaled by k → world point
  const onCard = (x, y, rot, k = 1) => (dx, dy) => [x + (dx * Math.cos(rot) - dy * Math.sin(rot)) * k, y + (dx * Math.sin(rot) + dy * Math.cos(rot)) * k];
  // the pup, scaled about his paws so he can inflate and deflate
  const pupAt = (x, y, u, kx, ky, o) => { push(); translate(x, y); scale(kx, ky); pup(0, 0, u, o); pop(); };

  // ---------- bar 20a · "Squirrel insurgents scatter" · blue ----------
  function scatter(t, lt, dur) {
    const tGo = 55.42, tSc = 55.96, GY = 1010, s = slam(t - tSc, .1), fly = easeOut(seg(t, tSc + .1, tSc + .55));
    const [sx, sy] = shakeXY(t, s.shake * 22 + hit(t, tGo, 10) * 8);
    bg(PAL.blue);
    camBegin(960 + sx, 540 + sy, lerp(1.16, 1, easeOut5(seg(t, tGo, tGo + .32))) + lt * .015, 0);
    sunburst(960, 780, { n: 22, col: PAL.ink, alpha: .13, rot: t * .1 });
    halftone(-200, 640, W + 400, 560, { cell: 24, col: PAL.ink, grad: [0, 700, 0, 1220], alpha: .5 });
    // the word lands, then its letters scatter too
    type('SCATTER', 960, 235, fitSize('SCATTER', 1740), { col: PAL.paper, k: s.k, alpha: s.alpha, shadow: { col: PAL.ink, dx: .02, dy: .024 }, seed: 4,
      per: (i, n) => ({ dx: (i - (n - 1) / 2) * .03 * fly, dy: (hash(i * 2.3) - .5) * .22 * fly, rot: (hash(i * 5.1) - .5) * .3 * fly }) });
    // seven insurgents leave in bouncing arcs: [delay, direction, speed, bounce period, height, u, in front of her]
    const SQ = [[0, -1, 1150, .62, 640, 34, 0], [.03, 1, 1250, .58, 700, 36, 0], [.08, -1, 760, .5, 480, 29, 1], [.1, 1, 820, .54, 540, 31, 1],
      [.16, -1, 1500, .7, 780, 40, 1], [.2, 1, 1560, .66, 740, 38, 0], [.26, 1, 520, .46, 390, 27, 1]];
    const flight = (q, a) => { const n = Math.floor(a / q[3]), ph = frac(a / q[3]); return [960 + q[1] * (70 + q[2] * a), GY - q[4] * Math.pow(.6, n) * Math.sin(ph * Math.PI), ph]; };
    { const c = g2d(); c.fillStyle = PAL.paper; c.beginPath();
      for (const q of SQ) { const a = t - tGo - q[0]; for (let b = Math.ceil(Math.max(0, a - .46) / .03) * .03; b < a - .05; b += .03) { const [x, y] = flight(q, b); c.moveTo(x + 6, y - q[5] * 3.4); c.arc(x, y - q[5] * 3.4, 6, 0, TAU); } }
      c.fill(); }
    const insurgents = front => SQ.forEach(q => { const a = t - tGo - q[0]; if (!!q[6] !== front || a <= 0) return; const [x, y, ph] = flight(q, a); squirrel(x, y, q[5], { flip: q[1] < 0, run: ph }); });
    insurgents(false);
    junjunSit(960, 1066, 26, { ...EXPR.deadpan, look: [lerp(-.25, .8, ease(seg(t, tGo + .1, tGo + .9))), -.35], lid: .56, brow: .15 });
    insurgents(true);
    camEnd();
    const la = t - (tGo + .26); if (la > 0) label([typed('INSURGENTS: 7', la, 70), typed('HELMETS: REGULATION', la - .2, 70)], 84, 912, { size: 28, col: PAL.lime, bg: PAL.ink, pad: 16, screen: true });
  }

  // ---------- bar 20b · "cat snipers in the alley" · blue slit, lime eyes ----------
  function sniper(t, lt, dur) {
    const tEyes = 56.98, tLock = 57.26, s = slam(lt - .02, .1), lock = t - tLock, CX = 1300, CY = 850, cu = 45;
    const [sx, sy] = shakeXY(t, s.shake * 14 + hit(t, tLock, 12) * 10), e = easeOut(seg(t, tEyes, tEyes + .1));
    bg(PAL.ink);
    camBegin(960 + lt * 26 + sx, 540 + sy, 1 + lt * .035, 0);
    // the alley: one slit of street light between two black walls
    poly2([[1010, -80], [1590, -80], [1760, 1160], [880, 1160]], PAL.blue);
    halftone(860, -80, 920, 700, { cell: 20, col: PAL.ink, grad: [0, 620, 0, -60], alpha: .9 });
    for (let i = 0; i < 16; i++) { const lf = i % 3 !== 2; rect2(lf ? 30 + hash(i * 3.7) * 760 : 1740 + hash(i * 3.7) * 150, 40 + i * 64 + hash(i) * 20, 90 + hash(i * 1.3) * 90, 9, mixCol(PAL.ink, PAL.blue, .32)); }
    type('SNIPER', 70, 200, 300, { col: PAL.lime, align: 'left', k: s.k, alpha: s.alpha, seed: 3, wear: .4 });
    // a bin, and on it the sniper
    paint(rectPts(CX - 210, CY + 30, 420, 400, 3), { wash: PAL.ink, ink: null }); paint(rectPts(CX - 240, CY - 6, 480, 44, 3), { wash: PAL.ink, ink: null });
    cat(CX, CY, cu, { eyes: e });
    junjunBust(430, 800, 54, { ...EXPR.sideEye, look: [lerp(.2, .95, easeOut5(seg(t, tEyes - .12, tEyes))), lerp(0, -.3, seg(t, tEyes - .12, tEyes))], lid: lerp(.4, .58, seg(lock, 0, .15)), brow: .5, turn: .22 });
    reticle(CX, CY - 7.9 * cu, 190, { k: lock / .18, col: PAL.lime, lw: 9 });
    camEnd();
    if (lock > .1) label(['CAT SNIPER', typed('LAST MOVED: TUESDAY', lock - .12, 90)], 1545, 96, { size: 27, col: PAL.ink, bg: PAL.lime, pad: 14, screen: true });
  }

  // ---------- bar 21 · "Crows call orders from the rooftop rally" · violet ----------
  function crows(t, lt, dur) {
    const RY = 180, HX = 960, HY = 925, u = 46, FALL = .3, LAND = [58.46, 59.26, 59.60], tAll = barT(21, 3);
    const CR = [[1030, 32, true, true], [530, 29, false, false], [1450, 29, true, false]];                 // x, u, flip, cap
    const SLAB = [[PAL.paper, 'CAW!', 600, -.03], [PAL.lime, 'CAW!!', 700, .035], [PAL.orange, 'CAW!!!', 810, -.02]];
    const [sx, sy] = shakeXY(t, LAND.reduce((p, tl) => p + hit(t, tl, 11) * 15, 0));
    const down = ease(seg(t, LAND[0] - FALL - .06, LAND[0] + .04)), landed = LAND.filter(tl => t >= tl).length;
    bg(PAL.violet);
    camBegin(960 + sx, lerp(320, 530, down) + sy, lerp(1.02, .92, down), 0);                               // the camera follows the first order down
    sunburst(960, RY, { n: 20, col: PAL.paper, alpha: .09, rot: .08 });
    halftone(-200, 600, W + 400, 700, { cell: 24, col: PAL.ink, grad: [0, 660, 0, 1340], alpha: .55 });
    // the roofline
    poly2([[-300, RY], [150, RY], [150, RY - 190], [300, RY - 190], [300, RY], [2300, RY], [2300, RY + 56], [-300, RY + 56]], PAL.ink);
    for (let i = 0; i < 26; i++) circ2(-260 + i * 100, RY + 56, 50, PAL.ink, { ey: .46 });
    CR.forEach(([x, cu, flip, cap], i) => {
      const a = t - (LAND[i] - FALL - .1), b = t - tAll, caw = Math.max(a > 0 && a < .55 ? Math.sqrt(Math.sin(a / .55 * Math.PI)) : 0, b > 0 ? Math.abs(Math.sin(b * 9 + i)) : 0);
      crow(x, RY - (b > 0 ? Math.abs(Math.sin(b * 9 + i)) * 16 : 0), cu, { flip, cap, caw, flap: caw > .05 ? caw * .25 : null });
    });
    // the manga caw, once per order
    [[250, 620, PAL.paper, -.1], [1670, 510, PAL.lime, .09], [300, 400, PAL.orange, -.06]].forEach(([x, y, col, r], i) => { const a = t - LAND[i]; if (a > 0) type('カー', x, y, 200, { font: 'jp', col, k: popIn(a, .12), rot: r + Math.sin(a * 28) * .04 * Math.exp(-a * 6), wear: .25, seed: i }); });
    // each order is a slab of type, shouted down. They pile up on her head. She does not follow them.
    SLAB.forEach(([col, txt, w, rot], i) => {
      const a = t - (LAND[i] - FALL); if (a <= 0) return;
      const [cx, cu, flip] = CR[i], p = clamp(a / FALL), la = t - LAND[i], squash = la > 0 ? 1 - .32 * Math.exp(-la * 15) * Math.cos(la * 36) : 1;
      const x = lerp(cx + (flip ? -1 : 1) * 5.6 * cu, HX + [10, -18, 14][i], p), y = lerp(RY - 5.2 * cu, 640 - i * 134, easeIn(p)) + (1 - squash) * 60, k = lerp(.2, 1, p);
      card(x, y, w, 124, rot, col, { k, ky: squash, kx: 2 - squash, stroke: PAL.ink, lw: 9, drop: 12 });
      type(txt, x, y, 138 * k, { col: PAL.ink, rot, sy: squash, sx: 2 - squash, track: .12, wear: .25, seed: i + 2 });
    });
    junjunBust(HX, HY, u, { ...EXPR.deadpan, look: [0, kf(t, [[58.0, -.15], [58.2, -.95], [59.92, -.95], [60.04, 0]])], lid: .5 + landed * .04, brow: .2 + landed * .06, ear: landed * .05 });
    camEnd();
    const la = t - (LAND[2] + .1); if (la > 0) label([typed('ORDERS RECEIVED: 3', la, 70), typed('ORDERS FOLLOWED: 0', la - .32, 70)], 84, 900, { size: 28, col: PAL.lime, bg: PAL.ink, pad: 16, screen: true });
  }

  // ---------- bar 22 · "Hydrant checkpoints — gotta sniff and claim" · oxblood ----------
  function checkpoint(t, lt, dur) {
    const tDown = 60.86, tSniff = 61.76, tClaim = 62.34, tUp = 62.66, GY = 950, HX = 600, u = 33, JX = 1330;
    const s = slam(t - tDown, .1), out = easeOut5(seg(t, tDown - .04, tDown + .22)), [sx, sy] = shakeXY(t, s.shake * 18 + hit(t, tClaim, 10) * 18);
    const sn = Math.max(hit(t, tSniff, 9), hit(t, tSniff + .24, 9)), dip = ease(seg(t, 61.22, 61.64)) - ease(seg(t, tClaim + .22, tClaim + .5)), ca = t - tClaim, ba = t - tDown;
    bg(PAL.paper);
    camBegin(lerp(HX + 30, 960, out) + sx, lerp(600, 540, out) + sy, lerp(1.5, 1, out) + seg(t, tDown, barT(23)) * .05, 0);   // the monument, then the whole checkpoint
    sunburst(HX, 600, { n: 18, col: PAL.oxblood, alpha: .17, rot: -.1 + t * .03 });
    halftone(-300, 700, W + 600, 500, { cell: 22, col: PAL.orange, grad: [0, 770, 0, 1240], alpha: .75 });
    type('CHECKPOINT', 70, 150, 290, { col: PAL.ink, align: 'left', k: s.k, alpha: s.alpha, seed: 9 });
    dryStroke(-300, GY + 58, 2300, GY + 46, 140, PAL.ink, { seed: 17 });
    rect2(1774, GY - 270, 56, 330, PAL.ink);                                                               // barrier post
    rect2(HX - 300, GY - 86, 600, 150, PAL.ink); hazard(HX - 300, GY - 86, 600, 46, 0, PAL.paper, PAL.oxblood);
    hydrant(HX, GY - 86, 56, { shadow: false });
    junjunSide(JX, GY, u, { ...EXPR.inspect, flip: true, look: [.4, .9], lid: .42 + sn * .1, head: { dx: dip * 1.6, dy: dip * 3.2 - sn * .22, rot: dip * .42 } });
    // her nose (for the sniff marks)
    const nx = JX - (7.5 + dip * 1.6 + 5.15 * Math.cos(dip * .42)) * u, ny = GY + (-17.4 + dip * 3.2 + 5.15 * Math.sin(dip * .42)) * u;
    if (sn > .12) for (const d of [-1, 0, 1]) inkLine([[nx - 22, ny + d * 22], [nx - 60 - sn * 40, ny + d * 44]], 1.2, PAL.ink, 'ink', 0);
    [[tSniff, 905, 336, -.08]].forEach(([tw, x, y, r]) => { const a = t - tw; if (a > 0) type('SNIFF', x, y, 112, { font: 'hand', col: PAL.oxblood, k: popIn(a, .1), rot: r + Math.sin(a * 30) * .03 * Math.exp(-a * 6), wear: .2 }); });
    // the barrier comes down in front of her, and goes up again once the hydrant is hers
    { const ang = (ba < 0 ? lerp(1.15, 0, easeIn(seg(t, tDown - .18, tDown))) : .1 * Math.exp(-ba * 9) * Math.abs(Math.sin(ba * 24))) + backOut(seg(t, tUp, tUp + .3), 1.4) * 1.15;
      const c = g2d(), L = 930, bh = 52; c.save(); c.translate(1802, GY - 236); c.rotate(ang);
      c.fillStyle = PAL.ink; c.fillRect(-L - 8, -bh / 2 - 8, L + 16, bh + 16); c.fillRect(-10, -52, 150, 104);
      c.fillStyle = PAL.paper; c.fillRect(-L, -bh / 2, L, bh); c.fillStyle = PAL.oxblood; c.beginPath();
      for (let x = -L; x < -30; x += 116) { c.moveTo(x, bh / 2); c.lineTo(x + 46, -bh / 2); c.lineTo(x + 104, -bh / 2); c.lineTo(x + 58, bh / 2); c.closePath(); }
      c.fill(); c.restore(); }
    if (ca > 0) { const k = slam(ca, .09).k; card(HX - 24, 548, 500, 168, -.09, PAL.lime, { k, stroke: PAL.ink, lw: 8 }); stamp('CLAIMED', HX - 24, 548, { k, size: 100, rot: -.09, col: PAL.ink, seed: 4 }); }
    camEnd();
    hud(['CHECKPOINT 03', typed('INSPECTION: NASAL', lt - .7, 40)], { corner: 'bl', col: PAL.paper, alpha: seg(lt, .45, .6), size: 24 });
  }

  // ---------- bar 23 · "That's territory marked — remember the name" · sage map, then the signature ----------
  function territory(t, lt, dur) {
    const tMark = 63.54, tRem = 64.16, tThe = 64.64, tName = 64.98, tSeal = barT(23, 3) + .1;
    if (t < tRem) {
      const a = t - tMark, s = slam(lt + .03, .1), [sx, sy] = shakeXY(t, hit(t, tMark, 9) * 26), FX = 1220, FY = 900;
      bg(PAL.ink);
      camBegin(960 + sx, 540 + sy, 1.04 + lt * .03, 0);
      // the map: her colour floods out from the flag, block by block
      { const c = g2d(); c.save(); c.translate(960, 540); c.rotate(-.12); c.translate(-960, -540); c.lineWidth = 5;
        for (let i = -1; i < 9; i++) for (let j = -1; j < 7; j++) { const x = i * 250 - 60, y = j * 215 - 110, id = i * 7 + j * 3, mine = a > 0 && Math.hypot(x + 102 - FX, y + 85 - FY) < a * 2700;
          if (mine) { c.fillStyle = PAL.orange; c.fillRect(x - 24, y - 24, 253, 218); } else if (hash(id * 1.9) > .7) { c.fillStyle = PAL.sage; c.fillRect(x, y, 205, 170); }
          c.strokeStyle = mine ? mixCol(PAL.orange, PAL.ink, .22) : mixCol(PAL.ink, PAL.sage, .4); c.strokeRect(x, y, 205, 170); }
        c.restore(); }
      type('TERRITORY', 960, 200, fitSize('TERRITORY', 1740), { col: PAL.paper, k: s.k, alpha: s.alpha, shadow: { col: PAL.ink, dx: .02, dy: .024 }, seed: 12 });
      if (t > tMark - .18) {
        const drop = -1200 * (1 - easeIn(seg(t, tMark - .18, tMark))), wv = Math.sin(t * 10) * 16;
        if (a > 0) burst(FX, FY, 60, 240 * easeOut5(a / .12), { n: 12, seed: 4, col: PAL.paper, stroke: PAL.ink, lw: 7 });
        poly2([[FX - 12, FY + drop], [FX + 12, FY + drop], [FX - 30, FY - 540 + drop], [FX - 54, FY - 540 + drop]], PAL.paper, { stroke: PAL.ink, lw: 8 });
        poly2([[FX - 50, FY - 536 + drop], [FX + 400, FY - 420 + drop + wv], [FX - 32, FY - 270 + drop]], PAL.lime, { stroke: PAL.ink, lw: 10, join: 'round' });
        pawPrint(FX + 90, FY - 408 + drop + wv * .3, 124, .2, PAL.ink);
      }
      stamp('MARKED', 560, 690, { k: popIn(a - .08, .12), size: 150, rot: -.08, col: PAL.lime, seed: 6 });
      camEnd();
    } else {
      const a = t - tRem, n = t - tName, sa = t - tSeal, s = slam(a, .1), [sx, sy] = shakeXY(t, s.shake * 18 + hit(t, tName, 9) * 12 + hit(t, tSeal, 12) * 16), sk = slam(sa, .08);
      bg(PAL.orange);
      camBegin(960 + sx, 540 + sy, 1 + a * .022, 0);
      sunburst(1490, 450, { n: 18, col: PAL.paper, alpha: .13, rot: t * .05 });
      halftone(0, 0, 1100, 700, { cell: 22, col: PAL.ink, grad: [700, 0, -200, 0], alpha: .3 });
      type('REMEMBER', 70, 190, fitSize('REMEMBER', 1030), { col: PAL.paper, align: 'left', k: s.k, alpha: s.alpha, shadow: { col: PAL.ink, dx: .022, dy: .026 }, seed: 5 });
      if (t > tThe) type('THE NAME', 76, 480, 178, { col: PAL.ink, align: 'left', k: popIn(t - tThe, .1), rot: -.012, seed: 8 });
      junjunBust(1490, 445, 42, { ...EXPR.royal, look: [0, .05], lid: Math.max(.45, blink(t, 5)), brow: .3, crown: seg(sa, 0, .2) });
      // signed, huge, one stroke of the brush per character
      dryStroke(30, 862, 1900, 838, 290, PAL.paper, { seed: 31, p: easeOut(seg(t, tName - .14, tName + .1)) });
      if (n > 0) type('ジュンジュン', 890, 850, fitSize('ジュンジュン', 1500, { font: 'jp' }), { font: 'jp', col: PAL.ink, rot: -.014, wear: .25, seed: 3,
        per: i => { const q = n - i * .05; return { alpha: q > 0 ? 1 : 0, s: lerp(1.5, 1, easeOut(q / .09)), rot: (1 - easeOut(q / .09)) * -.2 }; } });
      if (sa > 0) { circ2(1765, 880, 98 * sk.k, PAL.oxblood, { stroke: PAL.ink, lw: 8 }); type('姫', 1765, 880, 118 * sk.k, { font: 'jp', col: PAL.paper, rot: .08, wear: .3, seed: 2 }); }
      camEnd();
    }
  }

  // ---------- bar 24 · "Pup on the left tryna puff his chest" · violet ----------
  function pupPuff(t, lt, dur) {
    const tLand = 66.5, tPuff = 67.04, tMax = 67.62, GY = 1000, PX = 450, pu = 40;
    const pumps = [[tPuff, .24], [tPuff + .2, .2], [tPuff + .39, .2], [tMax, .36]];
    const inf = pumps.reduce((p, [tp, v]) => p + v * backOut(seg(t, tp, tp + .14), 2.6), 0), ant = Math.sin(seg(t, tPuff - .2, tPuff) * Math.PI);
    const [sx, sy] = shakeXY(t, hit(t, tMax, 9) * 16 + pumps.reduce((p, [tp]) => p + hit(t, tp, 14) * 5, 0));
    const hp = seg(t, barT(24) - .04, tLand), px = lerp(-240, PX, hp), py = GY - (hp < 1 ? Math.abs(Math.sin(hp * TAU)) * 130 : 0), la = t - tLand, ka = t - tPuff;
    bg(PAL.paper);
    camBegin(lerp(1010, 950, ease(seg(lt, 0, dur))) + sx, 540 + sy, 1 + lt * .02, 0);
    poly2([[1010, -200], [2300, -200], [2300, 1300], [850, 1300]], PAL.orange);                              // his side of the frame, and hers
    halftone(700, -100, 330, 1300, { cell: 24, col: PAL.orange, grad: [720, 0, 1010, 0], alpha: 1 });
    sunburst(1400, 400, { n: 18, col: PAL.paper, alpha: .12, rot: t * .04 });
    if (ka > 0) type('PUFF', 80, 195, 330, { col: PAL.violet, align: 'left', k: (.4 + .6 * clamp(inf)) * clamp(ka / .05), rot: -.03, seed: 7 });
    dryStroke(-300, GY + 52, 2300, GY + 40, 130, PAL.ink, { seed: 23 });
    junjunSit(1400, GY, 33, { ...EXPR.deadpan, look: [0, .05], lid: Math.max(.56, Math.sin(seg(t, 67.68, 67.86) * Math.PI)), brow: .1 });   // one slow blink at his biggest
    pupAt(px, py, pu, 1 + inf * .75 + ant * .08, 1 + inf * .7 - ant * .13, { puff: clamp(inf * 1.2), face: 'cocky' });
    vibLines(PX + 110, GY - 300, 380, 330, seg(t, tMax, tMax + .1), { n: 9, sw: 1.3, arc: [Math.PI * 1.05, Math.PI * 1.95], seed: 4 });
    // the arrow label, as ordered; his head knocks it away
    if (la > 0 && ka < .5) {
      const k = popIn(la, .12), fx = ka > 0 ? ka : 0, lx = PX - 90 - fx * 700, ly = 400 - fx * 1500 + fx * fx * 1400;
      if (fx === 0) poly2([[lx + 110, ly + 74], [lx + 200, ly + 74], [lx + 155, ly + 150]], PAL.violet);
      label('PUP (LEFT)', lx, ly, { size: 46 * k, col: PAL.paper, bg: PAL.violet, pad: 16, rot: -fx * 5 });
    }
    camEnd();
    if (ka > 0) hud(['CHEST: ' + [140, 180, 210, 240][pumps.filter(q => t >= q[0]).length - 1] + '%', t > tMax + .08 ? 'THREAT: 0%' : ''], { corner: 'tr', col: PAL.ink, size: 28 });
  }

  // ---------- bar 24, last beat · "Better tuck that tail" · the slow side-eye ----------
  function sideEye(t, lt, dur) {
    const tTuck = 68.40, tTail = 69.0, s = slam(t - tTuck, .1), [sx, sy] = shakeXY(t, s.shake * 16), sl = ease(seg(t, 68.0, 68.46));
    bg(PAL.orange);
    camBegin(lerp(975, 945, seg(lt, 0, dur)) + sx, 540 + sy, 1 + lt * .04, 0);
    halftone(-100, 560, W + 200, 620, { cell: 24, col: PAL.ink, grad: [0, 640, 0, 1250], alpha: .42 });
    type('BETTER', 84, 150, 118, { font: 'hand', col: PAL.ink, align: 'left', k: popIn(lt + .02, .1), rot: -.03, wear: .1 });
    type('TUCK', 70, 425, 330, { col: PAL.paper, align: 'left', k: s.k, alpha: s.alpha, rot: -.02, shadow: { col: PAL.ink, dx: .022, dy: .026 }, seed: 9 });
    if (t > tTail) type('THAT TAIL,', 80, 730, 104, { font: 'hand', col: PAL.lime, stroke: PAL.ink, strokeW: .16, align: 'left', k: popIn(t - tTail, .1), rot: -.04, wear: 0 });
    junjunBust(1280, 560, 84, { ...EXPR.sideEye, look: [-.95 * sl, .12 * sl], lid: lerp(.34, .56, sl), brow: lerp(.25, .6, sl), turn: -.3 * ease(seg(t, 68.3, 68.66)), tilt: -.03 * ease(seg(t, 68.5, 68.9)) });
    camEnd();
  }

  // ---------- bar 25 · "boy — respect the best" · he deflates ----------
  function respect(t, lt, dur) {
    const tRes = 69.62, tBest = 70.34, GY = 1000, PX = 450, pu = 40, s = slam(t - tRes, .1), best = t - tBest;
    const da = t - (tRes + .08), d = easeOut(seg(da, 0, .42)), wb = da > 0 ? Math.sin(da * 46) * .1 * (1 - d) : 0, tk = seg(da, .22, .42);
    const shiver = tk >= 1 ? (hash(Math.floor(t * 24)) - .5) * 8 : 0, [sx, sy] = shakeXY(t, s.shake * 22 + hit(t, tBest, 12) * 8);
    bg(PAL.violet);
    camBegin(lerp(950, 990, ease(seg(lt, 0, dur))) + sx, 540 + sy, 1.03 + lt * .015, 0);
    sunburst(1400, 420, { n: 18, col: PAL.ink, alpha: .17, rot: t * .04 });
    halftone(-200, 640, W + 400, 600, { cell: 24, col: PAL.ink, grad: [0, 700, 0, 1280], alpha: .5 });
    type('RESPECT', 70, 205, fitSize('RESPECT', 1010), { col: PAL.paper, align: 'left', k: s.k, alpha: s.alpha, shadow: { col: PAL.ink, dx: .022, dy: .026 }, seed: 6 });
    dryStroke(-300, GY + 52, 2300, GY + 40, 130, PAL.ink, { seed: 23 });
    junjunSit(1400, GY, 33, { ...EXPR.sideEye, look: [lerp(-.95, 0, easeOut5(best / .1)), .1], lid: lerp(.54, .68, seg(best, 0, .2)), brow: lerp(.5, .15, seg(best, 0, .2)), turn: -.2 * (1 - seg(best, 0, .15)), crown: seg(best, .06, .26) });
    // the air leaves him
    if (da > 0 && da < .6) { const q = seg(da, 0, .5); for (let i = 0; i < 3; i++) inkLine([[PX - 170, GY - 190 + i * 34], [PX - 260 - q * 160, GY - 230 + i * 50 + Math.sin(da * 30 + i) * 14], [PX - 330 - q * 260, GY - 210 + i * 62]], 1.3, PAL.paper, 'ink', .6);
      type('pffft', PX - 250 - q * 80, GY - 330, 92, { font: 'hand', col: PAL.paper, rot: -.14, alpha: 1 - seg(da, .42, .6), wear: 0 }); }
    pupAt(PX + shiver, GY, pu, lerp(1.75, .88, d) + wb, lerp(1.7, .82, d) - wb * .7, { puff: clamp(1 - d), tuck: tk, face: 'scared' });
    vibLines(PX + 20, GY - 170, 230, 190, tk, { n: 8, sw: 1.1, col: PAL.paper, seed: 6 });
    camEnd();
    stamp('THE BEST', 925, 590, { k: popIn(best, .12), size: 112, rot: .07, col: PAL.lime, seed: 9, screen: true });
  }

  // ---------- bar 26 · "My intel's sharp, I'm sniffin' truth from lies" · the nose, with a readout ----------
  function intel(t, lt, dur) {
    const tSharp = 71.52, tSniff = 72.14, tTruth = 72.44, tLies = 72.94, u = 170, NX = 620, NY = 590, z = 1 + seg(lt, 0, dur) * .1;
    const sn = Math.max(hit(t, tSniff, 8), hit(t, tSniff + .2, 8)), [sx, sy] = shakeXY(t, hit(t, tTruth, 12) * 9 + hit(t, tLies, 12) * 9 + slam(t - tSharp, .1).shake * 12);
    bg(PAL.orange);
    camBegin(NX + 340 / z + sx, NY - 50 / z + sy, z, 0);                                                    // the nose stays put on screen while we push in
    junjunBust(NX, NY - 1.7 * u, u, { ...EXPR.inspect, look: [0, 1], lid: .44, brow: .4, hy: -sn * .05 });
    for (const sd of [1, -1]) if (sn > .12) for (let i = 0; i < 2; i++) inkLine([[NX + sd * (250 + i * 40), NY + 40 - i * 90], [NX + sd * (330 + sn * 60 + i * 50), NY - 30 - i * 110], [NX + sd * (420 + sn * 110 + i * 50), NY + 10 - i * 120]], 2, PAL.ink, 'ink', .7);
    halftone(-700, 640, 2000, 700, { cell: 26, col: PAL.orange, grad: [0, 760, 0, 1500], alpha: .8 });
    // scanner: a blue frame locks on, a line sweeps the nose
    reticle(NX, NY + 30, 300, { k: (t - tSharp) / .2, col: PAL.blue, lw: 12 });
    { const p = seg(t, tSharp + .1, tSniff); if (p > 0 && p < 1) rect2(NX - 330, NY - 270 + p * 600, 660, 10, PAL.blue); }
    [[tSniff, 262, 800, -.1], [tSniff + .2, 1035, 445, .07]].forEach(([tw, x, y, r]) => { const a = t - tw; if (a > 0) type('SNIFF', x, y, 120, { font: 'hand', col: PAL.ink, k: popIn(a, .1), rot: r + Math.sin(a * 30) * .03 * Math.exp(-a * 6), wear: .2 }); });
    camEnd();
    // the readout
    const x0 = 1270 + (1 - easeOut5(lt / .22)) * 700, c = g2d(true); c.fillStyle = PAL.ink; c.fillRect(x0, 0, 700, H); c.fillStyle = PAL.blue; c.fillRect(x0, 0, 12, H);
    label('NOSE INTEL // LIVE', x0 + 56, 58, { size: 24, col: PAL.blue, screen: true });
    const ss = slam(t - tSharp, .1); type('SHARP', x0 + 52, 235, 205, { col: PAL.paper, align: 'left', k: ss.k, alpha: ss.alpha, screen: true, seed: 5 });
    [['TRUTH', tTruth, 520, PAL.lime, true], ['LIES', tLies, 720, PAL.paper, false]].forEach(([w, tw, y, col, ok]) => {
      const a = t - tw; if (a <= 0) return; const k = popIn(a, .1), g = g2d(true);
      g.strokeStyle = col; g.lineWidth = 11; g.strokeRect(x0 + 58, y - 56 * k, 112 * k, 112 * k);
      if (ok) { const q = easeOut(seg(a, .06, .2)); g.strokeStyle = PAL.lime; g.lineWidth = 22; g.lineCap = 'square'; g.lineJoin = 'miter'; g.beginPath(); g.moveTo(x0 + 76, y - 4); g.lineTo(x0 + 110, y + 30); if (q > 0) g.lineTo(x0 + 110 + 90 * q, y + 30 - 112 * q); g.stroke(); }
      type(w, x0 + 222, y, 158, { col, align: 'left', k, screen: true, seed: ok ? 2 : 7 });
    });
    const la = t - (tLies + .04); if (la > 0) label([typed('SOURCE: LAMP POST 4', la, 70), typed('HE WAS HERE AT 05:40', la - .28, 70)], x0 + 58, 870, { size: 27, col: PAL.ink, bg: PAL.lime, pad: 14, screen: true });
  }

  // ---------- bar 27 · "Read your whole history through your fur and eyes" · the file, then THE SECOND STARE ----------
  function dossierStare(t, lt, dur) {
    const tC = barT(27, 1.5), tFur = 75.10, tEyes = 75.60, tHit = 76.06;
    if (t < tC) {
      // she reads his file, page by page
      const PG = [[barT(27) - .1, 1300, 610, -.05], [74.22, 1345, 585, .045], [74.55, 1290, 615, -.022]], sh = slam(t - 74.04, .1);
      const [sx, sy] = shakeXY(t, PG.reduce((p, q) => p + hit(t, q[0] + .1, 14) * 9, 0) + sh.shake * 10), cur = PG.filter(q => t >= q[0] + .08).length - 1;
      bg(PAL.violet);
      camBegin(960 + sx, 540 + sy, 1 + lt * .04, 0);
      streaks({ col: PAL.ink, n: 22, drift: -lt * 5200, th: [14, 60], len: [300, 800], area: [-200, 30, W + 400, 1020], alpha: .3, seed: 5 });
      type('HISTORY', 70, 118, 200, { col: PAL.paper, align: 'left', k: sh.k, alpha: sh.alpha, shadow: { col: PAL.ink, dx: .025, dy: .03 }, seed: 4 });
      junjunBust(395, 665, 58, { ...EXPR.inspect, look: [.9, lerp(-.5, .7, seg(t, PG[Math.max(0, cur)][0] + .08, PG[Math.max(0, cur)][0] + .36))], lid: .46, brow: .45, turn: .22 });
      PG.forEach(([tp, x0, y0, rot], i) => {
        const a = t - tp; if (a <= 0) return;
        const p = easeOut5(a / .1), x = x0 + (1 - p) * 1100, k = lerp(1.25, 1, p), P = onCard(x, y0, rot, k);
        card(x, y0, 700, 820, rot, PAL.paper, { k, drop: 16 });
        card(...P(0, -366), 700, 88, rot, PAL.ink, { k, drop: 0 });
        label(['FILE 12 // PUP (LEFT)', 'ENTRY 041 // DIET', 'ENTRY 042 // FEARS'][i], ...P(-322, -384), { size: 30 * k, col: PAL.lime, rot });
        if (i === 0) {
          card(...P(0, -70), 520, 440, rot, PAL.violet, { k, drop: 0, stroke: PAL.ink, lw: 7 });
          for (let j = 0; j < 4; j++) card(...P(0, -230 + j * 100), 520, 5, rot, PAL.ink, { k, drop: 0, alpha: .5 });
          if (p > .98) pup(x - 50, y0 + 140, 38, { face: 'cocky', puff: .5, shadow: false });
          label(['ALIAS: "GOOD BOY"', 'RANK: NONE'], ...P(-260, 210), { size: 34 * k, col: PAL.ink, rot });
        } else {
          const L = i === 1 ? [['ATE A', -178, 560], ['SOCK', 62, 600]] : [['AFRAID', -205, 600], ['OF THE', -45, 330], ['VACUUM', 110, 600]];
          L.forEach(([w, dy, wd], j) => type(w, ...P(-300, dy), fitSize(w, wd) * k, { col: PAL.ink, align: 'left', rot, wear: .3, seed: i * 3 + j }));
          if (i === 1) type('(2023)', ...P(-296, 268), 100 * k, { font: 'hand', col: PAL.oxblood, align: 'left', rot: rot - .05, wear: .1 });
          stamp(i === 1 ? 'CONFIRMED' : 'ONGOING', ...P(i === 1 ? 160 : 110, i === 1 ? 318 : 300), { k: popIn(a - .14, .1) * k, size: i === 1 ? 70 : 88, rot: rot - .1, col: PAL.oxblood, seed: i + 3 });
        }
      });
      camEnd();
    } else if (t < tHit) {
      // the stare: three punches in, on the cut, on "fur" and on "eyes"
      const u = 112, HX = 960, HY = 640, EY = HY - 1.5 * u, build = seg(t, tC, tHit), lk = easeOut5((t - tFur) / .08);
      const z = .8 + .04 * build + .26 * easeOut5((t - tFur) / .1) + .36 * easeOut5((t - tEyes) / .1) + .1 * seg(t, tEyes, tHit);
      const [sx, sy] = shakeXY(t, hit(t, tFur, 12) * 12 + hit(t, tEyes, 12) * 16 + build * build * 5);
      bg(PAL.orange);
      camBegin(HX + sx, lerp(HY - .3 * u, EY, ease(build)) + sy, z, 0);
      stareLines(HX, EY, seg(t, tC, tC + .12) * lerp(.5, 1, build), { dim: .9, col: PAL.orange, n: 110, r0: 520 });
      for (let i = 0; i < 3; i++) { const a = t - (tC + .1 + i * .11); if (a > 0) type('ジーッ'[i], 150 + (i % 2) * 44, 330 + i * 185, 170, { font: 'jp', col: PAL.orange, k: popIn(a, .12), rot: -.14 + i * .06, wear: .2, screen: true });
        const b = t - (tC + .16 + i * .11); if (b > 0) type('ジーッ'[i], W - 190 + (i % 2) * 40, 350 + i * 180, 150, { font: 'jp', col: PAL.orange, k: popIn(b, .12), rot: .1 - i * .05, wear: .2, screen: true }); }
      junjunBust(HX, HY, u, { ...EXPR.stare, look: [lerp(.75, 0, lk), lerp(.4, 0, lk)], lid: lerp(.3, .1, lk), brow: lerp(.45, 1, build), iris: lerp(.9, .5, easeOut(seg(t, tEyes, tEyes + .16))), ear: build * .14, rage: seg(t, tEyes, tHit) * .5 });
      vibLines(HX, EY, 560, 420, seg(t, tEyes, tHit), { n: 18, sw: 1.5, len: 1.5, seed: 2 });
      camEnd();
      letterbox(easeOut(seg(t, tC, tC + .2)), PAL.ink, 132);
      type('THROUGH YOUR FUR', 70 - (1 - easeOut5((t - tC - .03) / .2)) * 1100, 68, 88, { col: PAL.paper, align: 'left', screen: true, wear: .25 });
      const ea = t - tEyes; if (ea > 0) type('AND EYES.', W - 70, H - 64, 88, { col: PAL.lime, align: 'right', screen: true, k: slam(ea, .1).k, wear: .25 });
    } else {
      // the hit: black, white and two orange eyes. One negative flicker on the last eighth, then hold it to the cut.
      const u = 112, HX = 960, HY = 640, EY = HY - 1.32 * u, a = t - tHit, t8 = barT(27, 3.5), neg = t >= t8 && t < t8 + .085;
      const [sx, sy] = shakeXY(t, 44 * Math.exp(-a * 5) + hit(t, t8, 9) * 22 + 3, 24), A = neg ? PAL.white : PAL.ink, B = neg ? PAL.ink : PAL.white;
      camBegin(HX + sx, EY + sy, lerp(2.3, 1.95, easeOut5(a / .14)) + a * .1, (hash(Math.floor(t * 24)) - .5) * .03 * Math.exp(-a * 5));
      impactFrame(HX, EY, a, { accent: PAL.orange, dark: A, light: B, seed: 5, size: 1.5 });
      junjunBust(HX, HY, u, { ...EXPR.stare, lid: .06, brow: 1, iris: .46, rage: .5, ear: .2, look: [0, 0],
        coat: { fur: B, white: B, dark: A, grey: A, ink: A, pink: B, mouth: A, harness: A, trim: B, eye: neg ? PAL.ink : PAL.white, iris: PAL.orange, gold: B } });
      speedLines(HX, EY, { n: 84, r0: 400, r1: 1500, col: A, w: [.004, .026], seed: 9, boil: true, boilRate: 12, jitter: .22, ey: .8 });
      vibLines(HX, EY + 30, 400, 250, seg(a, .1, .46), { n: 14, sw: 1.2, len: 1.3, col: A, seed: 8 });
      camEnd();
      flash(1 - a / .09, PAL.white);
      letterbox(1, PAL.ink, lerp(132, 196, easeOut5(a / .07)));
      type('THROUGH YOUR FUR', 70, 68, 88, { col: PAL.paper, align: 'left', screen: true, wear: .25 });
      type('AND EYES.', W - 70, H - 64, 88, { col: PAL.lime, align: 'right', screen: true, wear: .25 });
      type('ジーッ', 76, H - 66, 100, { font: 'jp', col: PAL.orange, align: 'left', screen: true, k: slam(a - .03, .09).k, wear: .15 });
      label(typed('HISTORY: READ.', a - .1, 110), W - 70, 50, { size: 28, col: PAL.ink, bg: PAL.lime, align: 'right', screen: true, alpha: a > .12 ? 1 : 0, pad: 12 });
    }
  }

  chapter('verse2', barT(20), barT(28), [
    [barT(20), scatter], [barT(20, 2), sniper], [barT(21), crows], [barT(22), checkpoint], [barT(23), territory],
    [barT(24), pupPuff], [barT(24, 3), sideEye], [barT(25, 1), respect], [barT(26), intel], [barT(27), dossierStare]
  ]);
})();
