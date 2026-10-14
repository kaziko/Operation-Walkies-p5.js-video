# Animation guide (read this before drawing a chapter)

This project renders a 204.72 s music video, "Operation Walkies" by Princess Jun Jun, as a hand-drawn animated punk
concert poster. p5.js + p5.brush, rendered offline in headless Chrome, 1920×1080, 24 fps. The shot list is in
[STORYBOARD.md](STORYBOARD.md). Look at the finished chapters before you start: `src/ch/c02_verse1.js` and
`src/ch/c03_chorus1.js` are the style reference, and `out/proof-of-style.mp4` is what they look like.

**The direction:** an underground anime concert poster starring an extremely judgmental Akita. Oversized condensed
type, flat colour with print texture, bold ink outlines, halftone, speed lines, dry brush. Deadpan comedy: ordinary
things shown with absurd seriousness. **Jun Jun barely moves. The lettering, the ink and the humans do the moving.**

## How a chapter works

One file per chapter in `src/ch/`, wrapped in an IIFE:

```js
// src/ch/c04_verse2.js
(() => {
  function scatter(t, lt, dur) { ... }           // a shot: draws the ENTIRE frame, background included
  function crows(t, lt, dur) { ... }
  chapter('verse2', barT(20), barT(28), [[barT(20), scatter], [barT(21), crows], ...]);
})();
```

- `chapter(name, start, end, shots)`. A shot fn is called as `fn(t, lt, dur)`: song time, time since the shot started,
  shot length. Cuts land on each shot's start time. A shot may cut inside itself (`if (t < tCut) {...} else {...}`).
- **Frames render in parallel and out of order. Every shot is a pure function of `t`.** No state between frames, no
  `Math.random()`, no `Date`. Use `hash(i)` for stable per-object randomness and `jit(a)` for hand-drawn jitter
  (`jit` is reseeded 8×/s, so linework "boils" on threes; that is wanted, keep it small).
- **Only edit your own chapter file.** If a shared helper is missing, write it privately in your IIFE. If you find a
  real bug in a shared file, report it; do not edit it. Shared: `core.js`, `type.js`, `fx.js`, `junjun.js`,
  `cast.js`, `timeline.js`, `songmap.js`, `studio.html`, `render.mjs`, `scenes_test.js`.
- **Never define a top-level name, and never reuse a p5 global name** (`pop`, `push`, `scale`, `rotate`, `translate`,
  `image`, `fill`, `rect`, `circle`, `line`, `text`, `random`, `noise`, `color`, `shader`, `camera`, `frameCount`…),
  even as a local variable name inside the IIFE if you then call the p5 function. A helper called `pop` silently broke
  every `pop()` in the project once.
- Wipes: `wipeAt(time, [colA, colB], seed, angle)` registers a brush wipe centred on `time` (covers from −0.26 s,
  reveals to +0.26 s). **Register a wipe only at your own chapter's start time**, and only where the storyboard says.
  Already registered: bar 16 and bar 20. Hard cuts on a downbeat are usually stronger than wipes.

## Time and music

- `barT(bar, beat = 0)` → song time. `bp(t)` → continuous beat position. `beatT(b)` → time of beat `b`.
  Beat ≈ 0.662 s, bar ≈ 2.65 s, eighth ≈ 0.33 s. **Build shot times from `barT`, and word hits from the word times in
  STORYBOARD.md** (they are good to ±0.15 s). Do not invent a BPM.
- `pulse(t, k)` = 1 on each beat then decays; `pulse2` on eighths; `barPulse` on downbeats; `hit(t, t0, k)` = decaying
  accent after one moment. `seg(t, a, b)` = 0..1 progress. `kf(t, [[t0, v0], ...], ease)` keyframes.
- Easing: `ease`, `easeIn`, `easeOut`, `easeOut5`, `backOut`, `elasticOut`. Also `lerp`, `clamp`, `frac`, `wob`,
  `mixCol(a, b, k)`, `rgba(hex, a)`, `shakeXY(t, amount, rate)` → `[dx, dy]`.
- **Not every beat gets an effect.** Strong accents: word slams, impact frames, cuts. Quiet passages stay quiet.

## Canvas, camera, layers

- 1920×1080 (`W`, `H`), y down, origin top-left. Keep faces and key type inside x 70..1850, y 50..1030.
- Two drawing systems share one painter's order. You can mix them freely; order of calls = order of layers.
  - **2D layer** (flat poster graphics, crisp): `bg(col)`, `rect2`, `circ2`, `poly2`, all type, `halftone`,
    `speedLines`, `streaks`, `sunburst`, `burst`, `splat`, `dryStroke`, `hazard`, `pawPrint`, `flash`, `letterbox`.
    For custom shapes get the context with `const c = g2d();` (camera space) or `g2d(true)` (screen space) and use
    the canvas 2D API. Call `g2d()` again after any brush call (it re-arms the layer).
  - **Brush** (hand-drawn, p5.brush): `paint(pts, { wash, ink, sw, br, hatch, curv })` for a filled outlined shape,
    `inkLine(pts, sw, col, brush, curvature)` for a stroke, all characters, `rageAura`, `vibLines`.
    Brushes: `ink` (bold outline), `inkfine`, `rough`, `dry`, plus p5.brush built-ins (`charcoal`, `2B`, `cpencil`,
    `marker`, `pen`). `paint(..., { ink: null })` = no outline.
