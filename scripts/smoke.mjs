import { chromium } from 'playwright';

const targetUrl = process.env.SMOKE_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => Boolean(window.__RICH_GAME__ && document.querySelector('canvas')));
await page.waitForFunction(() => Boolean(document.querySelector('#modal-layer.is-open')), null, { timeout: 20000 });
await page.waitForTimeout(300);
await page.screenshot({ path: 'artifacts-desktop.png', fullPage: false });
const first = await page.evaluate(() => ({
  title: document.title,
  canvas: Boolean(document.querySelector('canvas')),
  bootReady: document.querySelector('#boot-screen')?.classList.contains('is-ready'),
  modal: Boolean(document.querySelector('#modal-layer.is-open')),
  hud: Boolean(document.querySelector('.hud-shell')),
  game: Boolean(window.__RICH_GAME__)
}));
await page.locator('.modal-card [data-action="close-modal"]').first().click();
await page.waitForTimeout(350);
const rollEnabled = await page.locator('#roll-button').isEnabled().catch(() => false);
await page.locator('#roll-button').click();
await page.waitForTimeout(3300);
const afterRoll = await page.evaluate(() => {
  const state = window.__RICH_GAME__?.state?.();
  return { phase: state?.phase, lastRoll: state?.lastRoll, cash: state?.players?.[0]?.cash, logs: state?.logs?.slice(0, 3) };
});
const actionText = await page.locator('#action-strip').innerText().catch(() => '');
if (actionText.includes('买下')) await page.locator('#action-strip [data-action="buy"]').dispatchEvent('click');
else if (actionText.includes('收下这张牌')) {
  const cardButton = page.locator('.card-modal [data-action="card-continue"]');
  if (await cardButton.count()) await cardButton.click();
  else await page.locator('#action-strip [data-action="card-continue"]').click();
}
await page.waitForTimeout(450);
await page.locator('[data-action="rules"]').click();
await page.waitForTimeout(250);
const rulesVisible = await page.locator('.rules-grid').isVisible().catch(() => false);
await page.locator('.modal-card [data-action="close-modal"]').click();
await page.screenshot({ path: 'artifacts-after-roll.png', fullPage: false });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const mobileErrors = [];
mobile.on('pageerror', (error) => mobileErrors.push(`pageerror: ${error.message}`));
await mobile.goto(targetUrl, { waitUntil: 'domcontentloaded' });
await mobile.waitForFunction(() => Boolean(window.__RICH_GAME__ && document.querySelector('canvas')));
await mobile.waitForFunction(() => Boolean(document.querySelector('#modal-layer.is-open')), null, { timeout: 20000 });
await mobile.waitForTimeout(300);
await mobile.screenshot({ path: 'artifacts-mobile.png', fullPage: false });
const mobileLayout = await mobile.evaluate(() => ({
  overflow: document.documentElement.scrollWidth > window.innerWidth,
  canvasWidth: document.querySelector('canvas')?.getBoundingClientRect().width,
  modal: Boolean(document.querySelector('#modal-layer.is-open'))
}));

console.log(JSON.stringify({ first, rollEnabled, afterRoll, actionText, rulesVisible, mobileLayout, errors, mobileErrors }, null, 2));
await browser.close();
if (errors.length || mobileErrors.length) process.exitCode = 1;
