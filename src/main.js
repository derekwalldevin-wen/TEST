import * as THREE from 'three';
import './styles.css';
import {
  BOARD,
  TILES_BY_ID,
  assetValue,
  aiBuildTarget,
  aiShouldBuy,
  buildProperty,
  buyProperty,
  keepSkillReroll,
  useSkillReroll,
  calculatePropertyRent,
  createInitialState,
  declineProperty,
  dismissPending,
  endTurn,
  groupMonopoly,
  liquidateAndBankrupt,
  mortgageProperty,
  payJail,
  restoreState,
  roll,
  runSealedAuction,
  setAutopilot,
  unmortgageProperty,
  useJailCard
} from './game/engine.js';
import { GameAudio } from './audio/synth.js';
import { WorldScene, boardLayout } from './scene/world.js';
import { createCharacter, celebrateCharacter, moveCharacterAlong, setCharacterActive, setCharacterTile, setCharacterWalking, updateCharacter } from './scene/characters.js';
import { GameUI } from './ui/hud.js';

const SAVE_KEY = 'banyechangan-3d-save-v1';
const sceneRoot = document.querySelector('#scene-root');
const uiRoot = document.querySelector('#ui-root');
const bootScreen = document.querySelector('#boot-screen');

let state;
let loadedFromSave = false;
let world;
let ui;
let audio;
let characters = [];
let actionLock = false;
let aiTimer = null;
let characterFrame = 0;
let lastCharacterTime = performance.now();

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const restored = restoreState(raw);
      loadedFromSave = true;
      return restored;
    }
  } catch (error) {
    console.warn('存档读取失败，使用新局。', error);
  }
  return createInitialState();
}

state = loadState();

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('存档保存失败。', error);
  }
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function tileIndex(tileId) {
  return BOARD.findIndex((tile) => tile.id === tileId);
}

function currentPlayer() {
  return state.players[state.currentPlayer];
}

function isHumanTurn() {
  const player = currentPlayer();
  return Boolean(player && player.id === state.humanPlayerId && !player.autopilot && !player.bankrupt);
}

function playerPosition(playerId = state.currentPlayer) {
  const player = state.players[playerId];
  return world.getTileWorldPosition(player.position, player.avatarOffset);
}

function tilePosition(tileId, lift = 0) {
  const index = tileIndex(tileId);
  const point = world.getTileWorldPosition(index < 0 ? 0 : index, 0);
  point.y += lift;
  return point;
}

function updateCharacters() {
  const now = performance.now();
  const delta = Math.min(0.05, (now - lastCharacterTime) / 1000);
  lastCharacterTime = now;
  characters.forEach((character, index) => {
    const player = state.players[index];
    setCharacterActive(character, player.id === state.currentPlayer && !player.bankrupt);
    updateCharacter(character, now / 1000, delta);
  });
  characterFrame = requestAnimationFrame(updateCharacters);
}

function refresh({ focus = true } = {}) {
  world?.updateState(state);
  ui?.update(state);
  if (focus && state.winner == null) world?.focusTile(currentPlayer()?.position || 0);
  saveState();
}

function scheduleAI(delay = 720) {
  window.clearTimeout(aiTimer);
  const player = currentPlayer();
  if (!player || (player.ai && !player.autopilot) || player.bankrupt) return;
  if (!player.ai && !player.autopilot) return;
  aiTimer = window.setTimeout(() => runAI(), delay);
}

