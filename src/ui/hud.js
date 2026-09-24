import { BOARD, GROUPS, TILES_BY_ID, assetValue, calculatePropertyRent, calculateRoadRent } from '../game/engine.js';

const money = (value) => `${Math.max(0, Math.round(value)).toLocaleString('zh-CN')} 文`;
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const tileName = (id) => TILES_BY_ID.get(id)?.name || '未知地产';
const group = (id) => GROUPS.find((item) => item.id === id);

function actionButton(action, label, className = '', disabled = false, extra = '') {
  return `<button class="action-btn ${className}" data-action="${action}" ${extra} ${disabled ? 'disabled' : ''}>${label}</button>`;
}

export class GameUI {
  constructor(root, callbacks = {}) {
    this.root = root;
    this.callbacks = callbacks;
    this.modalOpen = false;
    this.inspectTileId = null;
    this.audioOn = true;
    this.shellReady = false;
    this.buildShell();
  }

  buildShell() {
    this.root.innerHTML = `
      <div class="hud-shell">
        <header class="topbar">
          <div class="brand-lockup">
            <div class="brand-seal">百业</div>
            <div><div class="brand-title">百业长安</div><div class="brand-subtitle">3D 财富漫游 · 盛唐微缩城</div></div>
          </div>
          <div class="topbar-center"><span class="live-dot"></span><span id="save-status">本地存档已准备</span></div>
          <div class="top-actions">
            <button class="icon-btn" data-action="camera-reset" title="复位镜头">⌂</button>
            <button class="icon-btn" data-action="sound" id="sound-btn" title="音效开关">♫</button>
            <button class="text-btn" data-action="rules">规则</button>
            <button class="text-btn danger-text" data-action="new-game">重开</button>
          </div>
        </header>
        <div class="hud-layout">
          <aside class="left-rail panel-glass">
            <div class="panel-kicker"><span>入席掌柜</span><span class="line"></span><span>4 / 4</span></div>
            <div id="players-list" class="players-list"></div>
            <div class="rail-footnote"><span class="tiny-seal">钱</span><span>地产、现金与建筑共同决定胜负</span></div>
          </aside>
          <section class="stage-ui">
            <div class="stage-copy">
              <div class="eyebrow">山海百业城 · 第 <span id="round-value">1</span> 回合</div>
              <h1 id="turn-title">请德小文掌柜入席</h1>
              <p id="turn-subtitle">骰盅已备好，今日的第一笔生意从起航广场开始。</p>
            </div>
            <div class="stage-metrics">
              <div class="metric-chip"><span>本轮点数</span><strong id="dice-value">—</strong></div>
              <div class="metric-chip"><span>你的净资产</span><strong id="player-worth">—</strong></div>
              <div class="metric-chip"><span>产业版图</span><strong id="property-count">0 / 22</strong></div>
            </div>
            <div id="action-strip" class="action-strip"></div>
            <div class="stage-bottom">
              <div id="turn-hint" class="turn-hint">拖动棋盘可旋转镜头 · 点击地格查看详情</div>
              <div class="dock">
                <button class="roll-button" data-action="roll" id="roll-button"><span class="roll-orb">✦</span><span id="roll-label">掷骰子</span><small>点击骰盅也可以</small></button>
                <button class="dock-button" data-action="end-turn" id="end-turn-button">结束回合 <span>→</span></button>
              </div>
            </div>
          </section>
          <aside class="right-rail panel-glass">
            <div class="panel-kicker"><span>市井快报</span><span class="line"></span><span class="log-count" id="log-count">0</span></div>
            <div id="event-log" class="event-log"></div>
            <div class="ledger-card" id="ledger-card"></div>
          </aside>
        </div>
      </div>
      <div class="modal-layer" id="modal-layer" aria-hidden="true"></div>
      <div class="toast-stack" id="toast-stack"></div>
    `;
    this.shellReady = true;
    this.bindActions();
  }

