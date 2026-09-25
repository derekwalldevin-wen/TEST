export const STATE_VERSION = 2;
export const START_CASH = 1500;
export const MAX_ROUNDS = 60;
export const JAIL_POSITION = 10;
export const JAIL_INDEX = 10;

export const GROUPS = [
  { id: 'bamboo', name: '翠竹坊', color: '#4e9d72', light: '#c7e5cb', ink: '#173e31' },
  { id: 'cloud', name: '云锦坊', color: '#d3a33a', light: '#f3dda0', ink: '#4b3514' },
  { id: 'river', name: '碧波坊', color: '#3f91b5', light: '#b7deeb', ink: '#153b4c' },
  { id: 'city', name: '锦官坊', color: '#c85b4f', light: '#efc0ae', ink: '#4e2420' },
  { id: 'garden', name: '园林坊', color: '#8d69a8', light: '#d9c5e5', ink: '#3e2a4a' },
  { id: 'sun', name: '鎏金坊', color: '#df8236', light: '#f4c58b', ink: '#533014' },
  { id: 'star', name: '星宿坊', color: '#4b648e', light: '#bacbe1', ink: '#1e2d49' }
];

const property = (id, group, name, price, rents, buildCost, monopoly = 100) => ({
  id, kind: 'property', group, name, price, rents, buildCost, monopoly
});

export const BOARD = [
  { id: 'go', kind: 'go', name: '起航广场', salary: 200 },
  property('p01', 'bamboo', '竹影巷', 60, [2, 10, 30, 90, 160, 250], 60),
  { id: 'chest-2', kind: 'chest', name: '机缘宝箱', deck: 'chest' },
  property('p03', 'bamboo', '月桥坊', 60, [4, 20, 60, 180, 320, 450], 60),
  { id: 'tax-4', kind: 'tax', name: '税务官', amount: 200 },
  { id: 'road-5', kind: 'road', name: '北方商路', price: 200, rents: [25, 50, 100, 200] },
  property('p06', 'cloud', '云锦坊', 100, [6, 30, 90, 270, 400, 550], 100),
  { id: 'chance-7', kind: 'chance', name: '风向签', deck: 'chance' },
  property('p08', 'cloud', '丹霞巷', 100, [6, 30, 90, 270, 400, 550], 100),
  property('p09', 'cloud', '青瓷坊', 120, [8, 40, 120, 360, 520, 700], 100),
  { id: 'jail', kind: 'jail', name: '巡安府', jail: true },
  property('p11', 'river', '碧波坊', 140, [10, 50, 150, 450, 625, 900], 100),
  { id: 'utility-12', kind: 'utility', name: '水司', price: 150, utilityMultipliers: [4, 10] },
  property('p13', 'river', '杏林坊', 140, [10, 50, 150, 450, 625, 900], 100),
  property('p14', 'river', '梅林坊', 160, [12, 60, 180, 540, 750, 1100], 100),
  { id: 'road-15', kind: 'road', name: '东方商路', price: 200, rents: [25, 50, 100, 200] },
  property('p16', 'city', '锦官坊', 180, [14, 70, 210, 630, 900, 1270], 100),
  { id: 'chest-17', kind: 'chest', name: '机缘宝箱', deck: 'chest' },
  property('p18', 'city', '梨园坊', 180, [14, 70, 210, 630, 900, 1270], 100),
  property('p19', 'city', '星河坊', 200, [16, 80, 240, 720, 1020, 1440], 100),
  { id: 'park-20', kind: 'park', name: '休憩花园' },
  property('p21', 'garden', '南风坊', 200, [18, 90, 270, 810, 1150, 1600], 100),
  { id: 'chance-22', kind: 'chance', name: '风向签', deck: 'chance' },
  property('p23', 'garden', '鹤鸣坊', 220, [20, 100, 300, 900, 1275, 1800], 100),
  property('p24', 'garden', '玉衡坊', 220, [20, 100, 300, 900, 1275, 1800], 100),
  { id: 'road-25', kind: 'road', name: '南方商路', price: 200, rents: [25, 50, 100, 200] },
  property('p26', 'sun', '金山坊', 240, [22, 110, 330, 990, 1400, 2000], 150),
  { id: 'utility-27', kind: 'utility', name: '电光司', price: 150, utilityMultipliers: [4, 10] },
  property('p28', 'sun', '凤凰坊', 240, [22, 110, 330, 990, 1400, 2000], 150),
  { id: 'goto-29', kind: 'goto-jail', name: '巡安府传送' },
  property('p30', 'star', '海门坊', 260, [26, 130, 390, 1170, 1650, 2300], 150),
  property('p31', 'star', '潮生坊', 260, [26, 130, 390, 1170, 1650, 2300], 150),
  { id: 'chest-32', kind: 'chest', name: '机缘宝箱', deck: 'chest' },
  property('p33', 'star', '观星坊', 280, [28, 140, 420, 1260, 1780, 2500], 150),
  { id: 'road-34', kind: 'road', name: '西方商路', price: 200, rents: [25, 50, 100, 200] },
  { id: 'chance-35', kind: 'chance', name: '风向签', deck: 'chance' },
  property('p36', 'star', '天枢坊', 300, [32, 160, 480, 1440, 2020, 2800], 150),
  { id: 'tax-37', kind: 'tax', name: '慈善捐纳', amount: 100 },
  property('p38', 'star', '蓬莱坊', 320, [36, 180, 540, 1620, 2280, 3200], 150),
  { id: 'center-39', kind: 'center', name: '长安中心' }
];

