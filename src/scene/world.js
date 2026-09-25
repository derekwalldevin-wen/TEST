import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BOARD, GROUPS, PLAYER_DEFS, TILES_BY_ID } from '../game/engine.js';
import { canvasTexture, ivoryTexture, lacquerTexture, metalTexture, paperTexture, pbr, stoneTexture, tileLabelTexture, woodTexture } from './materials.js';
import { addArchGate, addBanner, addCoin, addLeafCluster, addPlanter, addRoofDetails, addScroll, addSeal, addVessel, addWindowFrame } from './art-kit.js';

const BOARD_HALF = 8.9;
const TILE_SPACING = 1.98;
const TILE_SIZE = 1.86;
const FLOOR_Y = 0.14;

const vec = (x, y, z) => new THREE.Vector3(x, y, z);

export function boardLayout(index) {
  const i = index % BOARD.length;
  if (i <= 10) return { x: -BOARD_HALF + i * TILE_SPACING, z: BOARD_HALF, rotation: 0 };
  if (i <= 20) return { x: BOARD_HALF, z: BOARD_HALF - (i - 10) * TILE_SPACING, rotation: -Math.PI / 2 };
  if (i <= 30) return { x: BOARD_HALF - (i - 20) * TILE_SPACING, z: -BOARD_HALF, rotation: Math.PI };
  return { x: -BOARD_HALF, z: -BOARD_HALF + (i - 30) * TILE_SPACING, rotation: Math.PI / 2 };
}

function mesh(geometry, material, position = [0, 0, 0], scale = [1, 1, 1]) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(...position);
  object.scale.set(...scale);
  object.castShadow = true;
  object.receiveShadow = true;
  return object;
}

function roundedMesh(width, height, depth, material, radius = 0.08, position = [0, 0, 0]) {
  return mesh(new RoundedBoxGeometry(width, height, depth, 3, radius), material, position);
}

function roofMesh(radius, height, material, position = [0, 0, 0], sides = 4) {
  const roof = mesh(new THREE.ConeGeometry(radius, height, sides), material, position);
  roof.rotation.y = Math.PI / 4;
  return roof;
}

function ringMesh(radius, tube, material, position = [0, 0, 0], arc = Math.PI * 2) {
  return mesh(new THREE.TorusGeometry(radius, tube, 10, 48, arc), material, position);
}

function textLabel(text, options = {}) {
  const material = new THREE.SpriteMaterial({ map: tileLabelTexture({ name: text }), transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(options.width ?? 1.5, options.width ?? 1.5, 1);
  return sprite;
}

function createLantern(material = pbr('#d64b3e', { emissive: '#8e1e16', emissiveIntensity: 0.3 })) {
  const group = new THREE.Group();
  group.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.62, 8), pbr('#503323'), [0, 0.31, 0]));
  group.add(mesh(new THREE.SphereGeometry(0.15, 12, 8), material, [0, 0.62, 0], [0.82, 1, 0.82]));
  group.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 10), pbr('#d8ae52'), [0, 0.74, 0]));
  return group;
}

function createTree(scale = 1, color = '#4d7650') {
  const group = new THREE.Group();
  group.add(mesh(new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, 0.85 * scale, 7), pbr('#6a4935'), [0, 0.4 * scale, 0]));
  const leafMat = pbr(color, { roughness: 0.92 });
  group.add(mesh(new THREE.ConeGeometry(0.58 * scale, 1.15 * scale, 8), leafMat, [0, 1.1 * scale, 0]));
  group.add(mesh(new THREE.ConeGeometry(0.43 * scale, 0.86 * scale, 8), leafMat, [0, 1.55 * scale, 0]));
  return group;
}

function createCloud(scale = 1) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: '#e7e0ca', transparent: true, opacity: 0.62, roughness: 1, depthWrite: false });
  [[-0.55, 0, 0, 0.48], [0, 0.18, 0.05, 0.62], [0.55, 0, 0, 0.5], [0, -0.2, 0.1, 0.45]].forEach(([x, y, z, r]) => {
    group.add(mesh(new THREE.SphereGeometry(r * scale, 12, 8), mat, [x * scale, y * scale, z * scale]));
  });
  return group;
}

function makePips(face, value, axis) {
  const layouts = {
    1: [[0, 0]],
    2: [[-1, 1], [1, -1]],
    3: [[-1, 1], [0, 0], [1, -1]],
    4: [[-1, 1], [1, 1], [-1, -1], [1, -1]],
    5: [[-1, 1], [1, 1], [0, 0], [-1, -1], [1, -1]],
    6: [[-1, 1], [1, 1], [-1, 0], [1, 0], [-1, -1], [1, -1]]
  };
  const pipMat = pbr('#17252a', { roughness: 0.32, metalness: 0.15 });
  const positions = layouts[value];
  positions.forEach(([u, v]) => {
    const p = mesh(new THREE.SphereGeometry(0.055, 10, 8), pipMat);
    if (axis === 'z') p.position.set(u * 0.16, v * 0.16, 0.325);
    if (axis === '-z') p.position.set(u * 0.16, v * 0.16, -0.325);
    if (axis === 'x') p.position.set(0.325, v * 0.16, -u * 0.16);
    if (axis === '-x') p.position.set(-0.325, v * 0.16, u * 0.16);
    if (axis === 'y') p.position.set(u * 0.16, 0.325, -v * 0.16);
    if (axis === '-y') p.position.set(u * 0.16, -0.325, v * 0.16);
    face.add(p);
  });
}

