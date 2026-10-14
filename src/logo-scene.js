import * as THREE from 'three';
import { logoPose, renderPixelRatio } from './logo-motion.js';

// Traced from the supplied reference: split crown, diagonal stroke and inset.
// Replace these contours with final vector artwork when supplied.
export function createLogoShapes() {
  const crown = new THREE.Shape();
  crown.moveTo(-1.65, 2.05);
  crown.lineTo(.25, 2.05);
  crown.bezierCurveTo(1.35, 2.05, 1.85, 1.5, 1.85, .55);
  crown.lineTo(1.85, -.08);
  crown.lineTo(1.22, .28);
  crown.lineTo(1.22, .58);
  crown.bezierCurveTo(1.22, 1.12, .93, 1.43, .24, 1.43);
  crown.lineTo(-1.06, 1.43);
  crown.lineTo(1.85, -.25);
  crown.lineTo(1.85, -.83);
  crown.lineTo(-1.65, 1.2);
  crown.closePath();

  const lower = new THREE.Shape();
  lower.moveTo(-1.65, .92);
  lower.lineTo(1.85, -1.1);
  lower.bezierCurveTo(1.85, -1.76, 1.17, -2.05, .28, -2.05);
  lower.lineTo(-1.65, -2.05);
  lower.lineTo(-1.65, -.22);
  lower.lineTo(-1.03, -.58);
  lower.lineTo(-1.03, -1.43);
  lower.lineTo(.25, -1.43);
  lower.lineTo(.82, -1.1);
  lower.lineTo(-1.65, .33);
  lower.closePath();

  const inset = new THREE.Shape();
  inset.moveTo(-1.6, .3);
  inset.lineTo(.18, -.73);
  inset.lineTo(.18, -1.38);
  inset.lineTo(-1.6, -.35);
  inset.closePath();
  return { crown, lower, inset };
}

export async function createLogoScene(mount, onUnavailable) {
  const texture = await new THREE.TextureLoader().loadAsync('/assets/basalt-texture.png');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.repeat.set(1.6, 1.6);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
  catch (error) { texture.dispose(); throw error; }
  renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  scene.add(new THREE.HemisphereLight(0xf0f2e8, 0x242920, 1.4));
  const key = new THREE.DirectionalLight(0xfff9e8, 3.8);
  key.position.set(-4, 6, 8); scene.add(key);
  const rim = new THREE.DirectionalLight(0xb9ceab, 2);
  rim.position.set(5, 2, -4); scene.add(rim);
  const glow = new THREE.PointLight(0xd7ff3f, 7, 8, 2);
  glow.position.set(-1.4, -.2, 1); scene.add(glow);

  const face = new THREE.MeshStandardMaterial({
    color: 0xd9d6c7, map: texture, bumpMap: texture, bumpScale: .065,
    roughness: .56, metalness: .08,
  });
  face.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
      #ifdef USE_MAP
        vec3 grain = texture2D(map, vMapUv).rgb;
        diffuseColor.rgb *= .52 + .48 * grain;
      #endif
    `);
  };
  const edge = new THREE.MeshStandardMaterial({
    color: 0x737769, map: texture, bumpMap: texture, bumpScale: .075,
    roughness: .42, metalness: .28,
  });
  const lime = new THREE.MeshBasicMaterial({ color: 0xd7ff3f, toneMapped: false });
  const limeEdge = new THREE.MeshStandardMaterial({ color: 0x9bb82d, roughness: .35, metalness: .15 });
  const logo = new THREE.Group();
  scene.add(logo);
  const shapes = createLogoShapes();
  const geometries = [];
  function extrude(shape, depth, material, bevel) {
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel,
      bevelSegments: 2, curveSegments: 24, steps: 1,
    });
    geometry.translate(0, 0, -depth / 2);
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    logo.add(mesh);
    return mesh;
  }
  const crown = extrude(shapes.crown, .64, [face, edge], .035);
  const lower = extrude(shapes.lower, .64, [face, edge], .035);
  const inset = extrude(shapes.inset, .47, [lime, limeEdge], .014);
  inset.position.z = -.26;
  mount.append(renderer.domElement);
  let disposed = false, mobile = false;
  let lastState = { progress: 0, x: 0, y: 0, paused: true };
  const lookAt = new THREE.Vector3();
  let sampleStart = performance.now(), sampleFrames = 0, sampleCost = 0, previousRender = 0;

  function update(state) {
    if (disposed) return;
    lastState = state;
    const { progress, x, y, paused } = state;
    const pose = logoPose(progress, paused);
    logo.rotation.set(-.04 + (paused ? 0 : y * .07), -.24 + (paused ? 0 : x * .14) + pose.resolve * .15, .015);
    logo.position.set(mobile ? 0 : .95 + pose.open * .65, mobile ? 1.55 - pose.open * .25 : .35, 0);
    logo.scale.setScalar(pose.scale);
    crown.position.set(...pose.crown);
    lower.position.set(...pose.lower);
    crown.rotation.set(pose.open * -.12, pose.open * -.24, pose.open * -.08);
    lower.rotation.set(pose.open * .12, pose.open * .2, pose.open * .07);
    inset.position.z = pose.coreZ;
    glow.intensity = 7 + pose.open * 4;
    camera.position.set(paused ? 0 : x * .12, mobile ? 0 : .25, mobile ? 12.3 + pose.open * 1.25 : 10.7);
    lookAt.set(0, 0, 0); camera.lookAt(lookAt);
    mount.style.opacity = pose.opacity;
    const started = performance.now();
    if (started - previousRender > 200) { sampleStart = started; sampleFrames = sampleCost = 0; }
    previousRender = started;
    renderer.render(scene, camera);
    sampleCost += performance.now() - started;
    sampleFrames++;
    if (performance.now() - sampleStart >= 1000) {
      mount.dataset.renderRate = String(Math.round(sampleFrames * 1000 / (performance.now() - sampleStart)));
      mount.dataset.renderMs = (sampleCost / sampleFrames).toFixed(2);
      mount.dataset.renderCount = String(renderer.info.render.frame);
      sampleStart = performance.now(); sampleFrames = sampleCost = 0;
    }
    mount.dataset.progress = progress.toFixed(3);
    mount.dataset.triangles = String(renderer.info.render.triangles);
    if (mount.dataset.renderState !== 'active') mount.dataset.renderState = 'active';
  }
  function resize() {
    const width = mount.clientWidth, height = mount.clientHeight;
    mobile = width < 701;
    camera.aspect = width / Math.max(1, height);
    camera.fov = mobile ? 42 : 38;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(renderPixelRatio(width, height, devicePixelRatio));
    renderer.setSize(width, height, false); update(lastState);
    settled();
  }
  function settled() {
    mount.dataset.renderState = 'idle';
    mount.dataset.renderCount = String(renderer.info.render.frame);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(mount); resize();
  mount.dataset.renderer = 'webgl';
  mount.dataset.scene = 'extruded-logo';
  const contextLost = event => {
    event.preventDefault();
    queueMicrotask(() => { if (!disposed) onUnavailable?.(new Error('WebGL context lost.')); });
  };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  return {
    update,
    settled,
    dispose() {
      if (disposed) return;
      disposed = true; observer.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      geometries.forEach(geometry => geometry.dispose());
      [face, edge, lime, limeEdge].forEach(material => material.dispose());
      texture.dispose();
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
      for (const key of ['renderer', 'scene', 'progress', 'triangles', 'renderRate', 'renderMs', 'renderCount', 'renderState']) delete mount.dataset[key];
    },
  };
}