export const TILES_BY_ID = new Map(BOARD.map((tile) => [tile.id, tile]));

export const PLAYER_DEFS = [
  {
    id: 0, name: '嘟嘟', character: 'panda', color: '#d9b35c', accent: '#c44f3d', title: '熊猫掌柜',
    skill: { id: 'prosperous-panda', name: '招财熊猫', tag: '省租', maxUses: 3, description: '每局 3 次，支付租金时减免 20%。' }
  },
  {
    id: 1, name: '唐糖', character: 'tang', color: '#4b9b83', accent: '#e1a43a', title: '花朝执事',
    skill: { id: 'flower-blessing', name: '花朝祝福', tag: '分红', maxUses: 0, description: '每完成 3 回合，获得 100 文并抽一张机缘卡。' }
  },
  {
    id: 2, name: '三太子', character: 'youth', color: '#b83f46', accent: '#dc7a42', title: '游侠少主',
    skill: { id: 'wanderer-step', name: '游侠行动', tag: '重骰', maxUses: 2, description: '每局 2 次，掷骰后可重掷一枚骰子。' }
  },
  {
    id: 3, name: '德小文', character: 'explorer', color: '#477ba8', accent: '#e2b64f', title: '远行探险家',
    skill: { id: 'travel-compass', name: '远行罗盘', tag: '建设', maxUses: 5, description: '每完成一圈，自动为一处已集齐同组的地产免费升级。' }
  }
];

export const CHEST_CARDS = [
  { title: '春日分红', text: '山海商会送来一笔分红。', amount: 80 },
  { title: '街坊答谢', text: '替你修好了一处店面。', amount: -50 },
  { title: '意外订单', text: '一单书画生意谈成了。', amount: 120 },
  { title: '免费驿游', text: '沿商路巡游，暂不收取费用。', amount: 0 },
  { title: '春日茶礼', text: '你给全城送了一份茶礼。', amount: -70 },
  { title: '旧藏升值', text: '一件旧藏被识出真品。', amount: 160 },
  { title: '平安符', text: '本回合免除一次普通费用。', amount: 0 }
];

export const CHANCE_CARDS = [
  { title: '商会红包', text: '长风商会送来贺礼。', amount: 100 },
  { title: '灵感迸发', text: '一项新点子得到赏识。', amount: -60 },
  { title: '古街地契', text: '你获得一笔临门收益。', amount: 150 },
  { title: '绕道行旅', text: '沿途风景很好，本回合不结算。', amount: 0 },
  { title: '桥上修缮', text: '为修桥添了一块金砖。', amount: -80 },
  { title: '风调雨顺', text: '商铺景气，收入增加。', amount: 180 },
  { title: '官府嘉奖', text: '你的善举得到嘉奖。', amount: 0 }
];

const randomDie = (rng) => Math.floor(rng() * 6) + 1;
const totalDice = (dice) => dice[0] + dice[1];
const activePlayers = (state) => state.players.filter((player) => !player.bankrupt);
const current = (state) => state.players[state.currentPlayer];
const tileAt = (state, position) => BOARD[position];

const event = (type, payload = {}) => ({ type, ...payload });
const addLog = (state, text, tone = 'normal') => {
  state.logs.unshift({ id: `${Date.now()}-${state.logs.length}`, text, tone, round: state.round });
  state.logs = state.logs.slice(0, 80);
};

