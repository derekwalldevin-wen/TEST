import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { makeTextSprite, pbr, brocadeTexture, denimTexture, fanTexture, hairTexture, lacquerTexture, skinTexture, silkTexture } from './materials.js';
import { addCoin, addFabricFold, addHairLock, addPearlString, addScroll, addSeal, addVessel } from './art-kit.js';

const make = (geometry, material, position = [0, 0, 0], scale = [1, 1, 1]) => {
  const item = new THREE.Mesh(geometry, material);
  item.position.set(...position);
  item.scale.set(...scale);
  item.castShadow = true;
  item.receiveShadow = true;
  return item;
};
const rounded = (w, h, d, material, radius = 0.06, position = [0, 0, 0]) => make(new RoundedBoxGeometry(w, h, d, 3, radius), material, position);
const sphere = (r, material, position = [0, 0, 0], scale = [1, 1, 1]) => make(new THREE.SphereGeometry(r, 20, 14), material, position, scale);
const ringMesh = (radius, tube, material, position = [0, 0, 0], arc = Math.PI * 2) => make(new THREE.TorusGeometry(radius, tube, 8, 24, arc), material, position);
const capsule = (r, length, material, position = [0, 0, 0], rotation = [0, 0, 0]) => {
  const item = make(new THREE.CapsuleGeometry(r, length, 6, 10), material, position);
  item.rotation.set(...rotation);
  return item;
};

function addEye(parent, x, y, z, size, iris = '#2c1a16', highlight = true) {
  const eye = new THREE.Group();
  eye.position.set(x, y, z);
  eye.add(sphere(size, pbr('#fffaf0', { roughness: 0.2 }), [0, 0, 0], [1, 1.15, 0.55]));
  eye.add(sphere(size * 0.55, pbr(iris, { roughness: 0.15, metalness: 0.08 }), [0, -0.005, size * 0.43], [1, 1.1, 0.5]));
  eye.add(sphere(size * 0.18, pbr('#fff', { emissive: '#fff', emissiveIntensity: 0.8, roughness: 0.1 }), [size * 0.18, size * 0.2, size * 0.67], [1, 1, 0.45]));
  if (highlight) eye.add(sphere(size * 0.08, pbr('#fff'), [-size * 0.12, size * 0.25, size * 0.75]));
  parent.add(eye);
  return eye;
}

function addMouth(parent, y, z, color = '#6d302d', scale = 1) {
  const mouth = make(new THREE.TorusGeometry(0.095 * scale, 0.018 * scale, 8, 18, Math.PI), pbr(color, { roughness: 0.35 }), [0, y, z], [1, 0.75, 1]);
  mouth.rotation.x = Math.PI;
  parent.add(mouth);
}

function addBrow(parent, x, y, z, color, angle = 0) {
  const brow = rounded(0.19, 0.035, 0.035, pbr(color, { roughness: 0.7 }), 0.015, [x, y, z]);
  brow.rotation.z = angle;
  parent.add(brow);
}

function addHairBun(parent, position, scale = 1, material) {
  const bun = sphere(0.24 * scale, material, position, [1, 0.92, 1]);
  parent.add(bun);
  const band = make(new THREE.TorusGeometry(0.2 * scale, 0.028 * scale, 8, 20), pbr('#b87c35', { metalness: 0.4 }), [position[0], position[1] + 0.03, position[2]], [1, 1, 0.45]);
  parent.add(band);
  return bun;
}

function addCheeks(parent, y, z, color = '#d9827e') {
  [-.18, .18].forEach((x) => parent.add(sphere(.075, pbr(color, { roughness: .48, transparent: true, opacity: .58 }), [x, y, z], [1.15, .58, .28])));
}

function addFaceSpark(parent, x, y, z) {
  parent.add(sphere(.018, pbr('#fff8df', { emissive: '#fff2c5', emissiveIntensity: .9, roughness: .1 }), [x, y, z]));
}

function addStrandFringe(parent, points, material, radius = .018) {
  points.forEach((point) => addHairLock(parent, point, material, radius));
}

function addSeam(parent, { x = 0, y = 0, z = .29, width = .38, height = .015, color = '#e6c26d', rotate = 0 } = {}) {
  const seam = rounded(width, height, .022, pbr(color, { roughness: .45, metalness: .18 }), .008, [x, y, z]);
  seam.rotation.z = rotate;
  parent.add(seam);
}

function addButton(parent, position, color = '#d7ad54', scale = 1) {
  const button = sphere(.035 * scale, pbr(color, { metalness: .4, roughness: .3 }), position, [1, 1, .4]);
  parent.add(button);
  return button;
}