function applyEventVisuals(events) {
  events.forEach((item) => {
    const player = item.playerId == null ? currentPlayer() : state.players[item.playerId];
    const position = player ? playerPosition(player.id) : new THREE.Vector3(0, 1, 0);
    if (item.type === 'roll') audio.dice();
    if (item.type === 'move') audio.click();
    if (item.type === 'cash') {
      audio.coin();
      const sign = item.amount >= 0 ? '+' : '';
      world.floatText(`${sign}${item.amount} ${item.reason || '现金流'}`, position, item.amount >= 0 ? '#f4cf78' : '#e68a70');
    }
    if (item.type === 'salary') world.burst(position, '#eac56f', 14);
    if (item.type === 'skill-rent-discount') {
      world.floatText(`招财熊猫 -${item.amount} 文`, position, '#f4cf78');
      ui.showToast(`招财熊猫减免了 ${item.amount} 文租金`, 'normal');
    }
    if (item.type === 'skill-blessing') {
      world.burst(position, '#d9b65a', 24);
      world.floatText(`花朝祝福 +${item.amount} 文`, position, '#f2d37c');
      ui.showToast(`花朝祝福：+${item.amount} 文 · ${item.card.title}`, 'normal');
    }
    if (item.type === 'skill-build') {
      audio.coin();
      world.burst(tilePosition(item.tileId, .7), player?.color || '#77b6c7', 24);
      ui.showToast(`远行罗盘：${TILES_BY_ID.get(item.tileId)?.name || '地产'}免费升级`, 'normal');
    }
    if (item.type === 'skill-reroll') {
      world.burst(position, '#d78a53', 18);
      world.floatText(`游侠行动 ${item.oldValue} → ${item.value}`, position, '#efaa67');
      ui.showToast('游侠行动完成，骰子已重掷', 'normal');
    }
    if (item.type === 'buy') {
      audio.buy();
      world.burst(tilePosition(item.tileId, 0.5), player?.color || '#eac56f', 22);
      ui.showToast(`${player?.name || '掌柜'} 买下了${TILES_BY_ID.get(item.tileId)?.name || '产业'}`, 'normal');
    }
    if (item.type === 'build') {
      audio.coin();
      world.burst(tilePosition(item.tileId, 0.6), '#e7b95a', 18);
      ui.showToast(`${TILES_BY_ID.get(item.tileId)?.name || '产业'} 升级完成`, 'normal');
    }
    if (item.type === 'auction-won' && item.winnerId != null) {
      audio.buy();
      world.burst(tilePosition(item.tileId, 0.6), state.players[item.winnerId]?.color || '#eac56f', 30);
      ui.showToast(`${state.players[item.winnerId]?.name || '竞拍者'} 竞得${TILES_BY_ID.get(item.tileId)?.name || '产业'}`, 'normal');
    }
    if (item.type === 'mortgage' || item.type === 'unmortgage') {
      audio.click();
      world.floatText(item.type === 'mortgage' ? `+${item.amount} 抵押` : `-${item.amount} 解押`, tilePosition(item.tileId, 0.8), '#d9bf78');
    }
    if (item.type === 'jail') {
      audio.jail();
      world.burst(position, '#9b7eae', 20);
      ui.showToast(`${player?.name || '掌柜'} 进入巡安府`, 'warning');
    }
    if (item.type === 'jail-paid' || item.type === 'jail-card') world.floatText('获释', position, '#8bd1a0');
    if (item.type === 'bankrupt') {
      audio.bad();
      world.floatText('出局', position, '#d96758');
      ui.showToast(`${player?.name || '掌柜'} 资不抵债`, 'danger');
    }
    if (item.type === 'winner') {
      audio.win();
      celebrateCharacter(characters[item.playerId]);
      world.celebrate(item.playerId, state);
      ui.showToast(`${player?.name || '掌柜'} 赢得百业盛典！`, 'normal');
    }
  });
}

function buildPath(from, to, slot) {
  const path = [];
  let cursor = from;
  path.push([cursor, slot]);
  let guard = 0;
  while (cursor !== to && guard++ < BOARD.length + 2) {
    cursor = (cursor + 1) % BOARD.length;
    path.push([cursor, slot]);
  }
  return path;
}

function animateCharacter(character, path, duration = 760) {
  return new Promise((resolve) => {
    moveCharacterAlong(character, path, duration, resolve);
  });
}

