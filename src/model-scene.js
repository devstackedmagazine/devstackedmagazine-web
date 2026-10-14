import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Renders an actual GLB. Never substitutes procedural logo geometry for the asset.
export async function createModelScene(mount, url) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .05, 150);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  scene.environmentIntensity = .65;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xeaf1e0, 0x151b11, .8));
  const key = new THREE.DirectionalLight(0xfff8e6, 2);
  key.position.set(-3, 7, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xd7ff3f, .65);
  rim.position.set(4, 2, -3);
  scene.add(rim);

  let asset;
  try { asset = await new GLTFLoader().loadAsync(url); }
  catch (error) { environment.dispose(); renderer.dispose(); throw error; }
  const model = asset.scene;
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const span = Math.max(size.x, size.y, size.z);
  if (!Number.isFinite(span) || span <= 0) {
    environment.dispose(); renderer.dispose();
    throw new Error('Generated model has no usable geometry.');
  }
  const pivot = new THREE.Group();
  model.position.sub(center);
  pivot.add(model);
  pivot.scale.setScalar(6.5 / span);
  scene.add(pivot);
  mount.append(renderer.domElement);
  let mobile = false, disposed = false;
  let frameState = { progress: 0, x: 0, y: 0, paused: false };

  function resize() {
    const width = mount.clientWidth, height = mount.clientHeight;
    mobile = width < 701;
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    update(frameState);
  }
  function update(state) {
    if (disposed) return;
    frameState = state;
    const { progress, x, y, paused } = state;
    const approach = Math.min(1, progress / .7);
    const entrance = Math.max(0, (progress - .7) / .3);
    pivot.rotation.y = (paused ? 0 : x * .16) + Math.sin(progress * Math.PI) * .2;
    pivot.rotation.x = paused ? 0 : y * .035;
    const distance = mobile ? 15 : 12;
    camera.position.set(mobile ? 0 : -1.3 + approach * 1.3, mobile ? 1.3 : .7, distance - approach * 2.3 - entrance * 4);
    camera.lookAt(mobile ? 0 : -1.15 * (1 - approach), mobile ? -2.4 : 0, 0);
    mount.style.opacity = 1 - Math.max(0, (progress - .93) / .07);
    renderer.render(scene, camera);
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(mount);
  resize();
  let meshes = 0;
  model.traverse(object => { if (object.isMesh) meshes++; });
  mount.dataset.modelMeshes = String(meshes);
  mount.dataset.modelLoaded = 'true';

  function dispose() {
    if (disposed) return;
    disposed = true;
    resizeObserver.disconnect();
    const geometries = new Set(), materials = new Set(), textures = new Set();
    model.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        materials.add(material);
        for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      }
    });
    textures.forEach(texture => { texture.source?.data?.close?.(); texture.dispose(); });
    materials.forEach(material => material.dispose());
    geometries.forEach(geometry => geometry.dispose());
    environment.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    delete mount.dataset.modelMeshes;
    delete mount.dataset.modelLoaded;
  }
  return { update, dispose };
}
