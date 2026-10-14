// type.js: the typography system. Three levels, three faces (plus one Japanese display face for graphic kanji):
//   hero   Anton              oversized condensed words that own the frame
//   hand   Permanent Marker   rough hand-lettered accents and rhythmic words
//   mono   IBM Plex Mono      small technical annotations (labels, stamps, dossier notes)
//   jp     Dela Gothic One    kanji / katakana used as graphic objects and manga sound effects
// All type is drawn on the 2D layer, so it sits in the scene's painter's order: draw it before a character and the
// character stands in front of the word.
const FONT = { hero: '"Anton"', hand: '"Permanent Marker"', mono: '"IBM Plex Mono"', jp: '"Dela Gothic One"' };
const JP_GLYPHS = '戦争散歩秋田犬姫警戒任務完了出撃敵発見巡回中縄張明日再栄光作戦睨朝匂女王様無言圧力確保帰還大成功絶対許御意見参上' +
  'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだでどばびぶべぼっゃゅょ' +
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポァィゥェォッャュョー・！？';
const CAP = {};
let wearPat = null;

async function loadFonts() {
  await Promise.all([
    document.fonts.load('100px "Anton"', 'WAR'), document.fonts.load('100px "Permanent Marker"', 'WAR'),
    document.fonts.load('500 30px "IBM Plex Mono"', 'WAR'), document.fonts.load('700 30px "IBM Plex Mono"', 'WAR'),
    document.fonts.load('100px "Dela Gothic One"', JP_GLYPHS)
  ]);
}
function initType() {
  const c = scratchX;
  for (const k in FONT) { c.font = `${k === 'mono' ? 700 : 400} 100px ${FONT[k]}`; CAP[k] = c.measureText(k === 'jp' ? '戦' : 'H').actualBoundingBoxAscent / 100; }
  // print wear: specks and dry streaks that get knocked out of the lettering
  const cv = document.createElement('canvas'); cv.width = cv.height = 512; const w = cv.getContext('2d'), rnd = lcg(91);
  w.fillStyle = '#000';
  for (let i = 0; i < 330; i++) { const x = rnd() * 512, y = rnd() * 512, r = .4 + rnd() * rnd() * rnd() * 5; w.beginPath(); w.ellipse(x, y, r, r * (.4 + rnd() * .8), rnd() * 3, 0, TAU); w.fill(); }
  for (let i = 0; i < 9; i++) {
    const y = rnd() * 512, x0 = rnd() * 512, l = 30 + rnd() * 120; w.lineWidth = .5 + rnd() * 1.2;
    for (let x = x0; x < x0 + l; x += 5 + rnd() * 16) { w.beginPath(); w.moveTo(x % 512, y + rnd() * 1.5); w.lineTo((x % 512) + 3 + rnd() * 12, y + rnd() * 1.5); w.stroke(); }
  }
  wearPat = c.createPattern(cv, 'repeat');
}
const fontStr = (o, size) => `${o.weight || (o.font === 'mono' ? 700 : 400)} ${size}px ${FONT[o.font || 'hero']}`;
function typeW(txt, size, o = {}) {
  const c = scratchX; c.font = fontStr(o, 100);
  return (c.measureText(txt).width + (o.track || 0) * 100 * Math.max(0, txt.length - 1)) * size / 100 * (o.sx ?? 1);
}
const fitSize = (txt, width, o = {}) => width / typeW(txt, 1, o);     // font size that makes txt span `width`
const capH = (size, font = 'hero') => CAP[font] * size;

// type(txt, x, y, size, o): draw a word. (x, y) is the anchor: horizontally by o.align, vertically the middle of
// the cap height (o.base: 'middle' | 'bottom' = baseline | 'top').
//   col, font, align, rot, sx, sy (stretch), skew, k (overall scale about the anchor), alpha, track (em),
//   stroke + strokeW (outline, fraction of size), shadow {col, dx, dy} (hard offset block, fractions of size),
//   wear 0..1 (print imperfections), screen (ignore the camera),
//   per(i, n) => { dx, dy, rot, s, col, alpha } per-letter overrides (fractions of size) for kinetic lettering.
function type(txt, x, y, size, o = {}) {
  const fk = o.font || 'hero', wear = o.wear ?? (fk === 'mono' ? 0 : .45), layered = wear > 0;
  const dst = g2d(o.screen), c = layered ? scratchX : dst;
  if (layered) { c.setTransform(dst.getTransform()); c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); c.restore(); c.globalCompositeOperation = 'source-over'; }
  c.save();
  c.translate(x, y); c.rotate(o.rot || 0); if (o.skew) c.transform(1, 0, o.skew, 1, 0, 0);
  const k = o.k ?? 1; c.scale((o.sx ?? 1) * k, (o.sy ?? 1) * k);
  c.font = fontStr(o, size); c.textBaseline = 'alphabetic'; c.textAlign = 'left'; c.lineJoin = 'round';
  const chars = (o.track || o.per) ? [...txt] : [txt], tr = (o.track || 0) * size;
  const ws = chars.map(ch => c.measureText(ch).width), total = ws.reduce((p, q) => p + q, 0) + tr * (chars.length - 1);
  const cap = CAP[fk] * size, by = o.base === 'bottom' ? 0 : o.base === 'top' ? cap : cap / 2;
  let px = o.align === 'left' ? 0 : o.align === 'right' ? -total : -total / 2;
  const pass = (fn) => {
    let cx = px;
    chars.forEach((ch, i) => {
      const p = o.per ? (o.per(i, chars.length) || {}) : {};
      c.save();
      c.translate(cx + ws[i] / 2 + (p.dx || 0) * size, by + (p.dy || 0) * size); if (p.rot) c.rotate(p.rot);
      if (p.s != null) c.scale(p.s, p.s);
      c.globalAlpha = (o.alpha ?? 1) * (p.alpha ?? 1);
      fn(ch, -ws[i] / 2, p); c.restore(); cx += ws[i] + tr;
    });
  };
  if (o.shadow) pass((ch, lx) => { c.fillStyle = o.shadow.col || PAL.ink; c.fillText(ch, lx + (o.shadow.dx ?? .04) * size, (o.shadow.dy ?? .05) * size); });
  if (o.stroke) pass((ch, lx) => { c.strokeStyle = o.stroke; c.lineWidth = (o.strokeW ?? .06) * size; c.strokeText(ch, lx, 0); });
  if (o.col !== null) pass((ch, lx, p) => { c.fillStyle = p.col || o.col || PAL.ink; c.fillText(ch, lx, 0); });
  if (layered) {
    c.globalCompositeOperation = 'destination-out'; c.globalAlpha = wear;
    const ps = Math.min(1.5, size / 260); wearPat.setTransform(new DOMMatrix().scale(ps, ps).translate((o.seed || 0) * 37 % 512, (o.seed || 0) * 91 % 512));
    c.fillStyle = wearPat; c.fillRect(px - size, by - cap - size, total + size * 2, cap + size * 2);
    c.globalCompositeOperation = 'source-over';
  }
  c.restore(); c.globalAlpha = 1;
  if (layered) { dst.save(); dst.setTransform(1, 0, 0, 1, 0, 0); dst.drawImage(scratchC, 0, 0); dst.restore(); }
  return { w: total * (o.sx ?? 1) * k, cap: cap * (o.sy ?? 1) * k };
}