function createDudu(def, index) {
  const group = new THREE.Group();
  const fur = pbr('#f2eee3', { map: skinTexture('#f2eee3', '#d9c9b9'), roughness: 0.96 });
  const furDark = pbr('#252126', { map: hairTexture('#252126', '#4d3b3e'), roughness: 0.98 });
  const jacket = pbr('#d8b56a', { map: brocadeTexture('#d3b16a', '#315541'), roughness: 0.62 });
  const sash = pbr('#c54d3e', { roughness: 0.52 });
  const belt = pbr('#f2e5c8', { roughness: 0.6 });
  const beak = pbr('#e8a33c', { roughness: 0.42 });
  const model = new THREE.Group();
  const parts = { arms: [], legs: [], head: null, body: null, eyes: [] };
  const body = rounded(1.05, 1.16, 0.68, jacket, 0.22, [0, 1.25, 0]);
  model.add(body); parts.body = body;
  const trim = rounded(0.65, 0.64, 0.025, pbr('#eee0b6', { map: brocadeTexture('#eee0b6', '#a36c35'), roughness: 0.6 }), 0.04, [0, 1.28, 0.355]);
  model.add(trim);
  const beltMesh = rounded(1.1, 0.16, 0.72, belt, 0.05, [0, 0.78, 0]);
  model.add(beltMesh);
  const knot = sphere(0.095, pbr('#6d9e51'), [0, 0.78, 0.39], [1, 1, 0.4]);
  model.add(knot);
  const strap = rounded(0.17, 1.42, 0.04, sash, 0.04, [0, 1.23, 0.39]);
  strap.rotation.z = -0.52;
  model.add(strap);
  const strapAccent = rounded(0.08, 0.18, 0.055, pbr('#e3c257', { metalness: 0.28 }), 0.02, [0.19, 0.95, 0.43]);
  strapAccent.rotation.z = -0.52;
  model.add(strapAccent);
  addSeam(model, { y: 1.55, z: .39, width: .32, color: '#e7c66d', rotate: -.05 });
  addSeam(model, { y: 1.06, z: .39, width: .24, color: '#e7c66d', rotate: -.05 });
  addButton(model, [.12, 1.56, .43], '#a64c3c', .8);
  addButton(model, [-.12, 1.3, .43], '#a64c3c', .8);

  const head = sphere(0.78, fur, [0, 2.34, 0], [1.02, 0.94, 0.88]);
  model.add(head); parts.head = head;
  const muzzle = sphere(0.43, fur, [0, 2.18, 0.54], [1, 0.72, 0.46]);
  model.add(muzzle);
  const earLeft = sphere(0.23, furDark, [-0.56, 2.85, 0], [1, 1, 0.6]);
  const earRight = sphere(0.23, furDark, [0.56, 2.85, 0], [1, 1, 0.6]);
  model.add(earLeft, earRight);
  const patchLeft = sphere(0.3, furDark, [-0.27, 2.43, 0.58], [1, 1.25, 0.3]);
  const patchRight = sphere(0.3, furDark, [0.27, 2.43, 0.58], [1, 1.25, 0.3]);
  model.add(patchLeft, patchRight);
  parts.eyes.push(addEye(model, -0.27, 2.45, 0.77, 0.15, '#4a2a21'), addEye(model, 0.27, 2.45, 0.77, 0.15, '#4a2a21'));
  const nose = sphere(0.105, pbr('#2a1c1b', { roughness: 0.22 }), [0, 2.25, 0.79], [1.3, 0.8, 0.7]);
  model.add(nose);
  addMouth(model, 2.16, 0.78, '#5a2d2c', 0.8);
  addCheeks(model, 2.28, .72, '#d99588');
  addFaceSpark(model, -.11, 2.61, .79);
  [-.62, -.48, .48, .62].forEach((x, i) => model.add(sphere(.07, fur, [x, 2.62 + (i % 2) * .05, .25], [1, .55, .3])));

  const hat = make(new THREE.CylinderGeometry(0.56, 0.62, 0.16, 20), pbr('#b9873c', { roughness: 0.75 }), [0, 3.06, 0]);
  model.add(hat);
  const fluff = make(new THREE.TorusGeometry(0.53, 0.12, 10, 24), pbr('#d4c0a2', { roughness: 0.98 }), [0, 3.0, 0]);
  fluff.rotation.x = Math.PI / 2; model.add(fluff);
  const duck = sphere(0.19, pbr('#f0c14d', { roughness: 0.45 }), [0, 3.32, 0], [1, 1.15, 1]);
  model.add(duck);
  model.add(sphere(0.05, pbr('#f9d675'), [0, 3.43, 0.14], [1, 1, 0.45]));
  model.add(make(new THREE.ConeGeometry(0.09, 0.13, 4), beak, [0, 3.31, 0.23], [1, 0.8, 1]).rotateX(Math.PI / 2));
  addEye(duck, -0.06, 3.36, 0.16, 0.035, '#2b221c');
  addEye(duck, 0.06, 3.36, 0.16, 0.035, '#2b221c');
  duck.add(sphere(.08, pbr('#dca139', { roughness: .5 }), [.16, 3.29, 0], [1.5, .35, .7]));
  duck.add(sphere(.08, pbr('#dca139', { roughness: .5 }), [-.16, 3.29, 0], [1.5, .35, .7]));
  model.add(make(new THREE.TorusGeometry(.55, .022, 6, 20), pbr('#c59145', { metalness: .32, roughness: .36 }), [0, 3.11, 0]).rotateX(Math.PI / 2));

  const armLeft = capsule(0.17, 0.55, furDark, [-0.62, 1.18, 0], [0, 0, 0.18]);
  const armRight = capsule(0.17, 0.55, furDark, [0.62, 1.18, 0], [0, 0, -0.18]);
  model.add(armLeft, armRight); parts.arms.push(armLeft, armRight);
  const handLeft = sphere(0.18, furDark, [-0.67, 0.78, 0]);
  const handRight = sphere(0.18, furDark, [0.67, 0.78, 0]);
  model.add(handLeft, handRight);
  const legLeft = capsule(0.2, 0.48, furDark, [-0.28, 0.4, 0], [0, 0, 0.05]);
  const legRight = capsule(0.2, 0.48, furDark, [0.28, 0.4, 0], [0, 0, -0.05]);
  model.add(legLeft, legRight); parts.legs.push(legLeft, legRight);
  const footLeft = sphere(0.24, furDark, [-0.29, 0.12, 0.08], [1, 0.55, 1.2]);
  const footRight = sphere(0.24, furDark, [0.29, 0.12, 0.08], [1, 0.55, 1.2]);
  model.add(footLeft, footRight);
  model.add(rounded(.18, .025, .04, pbr('#6e5551', { roughness: .6 }), .01, [-.29, .12, .205]));
  model.add(rounded(.18, .025, .04, pbr('#6e5551', { roughness: .6 }), .01, [.29, .12, .205]));
  group.add(model);
  return { group, model, parts, name: def.name, color: def.color };
}

