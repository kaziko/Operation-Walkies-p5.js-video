// dbg.mjs: evaluate a JS expression inside the studio page and print the result (diagnostics only).
import puppeteer from 'puppeteer-core';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--allow-file-access-from-files', '--ignore-gpu-blocklist', '--use-angle=metal'] });
const page = await browser.newPage();
page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => console.log('[page error]', e.message));
await page.goto(pathToFileURL(resolve('studio.html')).href + '?render', { waitUntil: 'networkidle0' });
await page.waitForFunction('window.ready === true', { timeout: 60000 });
const code = readFileSync(process.argv[2], 'utf8');
console.log(JSON.stringify(await page.evaluate(code), null, 1));
await browser.close();