async function animateMoveEvent(item) {
  const character = characters[item.playerId];
  if (!character) return;
  const player = state.players[item.playerId];
  const path = buildPath(item.from, item.to, player.avatarOffset);
  await animateCharacter(character, path, Math.min(2100, Math.max(520, path.length * 125)));
  setCharacterWalking(character, false);
}

async function playRoll(result) {
  const rollEvent = result.events.find((item) => item.type === 'roll');
  const moveEvent = result.events.find((item) => item.type === 'move');
  world.focusCenter();
  if (rollEvent) {
    await new Promise((resolve) => world.rollDice(rollEvent.dice, resolve));
  }
  if (moveEvent) await animateMoveEvent(moveEvent);
  const jailEvent = result.events.find((item) => item.type === 'jail');
  if (jailEvent) {
    const character = characters[jailEvent.playerId];
    const player = state.players[jailEvent.playerId];
    if (character && moveEvent && moveEvent.to !== player.position) {
      await animateCharacter(character, buildPath(moveEvent.to, player.position, player.avatarOffset), 980);
    }
  }
  result.events.forEach((item) => {
    if (item.type !== 'roll' && item.type !== 'move') applyEventVisuals([item]);
  });
  state.players.forEach((player, index) => setCharacterTile(characters[index], player.position, player.avatarOffset, (positionIndex, slot) => world.getTileWorldPosition(positionIndex, slot)));
  actionLock = false;
  refresh();
  continueTurn();
}

async function performRoll() {
  if (actionLock || state.winner != null) return;
  const player = currentPlayer();
  if (!player || player.bankrupt) return;
  if (player.inJail && player.jailTurns < 3) {
    ui.showToast(`还需在巡安府停留 ${3 - player.jailTurns} 回合`, 'warning');
    return;
  }
  const result = roll(state);
  if (!result.ok) {
    ui.showToast(result.reason, 'warning');
    return;
  }
  actionLock = true;
  saveState();
  ui.update(state);
  await playRoll(result);
}

async function runAI() {
  if (actionLock || state.winner != null) return;
  const player = currentPlayer();
  if (!player || player.bankrupt || (!player.ai && !player.autopilot)) return;
  actionLock = true;
  ui.update(state);
  await wait(420);
  if (state.pending?.kind === 'skill-reroll') {
    const result = useSkillReroll(state, Math.random() < 0.5 ? 0 : 1);
    if (result.ok) applyEventVisuals(result.events);
    actionLock = false;
    refresh();
    await wait(260);
    finishTurn();
    return;
  }
  if (state.pending?.kind === 'property') {
    const tileId = state.pending.tileId;
    const shouldBuy = aiShouldBuy(state, player.id, tileId);
    let result;
    if (shouldBuy) result = buyProperty(state, tileId);
    else {
      result = declineProperty(state, tileId);
      if (result.ok) {
        const proposals = makeAuctionProposals(state);
        const auction = runSealedAuction(state, tileId, proposals);
        result = { ok: auction.ok, events: auction.events || [] };
      }
    }
    if (result.ok) applyEventVisuals(result.events);
    actionLock = false;
    refresh();
    await wait(320);
    finishTurn();
    return;
  }
  if (state.pending?.kind === 'card') {
    const result = dismissPending(state);
    if (result.ok) applyEventVisuals(result.events);
    actionLock = false;
    refresh();
    await wait(250);
    finishTurn();
    return;
  }
  if (player.inJail && player.jailTurns < 3) {
    if (player.cash >= 80 && Math.random() < 0.34) {
      const result = payJail(state);
      if (result.ok) applyEventVisuals(result.events);
    } else {
      const result = endTurn(state);
      if (result.ok) applyEventVisuals(result.events);
    }
    actionLock = false;
    refresh();
    scheduleAI(650);
    return;
  }
  const buildTarget = aiBuildTarget(state, player.id);
  if (buildTarget) {
    const buildResult = buildProperty(state, buildTarget);
    if (buildResult.ok) applyEventVisuals(buildResult.events);
  }
  actionLock = false;
  await wait(250);
  performRoll();
}

