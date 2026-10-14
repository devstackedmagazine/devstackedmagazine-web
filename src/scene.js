import * as THREE from 'three';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (a, b, value) => { const t = clamp((value - a) / (b - a)); return t * t * (3 - 2 * t); };
let prefersStaticView = false;

function stoneTexture(pale = false) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const data = ctx.createImageData(512, 512);
  let seed = 19;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) {
    const grain = random();
    const cloud = Math.sin(x * .035 + Math.sin(y * .025) * 2) * Math.cos(y * .017 + x * .008);
    const speckle = grain > .96 ? -65 : grain < .015 ? 24 : 0;
    const base = pale ? 194 : 61;
    const value = clamp(base + cloud * (pale ? 5 : 22) + (grain - .5) * (pale ? 72 : 48) + speckle, 0, 255);
    const offset = (y * 512 + x) * 4;
    data.data[offset] = value;
    data.data[offset + 1] = value + (pale ? -2 : 3);
    data.data[offset + 2] = value + (pale ? -8 : -3);
    data.data[offset + 3] = 255;
  }
  ctx.putImageData(data, 0, 0);
  for (let i = 0; i < 25; i++) {
    let x = random() * 512, y = random() * 512;
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let j = 0; j < 6; j++) { x += (random() - .5) * 35; y += random() * 20; ctx.lineTo(x, y); }
    ctx.strokeStyle = pale ? 'rgba(56,58,47,.14)' : 'rgba(6,13,7,.5)';
    ctx.lineWidth = random() * 1.5;
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function logoShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-1.6, -2.05);
  shape.lineTo(-1.6, 2.05);
  shape.lineTo(-.05, 2.05);
  shape.bezierCurveTo(1.65, 2.05, 1.85, 1.05, 1.85, 0);
  shape.bezierCurveTo(1.85, -1.05, 1.6, -2.05, -.05, -2.05);
  shape.lineTo(-1.6, -2.05);
  const hole = new THREE.Path();
  hole.moveTo(-.95, -1.45);
  hole.lineTo(.03, -1.45);
  hole.bezierCurveTo(.98, -1.45, 1.15, -.65, 1.15, 0);
  hole.bezierCurveTo(1.15, .7, .98, 1.45, .03, 1.45);
  hole.lineTo(-.95, 1.45);
  hole.lineTo(-.95, -1.45);
  shape.holes.push(hole);
  return shape;
}

function diagonalShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-1.62, 1.03);
  shape.lineTo(1.8, -.62);
  shape.lineTo(1.76, -1.08);
  shape.lineTo(-1.62, .58);
  shape.closePath();
  return shape;
}

