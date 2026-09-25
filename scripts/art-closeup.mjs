import { chromium } from 'playwright';
const targetUrl = process.env.SMOKE_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
page.on('pageerror', (error) => console.log('pageerror', error.message));
await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => Boolean(window.__RICH_GAME__ && document.querySelector('canvas')));
await page.waitForFunction(() => Boolean(document.querySelector('#modal-layer.is-open')), null, { timeout: 20000 });
await page.locator('.modal-card [data-action="close-modal"]').click();
await page.waitForTimeout(500);
await page.evaluate(() => {
  const world = window.__RICH_GAME__.world;
  world.camera.position.set(14, 12, 16);
  world.controls.target.set(0, 0, 0);
  world.controls.update();
});
await page.screenshot({ path: 'art-closeup-board.png' });
await page.evaluate(() => {
  const world = window.__RICH_GAME__.world;
  const target = world.getTileWorldPosition(0, 0);
  world.controls.target.copy(target);
  world.camera.position.copy(target).add({ x: 3.7, y: 2.5, z: 4.6 });
  world.controls.update();
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'art-closeup-character.png' });
console.log('saved art-closeup-board.png and art-closeup-character.png');
await browser.close();