// ---------- kinetic helpers (return values to feed into type options) ----------
// slam: a word hits the frame. Returns { k, alpha, shake } for age (seconds since the hit).
function slam(age, d = .16) {
  if (age < 0) return { k: 0, alpha: 0, shake: 0 };
  const p = clamp(age / d);
  return { k: age < d ? lerp(2.6, .94, easeIn(p)) : lerp(.94, 1, easeOut((age - d) / .14)), alpha: clamp(age / .04), shake: Math.exp(-(age - d) * 14) * (age >= d ? 1 : 0) };
}
// pop: overshoot scale-in, 0 before age 0
const popIn = (age, d = .22) => age <= 0 ? 0 : backOut(age / d);

// ---------- annotation level ----------
// label: small technical note. txt may be an array of lines. o: size, col, bg (box fill or null), frame, align,
// rot, screen, alpha, pad.
function label(txt, x, y, o = {}) {
  const lines = Array.isArray(txt) ? txt : [txt], size = o.size || 22, lh = size * 1.32, pad = o.pad ?? size * .5;
  const c = g2d(o.screen); c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.globalAlpha = o.alpha ?? 1;
  c.font = `${o.weight || 700} ${size}px ${FONT.mono}`; c.textBaseline = 'top';
  const w = Math.max(...lines.map(l => c.measureText(l).width)), h = lh * lines.length - (lh - size);
  const ox = o.align === 'right' ? -w : o.align === 'center' ? -w / 2 : 0;
  if (o.bg) { c.fillStyle = o.bg; c.fillRect(ox - pad, -pad, w + pad * 2, h + pad * 2); }
  if (o.frame) { c.strokeStyle = o.frame; c.lineWidth = o.lw || 2.5; c.strokeRect(ox - pad, -pad, w + pad * 2, h + pad * 2); }
  c.fillStyle = o.col || PAL.ink; c.textAlign = 'left';
  lines.forEach((l, i) => c.fillText(l, ox, i * lh));
  c.restore(); c.globalAlpha = 1;
  return { w: w + pad * 2, h: h + pad * 2 };
}
// typed: reveal a label's characters over time (teletype), with a block cursor while typing.
function typed(txt, age, cps = 28) { const n = Math.floor(clamp(age * cps, 0, txt.length)); return txt.slice(0, n) + (n < txt.length && age > 0 ? '█' : ''); }

// stamp: a rubber stamp slammed onto the frame. k = pop progress (use popIn(age)).
function stamp(txt, x, y, o = {}) {
  const size = o.size || 70, col = o.col || PAL.oxblood, k = o.k ?? 1; if (k <= .01) return;
  const w = typeW(txt, size, { font: 'hero', track: .04 }) + size * .9, h = size * 1.5;
  const dst = g2d(o.screen), c = scratchX; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); c.setTransform(dst.getTransform());
  c.save(); c.translate(x, y); c.rotate(o.rot ?? -.12); c.scale(k, k); c.globalAlpha = o.alpha ?? 1;
  c.strokeStyle = col; c.lineJoin = 'round'; c.lineWidth = size * .11; c.strokeRect(-w / 2, -h / 2, w, h);
  c.lineWidth = size * .035; c.strokeRect(-w / 2 + size * .13, -h / 2 + size * .13, w - size * .26, h - size * .26);
  c.font = `400 ${size}px ${FONT.hero}`; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillStyle = col;
  let px = -(w - size * .9) / 2; for (const ch of txt) { c.fillText(ch, px, CAP.hero * size / 2); px += c.measureText(ch).width + size * .04; }
  c.globalCompositeOperation = 'destination-out'; c.globalAlpha = .75;
  wearPat.setTransform(new DOMMatrix().scale(size / 110, size / 110).translate((o.seed || 3) * 53 % 512, (o.seed || 3) * 17 % 512));
  c.fillStyle = wearPat; c.fillRect(-w, -h, w * 2, h * 2);
  c.restore(); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
  dst.save(); dst.setTransform(1, 0, 0, 1, 0, 0); dst.drawImage(scratchC, 0, 0); dst.restore();
}
