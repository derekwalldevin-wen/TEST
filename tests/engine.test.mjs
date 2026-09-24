import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BOARD,
  buildProperty,
  buyProperty,
  assetValue,
  calculatePropertyRent,
  createInitialState,
  declineProperty,
  endTurn,
  groupMonopoly,
  liquidateAndBankrupt,
  roll,
  runSealedAuction
} from '../src/game/engine.js';

function landPlayerOn(state, playerId, tileId) {
  state.currentPlayer = playerId;
  state.players[playerId].position = BOARD.findIndex((tile) => tile.id === tileId);
  state.phase = 'awaiting-action';
  state.pending = { kind: 'property', tileId };
}

test('roll moves around the board and pays start salary once per lap', () => {
  const state = createInitialState(1);
  state.players[0].position = 38;
  const result = roll(state, { dice: [3, 4] });
  assert.equal(result.ok, true);
  assert.equal(state.players[0].position, 5);
  assert.equal(state.players[0].cash, 1700);
});

test('buying a property transfers ownership and spends cash', () => {
  const state = createInitialState(2);
  landPlayerOn(state, 0, 'p01');
  const result = buyProperty(state, 'p01');
  assert.equal(result.ok, true);
  assert.equal(state.players[0].cash, 1440);
  assert.deepEqual(state.players[0].owned, ['p01']);
  assert.equal(state.tiles.p01.owner, 0);
});

test('building requires group monopoly and raises rent', () => {
  const state = createInitialState(3);
  state.tiles.p01.owner = 0;
  state.tiles.p03.owner = 0;
  state.players[0].owned = ['p01', 'p03'];
  state.currentPlayer = 0;
  const baseRent = calculatePropertyRent(state, 'p01');
  assert.equal(groupMonopoly(state, 0, 'bamboo'), true);
  assert.equal(buildProperty(state, 'p01').ok, true);
  assert.equal(calculatePropertyRent(state, 'p01') > baseRent, true);
  assert.equal(state.tiles.p01.buildings, 1);
});

test('sealed auction awards the highest valid bid', () => {
  const state = createInitialState(4);
  landPlayerOn(state, 0, 'p01');
  const result = runSealedAuction(state, 'p01', { 0: 100, 1: 240, 2: 180, 3: 0 });
  assert.equal(result.winnerId, 1);
  assert.equal(state.tiles.p01.owner, 1);
  assert.equal(state.players[1].cash, 1260);
});

test('three doubles send the player to jail', () => {
  const state = createInitialState(5);
  state.players[0].lastDoubles = 2;
  roll(state, { dice: [4, 4] });
  assert.equal(state.players[0].inJail, true);
  assert.equal(state.players[0].position, 10);
});

test('declining a tile can start an auction and a declined turn advances', () => {
  const state = createInitialState(6);
  landPlayerOn(state, 0, 'p01');
  assert.equal(declineProperty(state).ok, true);
  assert.equal(state.pending.kind, 'property');
  const auction = runSealedAuction(state, 'p01', { 0: 0, 1: 0, 2: 0, 3: 0 });
  assert.equal(auction.winnerId, null);
  endTurn(state);
  assert.equal(state.currentPlayer, 1);
});

test('asset value stays finite for transport and utility properties', () => {
  const state = createInitialState(8);
  state.players[0].owned = ['road-5', 'utility-12'];
  state.tiles['road-5'].owner = 0;
  state.tiles['utility-12'].owner = 0;
  const value = assetValue(state, state.players[0]);
  assert.equal(Number.isFinite(value), true);
  assert.equal(value, 1850);
});

test('last solvent player wins after bankruptcy', () => {
  const state = createInitialState(7);
  for (let id = 0; id < 3; id += 1) {
    state.players[id].cash = 0;
    liquidateAndBankrupt(state, id);
  }
  assert.equal(state.players[3].bankrupt, false);
  assert.equal(state.winner, 3);
  assert.equal(state.phase, 'game-over');
});
