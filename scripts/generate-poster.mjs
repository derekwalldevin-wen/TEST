import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PLAYER_DEFS } from '../src/game/engine.js';
import { avatarSvg } from '../src/ui/avatar-art.js';

const width = 1920;
const height = 1080;
const escapeXml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&apos;', '"': '&quot;' }[char]));
const skills = ['减免租金', '周期分红', '重掷骰子', '免费升级'];
const tags = ['熊猫掌柜', '花朝执事', '游侠少主', '远行探险家'];
const cardWidth = 300;
const cardHeight = 396;
const cardGap = 24;
const cardStart = (width - (cardWidth * 4 + cardGap * 3)) / 2;
const cardY = 612;

const spokes = Array.from({ length: 24 }, (_, index) => {
  const angle = (index * Math.PI * 2) / 24;
  const x1 = 1510 + Math.sin(angle) * 150;
  const y1 = 350 + Math.cos(angle) * 150;
  const x2 = 1510 + Math.sin(angle) * (index % 3 === 0 ? 218 : 182);
  const y2 = 350 + Math.cos(angle) * (index % 3 === 0 ? 218 : 182);
  return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${index % 3 === 0 ? '#f1cd78' : '#5d8f84'}" stroke-width="${index % 3 === 0 ? 3 : 1.5}" opacity="${index % 3 === 0 ? .78 : .42}"/>`;
}).join('');
const stars = Array.from({ length: 42 }, (_, index) => {
  const x = 100 + ((index * 271) % 1740);
  const y = 60 + ((index * 97) % 460);
  const r = index % 5 === 0 ? 2.6 : 1.2;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${index % 4 === 0 ? '#f6d98f' : '#9bc3b0'}" opacity="${index % 4 === 0 ? .72 : .32}"/>`;
}).join('');
const cards = PLAYER_DEFS.map((def, index) => {
  const x = cardStart + index * (cardWidth + cardGap);
  const portrait = avatarSvg(def);
  return `<g transform="translate(${x} ${cardY})">
    <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" rx="20" fill="#f2e6ca" stroke="${def.color}" stroke-width="4"/>
    <rect x="10" y="10" width="${cardWidth - 20}" height="264" rx="15" fill="${def.color}" opacity=".12"/>
    <svg x="10" y="8" width="${cardWidth - 20}" height="252" viewBox="0 0 320 360" preserveAspectRatio="xMidYMid slice">${portrait}</svg>
    <rect x="20" y="274" width="${cardWidth - 40}" height="1" fill="#8d6a3b" opacity=".28"/>
    <text x="24" y="308" fill="#23473d" font-family="STKaiti,KaiTi,serif" font-size="27" letter-spacing="3">${escapeXml(def.name)}</text>
    <text x="276" y="306" text-anchor="end" fill="#8b6a3c" font-family="Noto Serif SC,serif" font-size="12" letter-spacing="1">${escapeXml(tags[index])}</text>
    <circle cx="27" cy="339" r="6" fill="${def.color}"/>
    <text x="43" y="344" fill="#4c6a55" font-family="Noto Serif SC,serif" font-size="13" letter-spacing="1">✦ ${escapeXml(def.skill.name)} · ${escapeXml(skills[index])}</text>
    <text x="24" y="371" fill="#7b6b4c" font-family="Noto Serif SC,serif" font-size="11">${escapeXml(def.skill.description)}</text>
  </g>`;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="poster-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#091f25"/><stop offset=".44" stop-color="#1b4646"/><stop offset="1" stop-color="#35251e"/></linearGradient>
    <radialGradient id="poster-glow" cx="76%" cy="34%" r="58%"><stop stop-color="#7ec4ab" stop-opacity=".28"/><stop offset=".6" stop-color="#2c6b64" stop-opacity=".1"/><stop offset="1" stop-color="#0b2024" stop-opacity="0"/></radialGradient>
    <linearGradient id="title-gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff0b1"/><stop offset=".42" stop-color="#e7b85c"/><stop offset="1" stop-color="#a96735"/></linearGradient>
    <linearGradient id="board-gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7d98a"/><stop offset=".5" stop-color="#b6793c"/><stop offset="1" stop-color="#f0cb72"/></linearGradient>
    <pattern id="paper-grain" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="3" cy="7" r=".7" fill="#fff" opacity=".14"/><circle cx="21" cy="16" r=".6" fill="#000" opacity=".1"/><path d="M2 27l8-2M23 4l5 1" stroke="#fff" stroke-width=".5" opacity=".08"/></pattern>
    <filter id="poster-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#061518" flood-opacity=".55"/></filter>
    <filter id="soft-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#poster-bg)"/>
  <rect width="${width}" height="${height}" fill="url(#poster-glow)"/>
  <rect x="28" y="28" width="${width - 56}" height="${height - 56}" rx="30" fill="none" stroke="url(#board-gold)" stroke-width="3" opacity=".86"/>
  <rect x="42" y="42" width="${width - 84}" height="${height - 84}" rx="22" fill="none" stroke="#f4d58b" stroke-width="1" opacity=".38"/>
  <rect x="44" y="44" width="${width - 88}" height="${height - 88}" fill="url(#paper-grain)" opacity=".7"/>
  <g>${stars}</g>
  <g transform="translate(1510 350)" opacity=".95">
    <circle r="228" fill="#173b3d" opacity=".42" stroke="#d5a757" stroke-width="2"/>
    <circle r="196" fill="none" stroke="#e4c274" stroke-width="2" stroke-dasharray="2 13" opacity=".75"/>
    <circle r="158" fill="#224d4c" opacity=".72" stroke="#76a79b" stroke-width="1.5"/>
    <circle r="118" fill="none" stroke="#e0b961" stroke-width="2" opacity=".8"/>
    ${spokes}
    <path d="M0-150 26-22 0 0-26-22Z" fill="url(#title-gold)" filter="url(#soft-glow)"/>
    <path d="M0 150 26 22 0 0-26 22Z" fill="#6ca196" opacity=".8"/>
    <circle r="15" fill="#f6d98a" stroke="#8e542c" stroke-width="4"/>
    <text x="0" y="-264" text-anchor="middle" fill="#f4d58b" font-family="STKaiti,KaiTi,serif" font-size="24" letter-spacing="8">山海百业城</text>
  </g>
  <g transform="translate(0 0)">
    <text x="148" y="174" fill="#e5bd6b" font-family="Noto Serif SC,serif" font-size="18" letter-spacing="9">原创 3D 财富漫游</text>
    <text x="140" y="315" fill="url(#title-gold)" font-family="STKaiti,KaiTi,serif" font-size="112" letter-spacing="12" filter="url(#poster-shadow)">百业长安</text>
    <text x="150" y="382" fill="#f4e0a9" font-family="STKaiti,KaiTi,serif" font-size="42" letter-spacing="10">一局棋 · 一座城 · 四位掌柜</text>
    <path d="M150 428h560" stroke="#d8a657" stroke-width="2" opacity=".7"/>
    <text x="150" y="475" fill="#d6dcc2" font-family="Noto Serif SC,serif" font-size="21" letter-spacing="2">选一位掌柜，掷一枚骰子</text>
    <text x="150" y="516" fill="#9fc4ae" font-family="Noto Serif SC,serif" font-size="18" letter-spacing="3">买地 · 竞拍 · 升级 · 逐鹿百业</text>
    <g transform="translate(151 562)">
      <rect width="260" height="48" rx="24" fill="#a5453b" stroke="#f0cc7c" stroke-width="2"/>
      <text x="130" y="31" text-anchor="middle" fill="#fff0c2" font-family="Noto Serif SC,serif" font-size="15" letter-spacing="3">1 位玩家 · 3 位 AI</text>
    </g>
  </g>
  <g filter="url(#poster-shadow)">${cards}</g>
  <g transform="translate(150 1042)">
    <circle cx="5" cy="-5" r="4" fill="#e3b45d"/>
    <text x="22" y="0" fill="#e5d5a7" font-family="Noto Serif SC,serif" font-size="14" letter-spacing="3">40 格棋盘</text>
    <circle cx="170" cy="-5" r="4" fill="#7fc0a3"/>
    <text x="187" y="0" fill="#e5d5a7" font-family="Noto Serif SC,serif" font-size="14" letter-spacing="3">专属技能</text>
    <circle cx="315" cy="-5" r="4" fill="#dd7b5c"/>
    <text x="332" y="0" fill="#e5d5a7" font-family="Noto Serif SC,serif" font-size="14" letter-spacing="3">无需下载 · 即开即玩</text>
    <text x="1620" y="0" text-anchor="end" fill="#c8b98c" font-family="Noto Serif SC,serif" font-size="12" letter-spacing="2">derekwalldevin-wen.github.io/TEST</text>
  </g>
</svg>`;

await mkdir(new URL('../public/', import.meta.url), { recursive: true });
await writeFile(new URL('../public/cover-poster.svg', import.meta.url), svg, 'utf8');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
await page.setContent(`<html><head><style>html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:#0b2024}svg{display:block}</style></head><body>${svg}</body></html>`, { waitUntil: 'load' });
await page.screenshot({ path: fileURLToPath(new URL('../public/cover-poster.png', import.meta.url)), type: 'png' });
await browser.close();
console.log(JSON.stringify({ svg: 'public/cover-poster.svg', png: 'public/cover-poster.png', width, height }, null, 2));
