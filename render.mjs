// render.mjs: drive studio.html in headless Chrome.
//   node render.mjs --sheet=23,23.5,24 [--cols=3] [--w=640] --out=out/check.jpg     contact sheet (fast visual check)
//   node render.mjs --stills=0.8,3,23.8 --out=out/test                              full-res PNG stills
//   node render.mjs --clip=22:27,37:41.6 [--workers=4] --out=out/proof.mp4          clip of one or more ranges, with audio
//   node render.mjs --frames=0:204.72 --workers=6                                   full-res JPEG frames → out/frames (resumable)
//   node render.mjs --encode [--out=out/princess-junjun.mp4]                        frames + song → MP4
//   add --scene=name to any of the first three to render a standalone test scene (see src/scenes_test.js)
//   add --fmt=v for the tall 1080 × 1920 frame, and --fade=in:out (seconds) to fade a clip's sound in and out:
//   node render.mjs --fmt=v --scene=reel --clip=39.416:60.639 --fade=.03:1.6 --out=out/junjun-reel.mp4      the Instagram trailer
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, statSync, renameSync, readdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const CHROME = args.chrome || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const GPU = process.platform === 'darwin' ? ['--use-angle=metal'] : [];   // Metal exists on macOS only
const AUDIO = 'assets/operation-walkies.mp3';
const DUR = 204.72, fps = +(args.fps || 24);
const FRAMES_DIR = args.dir || 'out/frames';

const run = (cmd, a) => new Promise((ok, bad) => { const p = spawn(cmd, a, { stdio: 'inherit' }); p.on('close', c => c ? bad(new Error(cmd + ' exited ' + c)) : ok()); });

if (args.encode) {
  const out = args.out || 'out/princess-junjun.mp4', n = readdirSync(FRAMES_DIR).filter(f => f.endsWith('.jpg')).length;
  console.log(`encoding ${n} frames → ${out}`);
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', `${FRAMES_DIR}/f%05d.jpg`, '-i', AUDIO,
    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(args.crf || 20), '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k',
    '-movflags', '+faststart', '-shortest', out]);
  console.log('wrote ' + out);
  process.exit(0);
}

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, protocolTimeout: 0,
  args: ['--allow-file-access-from-files', '--ignore-gpu-blocklist', ...GPU, '--enable-gpu-rasterization', '--window-size=1920,1080',
    '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows']
});
async function openPage(tag = '') {
  const page = await browser.newPage();
  page.on('console', m => { if (['error', 'warn'].includes(m.type()) && !m.text().includes('not from the associated program')) console.log(`[page${tag}]`, m.text()); });
  page.on('pageerror', e => console.log(`[page error${tag}]`, e.message));
  await page.goto(pathToFileURL(resolve('studio.html')).href + '?render' + (args.fmt ? '&fmt=' + args.fmt : ''), { waitUntil: 'networkidle0' });
  await page.waitForFunction('window.ready === true', { timeout: 60000 });
  if (args.scene) await page.evaluate(name => { window.SCENE = name; }, args.scene);
  return page;
}
const frameOf = async (page, t, type, q) => {
  const url = await page.evaluate((t, type, q) => window.renderAt(t, type, q), t, type, q);
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
};
const times = s => String(s).split(',').map(Number);
const name5 = i => `f${String(i).padStart(5, '0')}.jpg`;
// Parallel, resumable frame render: each worker page pulls the next missing job; files are written atomically.
async function renderJobs(jobs, dir, workers, q = .94) {
  mkdirSync(dir, { recursive: true });
  const todo = jobs.filter(j => { const f = `${dir}/${j.file}`; return !existsSync(f) || statSync(f).size < 1000; });
  console.log(`${todo.length} frames to render (${jobs.length - todo.length} already done), ${workers} workers`);
  let next = 0, done = 0; const start = Date.now();
  await Promise.all(Array.from({ length: Math.min(workers, Math.max(1, todo.length)) }, async (_, w) => {
    const page = await openPage('#' + w);
    while (next < todo.length) {
      const j = todo[next++], f = `${dir}/${j.file}`;
      const buf = await frameOf(page, j.t, 'image/jpeg', q);
      writeFileSync(f + '.tmp', buf); renameSync(f + '.tmp', f);
      if (++done % 48 === 0 || done === todo.length) {
        const el = (Date.now() - start) / 1000;
        console.log(`frame ${done}/${todo.length}  ${(el / done * 1000).toFixed(0)} ms/frame effective  eta ${((todo.length - done) * el / done / 60).toFixed(1)} min`);
      }
    }
  }));
}

if (args.sheet) {
  const page = await openPage(), out = args.out || 'out/sheet.jpg'; mkdirSync(dirname(out), { recursive: true });
  const { url, ms } = await page.evaluate((ts, c, w) => window.renderSheet(ts, c, w), times(args.sheet), +(args.cols || 3), +(args.w || 640));
  writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
  console.log(`${out}  ms/frame: ${ms.join(' ')}`);
} else if (args.stills) {
  const page = await openPage(), out = args.out || 'out/stills'; mkdirSync(out, { recursive: true });
  console.log('GPU:', await page.evaluate(() => window.gpuInfo()));
  for (const s of times(args.stills)) {
    const t0 = Date.now(), jpg = args.jpg, buf = await frameOf(page, s, jpg ? 'image/jpeg' : 'image/png', .9);
    const f = `${out}/t${s.toFixed(2).replace('.', '_')}.${jpg ? 'jpg' : 'png'}`; writeFileSync(f, buf);
    console.log(`${f}  ${Date.now() - t0} ms`);
  }
} else if (args.frames) {
  const [a, b] = String(args.frames).split(':').map(Number);
  const first = Math.round(a * fps), last = Math.min(Math.ceil(DUR * fps) - 1, Math.round(b * fps) - 1), jobs = [];
  for (let i = first; i <= last; i++) jobs.push({ t: i / fps, file: name5(i) });
  await renderJobs(jobs, FRAMES_DIR, +(args.workers || 6));
} else if (args.clip) {
  // One or more time ranges, cut together with their own audio.
  const ranges = String(args.clip).split(',').map(r => r.split(':').map(Number)), out = args.out || 'out/clip.mp4';
  const tmp = `out/tmp/${out.replace(/[^a-z0-9]+/gi, '_')}`; rmSync(tmp, { recursive: true, force: true }); mkdirSync(dirname(out), { recursive: true });
  const jobs = []; let n = 0;
  for (const [a, b] of ranges) { const k = Math.round((b - a) * fps); for (let i = 0; i < k; i++) jobs.push({ t: a + i / fps, file: name5(n++) }); }
  await renderJobs(jobs, tmp, +(args.workers || 4), .92);
  const [fin, fout] = String(args.fade || '0:0').split(':').map(Number), total = n / fps;
  const af = ranges.map(([a, b], i) => `[1:a]atrim=${a}:${a + Math.round((b - a) * fps) / fps},asetpts=PTS-STARTPTS[a${i}]`).join(';') +
    ';' + ranges.map((_, i) => `[a${i}]`).join('') + `concat=n=${ranges.length}:v=0:a=1` +
    (fin ? `,afade=t=in:d=${fin}` : '') + (fout ? `,afade=t=out:st=${(total - fout).toFixed(3)}:d=${fout}` : '') + '[a]';
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', `${tmp}/f%05d.jpg`, '-i', AUDIO, '-filter_complex', af,
    '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', out]);
  console.log(`wrote ${out}  (${n} frames)`);
}
await browser.close();
