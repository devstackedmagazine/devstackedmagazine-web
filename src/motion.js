import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const preference = matchMedia('(prefers-reduced-motion: reduce)');
let scroller = null;
let manual = false;
let locked = false;
export const motionLimited = () => preference.matches || manual;

function configure() {
  scroller?.destroy();
  scroller = motionLimited() ? null : new Lenis({
    autoRaf: true, lerp: .085, smoothWheel: true, syncTouch: true,
    syncTouchLerp: .085, anchors: true, autoToggle: true,
    stopInertiaOnNavigate: true,
  });
  document.body.classList.toggle('motion-limited', motionLimited());
  if (locked) scroller?.stop();
}

export function setScrollLocked(value) {
  locked = value;
  if (value) scroller?.stop();
  else scroller?.start();
}

export function setMotionLimited(value) {
  if (manual === value) return;
  manual = value;
  configure();
  window.dispatchEvent(new Event('studio-motion-change'));
}

export function smoothTo(target, { immediate = false, offset = 0 } = {}) {
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + scrollY;
  if (scroller) {
    scroller.resize();
    scroller.scrollTo(top, { immediate, offset, force: true });
  } else {
    window.scrollTo({ top: top + offset, behavior: 'instant' });
  }
}

export function animateAction(element, keyframes, options = {}) {
  if (motionLimited()) return null;
  return element.animate(keyframes, { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)', ...options });
}

preference.addEventListener('change', configure);
configure();