- **Camera:** `camBegin(cx, cy, zoom, rot)` … `camEnd()`. World point (cx, cy) lands at screen centre. Both layers
  follow it. One level only. Screen-space overlays (HUD labels, letterbox, stamps) go after `camEnd()` or take
  `{ screen: true }`. p5 `push()/translate()/rotate()/scale()/pop()` work for brush drawing (not for the 2D layer).
- Every shot should have a camera idea: a confident push, a pan, a whip, a zoom-out, or an on-hit shake. Not a
  constant random shake.

## Typography (`type.js`)

`type(txt, x, y, size, o)` draws one word or line. `(x, y)` = centre of the cap height by default.
Options: `font` ('hero' Anton | 'hand' Permanent Marker | 'mono' IBM Plex Mono | 'jp' Dela Gothic One), `col`,
`align` ('center' | 'left' | 'right'), `rot`, `k` (scale about the anchor), `sx`, `sy`, `skew`, `alpha`, `track` (em),
`stroke` + `strokeW`, `shadow: { col, dx, dy }` (hard offset block), `wear` 0..1 (print wear; 0 for small type),
`seed`, `screen`, `per: (i, n) => ({ dx, dy, rot, s, col, alpha })` for per-letter kinetics (fractions of size).

- `fitSize(txt, width, o)` → the size that makes `txt` span `width`. `typeW(txt, size, o)` measures. `capH(size)`.
- `slam(age, d)` → `{ k, alpha, shake }`: a word hits the frame (starts huge, lands, settles). Use
  `type(w, x, y, size, { k: s.k, alpha: s.alpha })` and feed `s.shake` into `shakeXY`.
  `popIn(age, d)` → overshoot scale-in.
- `label(txtOrLines, x, y, { size, col, bg, frame, align, rot, screen, pad })`: annotation level.
  `typed(txt, age, cps)`: teletype reveal. `stamp(txt, x, y, { k, size, rot, col, screen })`: rubber stamp.
  `dossier(x, y, title, lines, age, o)`, `hud(lines, { corner })`, `reticle(cx, cy, r, { k, col })`.
- **Three levels, strict hierarchy:** hero = one or two huge words per shot; rhythmic = short hand-lettered words on
  the vocal; annotation = small mono paperwork, at most one or two per shot.
- **Type lives in the scene:** draw it before a character and she stands in front of it. Let words crop off the frame,
  get cut, slammed, shaken, stamped. **But it must stay readable:** check contrast (paper on orange, ink on paper,
  lime on ink all work; ink type over an ink shape does not), and do not cover Jun Jun's eyes with type.
- Japanese (font 'jp'): only kanji/kana from the list in `type.js` (`JP_GLYPHS`) are loaded. Use the words in the
  storyboard (戦, 散歩, 警戒, 任務完了, 出撃, 敵発見, 巡回中, 縄張, 明日, 再出撃, 栄光, 作戦, 朝, 姫, 秋田犬) and
  katakana sound effects (ゴゴゴ rumble, ガルルル growl, ワン bark, ドン impact, ジーッ stare). Do not invent kanji.

## Jun Jun (`junjun.js`)

- `junjunBust(x, y, u, o)`: front head + ruff + harness; (x, y) = centre of the head. For close-ups: u 45–120.
- `junjunSit(x, y, u, o)`: regal front sit; (x, y) = ground between the front paws. About 27u tall, 17u wide.
- `junjunSide(x, y, u, o)`: profile, faces right; (x, y) = ground under the body. About 24u tall, 21u long.
  `walk` (stride phase, cycles), `flip`, `face: 'front'` (head turned to camera), `leash: [x, y]` + `slack`,
  `lean`, `head: { dx, dy, rot }`, `legs`, `tailWag`, `shadow: false`, `shadowOp`, `harness: false`.
  One walk cycle moves her 7.74u (×1.1 looks fine): `x = x0 + phase * 7.74 * u` keeps the paws from sliding.
- Face options (all views): `look: [x, y]` (−1..1), `lid` (0 open … .5 judging … 1 shut), `brow` (−1 … 1 angry),
  `browY`, `mouth` ('flat' | 'frown' | 'smile' | 'pant' | 'snarl' | 'bark' | 'o'), `ear`, `iris` (small = rage),
  `rage` 0..1, `turn` (−1..1), `tilt`, `crown` 0..1, `mono: true` (black / white only, for impact frames),
  `coat: {...}` (palette override, e.g. an all-ink silhouette).
- Singing (bridge only): `const s = sing(t)` gives lip-sync `{ open, round }` from the word timings; pass
  `mouth: 'sing', open: s.open, round: s.round`. Check it with `--scene=sing`.