export function createScene(mount, journey, reducedMotion = false) {
  if (!mount || !journey) return () => {};
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x172013, .022);
  const camera = new THREE.PerspectiveCamera(43, 1, .08, 90);
  const textures = [stoneTexture(), stoneTexture(true)];
  const basalt = new THREE.MeshStandardMaterial({ map: textures[0], bumpMap: textures[0], bumpScale: .14, color: 0x4d5345, roughness: .9, metalness: .13 });
  const pale = new THREE.MeshStandardMaterial({ map: textures[1], bumpMap: textures[1], bumpScale: .075, color: 0xfff9e8, roughness: .83, metalness: .04 });
  const paleSide = new THREE.MeshStandardMaterial({ map: textures[0], bumpMap: textures[0], bumpScale: .11, color: 0x647052, roughness: .82 });
  const lime = new THREE.MeshBasicMaterial({ color: 0xd7ff3f, toneMapped: false });
  const restingLime = new THREE.Color(0xb7db32);
  const awakenedLime = new THREE.Color(0xd7ff3f);
  const darkSide = basalt.clone();
  darkSide.color.setHex(0x202c17);

  scene.add(new THREE.HemisphereLight(0xedf3df, 0x182614, 2.1));
  const key = new THREE.DirectionalLight(0xfff6de, 3.7);
  key.position.set(-4, 8, 7); scene.add(key);
  const rim = new THREE.DirectionalLight(0xc4e095, 1.3);
  rim.position.set(5, 4, -4); scene.add(rim);
  const limeLight = new THREE.PointLight(0xc5ff35, 25, 12, 1.5);
  limeLight.position.set(0, 1, 2); scene.add(limeLight);

  const monument = new THREE.Group();
  monument.position.set(.5, 2.72, 0);
  monument.rotation.y = -.23;
  const logoGeometry = new THREE.ExtrudeGeometry(logoShape(), { depth: .72, bevelEnabled: true, bevelThickness: .045, bevelSize: .045, bevelSegments: 2, curveSegments: 24 });
  const logo = new THREE.Mesh(logoGeometry, [pale, paleSide]);
  monument.add(logo);
  const innerLogo = new THREE.Mesh(logoGeometry, lime);
  innerLogo.scale.set(1.006, 1.006, .6);
  innerLogo.position.z = -.18;
  monument.add(innerLogo);
  const stripeGeometry = new THREE.ExtrudeGeometry(diagonalShape(), { depth: .34, bevelEnabled: true, bevelThickness: .02, bevelSize: .02, bevelSegments: 1 });
  const stripe = new THREE.Mesh(stripeGeometry, [pale, darkSide]);
  stripe.position.z = .54;
  monument.add(stripe);
  const stripeLight = new THREE.Mesh(stripeGeometry, lime);
  stripeLight.position.set(0, .43, .3);
  monument.add(stripeLight);
  scene.add(monument);

  const terrain = new THREE.Group();
  scene.add(terrain);
  for (let i = 0; i < 3; i++) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(6.6 - i * 1.35, .21, 3.4 - i * .65), basalt);
    mesh.position.set(.5, .12 + i * .21, .15);
    terrain.add(mesh);
    const seam = new THREE.Mesh(new THREE.BoxGeometry(6.4 - i * 1.35, .025, .03), lime);
    seam.position.set(.5, .22 + i * .21, 1.84 - i * .325);
    terrain.add(seam);
  }

  const slabs = [];
  const slabSpecs = [[-3.4, 1.4, -1.1, .75, 2.8, .95], [3.05, 2.05, -.85, .62, 4.1, .8], [4.1, 1.25, .65, .75, 2.5, .6], [-4.45, .75, 1.2, .85, 1.5, .6]];
  slabSpecs.forEach(([x, y, z, w, h, d], index) => {
    const slab = new THREE.Group();
    const block = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), basalt);
    slab.add(block);
    const fissure = new THREE.Mesh(new THREE.BoxGeometry(.025, h * .93, .045), lime);
    fissure.position.set(w / 2 - .08, .01, d / 2 + .015);
    slab.add(fissure);
    slab.position.set(x, y - .5, z);
    slab.rotation.y = index % 2 ? -.25 : .2;
    slab.userData = { startY: y - .5, index };
    slabs.push(slab);
    terrain.add(slab);
  });

  let seed = 72;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 26; i++) {
    const geometry = new THREE.IcosahedronGeometry(.55 + random() * .5, 1);
    const positions = geometry.attributes.position;
    for (let j = 0; j < positions.count; j++) {
      const factor = .78 + random() * .38;
      positions.setXYZ(j, positions.getX(j) * factor, positions.getY(j) * factor, positions.getZ(j) * factor);
    }
    geometry.computeVertexNormals();
    const rock = new THREE.Mesh(geometry, basalt);
    const side = i % 2 ? 1 : -1;
    rock.position.set(side * (4.9 + random() * 4), -.12, -1.5 + random() * 8);
    rock.scale.set(1.2 + random(), .4 + random() * .9, 1 + random());
    rock.rotation.set(random(), random(), random() * .3);
    terrain.add(rock);
  }

  const waterUniforms = { uTime: { value: 0 }, uEnergy: { value: .2 } };
  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: waterUniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying vec2 vUv; uniform float uTime; uniform float uEnergy;
      void main(){
        float ripple=sin(vUv.y*210.+sin(vUv.x*40.+uTime*.3)*2.+uTime*.7)*.5+.5;
        float fine=sin(vUv.y*430.-uTime*.5)*.5+.5;
        float beam=exp(-pow((vUv.x-.52)*7.,2.));
        float fade=smoothstep(.0,.25,vUv.y)*(1.-smoothstep(.68,1.,vUv.y));
        float reflection=beam*ripple*fine*fade*(.18+uEnergy*.32);
        vec3 base=vec3(.028,.042,.025);
        vec3 color=base+vec3(.65,.89,.15)*reflection;
        gl_FragColor=vec4(color,fade*.52);
      }`
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(21, 16), waterMaterial);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, -.12, 5);
  scene.add(water);

  const atmosphere = new THREE.Mesh(new THREE.PlaneGeometry(16, 2.6), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uTime: waterUniforms.uTime },
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec2 vUv;uniform float uTime;void main(){float mist=sin(vUv.x*17.+uTime*.035+sin(vUv.y*9.))*sin(vUv.y*13.-uTime*.025);float edge=sin(vUv.y*3.14159);gl_FragColor=vec4(.48,.54,.39,max(0.,mist)*edge*.1);}`,
  }));
  atmosphere.position.set(0, .6, 3); scene.add(atmosphere);

  const copy = journey.querySelector('.hero-copy');
  const aside = journey.querySelector('.hero-aside');
  const journeyCopy = journey.querySelector('.journey-copy');
  const portalCopy = journey.querySelector('.portal-copy');
  const landscape = journey.querySelector('.hero-landscape');
  const toggle = journey.querySelector('.motion-toggle');
  const stageIndicators = [...journey.querySelectorAll('[data-stage]')];
  let mobile = false;
  let paused = reducedMotion || prefersStaticView;
  let visible = true;
  let disposed = false;
  let progress = 0;
  let targetProgress = 0;
  let pointerX = 0, pointerY = 0;
  let frame = 0;
  let lastTime = 0;
  const lookTarget = new THREE.Vector3();

  function resize() {
    const width = mount.clientWidth, height = mount.clientHeight;
    mobile = width < 701;
    camera.aspect = width / Math.max(height, 1);
    camera.fov = mobile ? 48 : 43;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    updateScroll();
    draw(lastTime);
  }

  function updateScroll() {
    const rect = journey.getBoundingClientRect();
    targetProgress = paused ? 0 : clamp(-rect.top / Math.max(1, journey.offsetHeight - mount.clientHeight));
  }

  function setPaused(value) {
    const originalTop = journey.getBoundingClientRect().top + scrollY;
    paused = value;
    prefersStaticView = reducedMotion ? prefersStaticView : value;
    journey.classList.toggle('motion-paused', paused);
    document.body.classList.toggle('motion-limited', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.querySelector('.motion-label').textContent = reducedMotion ? 'Reduced motion' : paused ? 'Enable motion' : 'Reduce motion';
    toggle.querySelector('.motion-icon').textContent = paused ? '▷' : 'Ⅱ';
    if (reducedMotion) toggle.disabled = true;
    if (paused && scrollY > originalTop) scrollTo({ top: originalTop, behavior: 'instant' });
    progress = targetProgress = 0;
    updateScroll();
    draw(lastTime);
  }

  function draw(time) {
    const t = paused ? 0 : time * .001;
    waterUniforms.uTime.value = t;
    const awaken = smooth(.18, .57, progress);
    const enter = smooth(.58, .97, progress);
    lime.color.copy(restingLime).lerp(awakenedLime, awaken);
    limeLight.intensity = 16 + awaken * 36;
    waterUniforms.uEnergy.value = .25 + awaken * .75;
    slabs.forEach(slab => {
      slab.position.y = slab.userData.startY + awaken * (slab.userData.index < 2 ? .65 : 1.15);
      slab.position.x = slabSpecs[slab.userData.index][0] + (slab.userData.index % 2 ? 1 : -1) * enter * 1.8;
    });
    const orbit = Math.sin(progress * Math.PI) * .7;
    const baseZ = mobile ? 16.5 : 13;
    camera.position.set((mobile ? 0 : -1.3) * (1 - enter) + enter * .5 + orbit + pointerX * (paused ? 0 : .14), (mobile ? 3.6 : 3.3) + pointerY * (paused ? 0 : .08) - enter * (mobile ? 1.8 : 1.5), baseZ - progress * 1.8 - enter * (baseZ - 1.2));
    lookTarget.set(mobile ? .5 : -.6 + enter * 1.1, mobile ? -.3 + enter * 2.1 : 2.65 - enter * .85, -.45 - enter * 3);
    camera.lookAt(lookTarget);
    const openingOpacity = 1 - smooth(.04, .25, progress);
    copy.style.opacity = openingOpacity;
    copy.style.transform = `translateY(${-progress * 70}px)`;
    copy.inert = openingOpacity < .15;
    if (aside) { aside.style.opacity = openingOpacity; aside.style.transform = `translateY(${-progress * 45}px)`; }
    journeyCopy.style.opacity = smooth(.2, .34, progress) * (1 - smooth(.55, .72, progress));
    journeyCopy.style.transform = `translateY(${(1 - awaken) * 20}px)`;
    portalCopy.style.opacity = smooth(.73, .87, progress) * (1 - smooth(.94, 1, progress));
    landscape.style.transform = `scale(${1.02 + progress * .11}) translateY(${progress * -1.3}%)`;
    landscape.style.opacity = 1 - smooth(.66, 1, progress) * .92;
    mount.style.opacity = 1 - smooth(.9, 1, progress);
    const current = progress < .25 ? 0 : progress < .67 ? 1 : 2;
    stageIndicators.forEach(indicator => indicator.classList.toggle('active', Number(indicator.dataset.stage) === current));
    renderer.render(scene, camera);
  }

  function tick(time) {
    if (disposed) return;
    frame = requestAnimationFrame(tick);
    if (!visible || document.hidden || paused) return;
    // Limit rendering to ~40fps and interpolate camera position in elapsed time.
    if (time - lastTime < 24) return;
    const dt = Math.min(time - lastTime, 80);
    progress += (targetProgress - progress) * (1 - Math.exp(-dt / 105));
    lastTime = time;
    draw(time);
  }

  function pointer(event) {
    pointerX = event.clientX / innerWidth - .5;
    pointerY = event.clientY / innerHeight - .5;
  }
  function contextLost(event) {
    event.preventDefault();
    journey.classList.add('scene-fallback');
    setPaused(true);
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(mount);
  const visibilityObserver = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { threshold: 0 });
  visibilityObserver.observe(journey);
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('pointermove', pointer, { passive: true });
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  const onToggle = () => setPaused(!paused);
  toggle.addEventListener('click', onToggle);
  setPaused(paused);
  resize();
  frame = requestAnimationFrame(tick);

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    window.removeEventListener('scroll', updateScroll);
    window.removeEventListener('pointermove', pointer);
    toggle.removeEventListener('click', onToggle);
    renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    const geometries = new Set(), materials = new Set();
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
    });
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
    textures.forEach(texture => texture.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}