function createTang(def, index) {
  const group = new THREE.Group();
  const skin = pbr('#f5c9ae', { map: skinTexture(), roughness: 0.72 });
  const hair = pbr('#241a23', { map: hairTexture('#241a23', '#5e3942'), roughness: 0.44 });
  const jade = pbr('#5e9c82', { map: silkTexture('#5e9c82', '#b3d6b5', '#2b5a4e'), roughness: 0.35, metalness: 0.12 });
  const blue = pbr('#557f9a', { map: silkTexture('#557f9a', '#b7d1d7', '#29485d'), roughness: 0.34, metalness: 0.08 });
  const gold = pbr('#d1a048', { roughness: 0.3, metalness: 0.5 });
  const model = new THREE.Group();
  const parts = { arms: [], legs: [], head: null, body: null, eyes: [] };
  const skirt = make(new THREE.CylinderGeometry(0.44, 0.76, 1.18, 18), blue, [0, 0.93, 0]);
  model.add(skirt); parts.body = skirt;
  const upper = rounded(0.7, 0.74, 0.45, jade, 0.16, [0, 1.67, 0]);
  model.add(upper);
  const chestBand = rounded(0.74, 0.13, 0.48, gold, 0.03, [0, 1.6, 0.01]);
  model.add(chestBand);
  const shawl = make(new THREE.TorusGeometry(0.58, 0.13, 10, 36, Math.PI * 1.45), gold, [0, 1.6, 0.05], [1, 0.58, 1]);
  shawl.rotation.x = Math.PI / 2; model.add(shawl);
  addFabricFold(model, { x: -.18, y: 1.02, z: .24, width: .06, height: .5, color: '#c89c45', rotate: -.18 });
  addFabricFold(model, { x: .18, y: 1.0, z: .24, width: .06, height: .48, color: '#d6b45c', rotate: .18 });
  addSeam(model, { y: 1.56, z: .245, width: .48, color: '#e5c778' });
  const head = sphere(0.58, skin, [0, 2.48, 0], [1, 1.02, 0.88]);
  model.add(head); parts.head = head;
  const hairCap = sphere(0.62, hair, [0, 2.62, -0.08], [1, 0.88, 0.83]);
  model.add(hairCap);
  addHairBun(model, [-0.32, 3.08, -0.04], 1.15, hair);
  addHairBun(model, [0.31, 3.08, -0.04], 1.15, hair);
  const hairBand = make(new THREE.TorusGeometry(0.42, 0.045, 8, 20), gold, [0, 2.9, 0.05], [1, 0.35, 0.45]);
  model.add(hairBand);
  const flower = sphere(0.13, pbr('#d96854', { roughness: 0.45 }), [0.39, 3.25, 0.03], [1, 0.65, 0.6]);
  model.add(flower);
  model.add(sphere(0.05, pbr('#f4c667'), [0.39, 3.25, 0.1], [1, 1, 0.5]));
  addPearlString(model, [[.36, 3.18, .08], [.4, 3.09, .08], [.43, 3.0, .06]], pbr('#f4e4bd', { roughness: .24, metalness: .1 }), .025);
  addHairLock(model, [[-.42, 2.86, .15], [-.48, 2.68, .32], [-.38, 2.52, .4]], hair, .025);
  addHairLock(model, [[.4, 2.9, .12], [.48, 2.72, .3], [.38, 2.54, .4]], hair, .022);
  addCheeks(model, 2.42, .52, '#d88480');
  addFaceSpark(model, -.1, 2.68, .54);
  parts.eyes.push(addEye(model, -0.2, 2.52, 0.5, 0.12, '#4c2824'), addEye(model, 0.2, 2.52, 0.5, 0.12, '#4c2824'));
  addBrow(model, -0.2, 2.69, 0.49, '#47252a', 0.08);
  addBrow(model, 0.2, 2.69, 0.49, '#47252a', -0.08);
  const nose = sphere(0.045, pbr('#ca7c71', { roughness: 0.5 }), [0, 2.41, 0.58], [1, 0.8, 0.7]);
  model.add(nose); addMouth(model, 2.36, 0.57, '#9d3c47', 0.65);
  const sleeveLeft = make(new THREE.CylinderGeometry(0.21, 0.27, 0.9, 12), jade, [-0.48, 1.62, 0], [1, 1, 0.8]);
  const sleeveRight = make(new THREE.CylinderGeometry(0.21, 0.27, 0.9, 12), jade, [0.48, 1.62, 0], [1, 1, 0.8]);
  sleeveLeft.rotation.z = -0.22; sleeveRight.rotation.z = 0.22;
  model.add(sleeveLeft, sleeveRight); parts.arms.push(sleeveLeft, sleeveRight);
  const handLeft = sphere(0.13, skin, [-0.6, 1.1, 0]);
  const handRight = sphere(0.13, skin, [0.6, 1.1, 0]);
  model.add(handLeft, handRight);
  const fan = make(new THREE.CylinderGeometry(0.34, 0.34, 0.035, 24), pbr('#d9b45b', { map: fanTexture(), roughness: 0.42 }), [0.64, 1.5, 0.2], [1, 1, 0.28]);
  fan.rotation.x = Math.PI / 2; model.add(fan);
  const fanRim = ringMesh(.345, .018, gold, [0.64, 1.5, .235], Math.PI * 2);
  fanRim.rotation.x = Math.PI / 2; model.add(fanRim);
  addPearlString(model, [[.54, 1.28, .24], [.64, 1.22, .24], [.74, 1.28, .24]], pbr('#f3e4be', { roughness: .3 }), .018);
  model.add(make(new THREE.CylinderGeometry(0.025, 0.025, 0.68, 8), gold, [0.64, 1.05, 0.2], [1, 1, 0.5]));
  group.add(model);
  return { group, model, parts, name: def.name, color: def.color };
}

