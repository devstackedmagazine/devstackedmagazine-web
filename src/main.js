import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/inter/latin-800.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import './style.css';
import { projects, serviceGroups, offers, resolveRoute, buildBrief } from './content.js';

const main = document.querySelector('#main');
const header = document.querySelector('#header');
const footer = document.querySelector('#footer');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let disposeScene = null;
let disconnectReveals = null;
let pageVersion = 0;
let briefText = '';
let contactDraft = null;

const arrow = (direction = 'right') => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="arrow ${direction}"><path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" stroke-width="1.5"/></svg>`;
const mark = `<svg class="brand-mark" viewBox="0 0 48 52" fill="none" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M5 2h18c16 0 23 9 23 24s-7 24-23 24H5V2zm10 9v30h8c9 0 13-5 13-15s-4-15-13-15h-8z"/><path d="M5 15 42 36l-5 9L5 26z" fill="var(--lime)"/></svg>`;
const button = (text, href, variant = '') => `<a class="button ${variant}" href="${href}" data-link>${text}${arrow()}</a>`;
const textLink = (text, href) => `<a class="text-link" href="${href}" data-link>${text}${arrow()}</a>`;

function renderChrome(page) {
  const nav = [['/work', 'Client work'], ['/products', 'Products'], ['/services', 'Services'], ['/pricing', 'Pricing'], ['/studio', 'Studio']];
  header.innerHTML = `<div class="header-inner"><a href="/" data-link class="brand" aria-label="devstackedmagazine home">${mark}<span>devstackedmagazine</span></a><nav class="desktop-nav" aria-label="Main navigation">${nav.map(([url, label]) => `<a href="${url}" data-link ${page === url || (url === '/work' && page === '/project') ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav><div class="header-actions"><a href="/contact" data-link class="contact-link" ${page === '/contact' ? 'aria-current="page"' : ''}>Let’s talk ${arrow()}</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open navigation"><span></span><span></span></button></div></div><nav id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation" hidden>${[...nav, ['/contact', 'Let’s talk']].map(([url, label]) => `<a href="${url}" data-link>${label}${arrow()}</a>`).join('')}</nav>`;
  footer.innerHTML = `<div class="footer-top"><a class="brand" href="/" data-link>${mark}<span>devstackedmagazine</span></a><p>Independent minds.<br>Shared ambition.</p><div class="footer-links">${textLink('Client work', '/work')}${textLink('Our products', '/products')}${textLink('Start a conversation', '/contact')}</div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} devstackedmagazine</span><span>Websites · Software · Design · AI</span><button class="back-top" type="button">Back to top ${arrow('up')}</button></div>`;
}

function mockup(project, compact = false) {
  if (project.className === 'form-field') return `<div class="mockup form-field ${compact ? 'compact' : ''}" aria-label="Illustrative architecture website"><div class="mini-browser"><i></i><i></i><i></i><span>formandfield.studio</span></div><div class="ff-nav"><b>Form & Field<span>Architecture & interiors</span></b><span>Selected work &nbsp; Studio &nbsp; Contact</span></div><div class="ff-body"><span class="ff-kicker">Spaces for living.</span><h3>Quiet forms.<br>Lasting impressions.</h3><div class="architecture"><div class="arch-wall"></div><div class="arch-window"></div><div class="arch-bench"></div><div class="arch-sun"></div></div><span class="ff-foot">Thoughtful spaces, inside and out. <span>View our projects ↗</span></span></div></div>`;
  if (project.className === 'signal') return `<div class="mockup signal ${compact ? 'compact' : ''}" aria-label="Illustrative SaaS workspace"><div class="mini-browser"><i></i><i></i><i></i><span>Signal / Workspace concept</span></div><div class="signal-app"><aside><b><span class="signal-symbol">◈</span> signal</b><span class="mini-active">Overview</span><span>Projects</span><span>Inbox <i>3</i></span><span>Team</span><span class="mini-bottom">Settings</span></aside><div class="signal-main"><div class="signal-top">Workspace <span>JD</span></div><p class="mini-muted">Wednesday, October 14</p><h3>A little more focus.</h3><div class="mini-stats"><div><small>In progress</small><b>12</b><span>Across 4 projects</span></div><div><small>Completed</small><b>28</b><span>This month</span></div></div><div class="task-heading">Your projects <span>View all ↗</span></div><div class="mini-task"><i class="dot purple"></i><div>Website launch<small>Design · In progress</small></div><span class="mini-progress"></span></div><div class="mini-task"><i class="dot teal"></i><div>Brand direction<small>Creative · In review</small></div><span class="mini-progress second"></span></div><div class="mini-task"><i class="dot orange"></i><div>Product roadmap<small>Planning · In progress</small></div><span class="mini-progress third"></span></div></div></div></div>`;
  if (project.className === 'afterhours') return `<div class="mockup afterhours ${compact ? 'compact' : ''}" aria-label="Illustrative motion identity"><span class="afterhours-label">An identity in motion</span><div class="afterhours-orbit"><i></i><i></i><i></i></div><h3>AFTER<br>HOURS<span>®</span></h3><div class="afterhours-footer"><span>Culture after the ordinary.</span><span>Design / Motion</span></div></div>`;
  return `<div class="mockup relay ${compact ? 'compact' : ''}" aria-label="Illustrative AI call workspace"><div class="mini-browser"><i></i><i></i><i></i><span>Relay / Calling workflow concept</span></div><div class="relay-body"><div class="relay-heading"><b>relay<span>●</span></b><span>Call workspace</span></div><div class="relay-columns"><div><p class="mini-muted">Conversation overview</p><h3>Every call.<br>A clearer next step.</h3><div class="waveform">${Array.from({ length: 33 }, (_, i) => `<i style="--height:${12 + Math.sin(i * .8) ** 2 * 55}px;--delay:${i * .06}s"></i>`).join('')}</div><span class="relay-state"><i></i>Workflow preview</span></div><div class="relay-summary"><span>Conversation summary</span><p>Project requirements</p><div></div><div></div><div></div><span class="relay-tag">Ready for human review</span></div></div></div></div>`;
}

function projectCard(project, index = 0) {
  return `<a href="/work/${project.slug}" data-link class="project-card ${index % 2 ? 'offset' : ''}" data-category="${project.category}"><div class="project-visual">${mockup(project)}<span class="view-project">View concept ${arrow()}</span></div><div class="project-meta"><div><h3>${project.name}</h3><span>${project.type}</span></div>${arrow()}</div></a>`;
}

function workGrid(items = projects) { return `<div class="work-grid">${items.map(projectCard).join('')}</div>`; }

function closing(title = 'Have something<br>in mind?') {
  return `<section class="closing"><div class="closing-glow"></div><div><p class="eyebrow">Good things start with a conversation.</p><h2>${title}</h2></div>${button('Let’s make it happen', '/contact', 'lime')}</section>`;
}

function home() {
  return `<section class="journey" aria-label="Journey through our stone landscape"><div class="hero-stage"><div class="hero-landscape"></div><div class="scene-mount" id="scene-mount" aria-hidden="true"></div><div class="hero-shade"></div><div class="hero-copy"><p class="eyebrow"><span class="live-dot"></span> Independent digital studio</p><h1>Built to<br>stand out.</h1><p class="hero-description">Websites, software, design, and AI.<br>For our clients. For ourselves.</p><a href="#possibilities" class="hero-explore">Explore the studio ${arrow('down')}</a></div><div class="hero-aside"><span class="small-rule"></span><p>Solid foundations.<br>Bold possibilities.</p><span>One studio.<br>Two ways of building.</span></div><div class="journey-copy" aria-hidden="true"><p class="eyebrow">Where ideas take shape</p><h2>A little imagination.<br>A lot of engineering.</h2></div><div class="portal-copy" aria-hidden="true"><span>Step inside.</span></div><div class="hero-bottom"><span class="hero-coordinate">Design meets development.</span><div class="journey-tracker" aria-label="Scroll journey"><span class="active" data-stage="0">Approach</span><i></i><span data-stage="1">Awaken</span><i></i><span data-stage="2">Enter</span></div><button class="motion-toggle" type="button" aria-pressed="false"><span class="motion-icon">Ⅱ</span> <span class="motion-label">Pause motion</span></button></div></div></section>
    <section class="intro section-pad" id="possibilities"><div class="section-heading"><p class="eyebrow">Different paths. Same ambition.</p><h2>For your next chapter.<br>And our own.</h2><p>We bring ideas to life for businesses.<br>We also build the products we want to see in the world.</p></div><div class="two-paths"><a href="/work" data-link class="path-panel client-path"><span class="path-kind">Built for clients</span><div class="stone-stack"><i></i><i></i><i></i><span class="stone-line"></span></div><div class="path-bottom"><h3>Your vision.<br>Our craft.</h3><p>Websites, systems, identities,<br>and creative that moves.</p><span class="text-link">Explore client work ${arrow()}</span></div></a><a href="/products" data-link class="path-panel product-path"><span class="path-kind">Products of our own</span><div class="product-monolith"><i></i><i></i><span>◈</span></div><div class="path-bottom"><h3>Our ideas.<br>Out in the world.</h3><p>Independent software, shaped<br>by problems worth solving.</p><span class="text-link">Explore our products ${arrow()}</span></div></a></div></section>
    <section class="selected section-pad"><div class="section-top"><div><p class="eyebrow">A glimpse of the possibilities</p><h2>Good ideas.<br>Given form.</h2></div><div><p class="concept-note">Selected design & product concepts.</p>${textLink('Explore all work', '/work')}</div></div>${workGrid(projects.slice(0, 2))}</section>
    <section class="capabilities section-pad"><div class="section-top"><div><p class="eyebrow">What we bring to the table</p><h2>From first thought<br>to final detail.</h2></div>${textLink('Our services', '/services')}</div><div class="service-list">${serviceGroups.map(group => `<a href="/services#${group.id}" data-link class="service-row"><h3>${group.title}</h3><p>${group.items.join(' / ')}</p>${arrow()}</a>`).join('')}</div></section>
    <section class="process section-pad"><div class="process-intro"><p class="eyebrow">How we work</p><h2>Thoughtful by design.<br>Solid by construction.</h2><p>Every project starts with a conversation.<br>Then we make the right things, in the right order.</p>${textLink('Meet the studio', '/studio')}</div><div class="process-steps">${[['01', 'Understand', 'Your goals, your people, and the problem worth solving.'], ['02', 'Shape', 'Explore the direction. Make the experience clear. Refine the details.'], ['03', 'Build', 'Develop, test, and launch—with a considered handover.']].map(([n, title, body]) => `<div><span>${n}</span><h3>${title}</h3><p>${body}</p></div>`).join('')}</div></section>
    <section class="pricing-teaser section-pad"><div><p class="eyebrow">Make the next step clear.</p><h2>Big ideas.<br>Clear scope.</h2><p>Project-based work, ongoing creative partnerships,<br>and individual plans for our products.</p></div><div class="pricing-paths">${textLink('Explore project pricing', '/pricing')}${textLink('Explore product plans', '/products')}</div></section>${closing()}`;
}

function pageIntro(eyebrow, title, description, extra = '') {
  return `<section class="page-intro section-pad"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><div class="intro-bottom"><p>${description}</p>${extra}</div></section>`;
}

function work() {
  return `${pageIntro('Client work & creative possibilities', 'Ideas are a start.<br>Execution is everything.', 'Websites, software, design, and motion.<br>A preview of the directions we can explore together.')}<section class="portfolio section-pad"><div class="portfolio-controls"><div class="filter-list" role="group" aria-label="Filter work">${['All work', 'Websites', 'Software', 'Design & motion'].map((label, i) => `<button type="button" class="filter ${i === 0 ? 'active' : ''}" data-filter="${label}" aria-pressed="${i === 0}">${label}</button>`).join('')}</div><p class="concept-note">Illustrative concept studies</p></div><div id="portfolio-grid">${workGrid()}</div><p class="filter-status sr-only" aria-live="polite"></p></section>${closing('Let’s build<br>your next chapter.')}`;
}

function products() {
  return `${pageIntro('Products of our own', 'Independent ideas.<br>Useful software.', 'Alongside client work, we develop our own SaaS apps.<br>Each product deserves its own purpose, identity, and home.')}<section class="product-directory section-pad"><p class="concept-note product-disclaimer">These interface studies demonstrate the product area. They are concepts, not launched SaaS apps.</p>${[projects[1], projects[3]].map((project, i) => `<article class="product-feature ${i % 2 ? 'reverse' : ''}"><div class="product-feature-visual">${mockup(project)}</div><div class="product-feature-copy"><span class="status-tag">Interface concept</span><h2>${project.name}</h2><p>${project.description}</p><ul class="plain-list">${project.scope.map(item => `<li>${item}</li>`).join('')}</ul>${button('Explore the concept', `/work/${project.slug}`, 'ink')}<span class="product-plan-note">Product availability and plans will appear with the real app.</span></div></article>`).join('')}</section><section class="product-philosophy section-pad"><p class="eyebrow">Why we make our own</p><h2>We like solving problems.<br>Sometimes, they’re our own.</h2><p>Our products give us space to explore ideas, build useful tools, and keep refining how we create software.</p>${textLink('About the studio', '/studio')}</section>${closing('An idea worth<br>building together?')}`;
}

function services() {
  return `${pageIntro('Our capabilities', 'One studio.<br>Many possibilities.', 'Technical thinking. Creative instinct.<br>We connect the two to make things that work.')}<section class="service-details section-pad">${serviceGroups.map((group, i) => `<article class="service-detail" id="${group.id}"><div class="service-visual service-visual-${group.id}">${i === 0 ? '<div class="build-blocks"><i></i><i></i><i></i><i></i></div>' : i === 1 ? '<div class="design-type">Aa<span>↗</span></div>' : '<div class="ai-orbit"><i></i><i></i><i></i><b>✳</b></div>'}</div><div><p class="eyebrow">${group.short}</p><h2>${group.title}</h2><p>${group.description}</p><ul class="plain-list">${group.items.map(item => `<li>${item}</li>`).join('')}</ul>${textLink('Discuss your project', `/contact?service=${group.id}`)}</div></article>`).join('')}</section><section class="service-faq section-pad"><div><p class="eyebrow">A few useful answers</p><h2>Before we<br>get started.</h2></div><div class="faq-list">${[['Can you combine services?', 'Yes. A project can bring together a website, visual identity, social creative, software, or an AI workflow. We agree the scope before starting.'], ['Do you build custom systems?', 'Yes. We start with the workflow and the people using it, then define the interfaces, integrations, and rollout.'], ['How do AI projects work?', 'We define the use case, required integrations, and human handoffs first. Model usage and third-party operating costs are part of the scope discussion.'], ['What happens after launch?', 'Handover and any ongoing support, hosting, maintenance, or creative work are agreed as part of the engagement.']].map(([q, a]) => `<details><summary>${q}<span>+</span></summary><p>${a}</p></details>`).join('')}</div></section>${closing()}`;
}

function pricing() {
  return `${pageIntro('Pricing & engagements', 'Clear scope.<br>A solid starting point.', 'Different projects need different shapes.<br>Choose a starting point, then we’ll define the details together.')}<section class="pricing-section section-pad"><div class="pricing-explainer"><span class="status-tag">Quoted to scope</span><p>Every proposal defines deliverables, timing, revisions, and responsibilities. Your proposal reflects the agreed requirements and ongoing costs.</p></div><div class="pricing-grid">${offers.map((offer, i) => `<article class="price-offer ${i === 1 ? 'featured' : ''}"><span class="offer-model">${offer.model}</span><h2>${offer.name}</h2><p>${offer.description}</p><div class="offer-price">Let’s define the scope<span>Proposal based on your requirements</span></div><ul>${offer.items.map(item => `<li><span>✓</span>${item}</li>`).join('')}</ul>${button('Discuss this scope', `/contact?offer=${offer.id}`, i === 1 ? 'lime' : 'outline')}<p class="offer-note">${offer.note}</p></article>`).join('')}</div><div class="pricing-footnote"><span>Included, before we begin.</span><p>A written scope · Agreed timeline · Clear revision limits · Defined handover</p></div></section><section class="product-pricing section-pad"><div><p class="eyebrow">Looking for our software?</p><h2>Different products.<br>Individual plans.</h2><p>Each SaaS app has its own pricing and availability.<br>Explore the product area to find the right destination.</p></div>${button('Explore our products', '/products', 'ink')}</section>${closing('Let’s work out<br>what you need.')}`;
}

function updateMeta(page, project) {
  const names = { '/': 'Websites, software & bold ideas', '/work': 'Client work', '/products': 'Our products', '/services': 'Services', '/pricing': 'Pricing', '/studio': 'The studio', '/contact': 'Let’s talk', '/404': 'Page not found' };
  document.title = `${project ? project.name : names[page]} — devstackedmagazine`;
}

async function render({ focus = false } = {}) {
  const version = ++pageVersion;
  disposeScene?.();
  disposeScene = null;
  disconnectReveals?.();
  const { page, project } = resolveRoute(location.pathname);
  document.body.classList.toggle('home-page', page === '/');
  document.body.classList.remove('nav-open');
  renderChrome(page);
  const pages = { '/': home, '/work': work, '/products': products, '/services': services, '/pricing': pricing };
  main.innerHTML = project && typeof projectPage === 'function' ? projectPage(project) : pages[page] ? pages[page]() : `${pageIntro('A different path', 'This page<br>isn’t here.', 'Let’s take you somewhere useful.', button('Return to the studio', '/', 'ink'))}`;
  updateMeta(page, project);
  if (focus) main.focus({ preventScroll: true });
  header.classList.toggle('scrolled', scrollY > 30);
  setupInteractions();
  setupReveals();
  if (location.hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' }));
  if (page === '/') {
    try {
      const { createScene } = await import('./scene.js');
      if (version !== pageVersion) return;
      disposeScene = createScene(document.querySelector('#scene-mount'), document.querySelector('.journey'), motionPreference.matches);
    } catch (error) {
      console.warn('Landscape fallback active:', error.message);
      document.querySelector('.journey')?.classList.add('scene-fallback');
      const toggle = document.querySelector('.motion-toggle');
      if (toggle) { toggle.disabled = true; toggle.querySelector('.motion-label').textContent = 'Static view'; }
    }
  }
}

function setupReveals() {
  const elements = [...main.querySelectorAll('.section-top, .section-heading, .service-row, .process-steps > div, .principles > article')];
  if (motionPreference.matches) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  elements.forEach(element => { element.classList.add('will-reveal'); observer.observe(element); });
  disconnectReveals = () => observer.disconnect();
}

function setupInteractions() {
  const menu = header.querySelector('.menu-toggle');
  const mobile = header.querySelector('#mobile-nav');
  const setMenu = open => {
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobile.hidden = !open;
    document.body.classList.toggle('nav-open', open);
  };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  header.onkeydown = event => {
    if (event.key === 'Escape' && !mobile.hidden) { setMenu(false); menu.focus(); }
    if (event.key === 'Tab' && !mobile.hidden) {
      const controls = [menu, ...mobile.querySelectorAll('a')];
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
      if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
    }
  };
  footer.querySelector('.back-top').onclick = () => { scrollTo({ top: 0, behavior: motionPreference.matches ? 'instant' : 'smooth' }); main.focus({ preventScroll: true }); };

  main.querySelectorAll('[data-filter]').forEach(filter => filter.addEventListener('click', () => {
    main.querySelectorAll('[data-filter]').forEach(item => { item.classList.toggle('active', item === filter); item.setAttribute('aria-pressed', String(item === filter)); });
    const items = filter.dataset.filter === 'All work' ? projects : projects.filter(project => project.category === filter.dataset.filter);
    main.querySelector('#portfolio-grid').innerHTML = workGrid(items);
    main.querySelector('.filter-status').textContent = `${items.length} ${items.length === 1 ? 'concept' : 'concepts'} shown.`;
  }));

}

document.addEventListener('click', event => {
  const link = event.target.closest('a[data-link]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
  const url = new URL(link.href);
  if (url.origin !== location.origin) return;
  event.preventDefault();
  history.replaceState({ ...history.state, scroll: scrollY }, '');
  history.pushState({ scroll: 0 }, '', url.pathname + url.search + url.hash);
  scrollTo({ top: 0, behavior: 'instant' });
  render({ focus: true });
});

window.addEventListener('popstate', () => {
  render({ focus: true });
  requestAnimationFrame(() => scrollTo({ top: history.state?.scroll || 0, behavior: 'instant' }));
});
window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 30), { passive: true });
motionPreference.addEventListener('change', () => {
  const offset = scrollY;
  render();
  requestAnimationFrame(() => scrollTo({ top: offset, behavior: 'instant' }));
});
render();
