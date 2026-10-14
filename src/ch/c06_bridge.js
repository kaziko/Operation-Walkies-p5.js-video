// c06_bridge.js: Bridge (bars 38-49). The war film's quiet scene: letterboxed dusk (violet, pink, sage), and
// Jun Jun sings the four lines straight to camera. The dusk street is what happens behind her and in the pauses.
// Then glory, then a snare build of flash-cuts back into the chorus.
(() => {
  const LB = 132;                                                  // letterbox bar height for the whole scene
  const SIL = { fur: PAL.ink, white: PAL.ink, dark: PAL.ink, grey: PAL.ink, ink: PAL.ink, pink: PAL.ink, mouth: PAL.ink, harness: PAL.ink, trim: PAL.ink, eye: PAL.ink, iris: PAL.ink, gold: PAL.ink };
  const coatOf = col => { const c = {}; for (const k in SIL) c[k] = col; return c; };
  const DUSK = mixCol(PAL.violet, PAL.ink, .55), SHADE = mixCol(PAL.sage, PAL.ink, .5), BINCOL = mixCol(PAL.violet, PAL.ink, .3);
  const HUD = ['OP. WALKIES // RETURN LEG', 'SECTOR 01: PAVEMENT (AGAIN)'];

  // ---------- private props ----------
  // The dusk street: violet sky, a low pink sun, a far roofline, sage ground. hy = horizon line.
  function dusk(sunX, sunY, sunR, hy, o = {}) {
    const k = o.k || 1, dx = o.dx || 0;
    bg(PAL.violet);
    circ2(sunX, sunY, sunR, PAL.pink);
    halftone(-600, hy - 320, W + 1200, 330, { cell: 22, col: PAL.pink, grad: [0, hy - 320, 0, hy + 60], max: .82 });
    const c = g2d(); c.fillStyle = DUSK; c.beginPath();
    for (let i = -4; i < 18; i++) {
      const x = i * 185 * k + dx + hash(i * 3.1) * 60, w = (120 + hash(i * 5.7) * 110) * k, h = (46 + hash(i * 7.3) * 92) * k;
      c.moveTo(x, hy + 4); c.lineTo(x, hy - h); if (hash(i * 9.9) > .35) c.lineTo(x + w / 2, hy - h - w * .3); c.lineTo(x + w, hy - h); c.lineTo(x + w, hy + 4); c.closePath();
      if (hash(i * 4.3) > .5) c.rect(x + w * .68, hy - h - w * .34, w * .13, w * .34);
    }
    c.fill();
    rect2(-600, hy, W + 1200, H + 400, PAL.sage);
    halftone(-600, hy + 30, W + 1200, H - hy + 300, { cell: 20, col: PAL.ink, grad: [0, hy + 60, 0, hy + 560], alpha: .5 });
  }
  function lamp(x, gy, h, rot = 0, col = PAL.ink) {
    const c = g2d(); c.save(); c.translate(x, gy); c.rotate(rot); c.fillStyle = col;
    c.fillRect(-9, -h, 18, h); c.fillRect(-22, -46, 44, 46); c.fillRect(-9, -h, 132, 14);
    c.beginPath(); c.moveTo(86, -h + 14); c.lineTo(136, -h + 14); c.lineTo(126, -h + 48); c.lineTo(96, -h + 48); c.closePath(); c.fill(); c.restore();
  }
  // The Commander as a one-colour silhouette, trudging: slouched, head hanging. Returns the lead hand.
  function trudge(x, y, u, ph, col) {
    const lean = .27, cl = Math.cos(lean), sl = Math.sin(lean), sw = clamp(u / 20, .5, 3), J = u * .03, a = Math.sin(ph * TAU) * .3, hipY = -14.8 * Math.cos(a) - .1;
    const Tp = (px, py) => [x + (px * cl - py * sl) * u, y + (hipY + px * sl + py * cl) * u];        // the leaning torso
    const Lp = (px, py) => [x + px * u, y + (hipY + py) * u];                                        // the legs
    const limb = (p, q, wa, wb) => { const dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d * u, ny = dx / d * u;
      paint([[p[0] + nx * wa + jit(J), p[1] + ny * wa + jit(J)], [q[0] + nx * wb, q[1] + ny * wb], [q[0] - nx * wb, q[1] - ny * wb], [p[0] - nx * wa + jit(J), p[1] - ny * wa + jit(J)]], { wash: col, ink: null }); };
    const go = (px, py, len, ang) => [px + Math.sin(ang) * len, py + Math.cos(ang) * len];
    const leg = (ang, knee) => { const kn = go(0, 0, 7.4, ang), ft = go(kn[0], kn[1], 7.4, ang - knee), toe = go(ft[0], ft[1], 2.6, ang - knee + 1.45); limb(Lp(0, 0), Lp(...kn), 1.7, 1.4); limb(Lp(...kn), Lp(...ft), 1.4, 1.1); limb(Lp(...ft), Lp(...toe), 1.2, 1.0); };
    const arm = ang => { const sh = [.2, -11.3], el = go(sh[0], sh[1], 5.6, ang * .8), hd = go(el[0], el[1], 5.6, ang * 1.15); limb(Tp(...sh), Tp(...el), 1.5, 1.2); limb(Tp(...el), Tp(...hd), 1.2, 1.0); paint(ellPts(...Tp(...hd), u * 1.1, u * 1.1, 10), { wash: col, ink: null }); return Tp(...hd); };
    arm(-.3 - a * .3); leg(-a, Math.max(0, -Math.cos(ph * TAU)) * .5); leg(a, Math.max(0, Math.cos(ph * TAU)) * .5);
    paint([Tp(-2.6, .6), Tp(2.6, .6), Tp(3.1, -12.4), Tp(.6, -13.6), Tp(-2.7, -12.2)].map(p => [p[0] + jit(J), p[1] + jit(J)]), { wash: col, ink: null });
    const hc = Tp(2.4, -15.8); paint(ellPts(hc[0], hc[1], 3.3 * u, 3.4 * u, 16, J), { wash: col, ink: null });
    paint([Tp(-1.5, -17.4), Tp(-.4, -20.0), Tp(2.2, -20.2), Tp(4.6, -18.9), Tp(2.2, -17.8)], { wash: col, ink: null });
    return arm(.45 + a * .15);
  }
  // A long shadow thrown toward the camera, away from the sun: the same drawing, mirrored, stretched and sheared.
  function castShadow(x, gy, sunX, drawFn, len = .75) { push(); translate(x, gy); shearX(Math.atan(clamp((x - sunX) / 520, -1.3, 1.3))); scale(1, -len); drawFn(); pop(); }
  function flutter(x, y, s, flap, rot = 0, col = PAL.paper) {
    const c = g2d(); c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col; c.strokeStyle = PAL.ink; c.lineWidth = s * .13; c.lineJoin = 'round'; c.lineCap = 'round';
    for (const sd of [1, -1]) { c.beginPath(); c.moveTo(0, 0); c.lineTo(sd * s * flap, -s * .9); c.lineTo(sd * s * 1.2 * flap, s * .05); c.lineTo(sd * s * .6 * flap, s * .62); c.closePath(); c.fill(); c.stroke(); }
    c.lineWidth = s * .2; c.beginPath(); c.moveTo(0, -s * .45); c.lineTo(0, s * .5); c.stroke(); c.restore();
  }
  // Leaves on the wind (2D): they cross [ax, ay, aw, ah] right to left and tumble.
  function leaves(t, n, o = {}) {
    const c = g2d(), [ax, ay, aw, ah] = o.area || [-100, 140, W + 200, 800], cols = o.cols || [PAL.pink, PAL.paper, PAL.sage], seed = o.seed || 0;
    for (let i = 0; i < n; i++) {
      const sp = (o.speed || 140) * (.6 + hash(i * 3.7 + seed)), x = ax + aw - ((hash(i * 1.9 + seed) * aw + t * sp) % aw + aw) % aw, y = ay + hash(i * 5.3 + seed) * ah + Math.sin(t * (1 + hash(i)) + i) * 36 + (o.fall || 0) * t * (.5 + hash(i * 2.9));
      const sz = (o.size || 24) * (.7 + hash(i * 7.1 + seed) * .7);
      c.save(); c.translate(x, ay + ((y - ay) % ah + ah) % ah); c.rotate(t * (1.2 + hash(i * 2.3) * 2) * (hash(i) > .5 ? 1 : -1) + i); c.scale(1, .3 + .7 * Math.abs(Math.sin(t * 2.6 + i)));
      c.beginPath(); c.moveTo(-sz, 0); c.quadraticCurveTo(0, -sz * .8, sz, 0); c.quadraticCurveTo(0, sz * .8, -sz, 0); c.fillStyle = cols[i % cols.length]; c.fill(); c.lineWidth = 4; c.strokeStyle = PAL.ink; c.lineJoin = 'round'; c.stroke(); c.restore();
    }
  }
  // A wheelie bin on its side, lid out, with what fell out of it. (x, y) = the ground under it, s = scale (1 ≈ 330 px long).
  function bin(x, y, s, rot = 0) {
    const sw = clamp(s * 1.7, .6, 3), P = pts => pts.map(p => [p[0] * s + jit(1.5 * s), p[1] * s + jit(1.5 * s)]);
    push(); translate(x, y); rotate(rot);
    paint(P([[160, -12], [352, -24], [356, -2], [160, 6]]), { wash: BINCOL, ink: PAL.ink, sw });
    paint(ellPts(-150 * s, -36 * s, 37 * s, 37 * s, 14), { wash: PAL.ink, ink: PAL.ink, sw }); paint(ellPts(-150 * s, -36 * s, 12 * s, 12 * s, 8), { wash: PAL.paper, ink: null });
    paint(P([[-150, -6], [-150, -150], [140, -178], [150, -2]]), { wash: BINCOL, ink: PAL.ink, sw });
    paint(P([[128, -188], [162, -190], [168, 4], [134, 4]]), { wash: BINCOL, ink: PAL.ink, sw });
    for (const yy of [-50, -102]) inkLine(P([[-138, yy], [122, yy - 7]]), sw * .45, PAL.ink, 'inkfine', 0);
    paint(P([[-70, -132], [-8, -138], [-4, -86], [-66, -82]]), { wash: PAL.paper, ink: PAL.ink, sw: sw * .5 }); inkLine(P([[-56, -124], [-22, -127], [-42, -94]]), sw * .6, PAL.ink, 'ink', 0);
    paint(ellPts(420 * s, -24 * s, 27 * s, 23 * s, 9, 4 * s), { wash: PAL.paper, ink: PAL.ink, sw: sw * .7 });
    paint(ellPts(486 * s, -15 * s, 17 * s, 15 * s, 8, 3 * s), { wash: PAL.paper, ink: PAL.ink, sw: sw * .6 });
    paint(P([[236, -26], [262, -78], [300, -92], [296, -70], [332, -66], [348, -24]]), { wash: PAL.pink, ink: PAL.ink, sw: sw * .8 });
    pop();
  }
  // The battlefield: the toppled bin and the Commander, wound in the lead. Returns the point where the lead leaves him.
  function wreck(x, gy, u, rock = 0) {
    bin(x, gy - 2.2 * u, u / 17, rock);
    const cx = x + 13 * u, cy = gy + 1.6 * u, sw = clamp(u / 20, .5, 3);
    commander(cx, cy, u, { pose: 'flat', face: 'dead' });
    for (let i = 0; i < 5; i++) {
      const lx = cx + (-9.5 + i * 4.7 + hash(i) * 1.2) * u, ly = cy - 1.7 * u, pts = rotPts(ellPts(lx, ly, .95 * u, (i < 2 ? 2.6 : 3.5) * u, 12, u * .06), .2 + hash(i * 3) * .35, lx, ly); pts.push(pts[0], pts[1]);
      inkLine(pts, sw * 1.5, PAL.ink, 'ink', .5); inkLine(pts, sw * .75, PAL.lime, 'ink', .5);
    }
    return [cx + 10.2 * u, cy - 4.6 * u];
  }
  function crownBig(x, y, u, rot = 0) {
    const S = pts => pts.map(p => [p[0] * u + jit(u * .02), p[1] * u + jit(u * .02)]);
    push(); translate(x, y); rotate(rot);
    paint(S([[-1.9, 0], [-2.2, -2.3], [-1.1, -1.25], [0, -2.9], [1.1, -1.25], [2.2, -2.3], [1.9, 0]]), { wash: PAL.lime, ink: PAL.ink, sw: 3.4 });
    paint(S([[-1.95, -.05], [1.95, -.05], [1.95, .55], [-1.95, .55]]), { wash: PAL.pink, ink: PAL.ink, sw: 3 });
    for (const [gx, gy] of [[-2.2, -2.3], [0, -2.9], [2.2, -2.3]]) paint(ellPts(gx * u, gy * u, u * .3, u * .3, 10), { wash: PAL.pink, ink: PAL.ink, sw: 2.4 });
    pop();
  }
  function heart(x, y, s, rot, col) {
    if (s <= 0) return; const c = g2d(); c.save(); c.translate(x, y); c.rotate(rot); c.beginPath(); c.moveTo(0, s * .9);
    c.bezierCurveTo(-s * 1.5, -s * .1, -s * .7, -s * 1.1, 0, -s * .35); c.bezierCurveTo(s * .7, -s * 1.1, s * 1.5, -s * .1, 0, s * .9);
    c.fillStyle = col; c.fill(); c.lineWidth = Math.max(5, s * .1); c.lineJoin = 'round'; c.strokeStyle = PAL.ink; c.stroke(); c.restore();
  }
  // The sung words, hand-lettered in the lower bar: each lands as it is sung. ws = [[word, time, colour]].
  function sung(t, ws, o = {}) {
    const size = o.size || 70, y = o.y ?? H - LB / 2;
    ws.reduce((x, [w, tw, col], i) => {
      const a = t - tw;
      if (a > 0) type(w, x, y + (hash(i * 3.3 + tw) - .5) * 10, size, { font: 'hand', col: col || PAL.paper, align: 'left', k: popIn(a, .12), rot: (hash(i * 1.7 + tw) - .5) * .05, wear: 0, screen: true });
      return x + typeW(w, size, { font: 'hand' }) + size * .42;
    }, o.x ?? 96);
  }
  const blinks = (t, ...ts) => ts.reduce((p, b) => Math.max(p, t > b && t < b + .17 ? Math.sin((t - b) / .17 * Math.PI) : 0), 0);   // her rare blinks, placed by hand
  const bars = () => { letterbox(1, PAL.ink, LB); hud(HUD, { corner: 'tl', col: PAL.paper, size: 22 }); };

  // ---------- bar 38 · (pause after "Sometimes…") · the walk home, in silhouette ----------
  function homeward(t, lt, dur) {
    const u = 18, GY = 800, k = lt / dur, ph = .15 + lt / (BEAT * 2), dogX = 790 + (ph - .15) * 7.74 * u * 1.1, manX = dogX - 18.5 * u, phM = ph * .49, sunX = 1130;
    camBegin(lerp(930, 1000, k), lerp(548, 540, k), lerp(1, 1.06, k), 0);
    dusk(sunX, 640, 370, 700);
    lamp(1620, GY - 34, 560);
    castShadow(manX, GY, sunX, () => trudge(0, 0, u, phM, SHADE));
    castShadow(dogX, GY, sunX, () => junjunSide(0, 0, u, { coat: coatOf(SHADE), walk: ph, shadow: false }));
    const hand = trudge(manX, GY, u, phM, PAL.ink);
    junjunSide(dogX, GY, u, { coat: { ...SIL, trim: PAL.lime }, walk: ph, shadow: false, leash: hand, slack: .2 });
    flutter(dogX + 15 * u + Math.sin(t * 1.7) * 70, GY - 21 * u + Math.sin(t * 2.6) * 46, 28, Math.abs(Math.sin(t * 17)), Math.sin(t * 2) * .3);
    camEnd();
    bars();
    sung(t, [['SOMETIMES...', barT(38) + .12]]);
  }

  // ---------- bars 39-41 · "we make it back / without fire. / Sometimes…" · she sings it to camera ----------
  function singHome(t, lt, dur) {
    const s = sing(t), k = ease(lt / dur), u = 43, hx = 1200, hy = 520, tLand = 109.55, tBack = 110.08, land = [hx + .7 * u, hy - 5.15 * u];
    const gaze = t < tBack ? easeOut(seg(t, 109.0, 109.3)) : 1 - easeOut5((t - tBack) / .1);        // she looks up at it, once
    camBegin(lerp(960, 1060, k), lerp(540, 522, k), lerp(1, 1.14, k), 0);
    dusk(500, 620, 340, 745, { k: .8 });
    const mx = 500, my = 925, um = 12.5;
    paint(ellPts(mx, my + 2, 6 * um, .7 * um, 14), { wash: SHADE, ink: null });
    const hand = trudge(mx, my, um, lt / 2.9, PAL.ink), e = [hx - 5.6 * u, hy + 6.4 * u], lead = [hand, [(hand[0] + e[0]) / 2, (hand[1] + e[1]) / 2 + 70], e];
    inkLine(lead, 2.3, PAL.ink, 'ink', .7); inkLine(lead, 1.15, PAL.lime, 'ink', .7);
    junjunBust(hx, hy, u, { ...EXPR.royal, mouth: 'sing', open: s.open, round: s.round, look: [0, -gaze * .95], lid: Math.max(.45 - gaze * .33, blinks(t, 106.2, 108.85, 111.9)), brow: .2 + s.open * .06 - gaze * .25, browY: gaze * .22, tilt: -.022 * ease(seg(t, 110.25, 110.6)) });
    // the butterfly from the walk: it lands on her head in the pause, and stays
    const fly = 1 - seg(t, 108.9, tLand), bp0 = kf(t, [[105.6, [800, 330]], [108.3, [890, 255]], [tLand, land]]);
    flutter(bp0[0] + Math.sin(t * 1.9) * 55 * fly, bp0[1] + Math.sin(t * 2.7 + 1) * 40 * fly, 34, fly > 0 ? Math.abs(Math.sin(t * 17)) : .3 + .7 * Math.abs(Math.sin(t * 2.4)), Math.sin(t * 2) * .3 * fly);
    if (t > tLand + .15) label(typed('BUTTERFLY: PERMITTED', t - tLand - .15, 34), hx + 7.6 * u, hy - 7.7 * u, { size: 25, col: PAL.ink, bg: PAL.paper, pad: 12 });
    camEnd();
    const fa = t - 110.98; if (fa > 0) label([typed('BARKS FIRED: 0', fa, 30), typed('BINS LOST: 0', fa - .55, 30)], 96, 186, { size: 29, col: PAL.ink, bg: PAL.paper, pad: 15, screen: true });
    bars();
    if (t < 112.5) sung(t, [['SOMETIMES...', 0], ['WE', 106.83], ['MAKE', 107.22], ['IT', 107.56], ['BACK', 107.81], ['WITHOUT', 110.22], ['FIRE.', 110.91, PAL.pink]], { size: 66 });
    else sung(t, [['SOMETIMES...', 113.20]]);
  }

  // ---------- bar 42 · (pause) · the same street, after ----------
  function aftermath(t, lt, dur) {
    const u = 17, GY = 800, k = lt / dur, sunX = 1130, yb = [113.95, 114.28, 114.95, 115.28, 115.6].reduce((p, ty) => Math.max(p, hit(t, ty, 9)), 0);
    camBegin(lerp(1000, 1030, k), 540, lerp(1.06, 1.1, k), 0);
    dusk(sunX, 640, 370, 700);
    lamp(1265, GY - 34, 520, .24);
    yorkie(250, 716, 6.5, { bark: yb, hop: yb * .8 });
    if (yb > .25) type('YIP!', 300, 630, 46, { font: 'hand', col: PAL.paper, rot: -.12, k: 1 + yb * .2, wear: 0 });
    castShadow(1590, GY, sunX, () => junjunSide(0, 0, 19, { coat: coatOf(SHADE), shadow: false }));
    const knot = wreck(590, GY, u, .05 * Math.exp(-lt * 3) * Math.cos(lt * 16));
    junjunSide(1590, GY, 19, { ...EXPR.royal, look: [.6, -.3], lid: Math.max(.42, blinks(t, 115.2)), head: { rot: -.05 }, shadow: false, leash: knot, slack: .1 });
    leaves(t, 12, { area: [-100, 150, W + 300, 640], speed: 90, fall: 26, seed: 3 });
    const la = lt - .5; if (la > 0) label(typed('CASUALTIES: 1 (BIN)', la, 30), 440, 500, { size: 27, col: PAL.ink, bg: PAL.paper, pad: 14 });
    camEnd();
    bars();
    sung(t, [['SOMETIMES...', 0]]);
  }

  // ---------- bar 43 · "the street is battlefield." · sung to camera, the battlefield behind her ----------
  function singStreet(t, lt, dur) {
    const s = sing(t), k = lt / dur, u = 50, hx = 740, hy = 520, hard = ease(seg(t, 117.9, 118.15));
    camBegin(lerp(960, 930, k), lerp(540, 528, k), lerp(1, 1.07, k), 0);
    dusk(1400, 610, 310, 745, { k: .8, dx: 40 });
    yorkie(1700, 760, 5, { flip: true, bark: pulse2(t, 8), hop: pulse2(t, 8) * .6 });
    const knot = wreck(1200, 845, 11.5), e = [hx + 5.6 * u, hy + 6.6 * u], lead = [knot, [(knot[0] + e[0]) / 2, (knot[1] + e[1]) / 2 + 50], e];
    inkLine(lead, 2.5, PAL.ink, 'ink', .7); inkLine(lead, 1.25, PAL.lime, 'ink', .7);
    leaves(t, 9, { area: [900, 150, 1200, 620], speed: 110, fall: 20, seed: 8 });
    junjunBust(hx, hy, u, { ...EXPR.royal, mouth: 'sing', open: s.open, round: s.round, look: [0, 0], lid: Math.max(.45 - hard * .1, blinks(t, 116.3, 118.5)), brow: .2 + hard * .35 });
    camEnd();
    const la = t - 117.0; if (la > 0) label(typed('PRINCESS: UNTOUCHED', la, 32), 1250, 186, { size: 27, col: PAL.ink, bg: PAL.paper, pad: 14, screen: true });
    bars();
    sung(t, [['SOMETIMES...', 0], ['THE', 117.01], ['STREET', 117.16], ['IS', 117.50], ['BATTLEFIELD.', 117.81, PAL.pink]]);
  }

  // ---------- bars 44-45 · "But every mission… every walk…" · wind, eyes shut; she turns and sings ----------
  function mission(t, lt, dur) {
    const s = sing(t), k = lt / dur, u = 66, px = 1010, py = 530, x = px - 7.5 * u, y = py + 17.5 * u, tTurn = barT(44, 2) - .12, front = t >= tTurn;
    const shut = front ? Math.max(ease(seg(t, 121.95, 122.5)) * (1 - easeOut(seg(t, 123.08, 123.22))), blinks(t, 120.05)) : 1;
    bg(PAL.violet);
    camBegin(lerp(960, 985, k), lerp(540, 530, k), lerp(1, 1.1, k), 0);
    circ2(px + 60, py + 40, 480, PAL.pink);
    halftone(-200, -100, W + 400, H + 200, { cell: 24, col: PAL.ink, radial: [px + 60, py + 40, 640, 1300], alpha: .45 });
    streaks({ col: PAL.paper, n: 13, drift: -lt * 1100, th: [3, 9], len: [260, 880], area: [-300, 150, W + 600, 790], seed: 5 });
    leaves(t, 6, { area: [-100, 160, W + 200, 760], speed: 520, size: 30, seed: 5 });
    junjunSide(x, y, u, front
      ? { ...EXPR.royal, face: 'front', mouth: 'sing', open: s.open, round: s.round, look: [0, 0], lid: lerp(.45, 1, shut), brow: .25, ear: .04, head: { rot: .04 * (1 - elasticOut((t - tTurn) / .4)) }, shadow: false }
      : { ...EXPR.shut, face: 'side', ear: .16 + Math.sin(t * 9) * .03, head: { rot: -.03 }, shadow: false });
    // wind in the fur: loose strokes streaming off the back of her neck
    for (let i = 0; i < 6; i++) { const f = Math.floor(t * 8), wx = px - (5.2 + hash(i * 3.1) * 2.6) * u, wy = py + (-2.2 + i * 1.5) * u, L = (2.2 + hash(i + f * 7.3) * 2.2) * u;
      inkLine([[wx, wy], [wx - L * .5, wy + Math.sin(t * 6 + i) * 14 - 10], [wx - L, wy + Math.sin(t * 6 + i + 1) * 20]], 1.5, PAL.paper, 'ink', .6); }
    camEnd();
    const la = lt - .45; if (la > 0) label(typed('WIND: 3 KT (DRAMATIC)', la, 32), 1330, 186, { size: 27, col: PAL.ink, bg: PAL.paper, pad: 14, screen: true });
    bars();
    sung(t, [['BUT', 120.96], ['EVERY', 121.08], ['MISSION...', 121.46], ['EVERY', 123.42], ['WALK...', 123.85, PAL.pink]]);
  }

  // ---------- bars 46-47 (+1 beat) · "Is a step closer to glory." · the monument: rays, pigeons, GLORY, 栄光 ----------
  function glory(t, lt, dur) {
    const s = sing(t), u = 42, hx = 960, hy = 735, tHit = 129.08, tStab = barT(48), hot = t >= tStab;
    const pull = ease(seg(lt, 0, 2.4)), z = lerp(1.5, 1.03, pull) - .03 * seg(t, 126.5, tStab) + .04 * hit(t, tHit, 7) + .05 * hit(t, tStab, 7);
    const [sx, sy] = shakeXY(t, hit(t, tHit, 9) * 9 + hit(t, tStab, 8) * 24);
    const sky = hot ? PAL.ink : PAL.violet, word = hot ? PAL.lime : PAL.paper;
    const wide = clamp(seg(t, 128.74, 128.86) * (1 - seg(t, 129.7, 129.9)));                        // "glo-o-ry": the mouth opens wide and holds
    bg(sky);
    camBegin(960 + sx, lerp(hy - 30, 540, pull) + sy, z, 0);
    sunburst(960, 640, { n: 18, col: hot ? PAL.orange : PAL.pink, rot: t * .05 });
    halftone(-500, -300, W + 1000, H + 600, { cell: 24, col: sky, radial: [960, 640, 760, 1400], alpha: .8 });
    const rise = ease(seg(t, 124.9, 128.3));
    type('GLORY', 892, 328 + (1 - rise) * 820, fitSize('GLORY', 1350), { col: word, k: 1 + .05 * hit(t, tHit, 9), shadow: { col: hot ? PAL.oxblood : PAL.ink, dx: .025, dy: .03 }, seed: 4, wear: .3 });
    poly2([[-600, 1500], [-600, 868], [120, 858], [470, 822], [700, 770], [1220, 770], [1450, 822], [1800, 858], [2520, 868], [2520, 1500]], hot ? PAL.paper : PAL.sage, { stroke: PAL.ink, lw: 9, join: 'round' });
    halftone(-600, 860, W + 1200, 500, { cell: 20, col: PAL.ink, grad: [0, 880, 0, 1300], alpha: .5 });
    // the choir
    [[190, 846, 0], [335, 832, 0], [478, 808, 0], [1450, 808, 1], [1585, 828, 1]].forEach(([bx, by, fl], i) => crow(bx, by, 15, { col: PAL.furGrey, caw: .55 + .4 * Math.sin(t * 5 + i * 1.3), flip: !!fl }));
    const ka = t - tHit;
    if (ka > 0) { const kk = popIn(ka, .14); circ2(1735, 668, 120 * kk, hot ? PAL.lime : PAL.pink, { stroke: PAL.ink, lw: 9 }); type('栄光', 1735, 668, 104 * kk, { font: 'jp', col: PAL.ink, rot: .06, wear: 0 }); }
    junjunBust(hx, hy, u, { ...EXPR.royal, mouth: 'sing', open: Math.max(s.open, wide * (.86 + .1 * Math.sin(t * 30))), round: wide ? .55 : s.round, look: [0, 0], lid: Math.max(.42 - wide * .14, blinks(t, 125.12)), brow: .15 + wide * .2, crown: seg(t, tHit, tHit + .22), coat: hot ? { ...JJ_COAT, gold: PAL.paper } : JJ_COAT });
    camEnd();
    if (hot) flash(1 - (t - tStab) / .08, PAL.white);
    const lb = hot ? 1 - easeOut((t - tStab) / .12) : 1, bh = lerp(LB, 84, easeOut(seg(lt, 0, .4)));
    letterbox(lb, PAL.ink, bh);
    if (!hot) sung(t, t < 125.3 ? [['EVERY', 0], ['WALK...', 0, PAL.pink]] : [['IS', 126.06], ['A', 126.27], ['STEP', 126.62], ['CLOSER', 127.98], ['TO', 128.52]], { y: H - bh / 2, size: 54 });
  }

  // ---------- bars 48-49 · the snare build · one hard image per stab, faster and faster ----------
  const IMG = [
    v => { bg(v ? PAL.ink : PAL.orange); speedLines(960, 520, { n: 80, r0: 720, r1: 1700, col: v ? PAL.orange : PAL.ink, boil: true, boilRate: 12, w: [.004, .03] }); junjunBust(960, 612, 122, { ...EXPR.stare, brow: .85, look: [0, 0], mono: !!v }); },
    v => { bg(v ? PAL.paper : PAL.ink); halftone(0, 0, W, H, { cell: 26, col: PAL.orange, radial: [960, 560, 430, 1100] }); pawPrint(960, 600, 880, -.2, v ? PAL.ink : PAL.paper); },
    v => { const a = v ? PAL.lime : PAL.ink, b = v ? PAL.ink : PAL.lime; bg(a); streaks({ ang: -.224, col: v ? PAL.paper : PAL.violet, n: 12, th: [4, 12], len: [300, 900], seed: 9 });
      poly2([[-80, 742], [2000, 268], [2000, 304], [-80, 778]], b); circ2(1440, 414, 74, null, { stroke: b, lw: 30 }); circ2(1440, 414, 74, null, { stroke: a, lw: 8 }); },
    v => { bg(v ? PAL.orange : PAL.paper); sunburst(960, 600, { n: 14, col: v ? PAL.paper : PAL.orange, alpha: v ? .3 : 1 }); hydrant(960, 1012, 80, {}); },
    v => { bg(v ? PAL.violet : PAL.pink); burst(960, 600, 360, 700, { n: 16, col: v ? PAL.pink : PAL.paper, seed: 4 }); crownBig(960, 800, 150, -.06); },
    v => { bg(v ? PAL.blue : PAL.lime); halftone(0, 0, W, H, { cell: 26, col: PAL.ink, grad: [0, 500, 0, 1300], alpha: .6 }); yorkie(880, 980, 66, { bark: 1, hop: .5 }); }
  ];
  const CUTS = (() => {
    const L = [[1, 0], [2, 1], [3, 2], [3.5, 3], [4, 4], [4.5, 5]];                                  // beats, then eighths
    for (let i = 0; i < 4; i++) L.push([5 + i / 4, i, 1]);                                           // sixteenths
    for (let i = 0; i < 8; i++) L.push([6 + i / 8, (i + 4) % 6, i % 2]);                             // the roll
    return L.map(([b, im, v]) => [barT(48, b), im, v || 0]);
  })();
  function stabs(t) {
    let i = 0; while (i + 1 < CUTS.length && t >= CUTS[i + 1][0]) i++;
    const [t0, im, v] = CUTS[i], a = t - t0;
    camBegin(960, 540, 1 + .1 * Math.exp(-a * 16), (hash(i * 5.1) - .5) * .05);
    IMG[im](v);
    camEnd();
    label(`BISCUITS IN ${Math.max(0, barT(50) - t).toFixed(2)} S`, W - 70, H - 96, { size: 38, col: PAL.ink, bg: PAL.lime, align: 'right', screen: true, pad: 16 });
  }

  // ---------- "I love" · the pickup: one soft card, and she sings into the wipe ----------
  function iLove(t, lt, dur) {
    const s = sing(t), sl = slam(lt, .08), [sx, sy] = shakeXY(t, sl.shake * 18), tLove = 134.40;
    bg(PAL.pink);
    camBegin(960 + sx, 540 + sy, 1.1 - .1 * easeOut(lt / .25), 0);
    sunburst(960, 600, { n: 16, col: PAL.paper, alpha: .55, rot: t * .1 });
    type('I', 285, 440, 430, { font: 'hand', col: PAL.ink, k: popIn(lt, .12), rot: -.06, wear: .15 });
    if (t > tLove) type('LOVE', 1600, 440, 196, { font: 'hand', col: PAL.oxblood, k: popIn(t - tLove, .1), rot: .06, wear: .15 });
    heart(300, 800, 70 * popIn(lt - .12, .16), -.2, PAL.oxblood); heart(1640, 760, 96 * popIn(lt - .2, .16), .16, PAL.orange);
    junjunBust(960, 580, 58, { ...EXPR.royal, lid: .4, mouth: 'sing', open: s.open, round: s.round, look: [0, 0], crown: 1 });
    camEnd();
  }

  chapter('bridge', barT(38), barT(50), [
    [barT(38), homeward], [barT(39), singHome], [barT(42), aftermath], [barT(43), singStreet], [barT(44), mission],
    [barT(46), glory], [barT(48, 1), stabs], [133.93, iLove]
  ]);
})();
