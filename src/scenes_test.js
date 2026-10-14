// scenes_test.js: standalone scenes for checking the visual system (render with --scene=name).
//   brushes   every brush at several weights, plus wash / order / concave checks
//   poses     Jun Jun pose and expression sheet
//   style     the small style test: Jun Jun, hero type, speed lines, dry brush, and a camera push (t = 0..4)
//   fx        one frame per signature effect (t = 0..7)

SCENES.brushes = t => {
  bg(PAL.paper);
  const names = ['ink', 'inkfine', 'rough', 'dry', 'marker', 'charcoal', '2B', 'pen', 'cpencil', 'spray'];
  names.forEach((n, i) => {
    const y = 70 + i * 62;
    label(n, 30, y - 12, { size: 20 });
    [.5, 1, 2, 4].forEach((w, j) => inkLine([[190 + j * 300, y + 10], [330 + j * 300, y - 16], [440 + j * 300, y + 8]], w, PAL.ink, n, .5));
  });
  // painter's order: orange wash, ink stroke over it, blue wash over the stroke, 2D text between
  paint(rectPts(1420, 60, 300, 200), { wash: PAL.orange, ink: PAL.ink, sw: 2 });
  inkLine([[1380, 160], [1760, 160]], 3, PAL.ink, 'ink', 0);
  type('2D', 1570, 200, 150, { col: PAL.lime });
  paint(rectPts(1520, 120, 300, 200), { wash: PAL.blue, ink: PAL.ink, sw: 2 });
  // concave wash
  paint(burstPts(1560, 520, 90, 190, 12, 4), { wash: PAL.violet, ink: PAL.ink, sw: 1.5 });
  // scaled transform: do strokes scale?
  push(); translate(1500, 760); scale(2.5); paint(rectPts(0, 0, 80, 60), { wash: PAL.sage, ink: PAL.ink, sw: 1 }); pop();
  paint(rectPts(1720, 760, 80, 60), { wash: PAL.sage, ink: PAL.ink, sw: 1 });
  dryStroke(120, 800, 1250, 760, 150, PAL.orange, { seed: 4 });
  dryStroke(160, 960, 1100, 990, 90, PAL.ink, { seed: 9 });
};

SCENES.poses = t => {
  bg(t >= 1 ? PAL.orange : PAL.paper);
  const ex = ['neutral', 'judge', 'sideEye', 'stare', 'deadpan', 'inspect', 'smug', 'rage', 'bark', 'royal', 'shut', 'pant'];
  if (t < 1) {
    ex.forEach((n, i) => {
      const x = 190 + (i % 6) * 308, y = 250 + Math.floor(i / 6) * 520;
      junjunBust(x, y, 19, { ...EXPR[n], crown: n === 'royal' ? 1 : 0 });
      label(n.toUpperCase(), x, y + 250, { size: 22, align: 'center', bg: PAL.ink, col: PAL.paper });
    });
  } else if (t < 2) {
    junjunSit(330, 1010, 26, { ...EXPR.royal, crown: 1 });
    junjunSide(980, 1000, 26, { ...EXPR.neutral });
    junjunSide(1560, 1000, 26, { ...EXPR.judge, face: 'front', leash: [1250, 380] });
  } else if (t < 3) {
    for (let i = 0; i < 4; i++) junjunSide(280 + i * 460, 520, 17, { ...EXPR.neutral, walk: i / 8 });
    for (let i = 0; i < 4; i++) junjunSide(280 + i * 460, 1010, 17, { ...EXPR.neutral, walk: .5 + i / 8 });
  } else if (t >= 4) {
    yorkie(400, 800, 60, {}); yorkie(1150, 800, 60, { bark: 1, hop: .6, flip: true }); yorkie(1650, 500, 22, { scared: 1 }); biscuit(1600, 850, 300, -.3);
  } else {
    junjunBust(520, 520, 52, { ...EXPR.judge, turn: .8, look: [.9, 0] });
    junjunBust(1400, 520, 52, { ...EXPR.rage });
  }
};

