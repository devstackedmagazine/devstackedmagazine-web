import { smoothTo, setMotionLimited } from './motion.js';

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = (start, end, value) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};
let prefersStaticView = false;

export function createScene(mount, journey, reducedMotion = false) {
  const landscape = journey.querySelector('.hero-landscape');
  const copy = journey.querySelector('.hero-copy');
  const aside = journey.querySelector('.hero-aside');
  const coreCopy = journey.querySelector('.journey-copy');
  const buildCopy = journey.querySelector('.build-copy');
  const portal = journey.querySelector('.portal-copy');
  const toggle = journey.querySelector('.motion-toggle');
  const indicators = [...journey.querySelectorAll('[data-stage]')];
  const atmosphere = document.createElement('div');
  atmosphere.className = 'landscape-atmosphere';
  mount.append(atmosphere);
  let paused = reducedMotion || prefersStaticView;
  let progress = 0, target = 0, pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  let frame = 0, lastTime = 0, disposed = false, visible = true, model = null, stage = -1;

  function draw() {
    const opening = 1 - smooth(.06, .2, progress);
    landscape.style.transform = 'translate3d(0,' + (-progress * 12) + 'px,0) scale(' + (1.015 + progress * .04) + ')';
    landscape.style.opacity = 1 - smooth(.93, 1, progress);
    copy.style.opacity = opening;
    copy.style.transform = 'translateY(' + (-progress * 35) + 'px)';
    copy.inert = opening < .15;
    if (aside) aside.style.opacity = opening;
    coreCopy.style.opacity = smooth(.14, .23, progress) * (1 - smooth(.33, .4, progress));
    buildCopy.style.opacity = smooth(.4, .47, progress) * (1 - smooth(.67, .74, progress));
    portal.style.opacity = smooth(.73, .81, progress) * (1 - smooth(.96, 1, progress));
    atmosphere.style.opacity = .08 + smooth(.04, .3, progress) * (1 - smooth(.36, .7, progress)) * .05;
    const nextStage = progress < .38 ? 0 : progress < .72 ? 1 : 2;
    if (nextStage !== stage) {
      stage = nextStage;
      indicators.forEach(item => item.classList.toggle('active', Number(item.dataset.stage) === stage));
    }
    model?.update({ progress, x: pointerX, y: pointerY, paused });
  }

  function requestDraw() {
    if (disposed || frame || paused || document.hidden || !visible) return;
    lastTime = performance.now();
    frame = requestAnimationFrame(tick);
  }
  function tick(time) {
    frame = 0;
    if (disposed || paused || document.hidden || !visible) { model?.settled(); return; }
    const easing = 1 - Math.exp(-Math.min(Math.max(time - lastTime, 1), 64) / 65);
    lastTime = time;
    // Lenis already smooths the scroll: use its actual position immediately.
    progress = target;
    pointerX += (targetX - pointerX) * easing;
    pointerY += (targetY - pointerY) * easing;
    draw();
    if (Math.abs(targetX - pointerX) + Math.abs(targetY - pointerY) > .0002) frame = requestAnimationFrame(tick);
    else model?.settled();
  }
  function updateScroll() {
    const next = paused ? 0 : clamp(-journey.getBoundingClientRect().top / Math.max(1, journey.offsetHeight - mount.clientHeight));
    if (Math.abs(next - target) > .00001) { target = next; requestDraw(); }
  }
  function setPaused(value, returnToTop = false) {
    const top = journey.getBoundingClientRect().top + scrollY;
    paused = value;
    if (!reducedMotion) prefersStaticView = value;
    journey.classList.toggle('motion-paused', value);
    setMotionLimited(value && !reducedMotion);
    toggle.setAttribute('aria-pressed', String(value));
    toggle.querySelector('.motion-label').textContent = reducedMotion ? 'Reduced motion' : value ? 'Enable motion' : 'Reduce motion';
    toggle.querySelector('.motion-icon').textContent = value ? '▷' : 'Ⅱ';
    toggle.disabled = reducedMotion;
    cancelAnimationFrame(frame); frame = 0;
    if (value && scrollY > top) smoothTo(top, { immediate: true });
    progress = target = 0; pointerX = pointerY = targetX = targetY = 0;
    updateScroll(); draw(); model?.settled();
    if (returnToTop) requestAnimationFrame(() => {
      if (disposed) return;
      smoothTo(top, { immediate: true }); progress = target = 0; draw(); model?.settled();
    });
  }
  function showStaticScene(error) {
    if (disposed) return;
    console.warn('WebGL landscape unavailable; reference artwork remains visible.', error.message);
    model?.dispose(); model = null;
    landscape.style.backgroundImage = "url('/assets/stone-monument.png')";
    mount.style.opacity = '1';
    journey.classList.remove('logo-scene-active'); journey.classList.add('scene-fallback');
    setPaused(true); toggle.disabled = true;
    toggle.querySelector('.motion-label').textContent = 'Static view';
  }
  import('./logo-scene.js').then(module => module.createLogoScene(mount, showStaticScene)).then(scene => {
    if (disposed) { scene.dispose(); return; }
    model = scene;
    journey.classList.add('logo-scene-active');
    landscape.style.backgroundImage = "url('/assets/volcanic-valley.png')";
    progress = target; draw(); model.settled();
  }).catch(showStaticScene);

  const pointer = event => {
    if (event.pointerType === 'touch' || paused || !visible) return;
    targetX = event.clientX / innerWidth - .5;
    targetY = event.clientY / innerHeight - .5;
    requestDraw();
  };
  const onToggle = () => setPaused(!paused, true);
  const onResize = () => { updateScroll(); if (paused) { draw(); model?.settled(); } else requestDraw(); };
  const onVisibility = () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; model?.settled(); }
    else requestDraw();
  };
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) { updateScroll(); requestDraw(); }
    else { cancelAnimationFrame(frame); frame = 0; model?.settled(); }
  });
  observer.observe(journey);
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('pointermove', pointer, { passive: true });
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);
  toggle.addEventListener('click', onToggle);
  setPaused(paused);
  return () => {
    disposed = true; cancelAnimationFrame(frame); observer.disconnect();
    window.removeEventListener('scroll', updateScroll);
    window.removeEventListener('pointermove', pointer);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    toggle.removeEventListener('click', onToggle);
    model?.dispose(); atmosphere.remove();
  };
}