function createYouth(def, index) {
  const group = new THREE.Group();
  const skin = pbr('#f2c2ac', { map: skinTexture('#f2c2ac', '#d9897c'), roughness: 0.78 });
  const hair = pbr('#25232b', { map: hairTexture('#25232b', '#5a4049'), roughness: 0.34 });
  const red = pbr('#a6383f', { map: silkTexture('#a6383f', '#db8a7a', '#51252f'), roughness: 0.68 });
  const denim = pbr('#55646c', { map: denimTexture(), roughness: 0.88 });
  const white = pbr('#e6ddc4', { roughness: 0.7 });
  const tiger = pbr('#c97938', { roughness: 0.82 });
  const model = new THREE.Group();
  const parts = { arms: [], legs: [], head: null, body: null, eyes: [] };
  const shirt = rounded(0.88, 0.9, 0.5, red, 0.15, [0, 1.4, 0]);
  model.add(shirt); parts.body = shirt;
  const collar = rounded(0.5, 0.1, 0.54, white, 0.03, [0, 1.84, 0]);
  model.add(collar);
  addSeam(model, { y: 1.48, z: .27, width: .55, color: '#d37d73', rotate: -.02 });
  addSeam(model, { y: 1.12, z: .27, width: .45, color: '#7e303b', rotate: -.02 });
  const pocket = rounded(.24, .2, .035, pbr('#8d3039', { roughness: .78 }), .035, [.18, 1.32, .275]);
  pocket.rotation.z = -.05; model.add(pocket);
  addButton(model, [-.18, 1.25, .29], '#d9b15b', .65);
  addButton(model, [-.18, 1.55, .29], '#d9b15b', .65);
  const strap = rounded(0.13, 1.5, 0.04, pbr('#607d8a', { roughness: 0.82 }), 0.03, [0, 1.35, 0.28]);
  strap.rotation.z = -0.48; model.add(strap);
  const bag = rounded(0.34, 0.42, 0.24, pbr('#956341', { roughness: 0.78 }), 0.08, [0.34, 1.05, 0.26]);
  model.add(bag);
  model.add(make(new THREE.TorusGeometry(0.12, 0.025, 8, 18), pbr('#b78c4b', { metalness: 0.4 }), [0.34, 1.05, 0.4], [1, 1, 0.4]));
  const head = sphere(0.61, skin, [0, 2.45, 0], [1, 1, 0.92]);
  model.add(head); parts.head = head;
  const cap = sphere(0.64, hair, [0, 2.65, -0.04], [1, 0.9, 0.88]);
  model.add(cap);
  addHairBun(model, [-0.48, 2.94, 0], 1.02, hair);
  addHairBun(model, [0.48, 2.94, 0], 1.02, hair);
  const ribbonL = make(new THREE.TorusGeometry(0.19, 0.018, 8, 18), pbr('#c73b42'), [-0.48, 2.98, 0.08], [1, 1, 0.45]);
  const ribbonR = make(new THREE.TorusGeometry(0.19, 0.018, 8, 18), pbr('#c73b42'), [0.48, 2.98, 0.08], [1, 1, 0.45]);
  model.add(ribbonL, ribbonR);
  const bangL = sphere(0.18, hair, [-0.24, 2.68, 0.48], [1.2, 0.7, 0.35]);
  const bangR = sphere(0.18, hair, [0.24, 2.68, 0.48], [1.2, 0.7, 0.35]);
  model.add(bangL, bangR);
  addHairLock(model, [[-.42, 2.78, .28], [-.5, 2.58, .4], [-.4, 2.4, .44]], hair, .024);
  addHairLock(model, [[.42, 2.78, .28], [.5, 2.58, .4], [.4, 2.4, .44]], hair, .024);
  addCheeks(model, 2.38, .59, '#d27e78');
  addFaceSpark(model, -.1, 2.63, .58);
  parts.eyes.push(addEye(model, -0.21, 2.48, 0.56, 0.15, '#5a1f1c'), addEye(model, 0.21, 2.48, 0.56, 0.15, '#5a1f1c'));
  addBrow(model, -0.21, 2.67, 0.54, '#28212a', 0.12);
  addBrow(model, 0.21, 2.67, 0.54, '#28212a', -0.12);
  model.add(sphere(0.045, pbr('#cb7b70'), [0, 2.36, 0.58], [1, 0.8, 0.7]));
  addMouth(model, 2.3, 0.58, '#873e41', 0.65);
  const armLeft = capsule(0.12, 0.55, red, [-0.55, 1.35, 0], [0, 0, -0.72]);
  const armRight = capsule(0.12, 0.55, red, [0.55, 1.35, 0], [0, 0, 0.72]);
  model.add(armLeft, armRight); parts.arms.push(armLeft, armRight);
  model.add(sphere(0.12, skin, [-0.68, 1.03, 0]), sphere(0.12, skin, [0.68, 1.03, 0]));
  const legLeft = rounded(0.39, 0.95, 0.42, denim, 0.13, [-0.23, 0.53, 0]);
  const legRight = rounded(0.39, 0.95, 0.42, denim, 0.13, [0.23, 0.53, 0]);
  model.add(legLeft, legRight); parts.legs.push(legLeft, legRight);
  const shoeL = rounded(0.45, 0.18, 0.62, pbr('#b23b3e', { roughness: 0.48 }), 0.08, [-0.23, 0.12, 0.08]);
  const shoeR = rounded(0.45, 0.18, 0.62, pbr('#b23b3e', { roughness: 0.48 }), 0.08, [0.23, 0.12, 0.08]);
  model.add(shoeL, shoeR);
  const patchL = rounded(.14, .12, .025, pbr('#8c6c55', { roughness: .9 }), .015, [-.23, .62, .225]);
  const patchR = rounded(.14, .12, .025, pbr('#8c6c55', { roughness: .9 }), .015, [.23, .48, .225]);
  patchL.rotation.z = -.12; patchR.rotation.z = .1; model.add(patchL, patchR);
  model.add(rounded(.18, .015, .02, pbr('#efe3c1'), .006, [-.23, .21, .39]));
  model.add(rounded(.18, .015, .02, pbr('#efe3c1'), .006, [.23, .21, .39]));
  const charm = sphere(0.16, tiger, [0.34, 0.72, 0.42], [1, 1.1, 0.7]);
  model.add(charm);
  model.add(make(new THREE.TorusGeometry(0.13, 0.012, 6, 12), pbr('#5c2b1e'), [0.34, 0.79, 0.52], [1, 1, 0.3]));
  model.add(sphere(.022, pbr('#4b241b'), [.3, .75, .53]));
  model.add(sphere(.022, pbr('#4b241b'), [.38, .75, .53]));
  model.add(rounded(.055, .018, .02, pbr('#4b241b'), .005, [.34, .68, .54]));
  group.add(model);
  return { group, model, parts, name: def.name, color: def.color };
}