SCENES.style = t => {
  const k = seg(t, 0, 4), z = lerp(1, 1.5, easeOut(k)), [sx, sy] = shakeXY(t, hit(t, 2.5, 6) * 26);
  bg(PAL.orange);
  camBegin(W / 2 + lerp(0, 120, k) + sx, H / 2 - lerp(0, 70, k) + sy, z, lerp(0, -.02, k));
  sunburst(1180, 470, { n: 14, col: rgba(PAL.paper, .16), rot: t * .1 });
  halftone(0, 620, W, 460, { cell: 22, col: PAL.ink, grad: [0, 640, 0, 1150], alpha: .5 });
  dryStroke(-80, 880, 2000, 840, 210, PAL.ink, { seed: 3, p: easeOut(seg(t, .1, .8)) });
  const s = slam(t - .5);
  type('STARE', 760, 430, 720, { col: PAL.paper, k: s.k, alpha: s.alpha, rot: -.04, shadow: { col: PAL.ink, dx: .018, dy: .022 } });
  type('ジーッ', 1560, 250, 150, { font: 'jp', col: PAL.ink, rot: .1, alpha: seg(t, 1.2, 1.4) });
  if (t > 2.5) speedLines(1180, 470, { n: 80, r0: 480, col: PAL.ink, boil: true });
  junjunSit(1180, 1040, 30, { ...EXPR.judge, look: [lerp(-.8, .8, ease(seg(t, 1, 2.4))), 0], lid: Math.max(.5, blink(t, 1)) });
  if (t > 2.5) vibLines(1180, 470, 250, 250, 1, { n: 12 });
  type('no bark.', 420, 820, 130, { font: 'hand', col: PAL.lime, rot: -.07, alpha: seg(t, 1.6, 1.75) });
  camEnd();
  hud(['SUBJECT UNDER REVIEW', 'THREAT LEVEL: AKITA'], { corner: 'tl', col: PAL.ink });
  stamp('DENIED', 1560, 900, { k: popIn(t - 3), size: 96 });
};

SCENES.fx = t => {
  const i = Math.floor(t), lt = t - i;
  if (i === 0) { impactFrame(W / 2, H / 2, lt); junjunBust(W / 2, 520, 44, { ...EXPR.rage, mono: true }); type('WAR', W / 2, 870, 330, { col: PAL.white, stroke: PAL.ink, strokeW: .08 }); }
  else if (i === 1) { bg(PAL.orange); stareLines(W / 2, 480, lt); junjunBust(W / 2, 520, 44, { ...EXPR.stare }); }
  else if (i === 2) { bg(PAL.ink); flames(W / 2, 1080, 1500, 900, lt); rageAura(W / 2, 480, 420, lt); junjunBust(W / 2, 520, 40, { ...EXPR.rage }); vibLines(W / 2, 480, 330, 330, lt, { n: 14 }); }
  else if (i === 3) { bg(PAL.blue); type('PATROL', W / 2, H / 2, 560, { col: PAL.paper }); brushWipe(lt, { cols: [PAL.ink, PAL.orange] }); }
  else if (i === 4) { bg(PAL.ink); streaks({ col: PAL.orange, n: 60, drift: lt * 2600 }); junjunSide(900, 960, 30, { ...EXPR.judge, walk: lt * 2 }); }
  else if (i === 5) { bg(PAL.paper); dossier(180, 160, 'FILE 07 // YORKIE', ['HEIGHT: 23 CM', 'VOLUME: UNACCEPTABLE', 'STATUS: UNDER REVIEW'], lt * 3); reticle(1300, 520, 200, { k: lt * 2, col: PAL.oxblood }); splat(1300, 520, 120, { k: easeOut(lt * 2), col: PAL.ink }); stamp('UNACCEPTABLE', 1300, 880, { k: popIn(lt - .5) }); }
  else { bg(PAL.lime); type('PRINCESS', W / 2, 330, 400, { col: PAL.ink, per: (j, n) => ({ dy: Math.sin(t * 6 + j) * .03, rot: Math.sin(t * 5 + j * 2) * .03 }) }); type('JUNJUN', W / 2, 760, 460, { col: PAL.orange, stroke: PAL.ink, strokeW: .03, shadow: { col: PAL.ink } }); slashWipe(lt, PAL.ink); }
};