function makeAuctionProposals(stateValue, humanAmount = 0) {
  const tile = TILES_BY_ID.get(stateValue.pending?.tileId || stateValue.players[stateValue.currentPlayer].position);
  const proposals = {};
  stateValue.players.forEach((player) => {
    if (player.bankrupt) return;
    if (player.id === stateValue.currentPlayer) {
      proposals[player.id] = Math.max(0, Math.min(player.cash, humanAmount));
      return;
    }
    const reserve = 150 + (tile.kind === 'property' ? tile.price * 0.2 : 40);
    const aggression = 0.75 + Math.random() * 0.6 + (player.cash > 1200 ? 0.22 : 0);
    const max = Math.floor((tile.price || 150) * aggression);
    proposals[player.id] = player.cash - reserve > max ? max : 0;
  });
  return proposals;
}

function finishTurn() {
  if (state.winner != null) {
    refresh();
    return;
  }
  const result = endTurn(state);
  if (result.ok) {
    refresh();
    scheduleAI(760);
  } else {
    ui.showToast(result.reason, 'warning');
  }
}

function continueTurn() {
  if (state.winner != null) {
    ui.closeModal();
    world.celebrate(state.winner, state);
    return;
  }
  const player = currentPlayer();
  if (!player || player.bankrupt) return;
  if (state.pending?.kind === 'card' && isHumanTurn()) {
    window.setTimeout(() => ui.openCard(state), 380);
    return;
  }
  if (!isHumanTurn()) {
    scheduleAI(680);
    return;
  }
  refresh();
}

function startSelectedGame(playerId) {
  state = createInitialState(Date.now(), Number(playerId));
  actionLock = false;
  window.clearTimeout(aiTimer);
  world.updateState(state);
  characters.forEach((character, index) => {
    setCharacterTile(character, 0, state.players[index].avatarOffset, (positionIndex, slot) => world.getTileWorldPosition(positionIndex, slot));
  });
  ui.closeModal();
  refresh();
  ui.showToast(`${state.players[state.humanPlayerId].name}已入席，特殊技能「${state.players[state.humanPlayerId].skill.name}」已激活`, 'normal');
}

function resetGame() {
  ui.openCharacterSelect(state.humanPlayerId ?? 0);
}