- Named expressions: `EXPR.neutral, judge, sideEye, stare, deadpan, inspect, smug, rage, bark, royal, shut, pant`.
  Spread one and override: `junjunBust(x, y, 60, { ...EXPR.judge, look: [.8, 0] })`. `blink(t, seed)` → a rare blink
  (`lid: Math.max(.5, blink(t, 1))`).
- **Acting rules:** default is controlled, confident, unimpressed. Move eyes first, then brows, then a few degrees of
  head. No bouncing, no happy faces (the two exceptions are in the storyboard). Rage is brief and rare. She should be
  big: in a character shot her head is 300–1200 px wide. Expression must read at a glance.

## Cast and props (`cast.js`)

All take `(x, y, u, o)` with (x, y) on the ground; pass the same `u` as Jun Jun to keep them in scale.

- `commander(x, y, u, { pose: 'stand' | 'walk' | 'dragged' | 'flat' | 'slump', walk, face: 'calm' | 'panic' | 'dead' | 'sleep', flip })`
  — 34u tall. **Returns the lead hand position**: `junjunSide(x, y, u, { leash: commander(...) })`.
- `yorkie(x, y, u, { bark, hop, scared, flip })` 9u · `squirrel(x, y, u, { run, helmet, flip })` 8u ·
  `cat(x, y, u, { eyes, col, ink })` 10u · `crow(x, y, u, { caw, flap, cap, flip })` 6u · `hydrant(x, y, u)` 11u ·
  `pup(x, y, u, { puff, tuck, face: 'cocky' | 'scared', flip })` 8u. Most take `mono: true`.
- Props: `biscuit(x, y, size, rot, o)`, `cushion(x, y, w, o)`, `pawPrint(x, y, s, rot, col, o)`,
  `hazard(x, y, w, h, scroll, a, b, o)`.
- New props or guests for your chapter: draw them privately in your file, in the same flat cut-out style
  (`paint` with a flat `wash` and an `ink` outline, a little `jit`).

## Signature effects (`fx.js`)

- **Stare:** `stareLines(cx, cy, k, o)` darkens the field and grows radial lines; pair with a slow camera push,
  pupils that move then lock, and one final hit.
- **Impact frame:** `impactFrame(cx, cy, age, { accent, seed, size })` draws the whole high-contrast frame; put
  `junjun…({ mono: true })` and a slammed word on top; add `shakeXY` and a 2-frame `flash`.
- **Rage aura:** `rageAura(cx, cy, r, intensity, o)`; `flames(cx, baseY, w, h, intensity, o)`.
- **Vibration lines:** `vibLines(cx, cy, rx, ry, amount, { n, arc, sw, len })`.
- **Kinetic type:** `slam`, `popIn`, `per`-letter jitter, `k`, `rot`, `sx/sy`.
- **Brush wipe:** `wipeAt` (chapter level) or `brushWipe(p, o)` / `slashWipe(p, col)` inside a shot (call last).
- **Annotations:** `label`, `stamp`, `dossier`, `hud`, `reticle`.
- Also: `speedLines`, `streaks`, `sunburst`, `halftone`, `burst`, `splat`, `dryStroke`, `flash`, `letterbox`.

## Style rules

- **Palette:** `PAL.orange, paper, ink` are the identity. `lime, pink, blue, sage, violet, oxblood, white` are
  accents: one or two per shot, and each chapter's accents are named in the storyboard. No gradients, no glow, no
  soft shadows, no transparency washes over characters. Flat fields + halftone + hatching.
- **Composition:** asymmetry, extreme crops, type that runs off the frame, one dominant shape. Big simple backgrounds;
  no small detailed scenery.
- **Motion hierarchy:** anticipation → decisive hit → overshoot and settle → hold. Holds make the joke. Graphics move
  hard; Jun Jun moves little; humans and small animals may squash, stretch and panic.
- **Texture:** print grain and specks are added automatically. Add `halftone` and `dryStroke` for hand-made surface.
- **Performance:** frames take about 20–60 ms. Hundreds of shapes are fine; keep it under about 250 ms a frame.

## Checking your work

Run from the project root (several agents can render at once):

```
node render.mjs --sheet=55.4,55.9,56.4,56.9,57.4,57.9 --cols=3 --w=640 --out=out/check/c04_a.jpg
node render.mjs --stills=56.2 --jpg --out=out/check/c04_full        # one full-size frame
```

A sheet puts several times on one image and prints ms per frame. Open it with the Read tool and really look. Check:

- the first and last frame of every shot, and several in between; every 0.05–0.1 s around a hit;
- that nothing is cropped by accident, type is readable, and no type covers a face;
- that Jun Jun is on-model, big enough, and her expression reads;
- that no frame is broken: an exception in a shot prints `SHOT ERROR at t=…` (with the stack) in the render log and
  the frame becomes a red `SHOT ERROR` card. Fix every one;
- the frames either side of your chapter's first and last cut.

Iterate until every shot is bold, readable, funny and clearly part of the same film as the proof-of-style clip.
Write files only in `src/ch/<your file>` and `out/check/`.
