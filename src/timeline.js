// timeline.js: chapter registry, standalone test scenes, chapter-break brush wipes.
//
// Each chapter file calls chapter(name, start, end, shots) where shots = [[t0, fn], ...] in time order.
// A shot function is called as fn(t, lt, dur): t = song time, lt = t - t0, dur = shot length. It draws the whole frame
// (background included) and must be a pure function of t: frames render in parallel and out of order.
const CH = [];
function chapter(name, start, end, shots) { CH.push({ name, start, end, shots }); CH.sort((a, b) => a.start - b.start); }

// Chapter breaks that get a brush wipe: [time, colours, seed]. The wipe covers by the boundary and reveals after it.
const WIPES = [];
const WIPE_TR = .26;
function wipeAt(t, cols, seed = 1, ang) { WIPES.push({ t, cols, seed, ang }); }

// Standalone scenes (style tests, pose sheets): window.SCENE = name swaps the whole frame for that scene.
const SCENES = {};

function drawWorld(t) {
  if (window.SCENE && SCENES[window.SCENE]) { SCENES[window.SCENE](t); if (CAM) camEnd(); return; }
  const ch = CH.find(c => t >= c.start && t < c.end);
  if (!ch) placeholder(t);
  else {
    let i = 0; while (i + 1 < ch.shots.length && t >= ch.shots[i + 1][0]) i++;
    const t0 = ch.shots[i][0], end = i + 1 < ch.shots.length ? ch.shots[i + 1][0] : ch.end;
    ch.shots[i][1](t, t - t0, end - t0);
    if (CAM) camEnd();
  }
  for (const w of WIPES) if (Math.abs(t - w.t) < WIPE_TR) brushWipe((t - (w.t - WIPE_TR)) / (2 * WIPE_TR), { cols: w.cols, seed: w.seed, ang: w.ang });
}

function placeholder(t) {
  bg(PAL.orange);
  type('NOT DRAWN YET', W / 2, H / 2, 200, { col: PAL.paper });
  label(`T ${t.toFixed(2)}  BAR ${Math.floor(bp(t) / 4)}`, W / 2, H / 2 + 160, { align: 'center', col: PAL.ink, size: 30 });
}
