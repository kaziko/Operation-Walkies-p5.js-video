// c02_verse1.js: Verse 1 (bars 8-15). The patrol begins: orange, paper, ink.
(() => {
  const GY = 905;                                   // ground line for full-body shots

  // ---------- bar 8 · "Paws… hit the concrete with precision" · THE ENTRANCE ----------
  function entrance(t, lt, dur) {
    const tPaws = 23.80, tIn = 24.2, tKick = 24.6, tTurn = barT(9) - .42;
    const k = seg(t, tKick, barT(9)), zoom = lerp(1, 1.2, easeOut(k)), s = slam(t - tPaws, .14);
    const [sx, sy] = shakeXY(t, s.shake * 22 + hit(t, tKick, 9) * 16);
    const u = 33, ph = Math.max(0, bp(t) - bp(tIn)), dogX = -400 + ph * 7.74 * u * 1.12;
    bg(PAL.orange);
    camBegin(lerp(960, dogX + 360, ease(k)) + sx, lerp(540, 592, ease(k)) + sy, zoom, lerp(0, -.018, k));
    sunburst(1250, 520, { n: 18, col: PAL.paper, alpha: .1, rot: -.2 + t * .04 });
    halftone(-300, 620, W + 600, 520, { cell: 24, col: PAL.ink, grad: [0, 700, 0, 1160], alpha: .42 });
    type('PAWS', 1010, 440, 780, { col: PAL.paper, k: s.k, alpha: s.alpha, rot: -.03, shadow: { col: PAL.ink, dx: .02, dy: .024 }, seed: 2 });
    type('散歩', 1735, 815, 120, { font: 'jp', col: PAL.ink, rot: .05, k: popIn(t - tPaws - .12, .12), wear: .2 });
    dryStroke(-500, GY + 62, 2500, GY + 46, 150, PAL.ink, { seed: 6, p: easeOut(seg(lt, .05, .34)) });
    // rhythmic words land on the concrete
    [['HIT', 24.6, 420], ['THE', 24.8, 640], ['CONCRETE', 24.98, 815]].forEach(([w, tw, x]) => {
      const a = t - tw; if (a > 0) type(w, x, GY + 60, 104, { col: PAL.paper, align: 'left', k: slam(a, .09).k, rot: -.008, wear: .3 });
    });
    // footfall ticks under the near paws, one per landing
    for (const [off, fx] of [[0, -3.3], [.25, 6.9]]) {
      const n = Math.floor(ph + off), tl = beatT(bp(tIn) + n - off), a = t - tl;
      if (n >= 1 && a >= 0 && a < .2) { const x = -400 + (n - off) * 7.74 * u * 1.12 + fx * u; for (let i = 0; i < 3; i++) inkLine([[x + (i - 1) * 26, GY - 8], [x + (i - 1) * 62, GY - 34 - (i === 1 ? 20 : 0)]], 1.3, PAL.paper, 'ink', 0); }
    }
    const turned = t >= tTurn;
    junjunSide(dogX, GY, u, { ...(turned ? EXPR.judge : EXPR.neutral), walk: ph, face: turned ? 'front' : 'side', look: turned ? [0, .1] : [.4, 0],
      head: { rot: turned ? .04 * elasticOut((t - tTurn) / .3) : 0 }, leash: [dogX - 1500, 250], slack: .03, shadowOp: 0 });
    // precision: a measured stride
    if (t > 25.32) {
      const a = t - 25.32, x0 = dogX - 3.3 * u, x1 = dogX + 6.9 * u, c = g2d();
      c.strokeStyle = PAL.lime; c.lineWidth = 5; c.beginPath(); const q = easeOut(a / .16);
      c.moveTo(x0, GY - 30); c.lineTo(lerp(x0, x1, q), GY - 30); c.moveTo(x0, GY - 46); c.lineTo(x0, GY - 14); if (q >= 1) { c.moveTo(x1, GY - 46); c.lineTo(x1, GY - 14); } c.stroke();
      label(typed('WITH PRECISION: 41.00 CM ±0.00', a - .1, 44), x1 + 40, GY - 46, { size: 26, col: PAL.ink, bg: PAL.lime, pad: 10 });
    }
    camEnd();
    hud(['OP. WALKIES // 06:00', 'SECTOR 01: PAVEMENT'], { corner: 'tl', col: PAL.ink, alpha: seg(lt, .1, .25) });
  }

  // ---------- bar 9 · "Every sniff a mission, every shadow — suspicion" ----------
  function sniff(t, lt, dur) {
    const tCut = 27.05, tSus = 27.84;
    if (t < tCut) {
      // nose close-up: two sniffs
      const sn = Math.max(hit(t, 26.28, 9), hit(t, 26.62, 9)), z = 1 + seg(lt, 0, dur) * .08;
      bg(PAL.paper);
      camBegin(960, 560, z, 0);
      halftone(0, 0, W, H, { cell: 26, col: PAL.orange, radial: [960, 700, 300, 1100], alpha: .9 });
      junjunBust(960, 330, 76, { ...EXPR.inspect, look: [0, 1], lid: .46, hy: -sn * .1, tilt: sn * .012 });
      for (const sd of [1, -1]) if (sn > .15) inkLine([[960 + sd * 150, 330 + 1.2 * 76], [960 + sd * (200 + sn * 30), 330 + .9 * 76], [960 + sd * (260 + sn * 50), 330 + 1.0 * 76]], 1.4, PAL.ink, 'ink', .7);
      for (const [tw, x, y, r] of [[26.28, 255, 250, -.2], [26.62, 1665, 420, .16]]) { const a = t - tw; if (a > 0) type('SNIFF', x, y, 150, { font: 'hand', col: PAL.ink, k: popIn(a, .12), rot: r + Math.sin(a * 30) * .02 * Math.exp(-a * 6), wear: .25 }); }
      camEnd();
      const a = t - 26.68; if (a > 0) label([typed('MISSION NO. 4,117', a, 40), typed('OBJECTIVE: THAT SMELL', a - .25, 40)], 96, 900, { size: 30, col: PAL.paper, bg: PAL.ink, pad: 18 });
    } else {
      // she suspects her own shadow
      const a = t - tCut, sus = t - tSus, u = 30, [sx, sy] = shakeXY(t, hit(t, tSus, 10) * 18);
      bg(PAL.orange);
      camBegin(960 + sx + (1 - easeOut5(a / .22)) * 900, 540 + sy, 1 + seg(a, 0, 1.7) * .06, 0);
      rect2(-400, 0, 1560, H + 200, PAL.paper);                                               // a sunlit wall
      halftone(-400, 0, 1560, H + 200, { cell: 22, col: PAL.orange, grad: [1160, 0, 500, 0], alpha: .55 });
      dryStroke(-600, GY + 70, 2600, GY + 60, 170, PAL.ink, { seed: 12 });
      const SH = { fur: PAL.ink, white: PAL.ink, dark: PAL.ink, grey: PAL.ink, ink: PAL.ink, pink: PAL.ink, mouth: PAL.ink, harness: PAL.ink, trim: PAL.ink, eye: PAL.ink, iris: PAL.ink, gold: PAL.ink };
      junjunSide(470, GY, u * 1.28, { coat: SH, harness: true, shadow: false });            // the shadow, larger than her
      if (sus > 0) { reticle(770, 235, 190, { k: sus / .22, col: PAL.lime, lw: 9 }); type('SUSPICION', 455, 500, 232, { col: PAL.lime, k: slam(sus, .1).k, rot: -.03, seed: 5, wear: .3 }); }
      junjunSide(1500, GY, u, { ...EXPR.sideEye, flip: true, look: [.9, 0], lid: lerp(.3, .62, seg(a, .3, .8)), brow: .6, head: { rot: -.05 * seg(a, .3, .6) }, shadowOp: 0 });
      vibLines(1500 - 7.5 * u, GY - 17.5 * u, 150, 150, seg(sus, 0, .1), { n: 6, arc: [Math.PI * .6, Math.PI * 1.5] });
      camEnd();
      if (sus > .12) label(['UNIDENTIFIED DOG', typed('FOLLOWING ME SINCE 06:00', sus - .2, 44)], 990, 150, { size: 26, col: PAL.ink, bg: PAL.lime, pad: 14 });
    }
  }

  // ---------- bar 14 · "Eye contact's a contract, you bark — that's war" · THE STARE ----------
  function stare(t, lt, dur) {
    const t0 = barT(14), tLock = t0 + .34, tBark = 40.5, tWar = 41.08;
    if (t < tWar) {
      const build = seg(t, t0 + .2, tWar), u = 86, z = lerp(1, 1.2, ease(seg(t, t0, tWar)));
      const lookX = t < tLock ? -.65 : lerp(-.65, .92, easeOut5((t - tLock) / .09)), lookY = t < tLock ? .1 : -.3 * easeOut5((t - tLock) / .09);
      const tw = hit(t, tBark + .14, 14), irisR = lerp(.9, .5, easeOut(seg(t, tBark + .1, tBark + .3)));
      bg(PAL.orange);
      camBegin(960, 520, z, 0);
      stareLines(960, 520, build, { dim: .86, col: PAL.orange, n: 96, r0: 560 });
      // menace, lettered the manga way
      for (let i = 0; i < 4; i++) { const a = t - (t0 + .5 + i * .26); if (a > 0) type('ゴ', 210 + i * 46 + Math.sin(i * 2.1) * 30, 800 - i * 168, 150 + i * 14, { font: 'jp', col: PAL.orange, k: popIn(a, .14), rot: -.18 + i * .05, alpha: .95, wear: .2 }); }
      junjunBust(960, 590, u, { ...EXPR.stare, look: [lookX, lookY], lid: lerp(.3, .5, ease(seg(t, tLock + .2, tLock + .7))) - tw * .12, brow: lerp(.4, .95, build) + tw * .2, iris: irisR, browY: -tw * .1, ear: build * .12 });
      vibLines(960, 520, 640, 520, seg(t, tBark, tWar), { n: 16, sw: 1.5, len: 1.5, arc: [Math.PI * .95, Math.PI * 2.05], seed: 2 });
      camEnd();
      // the bark arrives in its own panel
      const pa = t - (tBark - .1);
      if (pa > 0) {
        const k = backOut(pa / .16, 1.3), c = g2d(true), px = 1480, py = 300;
        c.save(); c.translate(px, py); c.rotate(.05); c.scale(k, k);
        c.fillStyle = PAL.ink; c.fillRect(-196, -150, 412, 320); c.fillStyle = PAL.paper; c.fillRect(-210, -164, 412, 320); c.strokeStyle = PAL.ink; c.lineWidth = 9; c.strokeRect(-210, -164, 412, 320); c.restore();
        if (k > .9) {
          const yb = Math.max(hit(t, tBark, 10), hit(t, tBark + .2, 10));
          yorkie(px + 40, py + 120, 21, { flip: true, bark: yb, hop: yb * .7, shadow: false });
          type('YIP!', px - 110, py - 90, 78, { font: 'hand', col: PAL.oxblood, rot: -.14, k: 1 + yb * .25, screen: true, wear: .2 });
        }
      }
      // cinematic bars carry the legal text
      const lb = easeOut(seg(lt, 0, .22));
      letterbox(lb, PAL.ink, 148);
      type('EYE CONTACT’S', 70 - (1 - easeOut5((t - (t0 + .04)) / .2)) * 900, 76, 96, { col: PAL.paper, align: 'left', screen: true, wear: .25 });
      const ca = t - (t0 + .58); if (ca > 0) type('A CONTRACT.', W - 70, H - 72, 96, { col: PAL.lime, align: 'right', screen: true, k: slam(ca, .1).k, wear: .25 });
      const sa = t - (t0 + .95); if (sa > 0) { stamp('SIGNED', 330, H - 76, { k: popIn(sa, .14), size: 58, col: PAL.orange, rot: -.07, screen: true }); pawPrint(110, H - 78, 84, -.3, PAL.orange, { screen: true, alpha: clamp(sa / .1) }); }
    } else {
      // impact frame: the one explosive beat
      const a = t - tWar, [sx, sy] = shakeXY(t, 46 * Math.exp(-a * 5), 24), inv = a > .33 && a < .41;
      camBegin(960 + sx, 540 + sy, 1.06 - .06 * easeOut(a / .5), (hash(Math.floor(t * 24)) - .5) * .03 * Math.exp(-a * 5));
      impactFrame(960, 470, a, { accent: PAL.orange, dark: inv ? PAL.white : PAL.ink, light: inv ? PAL.ink : PAL.white, seed: 11 });
      type('戦', 300, 420, 520, { font: 'jp', col: PAL.orange, stroke: PAL.ink, strokeW: .03, rot: -.1, k: slam(a - .04, .1).k, alpha: clamp((a - .04) / .04), wear: .15 });
      junjunBust(1010, 500, 54, { ...EXPR.rage, mono: true, tilt: -.05, sx: 1 + Math.exp(-a * 14) * .1, sy: 1 + Math.exp(-a * 14) * .1 });
      const s = slam(a - .02, .1);
      type('WAR', 1010, 870, 430, { col: PAL.white, stroke: PAL.ink, strokeW: .07, k: s.k, alpha: s.alpha, rot: .025, per: (i) => ({ dy: (hash(i + Math.floor(t * 12)) - .5) * .02 * Math.exp(-a * 3), rot: (hash(i * 3 + Math.floor(t * 12)) - .5) * .05 * Math.exp(-a * 3) }), wear: .2 });
      type('THAT’S', 520, 790, 150, { font: 'hand', col: PAL.lime, stroke: PAL.ink, strokeW: .2, rot: -.12, alpha: clamp(a / .05), wear: 0 });
      camEnd();
      flash(1 - a / .09, PAL.white);
      label('THREAT LEVEL: AKITA', W - 64, 56, { size: 24, col: PAL.ink, bg: PAL.lime, align: 'right', screen: true, alpha: seg(a, .3, .4), pad: 12 });
    }
  }

  // a word cut in two along the line p0→p1; each half slides d px along the cut
  function cutType(txt, x, y, size, o, p0, p1, d) {
    const ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]), nx = Math.cos(ang), ny = Math.sin(ang), far = 5000;
    for (const sd of [1, -1]) {
      const c = g2d(); c.save(); c.beginPath();
      c.moveTo(p0[0] - nx * far, p0[1] - ny * far); c.lineTo(p1[0] + nx * far, p1[1] + ny * far);
      c.lineTo(p1[0] + nx * far - ny * sd * far, p1[1] + ny * far + nx * sd * far); c.lineTo(p0[0] - nx * far - ny * sd * far, p0[1] - ny * far + nx * sd * far); c.closePath(); c.clip();
      type(txt, x + nx * d * sd, y + ny * d * sd, size, o);
      X2.restore();
    }
  }

  // ---------- bar 10 · "Battle chain locked to my neck like a tethered blade" ----------
  function chain(t, lt, dur) {
    const tChain = 28.94, tLock = 29.24, tLike = 30.28, tBlade = 30.90, u = 30, dx = 400, gy = 965;
    const ring = [dx + 2.8 * u, gy - 13.85 * u], end = [2050, 20], cut = t - tBlade, sc = slam(t - tChain, .1);
    const [sx, sy] = shakeXY(t, sc.shake * 16 + hit(t, tBlade, 7) * 34, 24);
    bg(PAL.ink);
    camBegin(960 + sx, 540 + sy, 1 + seg(lt, 0, dur) * .05 + hit(t, tBlade, 8) * .03, 0);
    halftone(0, 0, W, H, { cell: 26, col: PAL.orange, grad: [1900, 0, 700, 700], alpha: .9, max: .7 });
    type('BATTLE', 300, 150, 130, { font: 'hand', col: PAL.paper, rot: -.08, wear: 0, k: popIn(lt + .2, .12) });
    cutType('CHAIN', 1200, 610, 540, { col: PAL.paper, k: sc.k, alpha: sc.alpha, shadow: { col: PAL.orange, dx: .02, dy: .024 }, seed: 9 }, ring, end, cut > 0 ? 72 * easeOut5(cut / .12) : 0);
    dryStroke(-100, gy + 58, 2100, gy + 46, 130, PAL.orange, { seed: 15 });
    junjunSide(dx, gy, u, { ...EXPR.neutral, look: [.5, 0], brow: .45, shadow: false });
    // the lead: taut, lime, and for one beat a blade
    const w = cut > 0 ? lerp(34, 13, easeOut(cut / .3)) : 13, c = g2d();
    c.lineCap = 'round'; c.strokeStyle = PAL.ink; c.lineWidth = w + 12; c.beginPath(); c.moveTo(ring[0], ring[1]); c.lineTo(end[0], end[1]); c.stroke();
    c.strokeStyle = cut > 0 && cut < .09 ? PAL.white : PAL.lime; c.lineWidth = w; c.beginPath(); c.moveTo(ring[0], ring[1]); c.lineTo(end[0], end[1]); c.stroke();
    const gl = seg(t, tLike, tBlade); if (gl > 0 && gl < 1) { const gx = lerp(ring[0], end[0], easeIn(gl)), gyy = lerp(ring[1], end[1], easeIn(gl)); poly2([[gx - 70, gyy + 26], [gx, gyy - 26], [gx + 70, gyy - 26], [gx, gyy + 26]].map(p => [p[0], p[1]]), PAL.white); }
    if (cut > 0) { for (let i = 0; i < 4; i++) type('シャキン'[i], 1300 + i * 120, 215 - i * 36, 120, { font: 'jp', col: PAL.lime, k: popIn(cut - i * .03, .09), rot: -.2, wear: .15 }); }
    paint(ellPts(ring[0], ring[1], 17, 17, 10), { wash: PAL.lime, ink: PAL.ink, sw: 1 });
    camEnd();
    const la = t - tLock; if (la > 0) { reticle(ring[0], ring[1], 74, { k: la / .15, col: PAL.paper, lw: 6, screen: true }); stamp('LOCKED', 250, 420, { k: popIn(la, .12), size: 78, rot: -.1, col: PAL.paper, screen: true }); }
    if (t > 29.9) label([typed('BATTLE CHAIN', t - 29.9, 40), typed('(LEAD, 1.5 M, LIME)', t - 30.15, 40)], 1210, 880, { size: 30, col: PAL.ink, bg: PAL.lime, pad: 16 });
  }

  // ---------- bar 11 · "But I'll drag my commander through a firefight parade" ----------
  function drag(t, lt, dur) {
    const tDrag = 31.66, tCom = 32.16, tFire = 33.0, u = 25, gy = 930, sd = slam(t - tDrag, .1), [sx, sy] = shakeXY(t, sd.shake * 18);
    bg(PAL.orange);
    camBegin(960 + sx + lt * 30, 540 + sy, 1 + lt * .016, -.012);
    streaks({ col: PAL.paper, n: 34, drift: -lt * 1900, th: [3, 16], len: [300, 1100], alpha: .5, area: [-300, 40, W + 600, 820] });
    type('DRAG', 900, 430, 700, { col: PAL.paper, k: sd.k, alpha: sd.alpha, skew: -.22, shadow: { col: PAL.ink, dx: .02, dy: .024 }, seed: 14, per: i => ({ dx: -(3 - i) * .012 * Math.sin(t * 9 + i) }) });
    dryStroke(-300, gy + 60, 2400, gy + 48, 140, PAL.ink, { seed: 18 });
    // parade fireworks: small bursts on the eighths once the firefight starts
    if (t > tFire) for (let i = 0; i < 7; i++) { const tb = tFire + i * .165, a = t - tb; if (a > 0 && a < .5) { const bx = 250 + hash(i * 3.1) * 1500, by = 110 + hash(i * 7.7) * 330;
      burst(bx, by, 26 * easeOut(a / .2), 96 * easeOut(a / .2), { n: 9, seed: i * 5, col: [PAL.lime, PAL.pink, PAL.paper][i % 3], stroke: PAL.ink, lw: 6, alpha: 1 - seg(a, .35, .5) }); } }
    const hand = commander(520 + Math.sin(t * 6) * 14, 640 + Math.sin(t * 11) * 16, u, { pose: 'dragged', face: 'panic' });
    junjunSide(1330, gy, u, { ...EXPR.neutral, walk: lt * 1.5, look: [.3, 0], leash: hand, slack: 0, shadowOp: 0 });
    camEnd();
    if (t > tCom) { const a = t - tCom, c = g2d(true); c.strokeStyle = PAL.ink; c.lineWidth = 5; c.beginPath(); c.moveTo(430, 500); c.lineTo(430, 500 - 90 * easeOut(a / .12)); c.stroke();
      label(typed('COMMANDER (NOMINAL)', a - .1, 40), 300, 362, { size: 28, col: PAL.paper, bg: PAL.ink, pad: 14, screen: true }); }
    if (t > 33.22) label('PARADE SPEED: 4 KM/H', W - 70, 60, { size: 26, col: PAL.ink, align: 'right', screen: true });
  }

  // ---------- bar 12 · "Enemy sighted at two o'clock! Yorkie patrol." ----------
  function sighted(t, lt, dur) {
    const tTwo = 35.02, tYork = 35.72, tPat = 36.14, whip = 1 - easeOut5(lt / .2), se = slam(lt - .04, .1), [sx, sy] = shakeXY(t, se.shake * 14 + hit(t, tYork, 10) * 12);
    const cx = 620, cy = 560, R = 430, ha = lerp(-Math.PI / 2, -Math.PI / 6, elasticOut(seg(t, tTwo - .04, tTwo + .5)));
    bg(PAL.paper);
    camBegin(960 + sx - whip * 1500, 540 + sy, 1 + lt * .014, 0);
    if (whip > .02) streaks({ col: PAL.ink, n: 40, drift: lt * 9000, th: [4, 26], len: [500, 1400], alpha: whip });
    // the clock: she is its hub
    circ2(cx, cy, R, PAL.orange, { stroke: PAL.ink, lw: 14 });
    { const c = g2d(); c.strokeStyle = PAL.ink; c.lineCap = 'butt'; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r0 = i % 3 ? R - 46 : R - 86; c.lineWidth = i % 3 ? 9 : 18; c.beginPath(); c.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); c.lineTo(cx + Math.cos(a) * (R - 16), cy + Math.sin(a) * (R - 16)); c.stroke(); }
      c.strokeStyle = PAL.ink; c.lineWidth = 34; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(ha) * (R + 150), cy + Math.sin(ha) * (R + 150)); c.stroke();
      c.strokeStyle = PAL.lime; c.lineWidth = 18; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(ha) * (R + 146), cy + Math.sin(ha) * (R + 146)); c.stroke(); }
    type('2', cx + Math.cos(-Math.PI / 6) * (R - 150), cy + Math.sin(-Math.PI / 6) * (R - 150), 150, { col: PAL.ink, k: popIn(t - tTwo, .12), wear: .2 });
    type('ENEMY', 1420, 760, 330, { col: PAL.ink, k: se.k, alpha: se.alpha, rot: -.03, seed: 17 });
    // the enemy, in its sector
    const ya = t - tYork, ex = 1500, ey = 330;
    circ2(ex, ey, 200, PAL.pink, { stroke: PAL.ink, lw: 10 });
    yorkie(ex - 20, ey + 120, 26, { flip: true, hop: Math.abs(Math.sin(t * 9)) * .25, bark: ya > 0 ? Math.max(0, Math.sin(t * 20)) : 0, shadow: false });
    junjunBust(cx, cy + 20, 31, { ...EXPR.judge, look: t < tTwo ? [0, 0] : [.95, -.45], lid: t < tTwo ? .3 : .55, brow: t < tTwo ? .3 : .75, tilt: t < tTwo ? 0 : .05 * elasticOut((t - tTwo) / .4) });
    if (ya > 0) reticle(ex, ey, 240, { k: ya / .2, col: PAL.oxblood, lw: 11 });
    camEnd();
    stamp('SIGHTED', 1500, 930, { k: popIn(t - 34.36, .12), size: 96, rot: -.06, col: PAL.oxblood, screen: true, seed: 8 });
    dossier(1010, 60, 'FILE 07 // YORKIE PATROL', ['HEIGHT: 23 CM', 'THREAT: TOTAL'], (t - tPat) * 1.6, { screen: true, w: 440, size: 24, rot: -.03 });
    if (t > tTwo + .1) label('BEARING: TWO O’CLOCK', 70, 60, { size: 26, col: PAL.ink, screen: true });
  }

  // ---------- bar 13 · "We might pass in peace… or I might lose control" ----------
  function control(t, lt, dur) {
    const tOr = 38.02, tLose = 38.54, tCtl = 38.82, u = 27, gy = 930, lose = seg(t, tOr, barT(14)), z = lerp(1, 1.75, easeIn(seg(t, tOr, tOr + .5)));
    const dogX = 520 + lt * 60, pct = Math.round(lerp(50, 4, easeOut(seg(t, tOr, tCtl + .3)))), [sx, sy] = shakeXY(t, lose * lose * 9, 12);
    bg(PAL.sage);
    camBegin(lerp(960, dogX + 8 * u, ease(seg(t, tOr, tOr + .5))) + sx, lerp(540, gy - 17 * u, ease(seg(t, tOr, tOr + .5))) + sy, z, 0);
    if (lose > 0) halftone(0, 0, W, H, { cell: 24, col: PAL.orange, radial: [dogX + 8 * u, gy - 17 * u, 1500 - lose * 1400, 1700 - lose * 1200], max: 1.25 });
    if (t < tOr + .2) type('PEACE', 1010, 400, 520, { col: PAL.paper, track: .04, k: popIn(t - 37.6, .2), wear: .2, seed: 19 });
    dryStroke(-300, gy + 56, 2400, gy + 46, 120, PAL.ink, { seed: 23 });
    yorkie(1560 - lt * 46, gy, 22, { flip: true, hop: Math.abs(Math.sin(lt * 9)) * .2 });
    if (t > tCtl) { const a = t - tCtl; type('CONTROL', dogX + 8 * u + 40, gy - 17 * u - 190, 140, { col: PAL.ink, k: slam(a, .08).k, per: i => ({ dy: (hash(i * 3 + Math.floor(t * 12)) - .5) * .5 * a, rot: (hash(i * 7 + Math.floor(t * 12)) - .5) * 1.1 * a, dx: (i - 3) * .12 * a }), wear: .2 }); }
    junjunSide(dogX, gy, u, { ...EXPR.neutral, walk: lt * (t < tOr ? 1.1 : 0) + (t < tOr ? 0 : (tOr - barT(13)) * 1.1), look: [.6, 0], lid: lerp(.3, .1, lose), brow: lerp(.2, 1, lose), iris: lerp(1, .6, lose), ear: lose * .2,
      head: { rot: (hash(Math.floor(t * 12)) - .5) * .05 * lose } });
    vibLines(dogX + 8 * u, gy - 17.5 * u, 150, 140, lose, { n: 12, sw: .9, seed: 3 });
    camEnd();
    label('PROBABILITY OF PEACE: ' + String(pct).padStart(2, '0') + '%', 70, 60, { size: 30, col: lose > .5 ? PAL.paper : PAL.ink, bg: lose > .5 ? PAL.oxblood : PAL.paper, pad: 14, screen: true });
  }

  // ---------- bar 15 · "I'll lunge so hard I'll make my human hit the floor" ----------
  function lunge(t, lt, dur) {
    const tHard = 42.56, tMake = 43.0, tHit = 43.54, tFloor = 43.96, u = 22, gy = 800, sl = slam(lt, .1), dogX = 1460;
    const [sx, sy] = shakeXY(t, sl.shake * 14 + hit(t, tHit, 7) * 40, 24);
    bg(PAL.paper);
    camBegin(960 + sx, 540 + sy, 1 + lt * .01, 0);
    type('LUNGE', 800, 380, 600, { col: PAL.orange, k: sl.k, alpha: sl.alpha, rot: -.02, seed: 22 });
    if (t > tFloor) { const sf = slam(t - tFloor, .09); type('FLOOR', 800, 925, 330, { col: PAL.ink, k: sf.k, alpha: sf.alpha, track: .03, seed: 25 }); }
    else dryStroke(-200, gy + 50, 2200, gy + 40, 100, PAL.ink, { seed: 27 });
    // the human: relaxed, yanked, airborne, floored
    let hand;
    if (t < tHard) hand = commander(430 + lt * 60, gy, u, { pose: 'walk', walk: lt * 1.4, face: 'calm' });
    else if (t < tMake) { const a = seg(t, tHard, tMake); hand = commander(458 + a * 90, gy, u, { pose: 'stand', face: 'panic', lean: .25 + a * .3, arm: 1.5 }); }
    else if (t < tHit) { const a = seg(t, tMake, tHit); hand = commander(560 + easeIn(a) * 520, gy - u * (8 + Math.sin(a * Math.PI) * 7), u, { pose: 'dragged', face: 'panic' }); }
    else { const a = t - tHit; burst(1010, gy - 10, 150 * easeOut(a / .1), 430 * easeOut(a / .1), { n: 13, seed: 4, col: PAL.orange, stroke: PAL.ink, lw: 8, ey: .45, alpha: 1 - seg(a, .5, .8) });
      hand = commander(1000, gy, u, { pose: 'flat', face: 'dead' });
      for (let i = 0; i < 3; i++) { const sa = (i / 3 + t * .9) * TAU; poly2(burstPts(1330 + Math.cos(sa) * 80, gy - 150 + Math.sin(sa) * 30, 9, 26, 4, i), PAL.lime, { stroke: PAL.ink, lw: 4 }); } }
    // she leans. One inch.
    junjunSide(dogX, gy, u, { ...EXPR.judge, look: [.5, 0], lean: .07 * easeOut5(seg(t, tHard - .06, tHard + .06)), leash: hand, slack: t < tHard ? .16 : 0, shadowOp: 0 });
    if (t > tHit && t < tHit + .5) type('HIT', 1010, 520, 260, { col: PAL.ink, k: slam(t - tHit, .07).k, rot: .06, wear: .2 });
    camEnd();
    if (t > tHard) { const a = t - tHard, x0 = dogX + 6.9 * u, c = g2d(true); c.strokeStyle = PAL.oxblood; c.lineWidth = 5; c.beginPath(); c.moveTo(x0, gy + 96); c.lineTo(x0 + 46, gy + 96); c.moveTo(x0, gy + 82); c.lineTo(x0, gy + 110); c.moveTo(x0 + 46, gy + 82); c.lineTo(x0 + 46, gy + 110); c.stroke();
      label(typed('LUNGE DISTANCE: 2.5 CM', a - .05, 44), x0 - 150, gy + 122, { size: 26, col: PAL.oxblood, screen: true }); }
  }

  chapter('verse1', barT(8), barT(16), [
    [barT(8), entrance], [barT(9), sniff], [barT(10), chain], [barT(11), drag],
    [barT(12), sighted], [barT(13), control], [barT(14), stare], [barT(15), lunge]
  ]);
})();
