import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { jadeTexture, lacquerTexture, metalTexture, paperTexture, pbr, silkTexture } from './materials.js';

const mesh = (geometry, material, position = [0, 0, 0], scale = [1, 1, 1]) => {
  const item = new THREE.Mesh(geometry, material);
  item.position.set(...position);
  item.scale.set(...scale);
  item.castShadow = true;
  item.receiveShadow = true;
  return item;
};
const rounded = (w, h, d, material, radius = 0.03, position = [0, 0, 0]) => mesh(new RoundedBoxGeometry(w, h, d, 3, radius), material, position);
const sphere = (r, material, position = [0, 0, 0], scale = [1, 1, 1]) => mesh(new THREE.SphereGeometry(r, 12, 8), material, position, scale);

const lacquer = (color = '#7d302e', accent = '#d36a4c') => pbr(color, { map: lacquerTexture(color, accent), roughness: .28, metalness: .12 });
const celadon = () => pbr('#77a99a', { map: jadeTexture(), roughness: .24, metalness: .1 });
const gold = () => pbr('#c6953e', { map: metalTexture(), roughness: .25, metalness: .72 });
const ink = () => pbr('#263532', { roughness: .58, metalness: .06 });

export function addWindowFrame(parent, { x = 0, y = .55, z = .29, w = .16, h = .2, frame = gold(), glass = pbr('#f4c96a', { emissive: '#d58a2d', emissiveIntensity: .8, roughness: .28 }) } = {}) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.add(rounded(w, h, .028, ink(), .012, [0, 0, 0]));
  group.add(rounded(w * .78, h * .72, .035, glass, .008, [0, 0, .012]));
  group.add(rounded(.018, h * .96, .05, frame, .006, [0, 0, .032]));
  group.add(rounded(w * .96, .018, .05, frame, .006, [0, 0, .032]));
  group.add(rounded(w * .96, .018, .045, frame, .006, [0, -h * .46, .03]));
  group.add(rounded(w * .96, .018, .045, frame, .006, [0, h * .46, .03]));
  parent.add(group);
  return group;
}

export function addRoofDetails(parent, { y = 0, width = .62, depth = .58, roof = lacquer('#4a2b28', '#9b4a38'), accent = gold() } = {}) {
  const eave = rounded(width + .16, .065, depth + .16, roof, .025, [0, y, 0]);
  parent.add(eave);
  const ridge = rounded(width * .78, .055, .07, accent, .02, [0, y + .16, 0]);
  parent.add(ridge);
  [-1, 1].forEach((side) => {
    const end = rounded(.09, .09, .09, accent, .02, [side * width * .43, y - .015, 0]);
    parent.add(end);
  });
  return eave;
}

export function addBanner(parent, { x = 0, y = .55, z = .08, color = '#a93d38', height = .54, width = .18, rotate = 0 } = {}) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = rotate;
  group.add(mesh(new THREE.CylinderGeometry(.018, .022, height + .16, 7), pbr('#71432b'), [0, (height + .16) / 2, 0]));
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshStandardMaterial({ map: silkTexture(color, '#f0cf76', '#4d1e1e'), roughness: .48, side: THREE.DoubleSide }));
  cloth.position.set(.1, height * .46, 0);
  cloth.rotation.y = Math.PI / 2;
  cloth.castShadow = true;
  group.add(cloth);
  const finial = sphere(.045, gold(), [0, height + .2, 0]);
  group.add(finial);
  parent.add(group);
  return group;
}

export function addCoin(parent, position = [0, 0, 0], scale = 1, color = '#d3a44c') {
  const group = new THREE.Group();
  group.position.set(...position);
  group.scale.setScalar(scale);
  const material = pbr(color, { map: metalTexture(color, '#ffe3a0', '#744521'), roughness: .25, metalness: .68 });
  const coin = mesh(new THREE.CylinderGeometry(.12, .12, .035, 20), material);
  coin.rotation.x = Math.PI / 2;
  group.add(coin);
  group.add(mesh(new THREE.TorusGeometry(.1, .012, 6, 20), material, [0, 0, .02], [1, 1, .35]));
  group.add(rounded(.055, .055, .01, material, .008, [0, 0, .027]));
  parent.add(group);
  return group;
}

export function addVessel(parent, position = [0, 0, 0], scale = 1, color = '#6d9c8a') {
  const group = new THREE.Group();
  group.position.set(...position);
  group.scale.setScalar(scale);
  const body = pbr(color, { map: jadeTexture(), roughness: .2, metalness: .1 });
  const trim = gold();
  group.add(mesh(new THREE.SphereGeometry(.22, 16, 12), body, [0, .18, 0], [1, 1.2, 1]));
  group.add(mesh(new THREE.CylinderGeometry(.1, .15, .12, 16), body, [0, .43, 0]));
  group.add(mesh(new THREE.TorusGeometry(.12, .018, 8, 18), trim, [0, .49, 0]).rotateX(Math.PI / 2));
  group.add(mesh(new THREE.TorusGeometry(.2, .022, 8, 18), trim, [0, .23, 0]).rotateX(Math.PI / 2));
  group.add(mesh(new THREE.SphereGeometry(.035, 8, 6), trim, [0, .58, 0]));
  parent.add(group);
  return group;
}

