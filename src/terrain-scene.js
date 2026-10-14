import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Reflector } from 'three/addons/objects/Reflector.js';

const smooth = (a, b, value) => {
  const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function beveledStone(width, height, depth, material) {
  const bevel = Math.min(.055, width * .08, height * .08);
  const chip = Math.min(width * .16, height * .06);
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2 + chip, -height / 2);
  shape.lineTo(width / 2, -height / 2 + chip * .5);
  shape.lineTo(width / 2, height / 2 - chip);
  shape.lineTo(width / 2 - chip, height / 2);
  shape.lineTo(-width / 2, height / 2 - chip * .5);
  shape.lineTo(-width / 2, -height / 2 + chip);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: bevel,
    bevelSize: bevel, bevelSegments: 3, steps: 1,
  });
  geometry.center();
  return new THREE.Mesh(geometry, material);
}

export async function createTerrainScene(mount, onUnavailable) {
  const loader = new THREE.TextureLoader();
  const loaded = await Promise.allSettled([
    loader.loadAsync('/assets/basalt-texture.png'),
    loader.loadAsync('/assets/stone-monument.png'),
  ]);
  if (loaded.some(result => result.status === 'rejected')) {
    loaded.forEach(result => { if (result.status === 'fulfilled') result.value.dispose(); });
    throw new Error('Stone scene textures could not load.');
  }
  const [stoneMap, artworkMap] = loaded.map(result => result.value);
  stoneMap.colorSpace = artworkMap.colorSpace = THREE.SRGBColorSpace;
  stoneMap.wrapS = stoneMap.wrapT = THREE.RepeatWrapping;
  stoneMap.repeat.set(.45, .45);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' }); }
  catch (error) { stoneMap.dispose(); artworkMap.dispose(); throw error; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stoneMap.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x101711, .015);
  const camera = new THREE.PerspectiveCamera(43, 1, .08, 100);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .03);
  scene.environment = environment.texture;
  scene.environmentIntensity = .4;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xe5eeeb, 0x10170b, .9));
  const key = new THREE.DirectionalLight(0xf2f5ec, 2.5);
  key.position.set(-4, 7, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb7d988, .9);
  rim.position.set(5, 3, -3);
  scene.add(rim);
  const glow = new THREE.PointLight(0xc8ff3e, 20, 14, 1.7);
  glow.position.set(.7, -.7, 2);
  scene.add(glow);

  const stone = new THREE.MeshPhysicalMaterial({
    color: 0x222925, map: stoneMap, bumpMap: stoneMap, bumpScale: .09,
    roughness: .74, metalness: .1, clearcoat: .18, clearcoatRoughness: .35,
  });
  const lime = new THREE.MeshBasicMaterial({ color: 0xd7ff3f, toneMapped: false });
  const gateway = new THREE.Group();
  gateway.position.x = .7;
  scene.add(gateway);
  const slabs = [];
  for (const side of [-1, 1]) {
    for (let row = 0; row < 3; row++) {
      const group = new THREE.Group();
      const height = [1.25, .95, 1.15][row];
      const block = beveledStone(.42 + row * .04, height, .7, stone);
      group.add(block);
      const seam = new THREE.Mesh(new THREE.BoxGeometry(.022, height * .91, .025), lime);
      seam.position.set(-side * .17, 0, .385);
      group.add(seam);
      group.position.set(side * (3.05 + row * .08), -1.02 + row * 1.4, .65 + row * .18);
      group.rotation.y = side * -.12;
      group.userData = { side, row, x: group.position.x, y: group.position.y, z: group.position.z };
      gateway.add(group);
      slabs.push(group);
    }
  }
  for (let i = 0; i < 3; i++) {
    const slab = new THREE.Group();
    slab.add(beveledStone(1.7, .23, .75, stone));
    const seam = new THREE.Mesh(new THREE.BoxGeometry(1.58, .012, .025), lime);
    seam.position.set(0, -.117, .413);
    slab.add(seam);
    slab.position.set((i - 1) * 2.17, 4.15 + Math.abs(i - 1) * .1, .45);
    slab.userData = { side: i - 1, row: 3, x: slab.position.x, y: slab.position.y, z: slab.position.z };
    gateway.add(slab);
    slabs.push(slab);
  }

  const floor = new THREE.Group();
  floor.position.x = .7;
  scene.add(floor);
  for (let i = 0; i < 5; i++) {
    const slab = beveledStone(9.5 - i * 1.1, .18, 4.9 - i * .58, stone);
    slab.position.set(0, -2.08 + i * .21, -.15);
    floor.add(slab);
    const seam = new THREE.Mesh(new THREE.BoxGeometry(9.3 - i * 1.1, .014, .025), lime);
    seam.position.set(0, -1.985 + i * .21, 2.36 - i * .29);
    floor.add(seam);
  }

  // The logo is the supplied reference art on a plane within real 3D geometry.
  // It is not a rebuilt/extruded logo mesh.
  const artMaterial = new THREE.ShaderMaterial({
    uniforms: { uMap: { value: artworkMap }, uOpacity: { value: 1 } },
    transparent: true, depthWrite: false, toneMapped: false,
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform sampler2D uMap;uniform float uOpacity;varying vec2 vUv;
      void main(){
        vec2 imageUv=vec2(.37+vUv.x*.30,.16+vUv.y*.70);
        vec4 color=texture2D(uMap,imageUv);
        float edge=smoothstep(0.,.08,vUv.x)*smoothstep(0.,.08,1.-vUv.x)*smoothstep(0.,.065,vUv.y)*smoothstep(0.,.065,1.-vUv.y);
        gl_FragColor=vec4(color.rgb,edge*uOpacity);
        #include <colorspace_fragment>
      }`,
  });
  const artwork = new THREE.Mesh(new THREE.PlaneGeometry(5.85, 5.2), artMaterial);
  artwork.position.set(.7, 1.3, -.12);
  scene.add(artwork);

  const chips = [];
  const chipGeometry = new THREE.BoxGeometry(.17, .24, .13);
  for (let i = 0; i < 12; i++) {
    const chip = new THREE.Mesh(chipGeometry, stone);
    const side = i % 2 ? 1 : -1;
    chip.position.set(.7 + side * (3.55 + (i % 3) * .29), -.5 + (i % 6) * .69, 1.1 + (i % 4) * .6);
    chip.rotation.set(i * .2, i * .4, i * .1);
    chip.userData = { x: chip.position.x, y: chip.position.y, phase: i * .83 };
    chips.push(chip);
    scene.add(chip);
  }

  const waterShader = {
    uniforms: THREE.UniformsUtils.clone(Reflector.ReflectorShader.uniforms),
    vertexShader: Reflector.ReflectorShader.vertexShader,
    fragmentShader: Reflector.ReflectorShader.fragmentShader
      .replace('uniform vec3 color;', 'uniform vec3 color; uniform float uTime;')
      .replace('vec4 base = texture2DProj( tDiffuse, vUv );', 'vec4 displaced=vUv; displaced.x+=sin(vUv.y/max(vUv.w,.001)*85.+uTime*.6)*.0025*vUv.w; vec4 base=texture2DProj(tDiffuse,displaced);')
      .replace('blendOverlay( base.rgb, color ), 1.0', 'blendOverlay( base.rgb, color ), .55'),
  };
  waterShader.uniforms.uTime = { value: 0 };
  const reflectionSize = innerWidth < 701 ? 256 : 512;
  const water = new Reflector(new THREE.PlaneGeometry(22, 18), {
    color: 0x50584a, clipBias: .003, textureWidth: reflectionSize,
    textureHeight: reflectionSize, multisample: 0, shader: waterShader,
  });
  water.rotation.x = -Math.PI / 2;
  water.position.set(.7, -2.22, 4.2);
  water.material.transparent = true;
  water.material.depthWrite = false;
  scene.add(water);
  mount.append(renderer.domElement);
  let disposed = false, mobile = false;
  let lastState = { progress: 0, x: 0, y: 0, paused: false, time: 0 };
  const lookAt = new THREE.Vector3();

  function update(state) {
    if (disposed) return;
    lastState = state;
    const { progress, x, y, paused, time = 0 } = state;
    const awaken = smooth(.1, .58, progress);
    const enter = smooth(.58, .98, progress);
    const seconds = paused ? 0 : time * .001;
    slabs.forEach(slab => {
      const { side, row, x: baseX, y: baseY, z: baseZ } = slab.userData;
      slab.position.x = baseX + side * awaken * .55 + side * enter * 2.25;
      slab.position.y = baseY + awaken * (row === 3 ? .85 : .5 + row * .3) + (paused ? 0 : Math.sin(seconds * .45 + row) * .016);
      slab.position.z = baseZ + awaken * Math.sin(row * 1.7) * .32;
      slab.rotation.y = side * (-.3 + awaken * .7 + enter * .6);
      slab.rotation.x = row * -.035 + awaken * .08;
      slab.rotation.z = side * (.015 + awaken * .06 + enter * .13) * (row === 3 ? -1 : 1);
    });
    chips.forEach(chip => {
      chip.position.x = chip.userData.x + Math.sin(seconds * .3 + chip.userData.phase) * .07 * awaken;
      chip.position.y = chip.userData.y + awaken * .5 + Math.sin(seconds * .42 + chip.userData.phase) * .12 * awaken;
      chip.rotation.y += paused ? 0 : .0007;
    });
    gateway.rotation.y = paused ? 0 : x * .1;
    floor.rotation.y = paused ? 0 : x * .025;
    artMaterial.uniforms.uOpacity.value = 1 - smooth(.54, .76, progress);
    artwork.rotation.y = paused ? 0 : x * .065;
    water.material.uniforms.uTime.value = seconds;
    glow.intensity = 20 + awaken * 18;
    const baseZ = mobile ? 16.8 : 12.8;
    camera.position.set((mobile ? .7 : -1.0) * (1 - enter) + .7 * enter + (paused ? 0 : x * 1.0), (mobile ? 3.3 : 2.5) - enter * 1.6 + (paused ? 0 : y * .25), baseZ - awaken * 1.1 - enter * (baseZ - 2.3));
    lookAt.set(mobile ? .7 : -.7 + enter * 1.4, mobile ? -1.5 + enter * 2.1 : .4 + enter * .2, -enter * 3);
    camera.lookAt(lookAt);
    mount.style.opacity = 1 - smooth(.94, 1, progress);
    renderer.render(scene, camera);
    mount.dataset.progress = progress.toFixed(3);
    mount.dataset.triangles = String(renderer.info.render.triangles);
  }

  function resize() {
    const width = mount.clientWidth, height = mount.clientHeight;
    mobile = width < 701;
    camera.aspect = width / Math.max(1, height);
    camera.fov = mobile ? 47 : 43;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    update(lastState);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(mount);
  resize();
  mount.dataset.renderer = 'webgl';
  mount.dataset.scene = 'stone-gateway';
  const contextLost = event => {
    event.preventDefault();
    queueMicrotask(() => { if (!disposed) onUnavailable?.(new Error('WebGL context lost.')); });
  };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  function dispose() {
    if (disposed) return;
    disposed = true;
    observer.disconnect();
    renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    const geometries = new Set(), materials = new Set();
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
    });
    materials.delete(water.material);
    water.dispose();
    materials.forEach(material => material.dispose());
    geometries.forEach(geometry => geometry.dispose());
    stoneMap.dispose(); artworkMap.dispose(); environment.dispose();
    renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    for (const key of ['renderer', 'scene', 'progress', 'triangles']) delete mount.dataset[key];
  }
  return { update, dispose };
}
