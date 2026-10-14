import { motionLimited, smoothTo } from './motion.js';

// Desktop vertical scroll drives the rail. Touch/reduced-motion views use
// native horizontal overflow, retaining keyboard access to every project.
export function createProjectReel(section) {
  const viewport = section.querySelector('.project-reel-viewport');
  const track = section.querySelector('.project-reel-track');
  const cards = [...track.children];
  const previous = section.querySelector('[data-reel="previous"]');
  const next = section.querySelector('[data-reel="next"]');
  const counter = section.querySelector('.reel-counter');
  let distance = 0, pinned = false, frame = 0, disposed = false;

  function position() {
    if (!pinned) return viewport.scrollLeft;
    const travel = section.offsetHeight - section.querySelector('.project-reel-sticky').offsetHeight;
    return Math.max(0, Math.min(1, -section.getBoundingClientRect().top / Math.max(1, travel))) * distance;
  }
  function draw() {
    frame = 0;
    if (disposed) return;
    const x = position();
    track.style.transform = pinned ? `translate3d(${-x}px,0,0)` : '';
    const index = Math.max(0, Math.min(cards.length - 1, Math.floor((x + viewport.clientWidth / 2) / Math.max(1, cards[1].offsetLeft - cards[0].offsetLeft))));
    const label = `${String(index + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    if (counter.textContent !== label) counter.textContent = label;
    previous.disabled = x < 2;
    next.disabled = x >= distance - 2;
    section.style.setProperty('--reel-progress', String(distance ? x / distance : 0));
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
  function resize() {
    const wasPinned = pinned;
    pinned = innerWidth > 700 && !motionLimited();
    section.classList.toggle('reel-pinned', pinned);
    if (wasPinned !== pinned) viewport.scrollLeft = 0;
    distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
    section.style.setProperty('--reel-travel', `${distance}px`);
    schedule();
  }
  function go(direction) {
    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    const x = Math.max(0, Math.min(distance, position() + direction * step));
    if (pinned) smoothTo(section.getBoundingClientRect().top + scrollY + x);
    else viewport.scrollTo({ left: x, behavior: motionLimited() ? 'instant' : 'smooth' });
  }
  previous.onclick = () => go(-1);
  next.onclick = () => go(1);
  const onKey = event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault(); go(event.key === 'ArrowLeft' ? -1 : 1);
  };
  viewport.addEventListener('keydown', onKey);
  const onFocus = event => {
    if (!pinned) return;
    const card = event.target.closest('.project-card');
    if (!card) return;
    viewport.scrollLeft = 0;
    const x = Math.min(distance, card.offsetLeft - cards[0].offsetLeft);
    smoothTo(section.getBoundingClientRect().top + scrollY + x);
  };
  track.addEventListener('focusin', onFocus);
  window.addEventListener('scroll', schedule, { passive: true });
  viewport.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', resize);
  window.addEventListener('studio-motion-change', resize);
  const observer = new ResizeObserver(resize);
  observer.observe(viewport);
  resize();
  return () => {
    disposed = true; cancelAnimationFrame(frame); observer.disconnect();
    window.removeEventListener('scroll', schedule);
    viewport.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', resize);
    window.removeEventListener('studio-motion-change', resize);
    track.removeEventListener('focusin', onFocus);
    viewport.removeEventListener('keydown', onKey);
  };
}