export function addPearlString(parent, points, material = pbr('#f4e4bd', { roughness: .25, metalness: .08 }), radius = .025) {
  points.forEach((point) => parent.add(sphere(radius, material, point)));
}

export function addHairLock(parent, points, material, radius = .025) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  const lock = mesh(new THREE.TubeGeometry(curve, 10, radius, 6, false), material);
  parent.add(lock);
  return lock;
}

export function addFabricFold(parent, { x = 0, y = 0, z = 0, width = .08, height = .6, color = '#ffffff', rotate = 0 } = {}) {
  const fold = rounded(width, height, .025, pbr(color, { map: silkTexture(color, '#fff2bd', '#4a3828'), roughness: .46 }), .012, [x, y, z]);
  fold.rotation.z = rotate;
  parent.add(fold);
  return fold;
}

export function addPlanter(parent, position = [0, 0, 0], scale = 1, leaf = '#4e8b67') {
  const group = new THREE.Group();
  group.position.set(...position);
  group.scale.setScalar(scale);
  const pot = pbr('#9a5c42', { map: lacquerTexture('#8b4c3c', '#c77b55'), roughness: .48 });
  group.add(mesh(new THREE.CylinderGeometry(.22, .16, .26, 12), pot, [0, .13, 0]));
  group.add(mesh(new THREE.TorusGeometry(.2, .025, 8, 20), gold(), [0, .25, 0]).rotateX(Math.PI / 2));
  const leafMat = pbr(leaf, { roughness: .85 });
  for (let i = 0; i < 5; i += 1) {
    const angle = i * Math.PI * 2 / 5;
    const branch = mesh(new THREE.ConeGeometry(.12, .46, 5), leafMat, [Math.cos(angle) * .08, .45, Math.sin(angle) * .08]);
    branch.rotation.z = Math.cos(angle) * .3;
    branch.rotation.x = Math.sin(angle) * .3;
    group.add(branch);
  }
  parent.add(group);
  return group;
}

export function addSeal(parent, position = [0, 0, 0], scale = 1, color = '#b34838') {
  const group = new THREE.Group();
  group.position.set(...position);
  group.scale.setScalar(scale);
  const seal = pbr(color, { map: lacquerTexture(color, '#e08160'), roughness: .3, metalness: .08 });
  group.add(mesh(new THREE.CylinderGeometry(.18, .2, .08, 16), seal, [0, .04, 0]));
  group.add(mesh(new THREE.CylinderGeometry(.1, .1, .012, 16), gold(), [0, .09, 0]));
  parent.add(group);
  return group;
}

export function addScroll(parent, position = [0, 0, 0], scale = 1) {
  const group = new THREE.Group();
  group.position.set(...position);
  group.scale.setScalar(scale);
  group.add(mesh(new THREE.CylinderGeometry(.08, .08, .5, 12), pbr('#d8c49a', { map: paperTexture(), roughness: .8 }), [0, .2, 0], [1, 1, 1]).rotateZ(Math.PI / 2));
  group.add(mesh(new THREE.TorusGeometry(.08, .018, 8, 18), gold(), [-.25, .2, 0], [1, 1, .4]).rotateY(Math.PI / 2));
  group.add(mesh(new THREE.TorusGeometry(.08, .018, 8, 18), gold(), [.25, .2, 0], [1, 1, .4]).rotateY(Math.PI / 2));
  parent.add(group);
  return group;
}

export function addArchGate(parent, position = [0, 0, 0], scale = 1, color = '#a74638') {
  const group = new THREE.Group();
  group.position.set(...position);
  group.scale.setScalar(scale);
  const pillar = lacquer(color, '#d67b54');
  group.add(mesh(new THREE.CylinderGeometry(.1, .13, .85, 10), pillar, [-.42, .43, 0]));
  group.add(mesh(new THREE.CylinderGeometry(.1, .13, .85, 10), pillar, [.42, .43, 0]));
  group.add(rounded(1.05, .13, .16, pbr('#5d3327'), .04, [0, .82, 0]));
  group.add(rounded(1.2, .08, .22, gold(), .025, [0, .9, 0]));
  group.add(mesh(new THREE.ConeGeometry(.62, .32, 4), lacquer('#4a2927', '#9c4d3d'), [0, 1.08, 0], [1, 1, .45]));
  group.add(mesh(new THREE.SphereGeometry(.08, 10, 8), pbr('#f4c86c', { emissive: '#9a5c25', emissiveIntensity: .8 }), [0, 1.28, 0]));
  parent.add(group);
  return group;
}

export function addLeafCluster(parent, position = [0, 0, 0], scale = 1, color = '#4e8b67') {
  const group = new THREE.Group();
  group.position.set(...position);
  group.scale.setScalar(scale);
  const mat = pbr(color, { roughness: .88 });
  for (let i = 0; i < 7; i += 1) {
    const angle = i * Math.PI * 2 / 7;
    const radius = .15 + (i % 2) * .05;
    const leaf = sphere(.13, mat, [Math.cos(angle) * radius, .18 + (i % 3) * .06, Math.sin(angle) * radius], [1.25, .55, .75]);
    leaf.rotation.y = angle;
    group.add(leaf);
  }
  parent.add(group);
  return group;
}
