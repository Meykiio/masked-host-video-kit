// render.mjs: render a canvas page to MP4 with headless Chrome and ffmpeg.
//
// Setup (once, in the video project folder):  npm init -y && npm i puppeteer-core
// Needs Google Chrome or Chromium. If it is not found automatically, set CHROME_PATH.
//
// Your page (default index.html) must define:
//   window.READY = true                  when everything is loaded
//   window.DURATION                      seconds
//   window.seek = async (t) => {...}     draw the frame for time t on the first <canvas>
//   window.renderSFX = async (duration, sampleRate) => Float32Array   (optional) interleaved stereo effects
//
// Usage:
//   node render.mjs stills 0.6,3.2,9.8                  -> out/stills/<t>.jpg
//   node render.mjs video                               -> out/video_silent.mp4
//   node render.mjs video 12 18                         -> out/video_12_18.mp4 (a range, for quick tests)
//   node render.mjs audio --voice a.wav,b.wav           -> out/mix.wav (voice + effects, -14 LUFS)
//   node render.mjs mux                                 -> out/FINAL.mp4
// Options: --root <dir> (default: current folder)  --page <file> (default: index.html)  --fps 24
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf('--' + name); if (i < 0) return def; const v = args[i + 1]; args.splice(i, 2); return v; };
const ROOT = path.resolve(opt('root', process.cwd()));
const PAGE = opt('page', 'index.html');
const FPS = Number(opt('fps', 24));
const VOICE = opt('voice', '');
const [mode, a1, a2] = args;
const OUT = path.join(ROOT, 'out');
fs.mkdirSync(path.join(OUT, 'stills'), { recursive: true });

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };

function findChrome() {
  const home = process.env.USERPROFILE || process.env.HOME || '';
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ].filter(Boolean);
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) throw new Error('Chrome not found. Install Google Chrome or set CHROME_PATH to its executable.');
  return found;
}

function serve() {
  return new Promise((res) => {
    const srv = http.createServer((req, rsp) => {
      const p = path.resolve(ROOT, '.' + decodeURIComponent(req.url.split('?')[0]));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { rsp.writeHead(404); return rsp.end(); }
      rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(p).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(rsp);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

async function open() {
  const srv = await serve();
  const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true, protocolTimeout: 900000, args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().endsWith('favicon.ico')) console.error('HTTP', r.status(), r.url()); });
  await page.goto(`http://127.0.0.1:${srv.address().port}/${PAGE}?render`, { waitUntil: 'load', timeout: 180000 });
  await page.waitForFunction('window.READY || window.ERROR', { timeout: 300000 });
  const err = await page.evaluate('window.ERROR');
  if (err) throw new Error(err);
  return { srv, browser, page };
}

const grab = (page, t, q) => page.evaluate(async (t, q) => {
  await window.seek(t);
  return document.querySelector('canvas').toDataURL('image/jpeg', q);
}, t, q);
const b64 = (d) => Buffer.from(d.split(',')[1], 'base64');
const ff = (a) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...a]);

if (mode === 'stills') {
  const { srv, browser, page } = await open();
  for (const t of a1.split(',').map(Number)) {
    fs.writeFileSync(path.join(OUT, 'stills', `${t.toFixed(2)}.jpg`), b64(await grab(page, t, 0.9)));
    console.log('still', t);
  }
  await browser.close(); srv.close();
}

if (mode === 'video') {
  const { srv, browser, page } = await open();
  const D = await page.evaluate('window.DURATION');
  const f0 = Math.round((a1 ? +a1 : 0) * FPS), f1 = Math.round((a2 ? +a2 : D) * FPS);
  const out = path.join(OUT, a1 || a2 ? `video_${a1}_${a2}.mp4` : 'video_silent.mp4');
  const enc = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-r', String(FPS), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    if (!enc.stdin.write(b64(await grab(page, f / FPS, 0.95)))) await new Promise((r) => enc.stdin.once('drain', r));
    if (f % 48 === 0) console.log(`frame ${f}/${f1}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  enc.stdin.end(); await new Promise((r) => enc.on('close', r));
  await browser.close(); srv.close();
  console.log('wrote', out);
}

if (mode === 'audio') {
  const { srv, browser, page } = await open();
  const D = await page.evaluate('window.DURATION');
  let hasSfx = false;
  const raw = await page.evaluate(async (D) => {
    let r;
    if (window.renderSFX) r = await window.renderSFX(D, 48000);
    else if (window.SOUND && window.scoreSound) r = (await SOUND.renderOffline(window.scoreSound, D, 48000, { voiceover: true })).inter;
    if (!r) return null;
    const bytes = new Uint8Array(r.buffer); let s = '';
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  }, D);
  await browser.close(); srv.close();
  if (raw) {
    fs.writeFileSync(path.join(OUT, 'sfx.f32'), Buffer.from(raw, 'base64'));
    ff(['-f', 'f32le', '-ar', '48000', '-ac', '2', '-i', path.join(OUT, 'sfx.f32'), path.join(OUT, 'sfx.wav')]);
    hasSfx = true;
  }
  const voices = VOICE ? VOICE.split(',').map((v) => path.resolve(ROOT, v)) : [];
  if (voices.length) {
    // original recordings back to back: clean, compress, normalize, pad to the video length
    const inputs = voices.flatMap((v) => ['-i', v]);
    const n = voices.length;
    ff([...inputs, '-filter_complex', `${voices.map((_, i) => `[${i}:a]`).join('')}concat=n=${n}:v=0:a=1,highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=120:makeup=2,loudnorm=I=-16:TP=-2:LRA=7,apad=whole_dur=${D}`, '-ar', '48000', '-ac', '2', path.join(OUT, 'voice.wav')]);
  }
  const inA = [];
  if (voices.length) inA.push(path.join(OUT, 'voice.wav'));
  if (hasSfx) inA.push(path.join(OUT, 'sfx.wav'));
  if (!inA.length) throw new Error('Nothing to mix: pass --voice and/or define window.renderSFX');
  if (inA.length === 2) {
    // effects about 20 dB under the voice; final loudness for social video
    ff(['-i', inA[0], '-i', inA[1], '-filter_complex', '[1]volume=0.55[s];[0][s]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9', '-ar', '48000', path.join(OUT, 'mix.wav')]);
  } else {
    ff(['-i', inA[0], '-af', 'loudnorm=I=-14:TP=-1.5:LRA=9', '-ar', '48000', path.join(OUT, 'mix.wav')]);
  }
  console.log('wrote', path.join(OUT, 'mix.wav'));
}

if (mode === 'mux') {
  ff(['-i', path.join(OUT, 'video_silent.mp4'), '-i', path.join(OUT, 'mix.wav'), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', path.join(OUT, 'FINAL.mp4')]);
  console.log('wrote', path.join(OUT, 'FINAL.mp4'));
}
