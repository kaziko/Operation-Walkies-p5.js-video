// c08_radio.js: Radio report (bars 57-66). Field radio: ink, lime, paper, with orange / oxblood accents.
// The mono face leads on purpose: the report is typed into a transcript strip as she says it, under every shot.
// Above the strip each shot still gets one poster-scale image or word. The band is loud, so cuts sit on bar lines.
(() => {
  const SY = 920;                                    // top of the transcript strip: shots compose above this line
  const TSTOP = 177.9;                               // the music stops dead here: nothing moves afterwards
  const fit = (txt, w, cap) => Math.min(fitSize(txt, w), cap / CAP.hero);   // hero size limited by width and cap height
  const stepBeat = t => Math.floor(bp(t)) + easeOut(frac(bp(t)) * 3);        // a counter that snaps forward on each beat

  // ---------- the report, token by token [text, time]: one line per sentence ----------
  const LINES = [
    [0, []],
    [153.52, [['ALFA', 153.52], [' AKITA', 154.24], [' TO', 155.54], [' COMMAND.', 156.0]]],
    [157.98, [['THIS', 157.98], [' IS', 158.7], [' PRINCESS', 158.86], [' JUNJUN', 159.2], [' REPORTING', 160.06], [' IN', 161.48], ['.', 161.9], ['.', 162.22], ['.', 162.54]]],
    [163.6, [['HYDRANTS', 163.6], [' SECURED.', 164.32], [' TERRITORY', 165.64], [' CLAIMED.', 167.04]]],
    [167.58, [['ALL', 167.58], [' ENEMY', 168.62], [' OPERATORS', 169.02], [' SUPPRESSED.', 169.84]]],
    [170.48, [['COMMANDER', 170.48], [' SAFELY', 171.82], [' RETURNED', 172.48], [' TO', 173.24], [' BASE.', 173.54]]],
    [173.9, [['OPERATION', 173.9], [' WALKIES:', 175.08], [' MISSION', 176.78], [' SUCCESS.', 177.5]]]
  ];
  const VOX = LINES.flatMap(l => l[1]).filter(w => w[0].length > 1).map(([w, tw]) => [tw, tw + .14 + w.length * .06]);
  const vox = t => VOX.reduce((m, [a, b]) => Math.max(m, clamp((t - a) / .04) * clamp((b - t) / .1)), 0);   // 1 while she talks

  // ---------- private props ----------
  // radio waveform: bars that jump 12x a second; lvl 0..1 (defaults to the voice)
  function wave(x, y, w, h, t, o = {}) {
    const c = g2d(o.screen), n = o.n || 40, f = Math.floor(t * 12), bw = w / n, lvl = o.lvl ?? (.14 + .86 * vox(t));
    c.fillStyle = o.col || PAL.lime;
    for (let i = 0; i < n; i++) {
      const env = Math.pow(Math.sin((i + .5) / n * Math.PI), o.flat ?? .7), a = (.3 + .7 * hash(i * 3.7 + f * 1.31)) * lvl * env, bh = Math.max(bw * .5, h * a);
      c.fillRect(x + i * bw + bw * .2, y - bh / 2, bw * .6, bh);
    }
  }
  // the transcript strip (screen space, drawn last in every shot)
  function strip(t) {
    const c = g2d(true); c.fillStyle = PAL.ink; c.fillRect(0, SY, W, H - SY); c.fillStyle = PAL.lime; c.fillRect(0, SY, W, 8);
    let li = 0; while (li + 1 < LINES.length && t >= LINES[li + 1][0]) li++;
    let s = '> '; for (const [w, tw] of LINES[li][1]) s += w.slice(0, Math.floor(clamp((t - tw) * 40, 0, w.length)));
    type(s + '█', 64, SY + 86, 54, { font: 'mono', col: PAL.lime, align: 'left', screen: true, wear: 0 });
    circ2(1470, SY + 86, 11 + pulse(t, 6) * 6, PAL.orange, { screen: true });
    wave(1506, SY + 86, 350, 100, t, { screen: true, n: 28 });
  }
  // radio static on a cut: a few frames of torn horizontal bars
  function crackle(age, t) {
    if (age < 0 || age >= .1) return;
    const c = g2d(true), f = Math.floor(t * 24), n = Math.round(lerp(16, 4, age / .1));
    for (let i = 0; i < n; i++) { c.fillStyle = [PAL.lime, PAL.ink, PAL.paper][i % 3]; c.fillRect(hash(f * 1.7 + i * 5.1) * W - 300, hash(f * 3.1 + i * 7.7) * SY, 300 + hash(f * 2.9 + i) * 1400, 6 + hash(f + i * 2.3) * 46); }
  }
  // transmission rings: step outward from the mic on every beat
  function rings(cx, cy, t, col, o = {}) {
    const c = g2d(), f = frac(bp(t)), gap = o.gap || 240; c.strokeStyle = col;
    for (let i = 0; i < (o.n || 7); i++) { const r = (i + easeOut(f)) * gap; if (r < 20) continue; c.lineWidth = (o.lw || 30) * (i ? 1 : clamp(f * 4)); c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke(); }
  }
  const ribbon = (pts, w) => {                      // a polyline thickened into a polygon
    const L = [], R = [];
    pts.forEach((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; L.push([p[0] - dy / d * w / 2, p[1] + dx / d * w / 2]); R.push([p[0] + dy / d * w / 2, p[1] - dx / d * w / 2]); });
    return L.concat(R.reverse());
  };
  // Headset for junjunBust(x, y, u): the band goes down before the bust (it runs behind her ears), the rest after.
  function headBand(x, y, u) {
    const arch = []; for (let i = 0; i <= 16; i++) { const a = Math.PI * (1 + i / 16); arch.push([x + Math.cos(a) * 6.25 * u, y + (-.4 + Math.sin(a) * 5.45) * u]); }
    const band = ribbon(arch, .95 * u);
    poly2(band, PAL.lime);                         // flat fill under the brush wash: see the note in the report (a first wash was once dropped)
    paint(band, { wash: PAL.lime, ink: PAL.ink, sw: clamp(u / 22, .5, 3.4) });
  }
  function headsetFront(x, y, u) {
    const SW = clamp(u / 22, .5, 3.4), J = u * .02, S = pts => pts.map(p => [p[0] * u + jit(J), p[1] * u + jit(J)]);
    push(); translate(x, y);
    paint(S(rrPts(-7.35, -1.7, 1.25, 2.5, .5)), { wash: PAL.orange, ink: PAL.ink, sw: SW * .9 });            // temple pad
    paint(S(ellPts(6.75, -.1, 1.5, 2.15, 18)), { wash: PAL.orange, ink: PAL.ink, sw: SW });                   // ear cup
    paint(S(ellPts(6.85, -.1, .7, 1.15, 12)), { wash: PAL.ink, ink: null });
    const boom = S([[6.9, 1.9], [6.7, 3.7], [5.0, 4.75], [3.3, 4.45]]);
    inkLine(boom, SW * 1.5, PAL.ink, 'ink', .6); inkLine(boom, SW * .7, PAL.lime, 'ink', .6);
    paint(S(ellPts(2.85, 4.4, .78, .68, 12)), { wash: PAL.orange, ink: PAL.ink, sw: SW * .8 });              // mic
    pop();
  }
  // Headset for junjunSide(x, y, u), standing, facing right.
  function headsetSide(x, y, u) {
    const h = u * 1.12, SW = clamp(u / 22, .5, 3.4), J = u * .02, S = pts => pts.map(p => [p[0] * h + jit(J), p[1] * h + jit(J)]);
    push(); translate(x + 7.5 * u, y - 17.5 * u);
    paint(S(ribbon([[-.25, -3.5], [-.65, -2.4], [-1.05, -1.2], [-1.35, .1]], .62)), { wash: PAL.lime, ink: PAL.ink, sw: SW * .9 });
    paint(S(ellPts(-1.45, .75, 1.25, 1.6, 18)), { wash: PAL.orange, ink: PAL.ink, sw: SW });
    paint(S(ellPts(-1.45, .75, .58, .82, 12)), { wash: PAL.ink, ink: null });
    const boom = S([[-1.1, 2.2], [1.0, 3.35], [3.5, 3.1], [5.15, 2.1]]);
    inkLine(boom, SW * 1.5, PAL.ink, 'ink', .6); inkLine(boom, SW * .7, PAL.lime, 'ink', .6);
    paint(S(ellPts(5.45, 1.8, .62, .56, 12)), { wash: PAL.orange, ink: PAL.ink, sw: SW * .8 });
    pop();
  }
  // manga anger vein: they are fine, they are annoyed
  function vein(x, y, r, col = PAL.oxblood) {
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + .3; inkLine([[x + Math.cos(a) * r * .32, y + Math.sin(a) * r * .32], [x + Math.cos(a + .5) * r, y + Math.sin(a + .5) * r]], clamp(r / 16, .8, 2.6), col, 'ink', 0); }
  }
  // lime tick badge
  function tick(x, y, r, k) {
    if (k <= 0) return;
    circ2(x, y, r * k, PAL.lime, { stroke: PAL.ink, lw: 9 });
    const c = g2d(); c.strokeStyle = PAL.ink; c.lineWidth = r * .27 * k; c.lineCap = 'butt'; c.lineJoin = 'miter'; c.beginPath();
    c.moveTo(x - r * .5 * k, y - r * .02 * k); c.lineTo(x - r * .13 * k, y + r * .36 * k); c.lineTo(x + r * .52 * k, y - r * .4 * k); c.stroke();
  }
  // territory flag: pole, pennant, paw
  function pennant(x, y, h, k, t, seed) {
    if (k <= 0) return;
    const hh = h * k, w = h * .66, fl = Math.sin(t * 9 + seed) * h * .03;
    paint([[x - 8, y], [x - 8, y - hh], [x + 8, y - hh], [x + 8, y]], { wash: PAL.paper, ink: PAL.ink, sw: 1.5 });
    paint([[x + 8, y - hh], [x + 8 + w * .5, y - hh + h * .07 + fl], [x + 8 + w, y - hh + h * .2 - fl], [x + 8 + w * .5, y - hh + h * .34 + fl], [x + 8, y - hh + h * .42]], { wash: PAL.orange, ink: PAL.ink, sw: 1.8 });
    pawPrint(x + 8 + w * .34, y - hh + h * .2, h * .2, -.2, PAL.ink);
  }

  // a solid rubber stamp: paper block, double frame, worn hero type. Reads on any background.
  function slab(txt, x, y, size, o = {}) {
    const k = o.k ?? 1; if (k <= .01) return;
    const rows = Array.isArray(txt) ? txt : [txt], n = rows.length, lh = CAP.hero * size + size * .2;
    const col = o.col || PAL.oxblood, rot = o.rot ?? -.08, w = Math.max(...rows.map(r => typeW(r, size, { track: .03 }))) + size * .8, h = n * lh + size * .36;
    const frame4 = (ww, hh) => rotPts([[-ww / 2, -hh / 2], [ww / 2, -hh / 2], [ww / 2, hh / 2], [-ww / 2, hh / 2]].map(q => [x + q[0] * k, y + q[1] * k]), rot, x, y);
    poly2(frame4(w, h), o.bg || PAL.paper, { stroke: col, lw: size * .1 * k, screen: o.screen, join: 'round' });
    poly2(frame4(w - size * .32, h - size * .32), null, { stroke: col, lw: size * .03 * k, screen: o.screen });
    rows.forEach((r, i) => { const [rx, ry] = rotPts([[x, y + (i - (n - 1) / 2) * lh * k]], rot, x, y)[0]; type(r, rx, ry, size, { col, rot, k, track: .03, wear: .5, seed: (o.seed || 0) + i, screen: o.screen }); });
  }

  // ---------- 153.0 · "Alfa Akita…" · her face in a headset ----------
  function callsign(t, lt, dur) {
    const tAlfa = 153.52, tAkita = 154.24, sA = slam(t - tAlfa, .12), sK = slam(t - tAkita, .12), P = pulse(t, 5);
    const [sx, sy] = shakeXY(t, (sA.shake + sK.shake) * 20), u = 60, hx = 1400, hy = 430;
    // she says the call sign to the camera (lip-sync from the measured voice), then checks the lettering once
    const look = kf(t, [[154.98, [0, .05]], [155.08, [-.85, .2]], [155.36, [-.85, .2]], [155.46, [0, .05]]], easeOut), sp = sing(t);
    bg(PAL.ink);
    camBegin(960 + sx + lt * 10, 540 + sy, 1 + seg(lt, 0, dur) * .05 + P * .012, 0);
    rings(hx + 2.85 * u, hy + 4.4 * u, t, mixCol(PAL.ink, PAL.lime, .2));
    type('ALFA', 76, 300, fit('ALFA', 700, 310), { col: PAL.lime, align: 'left', k: sA.k, alpha: sA.alpha, rot: -.02, seed: 3 });
    type('AKITA', 76, 672, fit('AKITA', 860, 320), { col: PAL.paper, align: 'left', k: sK.k, alpha: sK.alpha, rot: -.02, shadow: { col: PAL.orange, dx: .024, dy: .028 }, seed: 5 });
    headBand(hx, hy, u);
    junjunBust(hx, hy, u, { ...EXPR.deadpan, look, lid: Math.max(.58, blink(t, 2)), brow: .15, mouth: 'sing', open: sp.open, round: sp.round });
    headsetFront(hx, hy, u);
    camEnd();
    label(typed('CALLSIGN:', lt - .12, 30), 84, 36, { size: 32, col: PAL.ink, bg: PAL.lime, pad: 12, screen: true, alpha: lt > .12 ? 1 : 0 });
    strip(t); crackle(lt, t);
  }

  // ---------- 155.6 · "…to Command." · profile, the signal leaves the mic ----------
  function command(t, lt, dur) {
    const tCmd = 156.0, s = slam(t - tCmd, .12), [sx, sy] = shakeXY(t, s.shake * 24), u = 66, P = pulse(t, 5);
    const hx = 380, hy = 480, x = hx - 7.5 * u, y = hy + 17.5 * u, mx = hx + 5.45 * u * 1.12, my = hy + 1.8 * u * 1.12;
    bg(PAL.lime);
    camBegin(960 + sx + lt * 12, 540 + sy, 1 + lt * .014 + P * .01, 0);
    rings(mx, my, t, mixCol(PAL.lime, PAL.paper, .6), { gap: 250, lw: 36 });
    wave(mx + 70, 720, 1960 - mx - 70, 300, t, { col: PAL.ink, n: 30, flat: .3, lvl: Math.max(vox(t), .32 + .45 * pulse2(t, 4)) });
    type('ALFA AKITA TO', 900, 122, 62, { font: 'mono', col: PAL.ink, align: 'left' });
    type('COMMAND.', 892, 370, fit('COMMAND.', 960, 300), { col: PAL.ink, align: 'left', k: s.k, alpha: s.alpha, rot: -.015, shadow: { col: PAL.paper, dx: .026, dy: .03 }, seed: 7 });
    junjunSide(x, y, u, { ...EXPR.deadpan, lid: Math.max(.56, blink(t, 5)), brow: .2, look: [.4, 0], shadow: false });
    headsetSide(x, y, u);
    camEnd();
    const a = t - 156.85;
    if (a > 0) label([typed('RESPONSE:', a, 34), typed('NOT REQUIRED.', a - .34, 34)], 1400, 706, { size: 40, col: PAL.ink, bg: PAL.paper, frame: PAL.ink, lw: 5, pad: 18, rot: -.03, screen: true });
    strip(t); crackle(lt, t);
  }

  // ---------- 158.3 · "This is Princess JunJun reporting in…" · the ID card, then her photo ----------
  function idCard(t, lt, dur) {
    const tCut = barT(60), tPrin = 158.86, tJun = 159.2, tIn = 161.48, tPaw = barT(60, 2), near = t >= tCut;
    const s = slam(lt, .12), sP = slam(t - tPrin, .1), sJ = slam(t - tJun, .1), sW = slam(t - tPaw, .1);
    const [sx, sy] = shakeXY(t, s.shake * 26 + (sP.shake + sJ.shake) * 9 + sW.shake * 20);
    bg(PAL.ink);
    if (near) camBegin(760 + sx, 562 + sy, lerp(1.62, 1.75, easeOut(seg(t, tCut, tCut + 2.6))) + pulse(t, 5) * .012, -.02);
    else camBegin(960 + sx, 562 + sy, s.k * (1 + lt * .012) + pulse(t, 5) * .01, -.035 + (1 - easeOut(lt / .3)) * .1);
    halftone(-300, -200, W + 600, H + 400, { cell: 28, col: PAL.lime, radial: [960, 480, 760, 1500], alpha: .95 });
    poly2([[922, -500], [998, -500], [998, 150], [922, 150]], PAL.lime, { stroke: PAL.ink, lw: 6 });                 // lanyard
    // the photo goes down first (regulation background, height lines, crown); the card is laid around it
    rect2(260, 246, 470, 520, PAL.orange);
    { const c = g2d(); c.fillStyle = PAL.paper; for (let i = 0; i < 7; i++) c.fillRect(260, 286 + i * 70, i % 2 ? 470 : 60, 5); }
    const look = near ? (t < tIn ? [.92, .05] : [lerp(.92, 0, easeOut5((t - tIn) / .09)), .05]) : [0, .05];
    junjunBust(495, 486, 29, { ...EXPR.deadpan, look, lid: near && t >= tIn ? lerp(.6, .5, seg(t, tIn, tIn + .3)) : Math.max(.6, blink(t, 4)), brow: near && t >= tIn ? .35 : .1, crown: 1 });
    rect2(210, 110, 1500, 137, PAL.paper); rect2(210, 246, 51, 604, PAL.paper); rect2(729, 246, 981, 604, PAL.paper); rect2(260, 765, 470, 85, PAL.paper);
    rect2(236, 850, 1500, 28, PAL.lime); rect2(1710, 138, 26, 740, PAL.lime); rect2(200, 878, 640, 70, PAL.ink);
    rect2(210, 110, 1500, 96, PAL.ink); rect2(880, 124, 160, 30, PAL.paper);
    type('ALFA AKITA DIVISION', 250, 176, 34, { font: 'mono', col: PAL.lime, align: 'left' });
    type('FIELD ID  000 001', 1670, 176, 34, { font: 'mono', col: PAL.paper, align: 'right' });
    rect2(260, 246, 470, 520, null, { stroke: PAL.ink, lw: 9 });
    { const c = g2d(); c.fillStyle = PAL.ink; let bx = 262; for (let i = 0; bx < 700; i++) { const bw = 4 + Math.floor(hash(i * 2.7) * 3) * 5; c.fillRect(bx, 786, bw, 46); bx += bw + 5 + Math.floor(hash(i * 5.3) * 2) * 6; } }
    // the paperwork
    type('RANK', 832, 250, 28, { font: 'mono', col: PAL.oxblood, align: 'left' });
    type('PRINCESS', 826, 388, fit('PRINCESS', 840, 215), { col: PAL.ink, align: 'left', k: sP.k, alpha: sP.alpha, seed: 9 });
    type('NAME', 832, 528, 28, { font: 'mono', col: PAL.oxblood, align: 'left' });
    type('JUNJUN', 826, 648, fit('JUNJUN', 840, 180), { col: PAL.orange, align: 'left', k: sJ.k, alpha: sJ.alpha, shadow: { col: PAL.ink, dx: .02, dy: .024 }, seed: 12 });
    label([typed('UNIT: ALFA AKITA', t - tJun - .35, 40), typed('CLEARANCE: ALL SOFAS', t - tJun - .75, 40)], 832, 768, { size: 28, col: PAL.ink });
    pawPrint(700, 738, 170 * sW.k, .25, PAL.oxblood, { alpha: sW.alpha });                                         // signed across the photo corner
    camEnd();
    if (near) { const a = t - tCut - .25; if (a > 0) label(['EXPRESSION:', typed('REGULATION', a - .2, 34)], 70, 748, { size: 40, col: PAL.ink, bg: PAL.lime, pad: 18, rot: -.03, screen: true }); }
    strip(t); crackle(lt, t); crackle(t - tCut, t);
  }

  // ---------- 163.5 · "Hydrants secured, territory claimed." · the checklist, then the map ----------
  function hydrants(t, lt, dur) {
    const tCut = barT(61, 3), P = pulse(t, 5);
    if (t < tCut) {
      const tk = [163.6, 163.84, 164.08, 164.32], tSec = 164.32, s = slam(t - tSec, .12), q = easeOut5(seg(t, tSec - .04, tSec + .16));
      const [sx, sy] = shakeXY(t, s.shake * 24 + tk.reduce((p, x) => p + hit(t, x, 14), 0) * 7);
      const xs = [300, 740, 1180, 1620], ys = [850, 796, 860, 806], u = 26, done = tk.filter(x => t >= x).length;
      bg(PAL.paper);
      camBegin(lerp(720, 960, q) + sx, lerp(610, 540, q) + sy, lerp(1.24, 1, q) + P * .008, 0);
      { const c = g2d(); c.save(); c.translate(960, 500); c.rotate(-.1); c.translate(-960, -500); c.lineWidth = 6; c.strokeStyle = mixCol(PAL.paper, PAL.ink, .2);
        for (let i = -1; i < 9; i++) for (let j = -1; j < 6; j++) c.strokeRect(i * 250 - 70, j * 205 - 40, 208, 164); c.restore(); }
      type('SECURED', 960, 290, fit('SECURED', 1700, 370), { col: PAL.ink, k: s.k, alpha: s.alpha, rot: -.02, shadow: { col: PAL.orange, dx: .026, dy: .03 }, seed: 4 });
      xs.forEach((x, i) => {
        hydrant(x, ys[i], u);
        if (i === done - 1) reticle(x, ys[i] - 5.4 * u, 200, { k: (t - tk[i]) / .14, col: PAL.ink, lw: 8 });
        tick(x + 128, ys[i] - 11.4 * u, 66, popIn(t - tk[i], .12));
      });
      camEnd();
      label(`HYDRANTS: ${done}/4`, 84, 44, { size: 38, col: PAL.lime, bg: PAL.ink, pad: 14, screen: true });
      strip(t); crackle(lt, t);
    } else {
      const a = t - tCut, tTer = 165.64, tClm = 167.04, n8 = Math.floor((bp(t) - bp(tCut)) * 2 + .02), steps = [.12, .28, .46, .64, .8];
      const part = t >= tClm ? 1 : steps[Math.min(n8, 4)], before = t >= tClm ? .8 : (n8 > 0 ? steps[Math.min(n8, 4) - 1] : 0), fresh = t >= tClm ? t - tClm : frac((bp(t) - bp(tCut)) * 2) * .33;
      const sT = slam(t - tTer, .12), sC = slam(t - tClm, .1), [sx, sy] = shakeXY(t, (sT.shake + sC.shake) * 24);
      bg(PAL.ink);
      camBegin(960 + sx, 540 + sy, lerp(1.35, 1, easeOut5(a / .3)) + a * .014, -.03);
      { const c = g2d(); c.save(); c.translate(960, 500); c.rotate(-.1); c.translate(-960, -500); c.lineWidth = 5; c.strokeStyle = mixCol(PAL.ink, PAL.lime, .34);
        let id = 0; for (let i = -1; i < 9; i++) for (let j = -1; j < 6; j++, id++) { const h = hash(id * 1.7 + 3);
          if (h < part) { c.fillStyle = h >= before && fresh < .09 ? PAL.paper : PAL.lime; c.fillRect(i * 250 - 70, j * 205 - 40, 208, 164); } else c.strokeRect(i * 250 - 70, j * 205 - 40, 208, 164); }
        c.restore(); }
      [[250, 850, tCut], [1630, 800, barT(62)], [1010, 720, barT(62, 1)]].forEach(([x, y, tf], i) => pennant(x, y, 330, popIn(t - tf, .14), t, i * 2));
      if (sT.alpha > 0) {
        poly2(rotPts([[-760, -150], [760, -150], [760, 150], [-760, 150]].map(p => [960 + p[0] * sT.k, 196 + p[1] * sT.k]), -.03, 960, 196), PAL.paper, { stroke: PAL.ink, lw: 9 });
        type('TERRITORY', 960, 196, fit('TERRITORY', 1400, 210), { col: PAL.ink, k: sT.k, alpha: sT.alpha, rot: -.03, seed: 8 });
      }
      camEnd();
      slab('CLAIMED', 1000, 580, 290, { k: sC.k, rot: -.09, seed: 4, screen: true });
      label(`TERRITORY: ${Math.round(part * 100)}%`, 84, 836, { size: 36, col: PAL.ink, bg: PAL.paper, pad: 14, screen: true });
      strip(t); crackle(a, t);
    }
  }

  // ---------- 167.5 · "All enemy operators suppressed." · the line-up ----------
  function lineup(t, lt, dur) {
    const t0 = barT(62, 2), tSup = 169.84, GY = 790, xs = [250, 612, 950, 1290, 1660], ts = i => tSup + i * .11;
    const hits = xs.reduce((p, _, i) => p + hit(t, ts(i), 16), 0), [sx, sy] = shakeXY(t, hits * 10 + hit(t, ts(4), 8) * 12, 24), P = pulse(t, 5);
    const drop = i => hit(t, ts(i), 12) * 16, idx = Math.floor((bp(t) - bp(t0)) * 2 + .02), fr = frac((bp(t) - bp(t0)) * 2 + .02);
    bg(PAL.paper);
    camBegin(960 + sx + lerp(-24, 24, lt / dur), 540 + sy, 1.02 + lt * .012, 0);
    { const c = g2d(); for (let i = 0; i < 10; i++) { c.fillStyle = mixCol(PAL.paper, PAL.ink, i % 2 ? .16 : .34); c.fillRect(-200, GY - 70 - i * 74, W + 400, i % 2 ? 4 : 7); } }
    xs.forEach((x, i) => type(String(i + 1), x, GY - 360, 300, { col: mixCol(PAL.paper, PAL.orange, i === idx % 5 && t < tSup ? .95 : .3), wear: .25, seed: i }));
    [['ALL', 167.58], ['ENEMY', 168.62], ['OPERATORS', 169.02]].reduce((x, [w, tw]) => {
      const a = t - tw; if (a > 0) type(w, x, 126, 150, { col: PAL.ink, align: 'left', k: slam(a, .1).k, wear: .3 });
      return x + typeW(w, 150) + 46;
    }, 84);
    rect2(-400, GY, W + 800, 400, PAL.ink);
    yorkie(xs[0] - 10, GY + drop(0), 28, { shadow: false });
    squirrel(xs[1], GY + drop(1), 33, {});
    cat(xs[2] + 20, GY + drop(2), 30, { eyes: .42 });
    crow(xs[3] - 10, GY - 32 + drop(3), 34, { cap: true });
    pup(xs[4] - 20, GY + drop(4), 33, { face: 'cocky', shadow: false });
    [['TCH.', 168.77, xs[0] + 60, -.1], ['HMPH.', 169.1, xs[4] + 20, .08]].forEach(([w, tw, x, r]) => { if (t > tw) type(w, x, GY - 372, 64, { font: 'hand', col: PAL.oxblood, k: popIn(t - tw, .1), rot: r, wear: 0 }); });
    [[140, -296], [160, -292], [128, -330], [196, -262], [190, -318]].forEach(([dx, dy], i) => vein(xs[i] + dx, GY + dy, 26 + P * 10 + hit(t, ts(i), 6) * 26));
    if (t < tSup) reticle(xs[idx % 5], GY - 150, 190, { k: fr * 5, col: PAL.ink, lw: 8 });
    xs.forEach((x, i) => { const a = t - ts(i); if (a >= 0) slab('SUPPRESSED', x + 10, GY - 86 + (i % 2 ? 26 : -22), 66, { k: slam(a, .07).k, rot: [-.11, .08, -.05, .1, -.08][i], seed: i + 2 }); });
    xs.forEach((x, i) => label(`0${i + 1} ${['YORKIE', 'SQUIRREL', 'CAT', 'CROW', 'PUP'][i]}`, x, GY + 44, { size: 30, col: PAL.ink, bg: PAL.lime, align: 'center', pad: 12 }));
    camEnd();
    strip(t); crackle(lt, t);
  }

  // ---------- 170.4 · "Commander safely returned to base." ----------
  function base(t, lt, dur) {
    const t0 = barT(63, 2.5), tCut = barT(64), tSafe = 171.82, tRet = 172.48, tBase = 173.24, u = 26, FY = 850, cx = 1180;
    const wide = t >= tCut, s = slam(t - tSafe, .12), sC = slam(t - 170.48, .1), [sx, sy] = shakeXY(t, (s.shake + sC.shake) * 22);
    const jx = cx + 6.4 * u, jy = FY - 4.2 * u + 10;
    bg(PAL.paper);
    if (wide) camBegin(960 + sx, 540 + sy, 1 + seg(t, tCut, t0 + dur) * .05 + pulse(t, 5) * .008, 0);
    else camBegin(1590 + sx, 752 + sy, 1.9 + lt * .06, -.025);
    sunburst(jx, jy - 19.3 * u, { n: 14, col: PAL.lime, alpha: 1, rot: stepBeat(t) * TAU / 28 });
    rect2(-600, FY + u, W + 1200, 500, PAL.ink);
    if (wide) type('SAFELY', 66, 320, fit('SAFELY', 1000, 380), { col: PAL.orange, align: 'left', k: s.k, alpha: s.alpha, rot: -.025, shadow: { col: PAL.ink, dx: .024, dy: .028 }, seed: 6 });
    const hand = commander(cx, FY, u, { pose: 'flat', face: 'dead' });
    { const pts = [[jx - 1.6 * u, jy - 9.6 * u], [jx - 7.4 * u, jy - 4.4 * u], [hand[0], hand[1] - u * .5]]; inkLine(pts, 1.5, PAL.ink, 'ink', .7); inkLine(pts, .75, PAL.lime, 'ink', .7); }
    junjunSit(jx, jy, u, { ...EXPR.deadpan, lid: Math.max(.6, blink(t, 6)), brow: .1, look: t > tRet + .1 && t < tRet + .75 ? [.55, .9] : [0, .05] });
    camEnd();
    if (!wide) type('COMMANDER', 1856, 168, fit('COMMANDER', 730, 210), { col: PAL.ink, align: 'right', k: sC.k, alpha: sC.alpha, rot: -.02, screen: true, seed: 3 });
    else {
      const a = t - tRet, b = t - tBase;
      if (a > 0) label([typed('SHOES: ON', a, 34), typed('LEAD: STILL IN HAND', a - .3, 34)], 84, 566, { size: 40, col: PAL.paper, bg: PAL.ink, pad: 16, screen: true });
      if (b > 0) label(typed('BASE = HALLWAY FLOOR', b, 60), 84, 712, { size: 40, col: PAL.ink, bg: PAL.orange, pad: 16, screen: true });
    }
    strip(t); crackle(lt, t); crackle(t - tCut, t);
  }

  // ---------- 174.0 · "Operation Walkies: mission success." · the title, then the last still ----------
  function title(t, lt, dur) {
    const tCut = barT(66), tWalk = 175.08;
    if (t < tCut) {
      const sO = slam(lt, .12), sW = slam(t - tWalk, .12), P = pulse(t, 5), a = t - tWalk, [sx, sy] = shakeXY(t, (sO.shake + sW.shake) * 26);
      bg(PAL.ink);
      camBegin(960 + sx, 540 + sy, 1 + lt * .014 + P * .014, -.012);
      sunburst(960, 560, { n: 18, col: mixCol(PAL.ink, PAL.lime, .17), rot: stepBeat(t) * TAU / 36 });
      type('OPERATION', 70, 188, fit('OPERATION', 1300, 250), { col: PAL.paper, align: 'left', k: sO.k, alpha: sO.alpha, seed: 2 });
      { const k = popIn(lt - .3, .14); rect2(1560 - 190 * k, 188 - 112 * k, 380 * k, 224 * k, PAL.orange, { stroke: PAL.paper, lw: 7 }); type('作戦', 1560, 188, 150 * k, { font: 'jp', col: PAL.ink, wear: .1 }); }
      // three paw steps on the eighths, then the word lands on them
      if (a < 0) [[430, 640, -.25], [900, 500, .1], [1370, 650, -.1]].forEach(([x, y, r], i) => { const k = popIn(t - barT(65, .5 + i * .5), .1); if (k > 0) pawPrint(x, y, 250 * k, r, PAL.paper); });
      type('WALKIES', 960, 590, fit('WALKIES', 1790, 440), { col: PAL.lime, k: sW.k, alpha: sW.alpha, shadow: { col: PAL.orange, dx: .022, dy: .026 }, seed: 5,
        per: i => ({ dy: (hash(i + Math.floor(t * 12)) - .5) * .03 * Math.exp(-Math.max(a, 0) * 4), rot: (hash(i * 3 + Math.floor(t * 12)) - .5) * .05 * Math.exp(-Math.max(a, 0) * 4) }) });
      camEnd();
      hazard(0, SY - 50, W, 50, t * 240, PAL.lime, PAL.ink, { screen: true });
      flash(a >= 0 ? 1 - a / .08 : 0, PAL.lime);
      strip(t); crackle(lt, t);
    } else {
      // the last frame: everything lands before the music stops, then it holds perfectly still
      const still = t >= TSTOP, q = Math.min(t, TSTOP), tMis = 176.78, tSuc = 177.5, s = slam(q - tSuc, .1), [sx, sy] = shakeXY(q, s.shake * 26), u = 52, hx = 500, hy = 470;
      if (still) randomSeed(8808);                                                  // freeze the line boil too
      bg(PAL.lime);
      camBegin(960 + sx, 540 + sy, 1 + (q - tCut) * .016, 0);
      sunburst(hx, hy, { n: 16, col: PAL.paper, alpha: .6, rot: stepBeat(q) * TAU / 32 });
      type('OPERATION WALKIES', 1380, 104, fit('OPERATION WALKIES', 940, 130), { col: PAL.ink, seed: 2 });
      for (let i = 0; i < 4; i++) { const k = popIn(q - tMis - i * .09, .12); if (k > 0) type('任務完了'[i], 1050 + i * 220, 312, 200 * k, { font: 'jp', col: PAL.ink, shadow: { col: PAL.paper, dx: .04, dy: .045 }, wear: .15, seed: i }); }
      headBand(hx, hy, u);
      junjunBust(hx, hy, u, { ...EXPR.deadpan, look: [0, .05], lid: lerp(.6, 1, easeOut(seg(q, tSuc + .04, tSuc + .16))), brow: .1 });
      headsetFront(hx, hy, u);
      camEnd();
      slab(['MISSION', 'SUCCESS'], 1390, 660, 196, { k: s.k, rot: -.06, seed: 6, screen: true });
      pawPrint(1812, 836, 104 * popIn(q - tSuc - .1, .12), .25, PAL.oxblood, { screen: true });
      strip(q); crackle(t - tCut, t);
    }
  }

  chapter('radio', barT(57), 178.1, [
    [barT(57), callsign], [barT(58), command], [barT(59), idCard], [barT(61), hydrants],
    [barT(62, 2), lineup], [barT(63, 2.5), base], [barT(65), title]
  ]);
})();