function createExplorer(def, index) {
  const group = new THREE.Group();
  const skin = pbr('#f2c5a9', { map: skinTexture('#f2c5a9', '#d68b7c'), roughness: 0.76 });
  const hair = pbr('#6f2927', { map: hairTexture('#6f2927', '#c06b3e'), roughness: 0.34 });
  const shirt = pbr('#ece6d2', { map: silkTexture('#ece6d2', '#fff6d7', '#9b896c'), roughness: 0.64 });
  const leather = pbr('#8b4b2d', { map: lacquerTexture('#8b4b2d', '#c9824d'), roughness: 0.62 });
  const boot = pbr('#6b3725', { roughness: 0.55, metalness: 0.08 });
  const gold = pbr('#d5a344', { roughness: 0.3, metalness: 0.58 });
  const model = new THREE.Group();
  const parts = { arms: [], legs: [], head: null, body: null, eyes: [] };
  const body = rounded(0.96, 1.08, 0.58, shirt, 0.16, [0, 1.35, 0]);
  model.add(body); parts.body = body;
  const belt = rounded(1.02, 0.17, 0.62, leather, 0.05, [0, 0.91, 0]);
  model.add(belt);
  model.add(rounded(0.2, 0.22, 0.08, gold, 0.035, [0, 0.92, 0.34]));
  const chestStrap = rounded(0.13, 1.45, 0.06, leather, 0.03, [0, 1.38, 0.33]);
  chestStrap.rotation.z = -0.42; model.add(chestStrap);
  const backStrap = rounded(0.13, 1.25, 0.06, leather, 0.03, [0, 1.35, -0.31]);
  backStrap.rotation.z = 0.42; model.add(backStrap);
  const pouchL = rounded(0.3, 0.34, 0.25, leather, 0.07, [-0.53, 0.97, 0.04]);
  const pouchR = rounded(0.3, 0.34, 0.25, leather, 0.07, [0.53, 0.97, 0.04]);
  model.add(pouchL, pouchR);
  addSeam(model, { y: 1.55, z: .3, width: .55, color: '#a97a55', rotate: -.42 });
  addSeam(model, { y: 1.2, z: .3, width: .48, color: '#a97a55', rotate: -.42 });
  addSeam(model, { y: 1.05, z: .27, width: .35, color: '#e1b36c', rotate: 0 });
  addButton(model, [.2, 1.58, .31], '#d6a449', .7);
  addButton(model, [.2, 1.32, .31], '#d6a449', .7);
  const head = sphere(0.62, skin, [0, 2.47, 0], [1, 1.02, 0.9]);
  model.add(head); parts.head = head;
  const hairCap = sphere(0.67, hair, [0, 2.72, -0.06], [1.04, 0.9, 0.9]);
  model.add(hairCap);
  const hairChunk1 = sphere(0.34, hair, [-0.35, 2.62, 0.42], [1.1, 0.7, 0.35]);
  const hairChunk2 = sphere(0.33, hair, [0.3, 2.65, 0.4], [1.1, 0.7, 0.35]);
  const hairChunk3 = sphere(0.3, hair, [0, 2.88, 0.37], [1.1, 0.65, 0.34]);
  model.add(hairChunk1, hairChunk2, hairChunk3);
  addHairLock(model, [[-.52, 2.76, .18], [-.64, 2.52, .38], [-.5, 2.3, .44]], hair, .026);
  addHairLock(model, [[.52, 2.76, .18], [.64, 2.52, .38], [.5, 2.3, .44]], hair, .026);
  addHairLock(model, [[0, 2.98, .4], [-.05, 2.76, .56], [0, 2.6, .5]], hair, .02);
  addCheeks(model, 2.37, .6, '#cc7a70');
  addFaceSpark(model, -.1, 2.66, .6);
  const ahogeCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0.12, 3.12, 0), new THREE.Vector3(0.42, 3.4, 0.05), new THREE.Vector3(0.75, 3.36, 0.04)]);
  const ahoge = make(new THREE.TubeGeometry(ahogeCurve, 10, 0.045, 7, false), gold);
  model.add(ahoge);
  parts.eyes.push(addEye(model, -0.21, 2.5, 0.57, 0.15, '#28618b'), addEye(model, 0.21, 2.5, 0.57, 0.15, '#d19b35'));
  addBrow(model, -0.21, 2.7, 0.55, '#57211f', 0.12);
  addBrow(model, 0.21, 2.7, 0.55, '#57211f', -0.12);
  model.add(sphere(0.047, pbr('#c77d6f'), [0, 2.37, 0.59], [1, 0.8, 0.7]));
  addMouth(model, 2.32, 0.59, '#8e413b', 0.65);
  const armL = capsule(0.13, 0.55, shirt, [-0.58, 1.35, 0], [0, 0, -0.58]);
  const armR = capsule(0.13, 0.55, shirt, [0.58, 1.35, 0], [0, 0, 0.58]);
  model.add(armL, armR); parts.arms.push(armL, armR);
  model.add(sphere(0.12, skin, [-0.7, 1.05, 0]), sphere(0.12, skin, [0.7, 1.05, 0]));
  const legL = rounded(0.4, 0.92, 0.43, shirt, 0.1, [-0.23, 0.51, 0]);
  const legR = rounded(0.4, 0.92, 0.43, shirt, 0.1, [0.23, 0.51, 0]);
  model.add(legL, legR); parts.legs.push(legL, legR);
  const bootL = rounded(0.48, 0.55, 0.58, boot, 0.1, [-0.23, 0.31, 0.02]);
  const bootR = rounded(0.48, 0.55, 0.58, boot, 0.1, [0.23, 0.31, 0.02]);
  model.add(bootL, bootR);
  [-.23, .23].forEach((x) => {
    model.add(rounded(.12, .08, .03, gold, .015, [x, .38, .31]));
    model.add(rounded(.05, .035, .035, pbr('#70452e'), .01, [x, .38, .34]));
  });
  addCoin(model, [.48, 1.1, .3], .34, '#c99b4c');
  model.add(rounded(0.52, 0.12, 0.65, pbr('#332d2b'), 0.05, [-0.23, 0.07, 0.04]));
  model.add(rounded(0.52, 0.12, 0.65, pbr('#332d2b'), 0.05, [0.23, 0.07, 0.04]));
  group.add(model);
  return { group, model, parts, name: def.name, color: def.color };
}

