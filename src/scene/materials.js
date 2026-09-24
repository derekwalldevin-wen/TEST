import * as THREE from 'three';
import { GROUPS } from '../game/engine.js';

export const pbr = (color, options = {}) => new THREE.MeshStandardMaterial({
  color,
  roughness: options.roughness ?? 0.58,
  metalness: options.metalness ?? 0.04,
  emissive: options.emissive ?? '#000000',
  emissiveIntensity: options.emissiveIntensity ?? 0,
  transparent: options.transparent ?? false,
  opacity: options.opacity ?? 1,
  side: options.side ?? THREE.FrontSide,
  map: options.map ?? null
});

function roundedRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

export function canvasTexture(draw, size = 512, repeat = [1, 1]) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  draw(context, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(...repeat);
  texture.anisotropy = 4;
  return texture;
}

export function woodTexture() {
  return canvasTexture((ctx, size) => {
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#342117');
    gradient.addColorStop(0.48, '#654330');
    gradient.addColorStop(1, '#2b1813');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    ctx.globalAlpha = 0.18;
    for (let line = 0; line < 80; line += 1) {
      const y = Math.random() * size;
      ctx.strokeStyle = line % 2 ? '#e0b37a' : '#160c09';
      ctx.lineWidth = 0.4 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= size; x += 24) ctx.lineTo(x, y + Math.sin(x * 0.06 + line) * (2 + Math.random() * 4));
      ctx.stroke();
    }
    ctx.globalAlpha = 0.08;
    for (let dot = 0; dot < 800; dot += 1) {
      ctx.fillStyle = Math.random() > 0.5 ? '#fff3d6' : '#0a0504';
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
    }
  }, 512, [2, 2]);
}

export function ivoryTexture() {
  return canvasTexture((ctx, size) => {
    ctx.fillStyle = '#d9c8a6';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(65,46,31,.18)';
    ctx.lineWidth = 2;
    for (let y = 0; y < size; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y + (y % 64 ? 3 : -3));
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,255,240,.2)';
    for (let x = 0; x < size; x += 64) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 3, size); ctx.stroke();
    }
  }, 512, [4, 4]);
}

export function tileLabelTexture(tile) {
  return canvasTexture((ctx, size) => {
    ctx.clearRect(0, 0, size, size);
    const group = tile.group ? GROUPS.find((item) => item.id === tile.group) : null;
    const color = tile.kind === 'property' ? group?.ink ?? '#182c29' : '#33241a';
    ctx.fillStyle = 'rgba(247,237,211,.88)';
    roundedRect(ctx, 20, 20, size - 40, size - 48, 34);
    ctx.fill();
    ctx.strokeStyle = tile.kind === 'property' ? group?.color ?? '#a9823f' : '#9b6736';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const words = [...tile.name];
    const fontSize = words.length > 4 ? 74 : 92;
    ctx.font = `700 ${fontSize}px "Microsoft YaHei", "PingFang SC", sans-serif`;
    const lines = tile.name.length > 5 ? [tile.name.slice(0, Math.ceil(tile.name.length / 2)), tile.name.slice(Math.ceil(tile.name.length / 2))] : [tile.name];
    lines.forEach((line, index) => ctx.fillText(line, size / 2, size / 2 + (index - (lines.length - 1) / 2) * 88));
    if (tile.kind === 'property') {
      ctx.fillStyle = group?.color ?? '#a9823f';
      ctx.fillRect(105, size - 58, size - 210, 14);
    }
  }, 512);
}

export function brocadeTexture(base = '#d2ad57', ink = '#2c563e') {
  return canvasTexture((ctx, size) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = ink;
    ctx.globalAlpha = 0.44;
    ctx.lineWidth = 8;
    for (let y = -size; y < size * 2; y += 86) {
      for (let x = -size; x < size * 2; x += 86) {
        ctx.strokeRect(x + 14, y + 14, 56, 56);
        ctx.beginPath();
        ctx.moveTo(x + 22, y + 22); ctx.lineTo(x + 62, y + 62);
        ctx.moveTo(x + 62, y + 22); ctx.lineTo(x + 22, y + 62);
        ctx.stroke();
        ctx.fillRect(x + 37, y + 37, 8, 8);
      }
    }
    ctx.globalAlpha = 0.12;
    for (let i = 0; i < 80; i += 1) {
      ctx.fillStyle = i % 2 ? '#fff' : '#2a1008';
      ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }
  }, 512, [1.4, 1.4]);
}

export function denimTexture() {
  return canvasTexture((ctx, size) => {
    ctx.fillStyle = '#52646a';
    ctx.fillRect(0, 0, size, size);
    ctx.globalAlpha = 0.32;
    for (let i = 0; i < size; i += 3) {
      ctx.strokeStyle = i % 6 ? '#a1a3a0' : '#263b42';
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i + 2); ctx.stroke();
    }
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 140; i += 1) {
      ctx.fillStyle = Math.random() > 0.5 ? '#c4b68b' : '#273940';
      ctx.beginPath();
      ctx.arc(Math.random() * size, Math.random() * size, 1 + Math.random() * 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }, 512, [2, 2]);
}

export function fanTexture() {
  return canvasTexture((ctx, size) => {
    ctx.fillStyle = '#efe0b4';
    ctx.fillRect(0, 0, size, size);
    const petals = ['#c9564d', '#e8897d', '#e8b457', '#f5d8ba'];
    for (let i = 0; i < 14; i += 1) {
      const angle = (i / 14) * Math.PI * 2;
      ctx.fillStyle = petals[i % petals.length];
      ctx.globalAlpha = 0.88;
      ctx.beginPath();
      ctx.ellipse(size / 2 + Math.cos(angle) * size * 0.2, size / 2 + Math.sin(angle) * size * 0.2, size * 0.1, size * 0.16, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#b38b3f';
    ctx.lineWidth = 14;
    ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.38, 0, Math.PI * 2); ctx.stroke();
  }, 512);
}

export function textSpriteTexture(text, { color = '#fff6df', background = '#b93b32', border = '#e8c775', subtext = '' } = {}) {
  return canvasTexture((ctx, size) => {
    ctx.clearRect(0, 0, size, size);
    ctx.shadowColor = 'rgba(15,8,4,.45)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = background;
    roundedRect(ctx, 48, 64, size - 96, size - 128, 58);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = border;
    ctx.lineWidth = 11;
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.font = `800 ${subtext ? 92 : 112}px "Microsoft YaHei", sans-serif`;
    ctx.fillText(text, size / 2, subtext ? size * 0.43 : size * 0.5);
    if (subtext) {
      ctx.font = '500 42px "Microsoft YaHei", sans-serif';
      ctx.fillStyle = '#f5dfb4';
      ctx.fillText(subtext, size / 2, size * 0.64);
    }
  }, 512);
}

export function makeTextSprite(text, options = {}) {
  const material = new THREE.SpriteMaterial({ map: textSpriteTexture(text, options), transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  const width = options.width ?? 1.4;
  sprite.scale.set(width, width, 1);
  sprite.renderOrder = 20;
  return sprite;
}