  bindActions() {
    this.root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (!button || button.disabled) return;
      const action = button.dataset.action;
      if (action === 'roll') this.callbacks.onRoll?.();
      if (action === 'end-turn') this.callbacks.onEndTurn?.();
      if (action === 'buy') this.callbacks.onBuy?.();
      if (action === 'decline') this.callbacks.onDecline?.();
      if (action === 'card-continue') this.callbacks.onCardContinue?.();
      if (action === 'auction-submit') this.callbacks.onAuctionSubmit?.(Number(document.querySelector('#auction-bid')?.value || 0));
      if (action === 'jail-pay') this.callbacks.onJailPay?.();
      if (action === 'jail-card') this.callbacks.onJailCard?.();
      if (action === 'autopilot') this.callbacks.onAutopilot?.(Number(button.dataset.playerId));
      if (action === 'build') this.callbacks.onBuild?.(button.dataset.tileId);
      if (action === 'mortgage') this.callbacks.onMortgage?.(button.dataset.tileId);
      if (action === 'unmortgage') this.callbacks.onUnmortgage?.(button.dataset.tileId);
      if (action === 'inspect') this.openTileInspector(button.dataset.tileId);
      if (action === 'close-modal') this.closeModal();
      if (action === 'rules') this.openRules();
      if (action === 'new-game') this.openNewGame();
      if (action === 'confirm-new-game') { this.closeModal(); this.callbacks.onNewGame?.(); }
      if (action === 'camera-reset') this.callbacks.onCameraReset?.();
      if (action === 'sound') this.toggleAudio();
    });
  }

  update(state) {
    this.state = state;
    if (!this.shellReady) return;
    const current = state.players[state.currentPlayer];
    const currentHuman = current && !current.ai && !current.autopilot;
    const round = document.querySelector('#round-value');
    if (round) round.textContent = state.round;
    const title = document.querySelector('#turn-title');
    const subtitle = document.querySelector('#turn-subtitle');
    const dice = document.querySelector('#dice-value');
    const worth = document.querySelector('#player-worth');
    const count = document.querySelector('#property-count');
    if (title) title.textContent = current ? `${current.name}掌柜的回合` : '本局已结束';
    if (subtitle) subtitle.textContent = this.getTurnSubtitle(state, current, currentHuman);
    if (dice) dice.textContent = state.lastRoll ? `${state.lastRoll.dice[0]} + ${state.lastRoll.dice[1]} = ${state.lastRoll.total}` : '—';
    const human = state.players.find((player) => !player.ai) || state.players[0];
    if (worth) worth.textContent = money(assetValue(state, human));
    if (count) count.textContent = `${human.owned.length} / 22`;
    this.renderPlayers(state);
    this.renderLogs(state);
    this.renderLedger(state, human);
    this.renderActions(state, current, currentHuman);
    this.updateSaveStatus(state);
  }

  getTurnSubtitle(state, player, human) {
    if (state.winner != null) return `${state.players[state.winner].name} 已成为今日的财富传奇。`;
    if (!player) return '本局已经落幕。';
    if (player.bankrupt) return '这位掌柜已经离开了牌桌。';
    if (!human) return `${player.name}正在暗中盘算，AI 不会只盯着眼前的骰子。`;
    if (state.pending?.kind === 'property') return `你在${tileName(state.pending.tileId)}落脚，是买下它还是把它交给市场？`;
    if (state.pending?.kind === 'card') return '一张机缘卡正等着你揭开。';
    if (player.inJail) return `巡安府还需停留 ${Math.max(0, 3 - player.jailTurns)} 回合，可支付保释金或等待。`;
    if (state.phase === 'awaiting-roll') return '骰盅已备好，今日的第一笔生意从起航广场开始。';
    return '把每一枚铜钱都放在会长远的棋路上。';
  }

  renderPlayers(state) {
    const list = document.querySelector('#players-list');
    if (!list) return;
    list.innerHTML = state.players.map((player) => {
      const status = player.bankrupt ? '出局' : player.inJail ? '巡安府' : player.autopilot ? '托管中' : player.id === state.currentPlayer ? '当前' : '候场';
      return `<div class="player-card ${player.id === state.currentPlayer ? 'is-current' : ''} ${player.bankrupt ? 'is-bankrupt' : ''}" style="--player-color:${player.color}" data-player-id="${player.id}">
        <div class="player-card-top"><div class="avatar-dot" style="--avatar:${player.color}">${player.name.slice(0, 1)}</div><div class="player-name"><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.title)}</small></div><span class="player-status ${status === '当前' ? 'status-now' : ''}">${status}</span></div>
        <div class="player-money"><span>现金</span><strong>${money(player.cash)}</strong><span class="player-owned">${player.owned.length} 处产业</span></div>
        <div class="player-progress"><i style="width:${Math.min(100, (player.cash / 5000) * 100)}%;background:${player.color}"></i></div>
        ${player.id === state.currentPlayer ? `<button class="autopilot-mini" data-action="autopilot" data-player-id="${player.id}">${player.autopilot ? '取消托管' : '交给 AI'}</button>` : ''}
      </div>`;
    }).join('');
  }

  renderLogs(state) {
    const log = document.querySelector('#event-log');
    const count = document.querySelector('#log-count');
    if (!log) return;
    if (count) count.textContent = state.logs.length;
    log.innerHTML = state.logs.length ? state.logs.slice(0, 8).map((item) => `<div class="log-row ${item.tone}"><span class="log-mark"></span><p>${escapeHtml(item.text)}</p></div>`).join('') : '<div class="empty-log">第一阵风还没吹来，掷骰后这里会记录每一次转机。</div>';
  }

  renderLedger(state, human) {
    const ledger = document.querySelector('#ledger-card');
    if (!ledger) return;
    const owned = human.owned.slice(-4).reverse();
    ledger.innerHTML = `<div class="ledger-title"><span>我的产业札记</span><span class="ledger-count">${human.owned.length} 处</span></div>${owned.length ? owned.map((id) => {
      const tile = TILES_BY_ID.get(id); const ts = state.tiles[id];
      return `<button class="ledger-row" data-action="inspect" data-tile-id="${id}"><span class="ledger-swatch" style="background:${group(tile.group)?.color || '#b89358'}"></span><span>${tile.name}</span><small>${ts.buildings ? 'Lv.' + ts.buildings : '待经营'}</small><b>${ts.mortgaged ? '抵押' : money(calculatePropertyRent(state, id))}</b></button>`;
    }).join('') : '<div class="ledger-empty">还没有产业札记。去起航广场开张吧。</div>'}`;
  }

  renderActions(state, player, human) {
    const strip = document.querySelector('#action-strip');
    const rollButton = document.querySelector('#roll-button');
    const endButton = document.querySelector('#end-turn-button');
    const hint = document.querySelector('#turn-hint');
    if (!strip) return;
    if (state.winner != null) {
      strip.innerHTML = `<div class="endgame-banner">${escapeHtml(state.players[state.winner].name)} 已登顶百业财富塔</div>`;
      if (rollButton) rollButton.disabled = true;
      if (endButton) endButton.disabled = true;
      return;
    }
    if (!human) {
      strip.innerHTML = `<div class="ai-thinking"><span class="ai-pulse"></span>${escapeHtml(player.name)}正在思考……<small>AI 会比较现金、垄断与租金</small></div>`;
      if (rollButton) rollButton.disabled = true;
      if (endButton) endButton.disabled = true;
      return;
    }
    if (state.pending?.kind === 'property') {
      const tile = TILES_BY_ID.get(state.pending.tileId);
      strip.innerHTML = `<div class="action-card"><div><span class="action-overline">落脚 · ${escapeHtml(group(tile.group)?.name || '公共地')}</span><strong>${escapeHtml(tile.name)}</strong><small>买入价 <b>${money(tile.price)}</b> · 基础租金 ${money(calculatePropertyRent(state, tile.id))}</small></div><div class="action-buttons">${actionButton('buy', '买下', 'primary', player.cash < tile.price)}${actionButton('decline', '竞拍', 'ghost')}</div></div>`;
      if (rollButton) rollButton.disabled = true;
      if (endButton) endButton.disabled = false;
      if (hint) hint.textContent = '拥有同组产业后可升级建筑，租金会逐级跃升。';
      return;
    }
    if (state.pending?.kind === 'card') {
      strip.innerHTML = `<div class="action-card card-action"><div><span class="action-overline">机缘已开</span><strong>${escapeHtml(state.pending.card.title)}</strong><small>${escapeHtml(state.pending.card.text)}</small></div><div class="action-buttons">${actionButton('card-continue', '收下这张牌', 'primary')}</div></div>`;
      if (rollButton) rollButton.disabled = true;
      if (endButton) endButton.disabled = false;
      return;
    }
    if (player.inJail && player.jailTurns < 3) {
      strip.innerHTML = `<div class="action-card jail-action"><div><span class="action-overline">巡安府 · 停留 ${3 - player.jailTurns} 回合</span><strong>想提前离开吗？</strong><small>支付 80 文，或使用一张平安符。</small></div><div class="action-buttons">${actionButton('jail-pay', '支付 80 文', 'primary', player.cash < 80)}${actionButton('jail-card', '使用平安符', 'ghost')}</div></div>`;
      if (rollButton) rollButton.disabled = true;
      if (endButton) endButton.disabled = false;
      return;
    }
    strip.innerHTML = `<div class="turn-status"><span class="status-orb"></span><span>${state.phase === 'resolving' ? '正在落子…' : '轮到你的决定'}</span><small>掷出相同点数可获得额外行动</small></div>`;
    if (rollButton) rollButton.disabled = state.phase !== 'awaiting-roll';
    if (endButton) endButton.disabled = state.phase === 'resolving';
    if (hint) hint.textContent = '拖动棋盘可旋转镜头 · 点击地格查看详情';
  }

  updateSaveStatus(state) {
    const status = document.querySelector('#save-status');
    if (status) status.textContent = state.winner != null ? '本局已完成 · 可重开' : '自动保存中 · 刷新可续玩';
  }

  toggleAudio() {
    this.audioOn = !this.audioOn;
    const button = document.querySelector('#sound-btn');
    if (button) { button.textContent = this.audioOn ? '♫' : '∅'; button.classList.toggle('is-muted', !this.audioOn); }
    this.callbacks.onAudioToggle?.(this.audioOn);
  }

  openModal(content, className = '') {
    const layer = document.querySelector('#modal-layer');
    if (!layer) return;
    layer.className = `modal-layer is-open ${className}`;
    layer.innerHTML = `<div class="modal-backdrop" data-action="close-modal"></div><section class="modal-card" role="dialog" aria-modal="true">${content}</section>`;
    this.modalOpen = true;
  }

  closeModal() {
    const layer = document.querySelector('#modal-layer');
    if (!layer) return;
    layer.className = 'modal-layer';
    layer.innerHTML = '';
    this.modalOpen = false;
  }

  openIntro() {
    this.openModal(`<div class="modal-ornament">✦</div><div class="modal-kicker">山海百业城 · 开局请柬</div><h2>让每一枚铜钱，<em>走成一条路。</em></h2><p class="modal-lead">你将和嘟嘟、唐糖、三太子一起掷骰、买地、经营与逐鹿百业。原创 3D 微缩城，40 格棋盘，一局大约 20—40 分钟。</p><div class="intro-roles">${['嘟嘟|熊猫掌柜', '唐糖|花朝执事', '三太子|游侠少主', '德小文|远行探险家'].map((item) => { const [name, title] = item.split('|'); return `<div><span>${name.slice(0, 1)}</span><strong>${name}</strong><small>${title}</small></div>`; }).join('')}</div><div class="modal-actions">${actionButton('close-modal', '入席开局', 'primary')}</div>`, 'intro-modal');
  }

  openRules() {
    this.openModal(`<div class="modal-ornament">规</div><div class="modal-kicker">掌柜手册 · 简明规则</div><h2>把资产经营成<em>一条护城河。</em></h2><div class="rules-grid"><div><b>掷骰与移动</b><p>每回合掷两枚六面骰。经过起航广场领取 200 文；掷出双数可获得一次额外行动，连续三个相同点数会被送进巡安府。</p></div><div><b>买地与竞拍</b><p>落在无主产业地可买下。放弃购买会开放密封竞拍，出价最高者获得。集齐同组后可升级三级建筑。</p></div><div><b>巡安府</b><p>可支付 80 文、使用平安符，或等待三轮。公共设施按骰子点数收费，商路数量越多，租金越高。</p></div><div><b>胜负</b><p>现金归零且无法通过抵押恢复时破产。最后一位仍有资产的掌柜获胜；第 60 回合后按净资产决胜。</p></div></div><div class="modal-actions">${actionButton('close-modal', '知道了', 'primary')}</div>`, 'rules-modal');
  }

  openNewGame() {
    this.openModal(`<div class="modal-ornament">新</div><div class="modal-kicker">重新入席</div><h2>要让这座城<em>再来一局吗？</em></h2><p class="modal-lead">当前进度会被清空，四位掌柜会重新回到起航广场。建议在决定前先保存一张截图。</p><div class="modal-actions">${actionButton('close-modal', '继续当前局', 'ghost')}${actionButton('confirm-new-game', '确认重开', 'danger')}</div>`, 'confirm-modal');
  }

  openAuction(state, tileId) {
    const tile = TILES_BY_ID.get(tileId);
    const player = state.players[state.currentPlayer];
    const suggested = Math.min(player.cash, tile.price + Math.max(50, tile.price * 0.15));
    this.openModal(`<div class="modal-ornament gold">竞</div><div class="modal-kicker">密封竞拍 · ${escapeHtml(group(tile.group)?.name || '公共地')}</div><h2>把${escapeHtml(tile.name)}<em>交给市场。</em></h2><p class="modal-lead">其他掌柜会同时亮出最高出价，最终价高者得。你可以填 0 文表示放弃。</p><div class="auction-preview"><span>公开底价</span><strong>${money(tile.price)}</strong><span>你的现金</span><strong>${money(player.cash)}</strong></div><label class="input-label">你的最高出价<input id="auction-bid" type="number" min="0" max="${player.cash}" value="${suggested}" /></label><div class="modal-actions">${actionButton('close-modal', '先不竞拍', 'ghost')}${actionButton('auction-submit', '亮出底价', 'primary')}</div>`, 'auction-modal');
  }

  openCard(state) {
    const card = state.pending?.card;
    if (!card) return;
    this.openModal(`<div class="modal-ornament">签</div><div class="modal-kicker">机缘牌 · ${escapeHtml(tileName(state.pending.tileId))}</div><h2>${escapeHtml(card.title)}</h2><p class="modal-lead">${escapeHtml(card.text)}</p><div class="card-seal">${card.amount > 0 ? '+' : ''}${card.amount || '—'} <small>文</small></div><div class="modal-actions">${actionButton('card-continue', '收下机缘', 'primary')}</div>`, 'card-modal');
  }

  openTileInspector(state, tileId) {
    this.inspectTileId = tileId;
    const tile = TILES_BY_ID.get(tileId);
    if (!tile) return;
    const tileState = state.tiles[tileId];
    const owner = tileState.owner == null ? null : state.players[tileState.owner];
    const current = state.players[state.currentPlayer];
    const isOwned = owner?.id === current.id;
    let detail = '';
    if (tile.kind === 'property') {
      const rentValues = tile.rents.map((rent, index) => `<span><b>${index === 0 ? '空置' : `${index}级`}</b>${money(rent)}</span>`).join('');
      detail = `<div class="rent-grid">${rentValues}</div><div class="build-note">当前等级 <b>${tileState.buildings} / 3</b> · 下一级需 ${money(tile.buildCost)}</div>`;
    } else if (tile.kind === 'road') {
      detail = `<div class="rent-grid">${tile.rents.map((rent, index) => `<span><b>${index + 1}条商路</b>${money(rent)}</span>`).join('')}</div>`;
    } else if (tile.kind === 'utility') {
      detail = `<div class="rent-grid"><span><b>独占</b>骰点 × ${tile.utilityMultipliers[0]}</span><span><b>双设施</b>骰点 × ${tile.utilityMultipliers[1]}</span></div>`;
    } else {
      detail = `<p class="tile-description">${escapeHtml(this.getTileDescription(tile))}</p>`;
    }
    const action = isOwned ? `${tileState.mortgaged ? actionButton('unmortgage', '解押', 'ghost', current.cash < Math.floor(tile.price * .55), `data-tile-id="${tileId}"`) : actionButton('mortgage', '抵押', 'ghost', tileState.buildings > 0, `data-tile-id="${tileId}"`)}${tile.kind === 'property' && !tileState.mortgaged ? actionButton('build', tileState.buildings < 3 ? '升级' : '已满级', 'primary', tileState.buildings >= 3 || current.cash < tile.buildCost, `data-tile-id="${tileId}"`) : ''}` : '';
    this.openModal(`<div class="modal-kicker">地格档案 · ${escapeHtml(group(tile.group)?.name || '山海公共地')}</div><h2>${escapeHtml(tile.name)}</h2><div class="owner-line"><span>${tileState.owner == null ? '尚无主人' : `主人 · ${escapeHtml(owner.name)}`}</span>${tileState.mortgaged ? '<b class="mortgage-tag">已抵押</b>' : ''}</div>${detail}<div class="modal-actions">${action}${actionButton('close-modal', '收起', 'ghost')}</div>`, 'inspect-modal');
  }

  getTileDescription(tile) {
    if (tile.kind === 'go') return '每经过一次，所有玩家都可以领取一笔起航俸禄。';
    if (tile.kind === 'jail') return '巡安府是这座城的临时歇脚处。停留三轮后自动获释。';
    if (tile.kind === 'goto-jail') return '被传送到巡安府，不能立即离开。';
    if (tile.kind === 'park') return '在这里整理思路，下一回合会有更好的运气。';
    if (tile.kind === 'tax') return '城市的公共事务需要每位掌柜共同承担。';
    if (tile.kind === 'chest') return '抽取一张机缘宝箱卡，看看今日的额外馈赠。';
    if (tile.kind === 'chance') return '抽取一张风向签，城市的风向会改变现金流。';
    if (tile.kind === 'center') return '百业盛典的中心，抵达即获得一笔小额奖励。';
    return '点击地格查看产业详情。';
  }

  showToast(text, tone = 'normal') {
    const stack = document.querySelector('#toast-stack');
    if (!stack) return;
    const toast = document.createElement('div');
    toast.className = `toast ${tone}`;
    toast.innerHTML = `<span></span><p>${escapeHtml(text)}</p>`;
    stack.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    window.setTimeout(() => { toast.classList.remove('is-visible'); window.setTimeout(() => toast.remove(), 350); }, 2800);
  }
}