export function createInitialState(seed = Date.now(), humanId = 0) {
  const selectedId = PLAYER_DEFS.some((def) => def.id === Number(humanId)) ? Number(humanId) : 0;
  return {
    version: STATE_VERSION,
    seed,
    humanPlayerId: selectedId,
    round: 1,
    currentPlayer: selectedId,
    phase: 'awaiting-roll',
    winner: null,
    pending: null,
    lastRoll: null,
    players: PLAYER_DEFS.map((def, index) => ({
      ...def,
      ai: def.id !== selectedId,
      cash: START_CASH,
      position: 0,
      owned: [],
      buildings: {},
      jailTurns: 0,
      lastDoubles: 0,
      turnsPlayed: 0,
      lapsCompleted: 0,
      skillUses: 0,
      skillPulseTurn: -1,
      inJail: false,
      bankrupt: false,
      autopilot: def.id !== selectedId,
      avatarOffset: index * 0.38
    })),
    tiles: Object.fromEntries(BOARD.map((tile) => [tile.id, { owner: null, buildings: 0, mortgaged: false }])),
    logs: [],
    cardIndex: { chest: 0, chance: 0 }
  };
}

function seededRandom(seed) {
  let value = Number(seed) >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function skillUpgradeTarget(state, playerId) {
  return playerId == null ? null : state.players[playerId].owned
    .map((tileId) => ({ tileId, tile: TILES_BY_ID.get(tileId), level: state.tiles[tileId].buildings }))
    .filter(({ tile, level }) => tile?.kind === 'property' && level < 3 && !state.tiles[tile.id].mortgaged && groupMonopoly(state, playerId, tile.group))
    .sort((a, b) => b.tile.price - a.tile.price || a.level - b.level)[0]?.tileId || null;
}

function triggerPassiveSkill(state, player, events) {
  if (player.skill?.id !== 'flower-blessing' || player.turnsPlayed <= 0 || player.turnsPlayed % 3 !== 0 || player.skillPulseTurn === player.turnsPlayed) return;
  const card = CHANCE_CARDS[state.cardIndex.chance % CHANCE_CARDS.length];
  state.cardIndex.chance += 1;
  const amount = 100 + card.amount;
  player.cash += amount;
  player.skillPulseTurn = player.turnsPlayed;
  events.push(event('skill-blessing', { playerId: player.id, amount, card: { ...card } }));
  addLog(state, `${player.name} 触发「花朝祝福」：获得${amount}文，并抽到「${card.title}」。`, 'good');
}

function triggerCompassSkill(state, player, events) {
  if (player.skill?.id !== 'travel-compass' || player.skillUses >= player.skill.maxUses) return false;
  const tileId = skillUpgradeTarget(state, player.id);
  if (!tileId) return false;
  const tile = TILES_BY_ID.get(tileId);
  state.tiles[tileId].buildings += 1;
  player.skillUses += 1;
  events.push(event('skill-build', { playerId: player.id, tileId, level: state.tiles[tileId].buildings, free: true }));
  addLog(state, `${player.name} 的「远行罗盘」为${tile.name}免费升级至 ${state.tiles[tileId].buildings} 级。`, 'good');
  return true;
}

export function calculatePropertyRent(state, tileId) {
  const tile = TILES_BY_ID.get(tileId);
  const tileState = state.tiles[tile.id];
  if (!tile || tile.kind !== 'property') return 0;
  if (tileState.mortgaged) return 0;
  const owner = state.players[tileState.owner];
  if (!owner) return tile.rents[0];
  const groupOwned = BOARD.filter((item) => item.kind === 'property' && item.group === tile.group)
    .every((item) => state.tiles[item.id].owner === owner.id);
  if (!groupOwned) return tile.rents[0];
  return tile.rents[tileState.buildings + 1];
}

export function calculateRoadRent(state, tileId) {
  const tile = TILES_BY_ID.get(tileId);
  const owner = state.tiles[tile.id].owner;
  if (owner == null) return 0;
  const count = BOARD.filter((item) => item.kind === 'road' && state.tiles[item.id].owner === owner).length;
  return tile.rents[Math.max(0, count - 1)];
}

export function calculateUtilityRent(state, tileId, diceTotal) {
  const tile = TILES_BY_ID.get(tileId);
  const owner = state.tiles[tile.id].owner;
  if (owner == null) return 0;
  const count = BOARD.filter((item) => item.kind === 'utility' && state.tiles[item.id].owner === owner).length;
  return Math.max(10, diceTotal) * (count === 1 ? tile.utilityMultipliers[0] : tile.utilityMultipliers[1]);
}

export function countOwnedBy(state, playerId) {
  return BOARD.filter((tile) => state.tiles[tile.id].owner === playerId).length;
}

export function groupMonopoly(state, playerId, groupId) {
  const groupTiles = BOARD.filter((tile) => tile.kind === 'property' && tile.group === groupId);
  return groupTiles.length > 0 && groupTiles.every((tile) => state.tiles[tile.id].owner === playerId);
}

export function assetValue(state, player) {
  const propertyValue = player.owned.reduce((sum, tileId) => {
    const tile = TILES_BY_ID.get(tileId);
    const tileState = state.tiles[tileId];
    const buildingValue = tile.kind === 'property' ? tileState.buildings * tile.buildCost : 0;
    return sum + (tileState.mortgaged ? Math.floor(tile.price * 0.45) : tile.price + buildingValue);
  }, 0);
  return player.cash + propertyValue;
}

export function computeWinner(state) {
  const alive = activePlayers(state);
  if (alive.length === 1) return alive[0].id;
  if (state.round > MAX_ROUNDS && alive.length > 0) {
    return [...alive].sort((a, b) => assetValue(state, b) - assetValue(state, a))[0].id;
  }
  return null;
}

function transferCash(state, from, to, amount, reason, events) {
  const payer = state.players[from];
  const payee = to == null ? null : state.players[to];
  const payment = Math.max(0, Math.min(amount, payer.cash));
  payer.cash -= payment;
  if (payee) payee.cash += payment;
  events.push(event('cash', { playerId: from, toPlayerId: to, amount: payment, reason }));
  if (payer.cash === 0 && assetValue(state, payer) <= 0) {
    payer.bankrupt = true;
    payer.pending = null;
    events.push(event('bankrupt', { playerId: from }));
    addLog(state, `${payer.name} 资不抵债，止步山海城。`, 'danger');
  }
  return payment;
}

function finishRoll(state, player, events) {
  const tile = tileAt(state, player.position);
  const diceTotal = state.lastRoll.total;
  if (tile.kind === 'go') {
    player.cash += tile.salary;
    events.push(event('salary', { playerId: player.id, amount: tile.salary }));
    addLog(state, `${player.name} 经过起航广场，领取 ${tile.salary} 文。`, 'good');
  } else if (tile.kind === 'property' || tile.kind === 'road' || tile.kind === 'utility') {
    const tileState = state.tiles[tile.id];
    if (tileState.owner == null) {
      state.pending = { kind: 'property', tileId: tile.id };
      state.phase = 'awaiting-action';
      addLog(state, `${player.name} 抵达${tile.name}，可以购买或竞拍。`);
    } else if (tileState.owner === player.id) {
      addLog(state, `${player.name} 回到自己的${tile.name}。`);
    } else {
      const owner = state.players[tileState.owner];
      let rent = 0;
      if (tile.kind === 'property') rent = calculatePropertyRent(state, tile.id);
      if (tile.kind === 'road') rent = calculateRoadRent(state, tile.id);
      if (tile.kind === 'utility') rent = calculateUtilityRent(state, tile.id, diceTotal);
      if (rent > 0) {
        let discount = 0;
        if (player.skill?.id === 'prosperous-panda' && player.skillUses < player.skill.maxUses) {
          discount = Math.floor(rent * 0.2);
          player.skillUses += 1;
          events.push(event('skill-rent-discount', { playerId: player.id, amount: discount, remaining: player.skill.maxUses - player.skillUses }));
          addLog(state, `${player.name} 触发「招财熊猫」，减免${discount}文租金。`, 'good');
        }
        rent -= discount;
        transferCash(state, player.id, owner.id, rent, `${tile.name}租金`, events);
        addLog(state, `${player.name} 向${owner.name}支付${rent}文${tile.name}租金。`, 'warning');
      }
    }
  } else if (tile.kind === 'tax') {
    transferCash(state, player.id, null, tile.amount, tile.name, events);
    addLog(state, `${player.name} 缴纳${tile.amount}文${tile.name}。`, 'warning');
  } else if (tile.kind === 'chest' || tile.kind === 'chance') {
    const deck = tile.kind === 'chest' ? CHEST_CARDS : CHANCE_CARDS;
    const deckName = tile.deck;
    const card = deck[state.cardIndex[deckName] % deck.length];
    state.cardIndex[deckName] += 1;
    if (card.amount > 0) {
      player.cash += card.amount;
      events.push(event('cash', { playerId: player.id, toPlayerId: player.id, amount: card.amount, reason: card.title }));
    } else if (card.amount < 0) {
      transferCash(state, player.id, null, Math.abs(card.amount), card.title, events);
    }
    state.pending = { kind: 'card', tileId: tile.id, card: { ...card } };
    addLog(state, `${player.name} 抽到「${card.title}」：${card.text}`, card.amount >= 0 ? 'good' : 'warning');
  } else if (tile.kind === 'goto-jail') {
    player.position = JAIL_POSITION;
    player.inJail = true;
    player.jailTurns = 0;
    player.lastDoubles = 0;
    addLog(state, `${player.name} 被传送到巡安府。`, 'danger');
    events.push(event('jail', { playerId: player.id, forced: true }));
  } else if (tile.kind === 'jail') {
    addLog(state, `${player.name} 在巡安府休整，等待下一回合。`, 'warning');
  } else if (tile.kind === 'park') {
    addLog(state, `${player.name} 在休憩花园听了一场雨，情绪正好。`, 'good');
  } else if (tile.kind === 'center') {
    addLog(state, `${player.name} 抵达长安中心，财运 +1。`, 'good');
    player.cash += 100;
    events.push(event('cash', { playerId: player.id, toPlayerId: player.id, amount: 100, reason: '长安中心' }));
  }
  if (!state.pending && !player.bankrupt) state.phase = 'awaiting-roll';
}

export function roll(state, { dice = null, forcedTotal = null, rng = seededRandom(state.seed + state.round * 97) } = {}) {
  const player = current(state);
  if (state.phase !== 'awaiting-roll' || player.bankrupt) return { ok: false, reason: '当前不能掷骰' };
  if (state.winner != null) return { ok: false, reason: '本局已经结束' };
  if (player.inJail && player.jailTurns < 3) {
    return { ok: false, reason: `还需在巡安府停留 ${3 - player.jailTurns} 回合` };
  }
  const events = [];
  triggerPassiveSkill(state, player, events);
  const rolledDice = dice || [randomDie(rng), randomDie(rng)];
  if (forcedTotal != null) {
    const first = forcedTotal <= 7 ? 1 : 6;
    rolledDice[0] = first;
    rolledDice[1] = forcedTotal - first;
  }
  const total = totalDice(rolledDice);
  const oldPosition = player.position;
  const doubles = rolledDice[0] === rolledDice[1];
  player.lastDoubles = doubles ? player.lastDoubles + 1 : 0;
  if (player.inJail && doubles) {
    player.inJail = false;
    player.jailTurns = 0;
    addLog(state, `${player.name} 掷出双 ${rolledDice[0]}，离开巡安府！`, 'good');
  }
  const goSalary = player.position >= 37 && oldPosition + total > 39;
  player.position = (oldPosition + total) % BOARD.length;
  state.lastRoll = { dice: [...rolledDice], total, playerId: player.id, doubles };
  state.phase = 'resolving';
  events.push(event('roll', { playerId: player.id, dice: [...rolledDice], total, doubles }), event('move', { playerId: player.id, from: oldPosition, to: player.position }));
  if (goSalary) {
    const salary = tileAt(state, 0).salary;
    player.cash += salary;
    player.lapsCompleted += 1;
    events.push(event('salary', { playerId: player.id, amount: salary, lap: player.lapsCompleted }));
    triggerCompassSkill(state, player, events);
  }
  if (player.lastDoubles >= 3 && !player.inJail) {
    player.position = JAIL_POSITION;
    player.inJail = true;
    player.jailTurns = 0;
    player.lastDoubles = 0;
    events.push(event('jail', { playerId: player.id, forced: true }));
    addLog(state, `${player.name} 连续三次掷出相同点数，被请进巡安府。`, 'danger');
  } else {
    finishRoll(state, player, events);
  }
  if (!state.pending && !player.bankrupt && player.skill?.id === 'wanderer-step' && player.skillUses < player.skill.maxUses) {
    state.pending = { kind: 'skill-reroll', dieIndex: null };
    state.phase = 'awaiting-action';
    addLog(state, `${player.name} 的「游侠行动」可以重掷一枚骰子。`, 'good');
  }
  state.phase = state.pending ? 'awaiting-action' : (player.bankrupt ? 'game-over' : 'awaiting-roll');
  const winner = computeWinner(state);
  if (winner != null && state.winner == null) {
    state.winner = winner;
    state.phase = 'game-over';
    events.push(event('winner', { playerId: winner }));
    addLog(state, `${state.players[winner].name} 赢得这场百业盛典！`, 'good');
  }
  return { ok: true, events, state };
}

export function buyProperty(state, tileId = state.pending?.tileId) {
  const player = current(state);
  const tile = TILES_BY_ID.get(tileId);
  if (!player || state.phase !== 'awaiting-action' || state.pending?.kind !== 'property' || state.pending.tileId !== tileId) {
    return { ok: false, reason: '当前不能购买该地产' };
  }
  if (state.tiles[tileId].owner != null) return { ok: false, reason: '该地产已有主人' };
  if (player.cash < tile.price) return { ok: false, reason: '现金不足' };
  player.cash -= tile.price;
  player.owned.push(tileId);
  state.tiles[tileId].owner = player.id;
  state.tiles[tileId].mortgaged = false;
  state.pending = null;
  state.phase = 'awaiting-roll';
  addLog(state, `${player.name} 以${tile.price}文买下${tile.name}。`, 'good');
  return { ok: true, events: [event('buy', { playerId: player.id, tileId, amount: tile.price })] };
}

export function declineProperty(state) {
  if (state.phase !== 'awaiting-action' || state.pending?.kind !== 'property') return { ok: false, reason: '当前没有待处理地产' };
  const tile = TILES_BY_ID.get(state.pending.tileId);
  const player = current(state);
  addLog(state, `${player.name} 暂不购买${tile.name}，开放竞拍。`);
  return { ok: true, events: [event('decline', { playerId: player.id, tileId: tile.id })] };
}

export function runSealedAuction(state, tileId, proposals) {
  const tile = TILES_BY_ID.get(tileId);
  const player = current(state);
  if (state.phase !== 'awaiting-action' || state.pending?.kind !== 'property' || state.pending.tileId !== tileId) {
    return { ok: false, reason: '当前不能竞拍' };
  }
  const valid = Object.entries(proposals || {})
    .map(([id, amount]) => ({ id: Number(id), amount: Math.max(0, Math.floor(Number(amount) || 0)) }))
    .filter(({ id, amount }) => state.players[id] && !state.players[id].bankrupt && amount > 0 && amount <= state.players[id].cash)
    .sort((a, b) => b.amount - a.amount || a.id - b.id);
  if (!valid.length) {
    state.pending = null;
    state.phase = 'awaiting-roll';
    return { ok: true, winnerId: null, events: [event('auction-won', { tileId, winnerId: null })] };
  }
  const winner = valid[0];
  state.players[winner.id].cash -= winner.amount;
  state.players[winner.id].owned.push(tileId);
  state.tiles[tileId].owner = winner.id;
  state.tiles[tileId].mortgaged = false;
  state.pending = null;
  state.phase = 'awaiting-roll';
  addLog(state, `${state.players[winner.id].name} 以${winner.amount}文竞得${tile.name}。`, 'good');
  return { ok: true, winnerId: winner.id, events: [event('auction-won', { tileId, winnerId: winner.id, amount: winner.amount })] };
}

export function buildProperty(state, tileId) {
  const player = current(state);
  const tile = TILES_BY_ID.get(tileId);
  const tileState = state.tiles[tileId];
  if (!player || !tile || tile.kind !== 'property' || tileState.owner !== player.id || tileState.mortgaged) return { ok: false, reason: '无法升级该地产' };
  if (tileState.buildings >= 3) return { ok: false, reason: '已达最高等级' };
  if (!groupMonopoly(state, player.id, tile.group)) return { ok: false, reason: '需要集齐同组地产' };
  if (player.cash < tile.buildCost) return { ok: false, reason: '现金不足' };
  player.cash -= tile.buildCost;
  tileState.buildings += 1;
  addLog(state, `${player.name} 将${tile.name}升级至 ${tileState.buildings} 级，租金提升。`, 'good');
  return { ok: true, events: [event('build', { playerId: player.id, tileId, level: tileState.buildings })] };
}

export function mortgageProperty(state, tileId) {
  const player = current(state);
  const tile = TILES_BY_ID.get(tileId);
  const tileState = state.tiles[tileId];
  if (!player || !tile || tileState.owner !== player.id || tileState.mortgaged || tileState.buildings > 0) return { ok: false, reason: '该地产无法抵押' };
  tileState.mortgaged = true;
  player.cash += Math.floor(tile.price * 0.5);
  addLog(state, `${player.name} 抵押${tile.name}，获得${Math.floor(tile.price * 0.5)}文。`, 'warning');
  return { ok: true, events: [event('mortgage', { playerId: player.id, tileId, amount: Math.floor(tile.price * 0.5) })] };
}

export function unmortgageProperty(state, tileId) {
  const player = current(state);
  const tile = TILES_BY_ID.get(tileId);
  const tileState = state.tiles[tileId];
  if (!player || !tile || tileState.owner !== player.id || !tileState.mortgaged) return { ok: false, reason: '该地产无需解押' };
  const cost = Math.floor(tile.price * 0.55);
  if (player.cash < cost) return { ok: false, reason: '现金不足' };
  player.cash -= cost;
  tileState.mortgaged = false;
  addLog(state, `${player.name} 为${tile.name}支付${cost}文解除抵押。`, 'good');
  return { ok: true, events: [event('unmortgage', { playerId: player.id, tileId, amount: cost })] };
}

export function payJail(state) {
  const player = current(state);
  if (!player?.inJail || player.cash < 80) return { ok: false, reason: '无法支付保释金' };
  player.cash -= 80;
  player.inJail = false;
  player.jailTurns = 0;
  addLog(state, `${player.name} 支付80文，离开巡安府。`, 'good');
  return { ok: true, events: [event('jail-paid', { playerId: player.id, amount: 80 })] };
}

export function useJailCard(state) {
  const player = current(state);
  if (!player?.inJail) return { ok: false, reason: '当前不在巡安府' };
  player.inJail = false;
  player.jailTurns = 0;
  addLog(state, `${player.name} 使用平安符离开了巡安府。`, 'good');
  return { ok: true, events: [event('jail-card', { playerId: player.id })] };
}

export function useSkillReroll(state, dieIndex = 0) {
  const player = current(state);
  if (!player || state.pending?.kind !== 'skill-reroll') return { ok: false, reason: '当前没有可重掷的骰子' };
  if (![0, 1].includes(Number(dieIndex))) return { ok: false, reason: '请选择要重掷的骰子' };
  const dice = [...state.lastRoll.dice];
  const oldValue = dice[Number(dieIndex)];
  dice[Number(dieIndex)] = Math.floor(Math.random() * 6) + 1;
  state.lastRoll = { ...state.lastRoll, dice, total: dice[0] + dice[1], doubles: dice[0] === dice[1], rerolled: true };
  player.skillUses += 1;
  state.pending = null;
  state.phase = 'awaiting-roll';
  addLog(state, `${player.name} 使用「游侠行动」重掷一枚骰子：${oldValue} → ${dice[Number(dieIndex)]}。`, 'good');
  return { ok: true, events: [event('skill-reroll', { playerId: player.id, dieIndex: Number(dieIndex), oldValue, value: dice[Number(dieIndex)], remaining: player.skill.maxUses - player.skillUses })] };
}

export function keepSkillReroll(state) {
  if (state.pending?.kind !== 'skill-reroll') return { ok: false, reason: '当前没有待处理的重骰行动' };
  const player = current(state);
  state.pending = null;
  state.phase = 'awaiting-roll';
  addLog(state, `${player.name} 收起了「游侠行动」，保留本次骰点。`);
  return { ok: true, events: [event('skill-reroll-keep', { playerId: player.id })] };
}

export function dismissPending(state) {
  if (!state.pending || state.pending.kind !== 'card') return { ok: false, reason: '当前没有可收起的机缘牌' };
  state.pending = null;
  state.phase = 'awaiting-roll';
  return { ok: true, events: [] };
}

export function endTurn(state) {
  if (state.pending) return { ok: false, reason: '还有待处理行动' };
  const player = current(state);
  if (!player || player.bankrupt) return { ok: false, reason: '当前玩家不可行动' };
  if (player.inJail) {
    player.jailTurns += 1;
    if (player.jailTurns >= 3) {
      player.inJail = false;
      player.jailTurns = 0;
      addLog(state, `${player.name} 服满三日，获准离开巡安府。`, 'good');
    }
  }
  const alive = activePlayers(state);
  player.turnsPlayed += 1;
  let nextIndex = (state.currentPlayer + 1) % state.players.length;
  let guard = 0;
  while (state.players[nextIndex].bankrupt && guard++ < state.players.length) nextIndex = (nextIndex + 1) % state.players.length;
  if (state.currentPlayer === state.players.length - 1 || nextIndex === 0) state.round += 1;
  state.currentPlayer = nextIndex;
  state.pending = null;
  state.phase = state.winner == null ? 'awaiting-roll' : 'game-over';
  if (state.round > MAX_ROUNDS) {
    state.winner = computeWinner(state);
    state.phase = 'game-over';
  }
  return { ok: true, events: [event('turn', { playerId: state.currentPlayer, round: state.round })] };
}

export function liquidateAndBankrupt(state, playerId) {
  const player = state.players[playerId];
  if (!player || player.bankrupt) return { ok: false, reason: '玩家已经出局' };
  player.owned.forEach((tileId) => {
    state.tiles[tileId].owner = null;
    state.tiles[tileId].buildings = 0;
    state.tiles[tileId].mortgaged = false;
  });
  player.owned = [];
  player.cash = 0;
  player.bankrupt = true;
  if (player.autopilot) player.autopilot = false;
  const winner = computeWinner(state);
  if (winner != null) {
    state.winner = winner;
    state.phase = 'game-over';
    if (state.currentPlayer === playerId) state.pending = null;
  } else if (state.currentPlayer === playerId) {
    state.pending = null;
    endTurn(state);
  }
  addLog(state, `${player.name} 结束旅程，资产归入商会。`, 'danger');
  return { ok: true, events: [event('bankrupt', { playerId })] };
}

export function setAutopilot(state, playerId, enabled) {
  const player = state.players[playerId];
  if (!player || player.bankrupt) return { ok: false, reason: '玩家不存在' };
  player.autopilot = enabled;
  return { ok: true, events: [event('autopilot', { playerId, enabled })] };
}

export function canBuy(state, playerId, tileId) {
  const player = state.players[playerId];
  const tile = TILES_BY_ID.get(tileId);
  return Boolean(player && tile && ['property', 'road', 'utility'].includes(tile.kind) && state.tiles[tileId].owner == null && player.cash >= tile.price);
}

export function aiShouldBuy(state, playerId, tileId) {
  const player = state.players[playerId];
  const tile = TILES_BY_ID.get(tileId);
  if (!player || !tile || !canBuy(state, playerId, tileId)) return false;
  const groupCount = tile.kind === 'property' ? BOARD.filter((item) => item.kind === 'property' && item.group === tile.group && state.tiles[item.id].owner === playerId).length : 0;
  const reserve = 120 + state.players.filter((item) => !item.bankrupt).length * 40;
  const affordability = player.cash - tile.price;
  const urgency = groupCount > 0 ? 0.34 : 0.24;
  const rivals = state.players.filter((item) => item.id !== playerId && !item.bankrupt && assetValue(state, item) > player.cash).length;
  const aggression = Math.min(0.12, rivals * 0.025) + Math.min(0.08, state.round / 900);
  return affordability >= reserve * (0.5 + rivals * 0.12) && (Math.random() < urgency + aggression || affordability > tile.price * 2.4);
}

export function aiBuildTarget(state, playerId) {
  const player = state.players[playerId];
  if (!player || player.cash < 220) return null;
  const reserve = 180;
  const options = player.owned
    .map((tileId) => ({ tileId, tile: TILES_BY_ID.get(tileId), level: state.tiles[tileId].buildings }))
    .filter(({ tile, level }) => tile.kind === 'property' && level < 3 && !state.tiles[tile.id].mortgaged && groupMonopoly(state, playerId, tile.group) && player.cash - tile.buildCost >= reserve)
    .sort((a, b) => b.tile.price - a.tile.price || a.level - b.level);
  return options[0]?.tileId || null;
}

export function serializeState(state) {
  return JSON.stringify(state);
}

export function restoreState(raw) {
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (!parsed || parsed.version !== STATE_VERSION || !Array.isArray(parsed.players) || parsed.players.length !== 4) throw new Error('存档版本不兼容');
  return parsed;
}