function initialize() {
  try {
    audio = new GameAudio();
    world = new WorldScene(sceneRoot, state, {
      onTileHover: (tileId) => { world.setHover(tileId); if (tileId) audio.hover(); },
      onTileClick: (tileId) => { audio.click(); ui.openTileInspector(state, tileId); },
      onDiceClick: () => performRoll()
    });
    ui = new GameUI(uiRoot, {
      onRoll: performRoll,
      onEndTurn: finishTurn,
      onBuy: () => {
        if (actionLock) return;
        const result = buyProperty(state);
        if (!result.ok) { ui.showToast(result.reason, 'warning'); return; }
        applyEventVisuals(result.events); refresh(); window.setTimeout(finishTurn, 420);
      },
      onDecline: () => {
        if (actionLock) return;
        const result = declineProperty(state);
        if (!result.ok) { ui.showToast(result.reason, 'warning'); return; }
        refresh();
        ui.openAuction(state, state.pending.tileId);
      },
      onAuctionSubmit: (amount) => {
        if (actionLock) return;
        const tileId = state.pending?.tileId;
        if (!tileId) return;
        const proposals = makeAuctionProposals(state, amount);
        const result = runSealedAuction(state, tileId, proposals);
        if (!result.ok) { ui.showToast(result.reason, 'warning'); return; }
        ui.closeModal();
        applyEventVisuals(result.events || []);
        refresh();
        window.setTimeout(finishTurn, 500);
      },
      onCardContinue: () => {
        if (actionLock) return;
        const result = dismissPending(state);
        if (result.ok) { ui.closeModal(); refresh(); finishTurn(); }
      },
      onJailPay: () => {
        if (actionLock) return;
        const result = payJail(state);
        if (!result.ok) { ui.showToast(result.reason, 'warning'); return; }
        applyEventVisuals(result.events); refresh(); finishTurn();
      },
      onJailCard: () => {
        if (actionLock) return;
        const result = useJailCard(state);
        if (!result.ok) { ui.showToast(result.reason, 'warning'); return; }
        applyEventVisuals(result.events); refresh(); finishTurn();
      },
      onAutopilot: (playerId) => {
        const player = state.players[playerId];
        if (!player) return;
        const result = setAutopilot(state, playerId, !player.autopilot);
        if (result.ok) { audio.click(); refresh(); scheduleAI(400); }
      },
      onBuild: (tileId) => {
        if (actionLock) return;
        const result = buildProperty(state, tileId);
        if (!result.ok) { ui.showToast(result.reason, 'warning'); return; }
        applyEventVisuals(result.events); refresh(); ui.openTileInspector(state, tileId);
      },
      onMortgage: (tileId) => {
        if (actionLock) return;
        const result = mortgageProperty(state, tileId);
        if (!result.ok) { ui.showToast(result.reason, 'warning'); return; }
        applyEventVisuals(result.events); refresh(); ui.openTileInspector(state, tileId);
      },
      onUnmortgage: (tileId) => {
        if (actionLock) return;
        const result = unmortgageProperty(state, tileId);
        if (!result.ok) { ui.showToast(result.reason, 'warning'); return; }
        applyEventVisuals(result.events); refresh(); ui.openTileInspector(state, tileId);
      },
      onSkillReroll: (dieIndex) => {
        if (actionLock) return;
        const result = useSkillReroll(state, dieIndex);
        if (!result.ok) { ui.showToast(result.reason, 'warning'); return; }
        applyEventVisuals(result.events); refresh();
      },
      onKeepReroll: () => {
        if (actionLock) return;
        const result = keepSkillReroll(state);
        if (!result.ok) { ui.showToast(result.reason, 'warning'); return; }
        applyEventVisuals(result.events); refresh();
      },
      onCharacterConfirm: (playerId) => startSelectedGame(playerId),
      onNewGame: resetGame,
      onCameraReset: () => world.focusCenter(),
      onAudioToggle: (enabled) => { audio.setEnabled(enabled); if (enabled) audio.click(); }
    });
    characters = createAllCharacters();
    characters.forEach((character, index) => {
      world.scene.add(character);
      setCharacterTile(character, 0, state.players[index].avatarOffset, (positionIndex, slot) => world.getTileWorldPosition(positionIndex, slot));
    });
    world.updateState(state);
    ui.update(state);
    updateCharacters();
    window.setTimeout(() => {
      bootScreen?.classList.add('is-ready');
      if (loadedFromSave) {
        ui.showToast('已恢复上一局百业盛典', 'normal');
        scheduleAI(500);
      } else {
        ui.openCharacterSelect(state.humanPlayerId ?? 0);
      }
    }, 850);
    if (loadedFromSave) scheduleAI(500);
    window.__RICH_GAME__ = { state: () => state, world, ui, performRoll, resetGame, startSelectedGame };
  } catch (error) {
    console.error(error);
    bootScreen?.classList.add('is-ready');
    uiRoot.innerHTML = `<div class="fatal-screen"><div class="modal-ornament">!</div><h1>3D 棋盘暂时无法点亮</h1><p>请确认浏览器已开启 WebGL，然后刷新页面。</p><small>${String(error.message || error)}</small></div>`;
  }
}

function createAllCharacters() {
  return state.players.map((player, index) => createCharacter(player, index));
}

initialize();