function makeDie() {
  const group = new THREE.Group();
  const body = roundedMesh(0.68, 0.68, 0.68, pbr('#f2dfb3', { roughness: 0.32, metalness: 0.08 }), 0.12);
  group.add(body);
  const faces = {
    z: new THREE.Group(), '-z': new THREE.Group(), x: new THREE.Group(), '-x': new THREE.Group(), y: new THREE.Group(), '-y': new THREE.Group()
  };
  Object.entries(faces).forEach(([key, face]) => { face.userData.face = key; group.add(face); });
  group.userData.faces = faces;
  return group;
}

export class WorldScene {
  constructor(container, state, callbacks = {}) {
    this.container = container;
    this.state = state;
    this.callbacks = callbacks;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#102c2e');
    this.scene.fog = new THREE.FogExp2('#102c2e', 0.018);
    this.lastFrameTime = performance.now();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.tileVisuals = new Map();
    this.clickTargets = [];
    this.characterSlots = new Map();
    this.bursts = [];
    this.floaters = [];
    this.lanterns = [];
    this.fireflies = [];
    this.diceAnimation = null;
    this.focusTarget = new THREE.Vector3(0, 0, 0);
    this.cameraFocus = new THREE.Vector3(0, 0, 0);
    this.isReady = false;

    this.setupRenderer();
    this.setupLights();
    this.createBackdrop();
    this.createBoard();
    this.createCenterpiece();
    this.createDecor();
    this.createDice();
    this.createParticles();
    this.bindPointer();
    this.onResize();
    window.addEventListener('resize', () => this.onResize(), { passive: true });
    this.animate();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    this.renderer.setSize(this.container.clientWidth || window.innerWidth, this.container.clientHeight || window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);
    this.camera.position.set(24, 25, 28);
    this.camera.lookAt(0, 0, 0);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.065;
    this.controls.minDistance = 21;
    this.controls.maxDistance = 44;
    this.controls.minPolarAngle = 0.62;
    this.controls.maxPolarAngle = 1.18;
    this.controls.maxAzimuthAngle = Math.PI * 0.46;
    this.controls.minAzimuthAngle = -Math.PI * 0.46;
    this.controls.enablePan = false;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.18, 0.55, 0.86);
    this.composer.addPass(this.bloom);
  }

  setupLights() {
    this.scene.add(new THREE.HemisphereLight('#b7d5d0', '#17251f', 2.1));
    const key = new THREE.DirectionalLight('#ffe0aa', 4.8);
    key.position.set(-12, 24, 14);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -24; key.shadow.camera.right = 24; key.shadow.camera.top = 24; key.shadow.camera.bottom = -24;
    key.shadow.bias = -0.00025;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight('#79c9d0', 2.2);
    rim.position.set(18, 12, -18);
    this.scene.add(rim);
    const centerGlow = new THREE.PointLight('#f4b45e', 4.2, 16, 2);
    centerGlow.position.set(0, 3, 0);
    this.scene.add(centerGlow);
    const lanternFill = new THREE.PointLight('#e36c4d', 2.4, 20, 2);
    lanternFill.position.set(-6, 2.5, 5);
    this.scene.add(lanternFill);
    const coolFill = new THREE.SpotLight('#8ad8d0', 18, 30, Math.PI / 5, .7, 1.4);
    coolFill.position.set(4, 11, 8);
    coolFill.target.position.set(0, 0, 0);
    coolFill.castShadow = false;
    this.scene.add(coolFill, coolFill.target);
  }

  createBackdrop() {
    const ground = mesh(new THREE.CircleGeometry(52, 64), pbr('#193a35', { roughness: 0.96 }), [0, -0.48, 0], [1, 1, 1]);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    const rim = ringMesh(22, 0.08, pbr('#b47b45', { metalness: 0.35, roughness: 0.4 }), [0, -0.4, 0]);
    rim.rotation.x = Math.PI / 2;
    this.scene.add(rim);

    const starGeo = new THREE.BufferGeometry();
    const starData = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 14;
      starData[i * 3] = Math.cos(angle) * radius;
      starData[i * 3 + 1] = 8 + Math.random() * 22;
      starData[i * 3 + 2] = Math.sin(angle) * radius;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starData, 3));
    this.scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: '#f4d69b', size: 0.16, transparent: true, opacity: 0.7, sizeAttenuation: true })));

    const moon = mesh(new THREE.SphereGeometry(1.55, 32, 20), new THREE.MeshBasicMaterial({ color: '#f7d78f', transparent: true, opacity: .92 }), [-17, 12, -28]);
    moon.castShadow = false;
    this.scene.add(moon);
    const moonHalo = ringMesh(2.05, .035, new THREE.MeshBasicMaterial({ color: '#e3b864', transparent: true, opacity: .35 }), [-17, 12, -28]);
    moonHalo.rotation.x = Math.PI / 2;
    this.scene.add(moonHalo);
    const water = mesh(new THREE.CircleGeometry(31, 96), new THREE.MeshStandardMaterial({ color: '#173e42', roughness: .2, metalness: .25, transparent: true, opacity: .68 }), [0, -.43, 0]);
    water.rotation.x = -Math.PI / 2;
    water.receiveShadow = true;
    this.scene.add(water);
    const distantGate = addArchGate(new THREE.Group(), [0, -.25, -25], 1.35, '#365e59');
    this.scene.add(distantGate);

    const mountains = new THREE.Group();
    const mountainMat = pbr('#284b47', { roughness: 1 });
    const snowMat = pbr('#d5d5be', { roughness: 1 });
    for (let i = 0; i < 16; i += 1) {
      const angle = (i / 16) * Math.PI * 2;
      const radius = 27 + (i % 3) * 2.4;
      const height = 5 + (i % 4) * 1.2;
      const mountain = mesh(new THREE.ConeGeometry(3.2 + (i % 3) * 0.5, height, 5), mountainMat, [Math.cos(angle) * radius, height / 2 - 0.3, Math.sin(angle) * radius]);
      mountain.rotation.y = i * 0.73;
      mountain.castShadow = false;
      mountains.add(mountain);
      const cap = mesh(new THREE.ConeGeometry(1.4 + (i % 3) * 0.15, 1.8, 5), snowMat, [Math.cos(angle) * (radius - 0.15), height - 0.6, Math.sin(angle) * (radius - 0.15)]);
      cap.castShadow = false;
      mountains.add(cap);
    }
    this.scene.add(mountains);

    this.clouds = [];
    for (let i = 0; i < 8; i += 1) {
      const cloud = createCloud(1.2 + (i % 3) * 0.35);
      cloud.position.set(-22 + i * 6, 8 + (i % 3) * 2, -20 - (i % 2) * 4);
      cloud.userData.speed = 0.45 + i * 0.03;
      this.clouds.push(cloud);
      this.scene.add(cloud);
    }
  }

  createBoard() {
    this.boardGroup = new THREE.Group();
    this.boardGroup.position.y = 0;
    this.scene.add(this.boardGroup);

    const plinth = roundedMesh(21.5, 0.55, 21.5, pbr('#4a2b20', { map: woodTexture(), roughness: 0.46 }), 0.26, [0, -0.33, 0]);
    this.boardGroup.add(plinth);
    const goldTrim = ringMesh(10.55, 0.08, pbr('#c6934f', { metalness: 0.72, roughness: 0.24 }), [0, -0.02, 0]);
    goldTrim.rotation.x = Math.PI / 2;
    this.boardGroup.add(goldTrim);
    const innerRoad = roundedMesh(18.3, 0.2, 18.3, pbr('#1a332f', { roughness: 0.88 }), 0.12, [0, 0, 0]);
    this.boardGroup.add(innerRoad);

    const street = roundedMesh(17.3, 0.12, 17.3, pbr('#cbbd9b', { map: ivoryTexture(), roughness: 0.82 }), 0.08, [0, 0.13, 0]);
    this.boardGroup.add(street);
    const innerGarden = roundedMesh(12.1, 0.15, 12.1, pbr('#385d48', { roughness: 0.94 }), 0.14, [0, 0.2, 0]);
    this.boardGroup.add(innerGarden);
    const centerStone = roundedMesh(8.3, 0.17, 8.3, pbr('#c6b58d', { map: ivoryTexture(), roughness: 0.9 }), 0.16, [0, 0.3, 0]);
    this.boardGroup.add(centerStone);

    BOARD.forEach((tile, index) => this.createTile(tile, index));
  }

  createTile(tile, index) {
    const layout = boardLayout(index);
    const group = new THREE.Group();
    group.position.set(layout.x, 0, layout.z);
    group.rotation.y = layout.rotation;
    const groupData = GROUPS.find((item) => item.id === tile.group);
    const baseColor = tile.kind === 'property' ? groupData?.color ?? '#c5a56d' : tile.kind === 'go' ? '#b45d45' : tile.kind === 'jail' ? '#806d96' : tile.kind === 'park' ? '#648f65' : '#d4bb79';
    const base = roundedMesh(TILE_SIZE, 0.24, TILE_SIZE, pbr(baseColor, { map: stoneTexture(baseColor, '#f0dfb3', '#806545'), roughness: .72, metalness: .04 }), .07, [0, 0.24, 0]);
    const top = mesh(new THREE.PlaneGeometry(TILE_SIZE - 0.18, TILE_SIZE - 0.18), pbr('#e3d6b6', { map: ivoryTexture(), roughness: .84 }), [0, 0.375, 0]);
    top.rotation.x = -Math.PI / 2;
    top.userData.tileId = tile.id;
    top.userData.tileIndex = index;
    this.clickTargets.push(top);
    group.add(base, top);

    const border = ringMesh(0.76, 0.035, pbr('#b08b52', { map: metalTexture('#a77a3b', '#e6c579', '#5b3520'), metalness: 0.56, roughness: 0.3 }), [0, 0.405, 0]);
    border.rotation.x = Math.PI / 2;
    group.add(border);
    const cornerMat = pbr('#d8ac58', { map: metalTexture(), metalness: .62, roughness: .28 });
    [-.68, .68].forEach((x) => [-.68, .68].forEach((z) => group.add(mesh(new THREE.SphereGeometry(.035, 8, 6), cornerMat, [x, .41, z]))));

    const label = new THREE.Mesh(new THREE.PlaneGeometry(1.28, 0.42), new THREE.MeshBasicMaterial({ map: tileLabelTexture(tile), transparent: true, depthWrite: false }));
    label.rotation.x = -Math.PI / 2;
    label.position.set(0, 0.42, 0.61);
    group.add(label);

    const landmark = this.createLandmark(tile, index);
    landmark.position.set(0, 0.42, -0.18);
    group.add(landmark);

    const hover = new THREE.Mesh(new THREE.PlaneGeometry(TILE_SIZE - 0.06, TILE_SIZE - 0.06), new THREE.MeshBasicMaterial({ color: '#f7d58a', transparent: true, opacity: 0, depthWrite: false }));
    hover.rotation.x = -Math.PI / 2;
    hover.position.y = 0.4;
    group.add(hover);

    this.tileVisuals.set(index, {
      group, top, border, label, landmark, hover,
      baseMaterial: base.material,
      hoverMaterial: hover.material,
      ownerMaterials: landmark.userData.ownerMaterials || [],
      buildingLevel: 0,
      basePosition: vec(layout.x, 0, layout.z),
      baseRotation: layout.rotation
    });
    this.boardGroup.add(group);
  }

  createLandmark(tile, index) {
    const group = new THREE.Group();
    const detail = new THREE.Group();
    const ownerMaterials = [];
    const groupData = GROUPS.find((item) => item.id === tile.group);
    const primary = pbr(groupData?.color ?? '#b98b4d', { map: stoneTexture(groupData?.color ?? '#b98b4d', '#ead9aa', '#67452d'), roughness: .56, metalness: .08 });
    const roofMat = pbr('#4b3430', { map: lacquerTexture('#4b2e2b', '#9a5140'), roughness: .44, metalness: .12 });
    const windowMat = pbr('#f2c76c', { emissive: '#e3a33f', emissiveIntensity: .75, roughness: .35 });
    const brass = pbr('#c6934b', { map: metalTexture(), roughness: .28, metalness: .68 });
    const dark = pbr('#223632', { roughness: .58, metalness: .08 });
    ownerMaterials.push(primary, roofMat, windowMat);
    group.add(detail);

    if (tile.kind === 'property') {
      const base = roundedMesh(0.55, 0.35, 0.55, primary, .06, [0, .18, 0]);
      group.add(base);
      if (tile.group === 'bamboo') {
        group.add(mesh(new THREE.CylinderGeometry(.035, .035, .55, 7), pbr('#6b4d32'), [0, .56, 0]));
        group.add(roofMesh(.38, .25, roofMat, [0, .86, 0]));
        addLeafCluster(detail, [.25, .25, -.16], .7, '#5e9b70');
      } else if (tile.group === 'star') {
        group.add(mesh(new THREE.CylinderGeometry(.13, .25, .36, 12), primary, [0, .54, 0]));
        group.add(roofMesh(.33, .23, roofMat, [0, .82, 0]));
        group.add(mesh(new THREE.SphereGeometry(.08, 10, 8), windowMat, [0, 1.03, 0]));
        addCoin(detail, [.25, .3, .12], .7);
      } else if (tile.group === 'city' || tile.group === 'sun') {
        group.add(roundedMesh(.42, .5, .42, primary, .05, [0, .56, 0]));
        group.add(roofMesh(.38, .28, roofMat, [0, .93, 0]));
        addWindowFrame(detail, { x: -.11, y: .6, z: .23, w: .15, h: .19, frame: brass, glass: windowMat });
        addWindowFrame(detail, { x: .11, y: .6, z: .23, w: .15, h: .19, frame: brass, glass: windowMat });
        addBanner(detail, { x: .29, y: .38, z: -.12, color: groupData?.color || '#9d453c', height: .3, width: .1, rotate: -.15 });
      } else {
        group.add(roundedMesh(.38, .46, .38, primary, .06, [0, .53, 0]));
        group.add(roofMesh(.34, .22, roofMat, [0, .87, 0]));
        addWindowFrame(detail, { x: 0, y: .56, z: .22, w: .18, h: .2, frame: brass, glass: windowMat });
        addVessel(detail, [.25, .18, .15], .48, groupData?.color);
      }
      addRoofDetails(detail, { y: .4, width: .54, depth: .54, roof: roofMat, accent: brass });
      if (tile.group === 'river') addVessel(detail, [-.25, .15, .14], .46, '#79aaa0');
      if (tile.group === 'garden') addPlanter(detail, [.25, .15, .16], .45, '#4f9368');
      if (tile.group === 'cloud') addCoin(detail, [-.25, .22, .16], .55);
      if (tile.group === 'sun') addSeal(detail, [-.24, .18, .17], .5, '#c75b3d');
      if (tile.group === 'star') addSeal(detail, [-.24, .17, .16], .42, '#526b98');
    } else if (tile.kind === 'road') {
      group.add(mesh(new THREE.CylinderGeometry(.2, .2, .1, 16), pbr('#516d66', { map: stoneTexture('#516d66', '#a5c4b1', '#253f40'), metalness: .18, roughness: .46 }), [0, .2, 0]));
      group.add(mesh(new THREE.BoxGeometry(.05, .62, .05), pbr('#5c3828'), [0, .49, 0]));
      group.add(mesh(new THREE.BoxGeometry(.42, .06, .06), primary, [0, .65, 0]));
      group.add(mesh(new THREE.BoxGeometry(.06, .12, .06), windowMat, [0, .78, 0]));
      detail.add(mesh(new THREE.BoxGeometry(.38, .025, .025), brass, [0, .27, .16]));
      detail.add(mesh(new THREE.BoxGeometry(.38, .025, .025), brass, [0, .27, -.16]));
      addBanner(detail, { x: .25, y: .26, z: .08, color: groupData?.color || '#8c5636', height: .25, width: .12 });
    } else if (tile.kind === 'utility') {
      group.add(mesh(new THREE.CylinderGeometry(.16, .22, .58, 8), primary, [0, .42, 0]));
      group.add(mesh(new THREE.SphereGeometry(.1, 10, 8), windowMat, [0, .78, 0]));
      group.add(mesh(new THREE.TorusGeometry(.22, .025, 8, 20), primary, [0, .28, 0]).rotateX(Math.PI / 2));
      addWindowFrame(detail, { x: 0, y: .46, z: .2, w: .14, h: .2, frame: brass, glass: windowMat });
      addBanner(detail, { x: .26, y: .28, z: .08, color: groupData?.color || '#5b8e83', height: .24, width: .1 });
    } else if (tile.kind === 'go') {
      group.add(mesh(new THREE.TorusGeometry(.38, .045, 8, 24), primary, [0, .22, 0]).rotateX(Math.PI / 2));
      group.add(mesh(new THREE.ConeGeometry(.22, .55, 4), primary, [0, .58, 0]));
      addArchGate(detail, [0, .16, -.05], .42, '#a74638');
      addCoin(detail, [.28, .26, .16], .65);
    } else if (tile.kind === 'jail') {
      group.add(mesh(new THREE.BoxGeometry(.52, .45, .5), primary, [0, .35, 0]));
      for (let i = -1; i <= 1; i += 1) group.add(mesh(new THREE.CylinderGeometry(.025, .025, .5, 6), roofMat, [i * .12, .73, .18]));
      group.add(mesh(new THREE.BoxGeometry(.07, .23, .07), windowMat, [0, .4, .28]));
      addRoofDetails(detail, { y: .59, width: .48, depth: .46, roof: roofMat, accent: brass });
      addWindowFrame(detail, { x: 0, y: .38, z: .26, w: .15, h: .22, frame: brass, glass: windowMat });
      addBanner(detail, { x: .27, y: .28, z: .1, color: '#795c8c', height: .24, width: .1 });
    } else if (tile.kind === 'park' || tile.kind === 'center') {
      group.add(createTree(.75, tile.kind === 'center' ? '#9fbd67' : '#4d875c'));
      addPlanter(detail, [.25, .13, .15], .48, tile.kind === 'center' ? '#9bbf6c' : '#4f8d63');
      addLeafCluster(detail, [-.24, .12, .12], .55, '#6c9b5b');
    } else if (tile.kind === 'tax' || tile.kind === 'goto-jail' || tile.kind === 'chance' || tile.kind === 'chest') {
      group.add(mesh(new THREE.CylinderGeometry(.24, .28, .24, 8), primary, [0, .25, 0]));
      group.add(mesh(new THREE.SphereGeometry(.16, 12, 8), windowMat, [0, .48, 0]));
      if (tile.kind === 'chest' || tile.kind === 'chance') addScroll(detail, [.24, .14, .14], .5);
      else addSeal(detail, [.24, .12, .16], .55, '#b34838');
      addRoofDetails(detail, { y: .4, width: .42, depth: .42, roof: roofMat, accent: brass });
    }
    group.userData.ownerMaterials = ownerMaterials;
    group.userData.detailGroup = detail;
    return group;
  }

  createCenterpiece() {
    this.centerGroup = new THREE.Group();
    this.centerGroup.position.y = 0.34;
    this.boardGroup.add(this.centerGroup);
    const dais = mesh(new THREE.CylinderGeometry(3.15, 3.35, 0.28, 64), pbr('#5c4030', { map: woodTexture(), roughness: 0.4 }), [0, 0.14, 0]);
    this.centerGroup.add(dais);
    const goldRing = ringMesh(2.52, 0.07, pbr('#d2a24f', { metalness: 0.7, roughness: 0.24 }), [0, 0.33, 0]);
    goldRing.rotation.x = Math.PI / 2;
    this.centerGroup.add(goldRing);
    const compassBase = mesh(new THREE.CylinderGeometry(1.72, 1.9, 0.12, 48), pbr('#d4be8c', { map: ivoryTexture(), roughness: 0.42, metalness: 0.18 }), [0, 0.39, 0]);
    this.centerGroup.add(compassBase);
    this.compass = new THREE.Group();
    this.compass.position.y = 0.54;
    const disc = mesh(new THREE.CylinderGeometry(1.36, 1.36, 0.08, 48), pbr('#224b4d', { metalness: 0.3, roughness: 0.32 }), [0, 0, 0]);
    this.compass.add(disc);
    for (let i = 0; i < 8; i += 1) {
      const angle = i * Math.PI / 4;
      const spoke = mesh(new THREE.BoxGeometry(0.06, 0.05, 1.2), pbr(i % 2 ? '#e4b75e' : '#75a59b', { metalness: 0.34 }), [Math.sin(angle) * 0.62, 0.07, Math.cos(angle) * 0.62]);
      spoke.rotation.y = angle;
      this.compass.add(spoke);
    }
    const needle = mesh(new THREE.ConeGeometry(0.18, 0.62, 4), pbr('#d9aa48', { metalness: 0.65, roughness: 0.2 }), [0, 0.18, -0.43]);
    needle.rotation.x = Math.PI / 2;
    this.compass.add(needle);
    this.compass.add(mesh(new THREE.SphereGeometry(0.13, 16, 12), pbr('#f6db8c', { metalness: 0.7, emissive: '#8c5624', emissiveIntensity: 0.45 }), [0, 0.2, 0]));
    this.centerGroup.add(this.compass);
    this.fountain = new THREE.Group();
    this.fountain.position.set(0, 0.25, 0);
    this.fountain.add(mesh(new THREE.CylinderGeometry(0.58, 0.72, 0.34, 32), pbr('#7aa8a0', { roughness: 0.32, metalness: 0.16 })));
    this.fountain.add(mesh(new THREE.CylinderGeometry(0.12, 0.22, 0.9, 16), pbr('#b5d5c3', { roughness: 0.35, metalness: 0.1 }), [0, 0.55, 0]));
    const water = mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.025, 32), pbr('#72c4c8', { emissive: '#2a7b83', emissiveIntensity: 0.35, transparent: true, opacity: 0.78, roughness: 0.08 }), [0, 0.79, 0]);
    this.fountain.add(water);
    this.centerGroup.add(this.fountain);

    const stoneMat = pbr('#b99e72', { map: stoneTexture(), roughness: .5, metalness: .08 });
    const brass = pbr('#c9974a', { map: metalTexture(), roughness: .28, metalness: .7 });
    for (let i = 0; i < 16; i += 1) {
      const angle = i * Math.PI / 8;
      const radial = roundedMesh(.07, .035, 1.05, brass, .015, [Math.sin(angle) * 1.95, .45, Math.cos(angle) * 1.95]);
      radial.rotation.y = angle;
      this.centerGroup.add(radial);
      if (i % 2 === 0) {
        const marker = mesh(new THREE.CylinderGeometry(.05, .07, .18, 8), stoneMat, [Math.sin(angle) * 2.52, .53, Math.cos(angle) * 2.52]);
        marker.castShadow = true;
        this.centerGroup.add(marker);
        addCoin(this.centerGroup, [Math.sin(angle) * 2.5, .78, Math.cos(angle) * 2.5], .42);
      }
    }
    const lotus = new THREE.Group();
    for (let i = 0; i < 10; i += 1) {
      const angle = i * Math.PI * 2 / 10;
      const petal = mesh(new THREE.SphereGeometry(.24, 10, 6), pbr(i % 2 ? '#d9b96c' : '#b75a46', { roughness: .38 }), [Math.cos(angle) * .68, .18, Math.sin(angle) * .68], [.72, .18, 1.1]);
      petal.rotation.y = angle;
      lotus.add(petal);
    }
    lotus.position.y = .18;
    this.centerGroup.add(lotus);
    this.centerCoins = [];
    for (let i = 0; i < 6; i += 1) {
      const coin = addCoin(this.centerGroup, [0, 1.2 + i * .2, 0], .38 + (i % 2) * .08);
      coin.userData.phase = i * Math.PI / 3;
      this.centerCoins.push(coin);
    }
  }

  createDecor() {
    const lanterns = [
      [-7.3, -7.3], [7.3, -7.3], [-7.3, 7.3], [7.3, 7.3], [0, -8.2], [0, 8.2], [-8.2, 0], [8.2, 0]
    ];
    lanterns.forEach(([x, z], i) => {
      const lantern = createLantern();
      lantern.position.set(x, 0.18, z);
      lantern.scale.setScalar(0.9);
      lantern.userData.phase = i * .8;
      this.lanterns.push(lantern);
      this.boardGroup.add(lantern);
      if (i % 2 === 0) {
        const tree = createTree(0.82, i % 4 === 0 ? '#507c5c' : '#806e42');
        tree.position.set(x * 0.87, 0.18, z * 0.87);
        this.boardGroup.add(tree);
      }
    });
    for (let i = 0; i < 24; i += 1) {
      const angle = (i / 24) * Math.PI * 2;
      const radius = 10.6 + (i % 3) * 0.5;
      const tree = createTree(0.4 + (i % 3) * 0.12, ['#4c7759', '#6d7c45', '#8a6943'][i % 3]);
      tree.position.set(Math.cos(angle) * radius, -0.22, Math.sin(angle) * radius);
      this.boardGroup.add(tree);
    }
    const bridgeMat = pbr('#7b4c34', { roughness: 0.58 });
    const bridge = new THREE.Group();
    bridge.add(mesh(new THREE.BoxGeometry(2.7, 0.12, 0.42), bridgeMat, [0, 0, 0]));
    bridge.add(mesh(new THREE.BoxGeometry(0.18, 0.48, 0.12), bridgeMat, [-1.08, 0.28, 0]));
    bridge.add(mesh(new THREE.BoxGeometry(0.18, 0.48, 0.12), bridgeMat, [1.08, 0.28, 0]));
    bridge.position.set(6.5, 0.15, -5.7);
    bridge.rotation.y = -0.7;
    bridge.add(mesh(new THREE.BoxGeometry(2.7, .05, .07), pbr('#c6964d', { metalness: .55, roughness: .34 }), [0, .1, .2]));
    bridge.add(mesh(new THREE.BoxGeometry(2.7, .05, .07), pbr('#c6964d', { metalness: .55, roughness: .34 }), [0, .1, -.2]));
    bridge.add(mesh(new THREE.BoxGeometry(.06, .38, .06), pbr('#a66a3c'), [-.85, .25, 0]));
    bridge.add(mesh(new THREE.BoxGeometry(.06, .38, .06), pbr('#a66a3c'), [0, .25, 0]));
    bridge.add(mesh(new THREE.BoxGeometry(.06, .38, .06), pbr('#a66a3c'), [.85, .25, 0]));
    this.boardGroup.add(bridge);

    addArchGate(this.boardGroup, [0, .12, -7.2], .62, '#8f3b36');
    addBanner(this.boardGroup, { x: -1.05, y: .18, z: -7.1, color: '#a63f3b', height: .52, width: .18, rotate: .08 });
    addBanner(this.boardGroup, { x: 1.05, y: .18, z: -7.1, color: '#3c8276', height: .52, width: .18, rotate: -.08 });
    [[-6.6, 2.4], [6.2, 2.7], [-2.8, -7.0], [2.8, 7.0]].forEach(([x, z], i) => addPlanter(this.boardGroup, [x, .14, z], .72, i % 2 ? '#568a64' : '#8e7647'));
    for (let i = 0; i < 12; i += 1) {
      const angle = i * Math.PI * 2 / 12;
      const rock = mesh(new THREE.DodecahedronGeometry(.12 + (i % 3) * .04, 0), pbr(i % 2 ? '#6e8270' : '#8b704e', { roughness: .98 }), [Math.cos(angle) * 9.7, -.02, Math.sin(angle) * 9.7], [1.4, .6, 1]);
      rock.rotation.y = angle;
      this.boardGroup.add(rock);
    }
  }

  createParticles() {
    const geometry = new THREE.BufferGeometry();
    const data = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i += 1) {
      data[i * 3] = (Math.random() - 0.5) * 32;
      data[i * 3 + 1] = 1 + Math.random() * 15;
      data[i * 3 + 2] = (Math.random() - 0.5) * 32;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(data, 3));
    this.pollen = new THREE.Points(geometry, new THREE.PointsMaterial({ color: '#f6d890', size: 0.08, transparent: true, opacity: 0.62, sizeAttenuation: true }));
    this.scene.add(this.pollen);

    const fireflyData = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i += 1) {
      fireflyData[i * 3] = (Math.random() - .5) * 20;
      fireflyData[i * 3 + 1] = .8 + Math.random() * 5;
      fireflyData[i * 3 + 2] = (Math.random() - .5) * 20;
    }
    const fireflyGeo = new THREE.BufferGeometry();
    fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyData, 3));
    this.fireflies = new THREE.Points(fireflyGeo, new THREE.PointsMaterial({ color: '#ffe9a4', size: .12, transparent: true, opacity: .75, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }));
    this.scene.add(this.fireflies);
  }

  createDice() {
    this.diceGroup = new THREE.Group();
    this.diceGroup.position.set(0, 1.05, 0);
    this.diceGroup.userData.clickable = true;
    this.dice = [makeDie(), makeDie()];
    this.dice.forEach((die, i) => {
      die.position.x = i === 0 ? -0.47 : 0.47;
      die.rotation.set(0.18, 0.35, -0.12);
      die.userData.index = i;
      this.diceGroup.add(die);
      Object.values(die.userData.faces).forEach((face) => makePips(face, 1, face.userData.face));
    });
    const tray = roundedMesh(1.8, 0.14, 1.15, pbr('#714733', { map: woodTexture(), roughness: 0.42 }), 0.18, [0, -0.45, 0]);
    tray.scale.set(1.2, 1, 0.8);
    this.diceGroup.add(tray);
    this.scene.add(this.diceGroup);
  }

  setDieValue(index, value) {
    const die = this.dice[index];
    if (!die) return;
    Object.entries(die.userData.faces).forEach(([key, face]) => {
      while (face.children.length) face.remove(face.children[0]);
      makePips(face, value, key);
    });
    die.userData.value = value;
  }

  rollDice(values, onComplete) {
    this.setDieValue(0, values?.[0] || 1);
    this.setDieValue(1, values?.[1] || 1);
    this.diceAnimation = { start: performance.now(), duration: 980, values: [values?.[0] || 1, values?.[1] || 1], onComplete };
    this.diceGroup.position.y = 1.32;
  }

  bindPointer() {
    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointermove', (event) => {
      const rect = canvas.getBoundingClientRect();
      this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersections = this.raycaster.intersectObjects(this.clickTargets, false);
      if (intersections[0]) this.callbacks.onTileHover?.(intersections[0].object.userData.tileId);
      else this.callbacks.onTileHover?.(null);
    });
    canvas.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      const rect = canvas.getBoundingClientRect();
      this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const tileHit = this.raycaster.intersectObjects(this.clickTargets, false)[0];
      if (tileHit) this.callbacks.onTileClick?.(tileHit.object.userData.tileId);
      else if (this.raycaster.intersectObject(this.diceGroup, true).length) this.callbacks.onDiceClick?.();
    });
  }

  getTileWorldPosition(index, slot = 0) {
    const layout = boardLayout(index);
    const offset = slot - 1.5;
    const local = new THREE.Vector3(offset * 0.23, 0.44, 0.02);
    local.applyAxisAngle(new THREE.Vector3(0, 1, 0), layout.rotation);
    return new THREE.Vector3(layout.x, 0, layout.z).add(local);
  }

  setTileVisual(tileId, tileState, player = null, group = null) {
    const entry = [...this.tileVisuals.entries()].find(([index]) => BOARD[index].id === tileId);
    if (!entry) return;
    const visual = entry[1];
    const ownerColor = player?.color || '#ad8a55';
    visual.ownerMaterials.forEach((material) => {
      if (tileState.owner != null) {
        material.color.set(ownerColor);
        if ('emissive' in material) material.emissive.set(new THREE.Color(ownerColor).multiplyScalar(0.1));
      } else if (group) {
        material.color.set(group.color);
        material.emissive.set('#000000');
      } else {
        material.color.set('#aa8a56');
        material.emissive.set('#000000');
      }
    });
    visual.border.material.color.set(tileState.owner != null ? ownerColor : '#b08b52');
    visual.buildingLevel = tileState.buildings;
    visual.landmark.scale.setScalar(tileState.owner == null ? 0.65 : 1 + tileState.buildings * 0.14);
    visual.landmark.position.y = 0.42;
  }

  updateState(state) {
    this.state = state;
    BOARD.forEach((tile, index) => {
      const tileState = state.tiles[tile.id];
      const owner = tileState.owner == null ? null : state.players[tileState.owner];
      this.setTileVisual(tile.id, tileState, owner, GROUPS.find((group) => group.id === tile.group));
    });
  }

  setHover(tileId) {
    this.tileVisuals.forEach((visual) => { visual.hoverMaterial.opacity = 0; });
    if (tileId == null) return;
    const index = BOARD.findIndex((tile) => tile.id === tileId);
    if (index >= 0) this.tileVisuals.get(index).hoverMaterial.opacity = 0.18;
  }

  focusTile(index) {
    const layout = boardLayout(index);
    this.focusTarget.set(layout.x * 0.14, 0, layout.z * 0.14);
  }

  focusCenter() { this.focusTarget.set(0, 0, 0); }

  burst(position, color = '#f3c45f', count = 18) {
    const group = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.92 });
    const geo = new THREE.IcosahedronGeometry(0.09, 0);
    for (let i = 0; i < count; i += 1) {
      const piece = new THREE.Mesh(geo, mat);
      piece.position.set(0, 0, 0);
      group.add(piece);
    }
    group.position.copy(position);
    this.scene.add(group);
    this.bursts.push({ group, started: performance.now(), life: 1050 });
  }

  floatText(text, position, color = '#f5d68a') {
    const material = new THREE.SpriteMaterial({ map: tileLabelTexture({ name: text }), transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(2.8, 0.92, 1);
    sprite.position.copy(position).add(new THREE.Vector3(0, 2.1, 0));
    sprite.renderOrder = 30;
    this.scene.add(sprite);
    this.floaters.push({ sprite, started: performance.now(), life: 1400 });
  }

  celebrate(playerId, state) {
    const player = state.players[playerId];
    const color = player?.color || '#f5d68a';
    const position = new THREE.Vector3(0, 1.1, 0);
    this.burst(position, color, 42);
    this.burst(new THREE.Vector3(-2.2, 1.5, -1.2), '#f2c35e', 24);
    this.burst(new THREE.Vector3(2.2, 1.5, 1.2), '#83c6c6', 24);
    this.floatText(`${player?.name || '掌柜'} 登顶！`, position, color);
  }

  updateEffects(now) {
    for (let i = this.bursts.length - 1; i >= 0; i -= 1) {
      const item = this.bursts[i];
      const progress = Math.min(1, (now - item.started) / item.life);
      item.group.children.forEach((piece, index) => {
        const angle = (index / item.group.children.length) * Math.PI * 2;
        piece.position.set(Math.cos(angle) * progress * 3.5, Math.sin(progress * Math.PI) * (2.2 + index * 0.03), Math.sin(angle) * progress * 3.5);
        piece.rotation.x += 0.05;
        piece.scale.setScalar(1 - progress * 0.55);
      });
      item.group.children.forEach((piece) => { piece.material.opacity = 0.9 * (1 - progress); });
      if (progress >= 1) {
        this.scene.remove(item.group);
        item.group.children.forEach((piece) => piece.material.dispose());
        this.bursts.splice(i, 1);
      }
    }
    for (let i = this.floaters.length - 1; i >= 0; i -= 1) {
      const item = this.floaters[i];
      const progress = Math.min(1, (now - item.started) / item.life);
      item.sprite.position.y += 0.012;
      item.sprite.material.opacity = 1 - progress;
      item.sprite.scale.set(2.8 + progress * 0.5, 0.92 + progress * 0.14, 1);
      if (progress >= 1) {
        this.scene.remove(item.sprite);
        item.sprite.material.map.dispose();
        item.sprite.material.dispose();
        this.floaters.splice(i, 1);
      }
    }
  }

  updateDice(now) {
    if (!this.diceAnimation) {
      this.diceGroup.position.y = THREE.MathUtils.lerp(this.diceGroup.position.y, 1.05, 0.08);
      return;
    }
    const item = this.diceAnimation;
    const progress = Math.min(1, (now - item.start) / item.duration);
    this.dice.forEach((die, index) => {
      die.rotation.x += 0.22;
      die.rotation.y += 0.18 + index * 0.02;
      die.position.y = Math.abs(Math.sin(progress * Math.PI * 5 + index)) * 0.6;
    });
    this.diceGroup.position.y = 1.32 + Math.sin(progress * Math.PI) * 0.55;
    if (progress >= 1) {
      this.dice.forEach((die, index) => {
        die.rotation.set(0.18 + index * 0.2, 0.35 - index * 0.16, -0.12 + index * 0.08);
        die.position.y = 0;
      });
      this.diceAnimation = null;
      item.onComplete?.();
    }
  }

  onResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    const now = performance.now();
    const delta = Math.min(0.05, Math.max(0, (now - this.lastFrameTime) / 1000));
    this.lastFrameTime = now;
    this.controls.target.lerp(this.focusTarget, 0.04);
    this.cameraFocus.lerp(this.controls.target, 0.04);
    if (this.compass) this.compass.rotation.y += delta * 0.16;
    if (this.fountain) this.fountain.rotation.y -= delta * 0.08;
    if (this.pollen) {
      this.pollen.rotation.y += delta * 0.012;
      this.pollen.position.y = Math.sin(now * 0.0004) * 0.3;
    }
    if (this.fireflies) {
      this.fireflies.rotation.y -= delta * .018;
      this.fireflies.position.y = Math.sin(now * .0007) * .24;
    }
    this.lanterns?.forEach((lantern, index) => {
      lantern.rotation.z = Math.sin(now * .0014 + (lantern.userData.phase || index)) * .035;
      lantern.position.y = .18 + Math.sin(now * .0011 + index) * .025;
    });
    this.centerCoins?.forEach((coin, index) => {
      coin.rotation.y += delta * (.55 + index * .04);
      coin.position.y = 1.2 + index * .2 + Math.sin(now * .0012 + coin.userData.phase) * .08;
    });
    this.clouds?.forEach((cloud, index) => {
      cloud.position.x += delta * cloud.userData.speed;
      if (cloud.position.x > 30) cloud.position.x = -30;
      cloud.position.y += Math.sin(now * 0.0002 + index) * 0.001;
    });
    this.updateDice(now);
    this.updateEffects(now);
    this.composer.render();
  };
}