export function createCharacter(def, index) {
  const factory = { panda: createDudu, tang: createTang, youth: createYouth, explorer: createExplorer }[def.character] || createDudu;
  const result = factory(def, index);
  const { group, model, parts, name, color } = result;
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.62, 32), new THREE.MeshBasicMaterial({ color: '#101c1b', transparent: true, opacity: 0.26, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.015;
  group.add(shadow);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.035, 8, 32), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.86, depthWrite: false }));
  halo.rotation.x = Math.PI / 2;
  halo.position.y = 0.03;
  group.add(halo);
  const label = makeTextSprite(name, { background: color, border: '#f1d58a', width: 1.2, subtext: def.title });
  label.position.set(0, 3.68, 0);
  group.add(label);
  group.userData.character = {
    def, index, model, parts, label, halo, name, color,
    baseScale: 0.92, moving: false, walking: false, celebrating: 0, active: index === 0,
    positionResolver: null, currentIndex: 0, currentSlot: 0, movement: null
  };
  model.scale.setScalar(0.92);
  halo.visible = index === 0;
  return group;
}

export function setCharacterTile(character, index, slot, positionResolver, immediate = true) {
  const data = character.userData.character;
  data.currentIndex = index;
  data.currentSlot = slot;
  data.positionResolver = positionResolver;
  if (!positionResolver) return;
  const position = positionResolver(index, slot);
  if (immediate) {
    character.position.copy(position);
    data.movement = null;
  }
  const layoutAngle = [0, -Math.PI / 2, Math.PI, Math.PI / 2][Math.floor(index / 10) % 4];
  data.model.rotation.y = layoutAngle;
}