SCENES.xf = t => {
  bg(PAL.paper);
  const i = Math.floor(t);
  const W1 = (pts, col) => { brush.noStroke(); brush.noFill(); brush.noHatch(); brush.wash(col, 255); brush.polygon(pts); brush.noWash(); };
  const S1 = (pts) => { brush.noWash(); brush.noFill(); brush.noHatch(); brush.set('ink', PAL.ink, 1); brush.beginShape(0); for (const p of pts) brush.vertex(p[0], p[1]); brush.endShape(true); };
  if (i === 0) { push(); translate(300, 200); scale(2.5); W1(rectPts(0, 0, 80, 60), PAL.sage); pop(); }
  if (i === 1) { push(); translate(300, 200); scale(2.5); S1(rectPts(0, 0, 80, 60)); pop(); }
  if (i === 2) { push(); translate(300, 200); scale(2.5); W1(rectPts(0, 0, 80, 60), PAL.sage); pop(); W1(rectPts(700, 200, 80, 60), PAL.orange); }
  if (i === 3) { push(); translate(300, 200); scale(2.5); W1(rectPts(0, 0, 80, 60), PAL.sage); S1(rectPts(0, 0, 80, 60)); pop(); W1(rectPts(700, 200, 80, 60), PAL.orange); S1(rectPts(700, 200, 80, 60)); }
  if (i === 4) { W1(rectPts(100, 100, 80, 60), PAL.blue); push(); translate(300, 200); rotate(.4); W1(rectPts(0, 0, 200, 100), PAL.sage); pop(); W1(rectPts(700, 200, 80, 60), PAL.orange); W1(rectPts(1000, 200, 80, 60), PAL.violet); }
  if (i === 5) { flush2D(); W1(rectPts(100, 100, 80, 60), PAL.blue); push(); translate(300, 200); rotate(.4); W1(rectPts(0, 0, 200, 100), PAL.sage); pop(); W1(rectPts(700, 200, 80, 60), PAL.orange); W1(rectPts(1000, 200, 80, 60), PAL.violet); }
};

SCENES.cast = t => {
  bg(t < 1 ? PAL.orange : PAL.paper);
  if (t < 1) {
    const h1 = commander(260, 1000, 24, { pose: 'walk', walk: .1 }); junjunSide(700, 1000, 24, { ...EXPR.neutral, walk: .2, leash: h1 });
    commander(1150, 1000, 24, { pose: 'stand', face: 'panic', shadow: true });
    commander(1600, 1000, 24, { pose: 'slump', face: 'dead' });
  } else if (t < 2) {
    const h = commander(520, 560, 24, { pose: 'dragged', face: 'panic' }); junjunSide(1400, 1000, 24, { ...EXPR.judge, walk: .3, leash: h, slack: 0, lean: .06 });
    commander(600, 1010, 24, { pose: 'flat', face: 'dead' });
  } else {
    squirrel(220, 500, 34, { run: .25 }); squirrel(520, 500, 34, {}); cat(900, 520, 34, {}); cat(1250, 520, 34, { col: PAL.violet, ink: PAL.ink });
    crow(1600, 420, 40, { caw: 1, cap: true }); crow(1650, 160, 30, { flap: .2 });
    hydrant(300, 1010, 34); pup(760, 1010, 40, { puff: 1 }); pup(1200, 1010, 40, { tuck: 1, face: 'scared' }); yorkie(1650, 1010, 40, { bark: 1 });
  }
};

// lip-sync check: t is song time (try the bridge, 102-130 s)
SCENES.sing = t => { bg(PAL.violet); const s = sing(t); junjunBust(700, 470, 60, { ...EXPR.royal, mouth: 'sing', open: s.open, round: s.round }); junjunSide(1450, 900, 24, { ...EXPR.royal, mouth: 'sing', open: s.open, round: s.round, shadow: false });
  label('open ' + s.open.toFixed(2) + '  round ' + s.round.toFixed(2), 60, 60, { size: 30, col: PAL.paper }); };