export function moveCharacterAlong(character, path, duration = 720, onComplete = null) {
  const data = character.userData.character;
  if (!path?.length || !data.positionResolver) return;
  data.moving = true;
  data.walking = true;
  data.movement = { path: path.map(([index, slot]) => data.positionResolver(index, slot)), started: performance.now(), duration, onComplete };
  data.movementCallback = onComplete;
  character.userData.movementPath = data.movement;
}

export function setCharacterActive(character, active) {
  const data = character.userData.character;
  data.active = active;
  data.halo.visible = active;
  data.label.scale.setScalar(active ? 1.08 : 0.96);
}

export function setCharacterWalking(character, walking) {
  character.userData.character.walking = walking;
}

export function celebrateCharacter(character) {
  character.userData.character.celebrating = 1;
}

export function updateCharacter(character, time, delta) {
  const data = character.userData.character;
  const { model, parts, head, body, label, halo } = data;
  const breathe = Math.sin(time * 2.2 + data.index * 0.9) * 0.018;
  if (data.celebrating > 0) {
    data.celebrating = Math.max(0, data.celebrating - delta * 0.28);
    const jump = Math.abs(Math.sin(time * 6.5)) * 0.42 * data.celebrating;
    model.position.y = jump;
    model.rotation.y += delta * 1.7 * data.celebrating;
  } else {
    model.position.y = THREE.MathUtils.lerp(model.position.y, 0, 0.14);
  }
  if (body) body.scale.y = 1 + breathe;
  if (head) head.position.y += Math.sin(time * 2.1 + data.index) * 0.0007;
  if (data.movement) {
    const progress = Math.min(1, (performance.now() - data.movement.started) / data.movement.duration);
    const scaled = progress * (data.movement.path.length - 1);
    const segment = Math.min(data.movement.path.length - 2, Math.floor(scaled));
    const local = scaled - segment;
    const from = data.movement.path[segment];
    const to = data.movement.path[Math.min(segment + 1, data.movement.path.length - 1)];
    character.position.lerpVectors(from, to, local);
    character.position.y += Math.sin(progress * Math.PI) * 0.42;
    const direction = to.clone().sub(from);
    if (direction.lengthSq() > 0.001) model.rotation.y = Math.atan2(direction.x, direction.z);
    parts.arms.forEach((arm, index) => { arm.rotation.x = Math.sin(time * 10 + index * Math.PI) * 0.45; });
    parts.legs.forEach((leg, index) => { leg.rotation.x = Math.sin(time * 10 + index * Math.PI + Math.PI) * 0.28; });
    if (progress >= 1) {
      data.movement = null;
      data.moving = false;
      data.walking = false;
      data.movementOnComplete?.();
      data.movementCallback?.();
      data.movementCallback = null;
    }
  } else if (data.walking) {
    parts.legs.forEach((leg, index) => { leg.rotation.x = Math.sin(time * 9 + index * Math.PI) * 0.2; });
    parts.arms.forEach((arm, index) => { arm.rotation.x = Math.sin(time * 9 + index * Math.PI + Math.PI) * 0.25; });
  } else {
    parts.legs.forEach((leg) => { leg.rotation.x = THREE.MathUtils.lerp(leg.rotation.x, 0, 0.15); });
    parts.arms.forEach((arm) => { arm.rotation.x = THREE.MathUtils.lerp(arm.rotation.x, 0, 0.15); });
  }
  halo.rotation.z = time * 0.35;
  label.position.y = 3.68 + Math.sin(time * 2 + data.index) * 0.035;
}
