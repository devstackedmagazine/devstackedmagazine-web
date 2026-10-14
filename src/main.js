import '@fontsource/onest/latin-400.css';
import '@fontsource/onest/latin-500.css';
import '@fontsource/onest/latin-600.css';
import '@fontsource/onest/latin-700.css';
import '@fontsource/onest/latin-800.css';
import './style.css';
import { smoothTo, motionLimited, animateAction, setScrollLocked } from './motion.js';
import { createProjectReel } from './project-reel.js';
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
let disposeReel = null;
let activeTransition = null;

const arrow = (direction = 'right') => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="arrow ${direction}"><path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" stroke-width="1.5"/></svg>`;
const mark = '';
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
  return `<section class="closing"><div class="closing-glow"></div><div><h2>${title}</h2></div>${button('Let’s make it happen', '/contact', 'lime')}</section>`;
}

function home() {
  return `<section class="journey" aria-label="3D logo scroll study"><div class="hero-stage"><div class="hero-landscape" style="background-image:url('/assets/volcanic-valley.png')"></div><div class="scene-mount" id="scene-mount" aria-hidden="true"></div><div class="hero-shade"></div><div class="hero-copy"><h1>Build.<br>Design.<br><span>Scale.</span></h1><p class="hero-description">Websites, software, design, and AI.<br>For our clients. For ourselves.</p><a href="#possibilities" class="hero-explore">Explore the studio ${arrow('down')}</a></div><div class="hero-aside"><span class="small-rule"></span><p>Solid foundations.<br>Bold possibilities.</p><span>One studio.<br>Two ways of building.</span></div><div class="journey-copy" aria-hidden="true"><h2>Every idea starts<br>with a spark.</h2><p>A clear direction at the core.</p></div><div class="build-copy journey-copy" aria-hidden="true"><h2>The right parts.<br>Working as one.</h2><p>Design and engineering, made to fit.</p></div><div class="portal-copy" aria-hidden="true"><span>Ready for<br>what’s next.</span><p>Built for your business. Or a product of our own.</p></div><div class="hero-bottom"><span class="hero-coordinate">Design meets development.</span><div class="journey-tracker" aria-label="Scroll journey"><span class="active" data-stage="0">Idea</span><i></i><span data-stage="1">Build</span><i></i><span data-stage="2">Scale</span></div><button class="motion-toggle" type="button" aria-pressed="false" disabled><span class="motion-icon">Ⅱ</span> <span class="motion-label">Pause motion</span></button></div></div></section>
    <section class="intro section-pad" id="possibilities"><div class="section-heading"><h2>For your next chapter.<br>And our own.</h2><p>We bring ideas to life for businesses.<br>We also build the products we want to see in the world.</p></div><div class="two-paths"><a href="/work" data-link class="path-panel client-path"><span class="path-kind">Built for clients</span><div class="path-bottom"><h3>Your vision.<br>Our craft.</h3><p>Websites, systems, identities,<br>and creative that moves.</p><span class="text-link">Explore client work ${arrow()}</span></div></a><a href="/products" data-link class="path-panel product-path"><span class="path-kind">Products of our own</span><div class="path-bottom"><h3>Our ideas.<br>Out in the world.</h3><p>Independent software, shaped<br>by problems worth solving.</p><span class="text-link">Explore our products ${arrow()}</span></div></a></div></section>
    <section class="selected project-reel"><div class="project-reel-sticky section-pad"><div class="section-top"><div><h2>Good ideas.<br>Given form.</h2></div><div><p class="concept-note">Selected design & product concepts.</p>${textLink('Explore all work', '/work')}</div></div><div class="project-reel-viewport" tabindex="0" role="region" aria-label="Project showcase"><div class="project-reel-track">${projects.map(projectCard).join('')}</div></div><div class="reel-footer"><span class="reel-counter" aria-live="polite">01 / 04</span><div class="reel-progress" aria-hidden="true"><span></span></div><div class="reel-controls"><button type="button" data-reel="previous" aria-label="Previous project">${arrow('left')}</button><button type="button" data-reel="next" aria-label="Next project">${arrow()}</button></div></div></div></section>
    <section class="capabilities section-pad"><div class="section-top"><div><h2>From first thought<br>to final detail.</h2></div>${textLink('Our services', '/services')}</div><div class="service-list">${serviceGroups.map(group => `<a href="/services#${group.id}" data-link class="service-row"><h3>${group.title}</h3><p>${group.items.join(' / ')}</p>${arrow()}</a>`).join('')}</div></section>
    <section class="process section-pad"><div class="process-intro"><h2>Thoughtful by design.<br>Solid by construction.</h2><p>Every project starts with a conversation.<br>Then we make the right things, in the right order.</p>${textLink('Meet the studio', '/studio')}</div><div class="process-steps">${[['01', 'Understand', 'Your goals, your people, and the problem worth solving.'], ['02', 'Shape', 'Explore the direction. Make the experience clear. Refine the details.'], ['03', 'Build', 'Develop, test, and launch—with a considered handover.']].map(([n, title, body]) => `<div><span>${n}</span><h3>${title}</h3><p>${body}</p></div>`).join('')}</div></section>
    <section class="pricing-teaser section-pad"><div><h2>Big ideas.<br>Clear scope.</h2><p>Project-based work, ongoing creative partnerships,<br>and individual plans for our products.</p></div><div class="pricing-paths">${textLink('Explore project pricing', '/pricing')}${textLink('Explore product plans', '/products')}</div></section>${closing()}`;
}

function pageIntro(_label, title, description, extra = '') {
  return `<section class="page-intro section-pad"><h1>${title}</h1><div class="intro-bottom"><p>${description}</p>${extra}</div></section>`;
}

function work() {
  return `${pageIntro('Client work & creative possibilities', 'Ideas are a start.<br>Execution is everything.', 'Websites, software, design, and motion.<br>A preview of the directions we can explore together.')}<section class="portfolio section-pad"><div class="portfolio-controls"><div class="filter-list" role="group" aria-label="Filter work">${['All work', 'Websites', 'Software', 'Design & motion'].map((label, i) => `<button type="button" class="filter ${i === 0 ? 'active' : ''}" data-filter="${label}" aria-pressed="${i === 0}">${label}</button>`).join('')}</div><p class="concept-note">Illustrative concept studies</p></div><div id="portfolio-grid">${workGrid()}</div><p class="filter-status sr-only" aria-live="polite"></p></section>${closing('Let’s build<br>your next chapter.')}`;
}

function products() {
  return `${pageIntro('Products of our own', 'Independent ideas.<br>Useful software.', 'Alongside client work, we develop our own SaaS apps.<br>Each product deserves its own purpose, identity, and home.')}<section class="product-directory section-pad"><p class="concept-note product-disclaimer">These interface studies demonstrate the product area. They are concepts, not launched SaaS apps.</p>${[projects[1], projects[3]].map((project, i) => `<article class="product-feature ${i % 2 ? 'reverse' : ''}"><div class="product-feature-visual">${mockup(project)}</div><div class="product-feature-copy"><h2>${project.name}</h2><span class="status-tag">Interface concept</span><p>${project.description}</p><ul class="plain-list">${project.scope.map(item => `<li>${item}</li>`).join('')}</ul>${button('Explore the concept', `/work/${project.slug}`, 'ink')}<span class="product-plan-note">Product availability and plans will appear with the real app.</span></div></article>`).join('')}</section><section class="product-philosophy section-pad"><h2>We like solving problems.<br>Sometimes, they’re our own.</h2><p>Our products give us space to explore ideas, build useful tools, and keep refining how we create software.</p>${textLink('About the studio', '/studio')}</section>${closing('An idea worth<br>building together?')}`;
}

function services() {
  return `${pageIntro('Our capabilities', 'One studio.<br>Many possibilities.', 'Technical thinking. Creative instinct.<br>We connect the two to make things that work.')}<section class="service-details section-pad">${serviceGroups.map((group, i) => `<article class="service-detail" id="${group.id}"><div class="service-visual service-visual-${group.id}">${i === 0 ? '<div class="build-blocks"><i></i><i></i><i></i><i></i></div>' : i === 1 ? '<div class="design-type">Aa<span>↗</span></div>' : '<div class="ai-orbit"><i></i><i></i><i></i><b>✳</b></div>'}</div><div><h2>${group.title}</h2><p>${group.description}</p><ul class="plain-list">${group.items.map(item => `<li>${item}</li>`).join('')}</ul>${textLink('Discuss your project', `/contact?service=${group.id}`)}</div></article>`).join('')}</section><section class="service-faq section-pad"><div><h2>Before we<br>get started.</h2></div><div class="faq-list">${[['Can you combine services?', 'Yes. A project can bring together a website, visual identity, social creative, software, or an AI workflow. We agree the scope before starting.'], ['Do you build custom systems?', 'Yes. We start with the workflow and the people using it, then define the interfaces, integrations, and rollout.'], ['How do AI projects work?', 'We define the use case, required integrations, and human handoffs first. Model usage and third-party operating costs are part of the scope discussion.'], ['What happens after launch?', 'Handover and any ongoing support, hosting, maintenance, or creative work are agreed as part of the engagement.']].map(([q, a]) => `<details><summary>${q}<span>+</span></summary><p>${a}</p></details>`).join('')}</div></section>${closing()}`;
}

function pricing() {
  return `${pageIntro('Pricing & engagements', 'Clear scope.<br>A solid starting point.', 'Different projects need different shapes.<br>Choose a starting point, then we’ll define the details together.')}<section class="pricing-section section-pad"><div class="pricing-explainer"><span class="status-tag">Quoted to scope</span><p>Every proposal defines deliverables, timing, revisions, and responsibilities. Your proposal reflects the agreed requirements and ongoing costs.</p></div><div class="pricing-grid">${offers.map((offer, i) => `<article class="price-offer ${i === 1 ? 'featured' : ''}"><h2>${offer.name}</h2><span class="offer-model">${offer.model}</span><p>${offer.description}</p><div class="offer-price">Let’s define the scope<span>Proposal based on your requirements</span></div><ul>${offer.items.map(item => `<li><span>✓</span>${item}</li>`).join('')}</ul>${button('Discuss this scope', `/contact?offer=${offer.id}`, i === 1 ? 'lime' : 'outline')}<p class="offer-note">${offer.note}</p></article>`).join('')}</div><div class="pricing-footnote"><span>Included, before we begin.</span><p>A written scope · Agreed timeline · Clear revision limits · Defined handover</p></div></section><section class="product-pricing section-pad"><div><h2>Different products.<br>Individual plans.</h2><p>Each SaaS app has its own pricing and availability.<br>Explore the product area to find the right destination.</p></div>${button('Explore our products', '/products', 'ink')}</section>${closing('Let’s work out<br>what you need.')}`;
}

function studio() {
  return `${pageIntro('The studio', 'Creative minds.<br>Builder mentality.', 'We’re devstackedmagazine. An independent digital studio<br>building for our clients and creating products of our own.')}<section class="studio-landscape"><div class="studio-landscape-caption"><span>Built on curiosity.</span><span>Shaped by the work.</span></div>${mark}</section><section class="studio-story section-pad"><div><h2>We make things<br>we want to stand behind.</h2><p>Client projects let us turn someone else’s ambition into a tangible experience. Our own products give us room to explore problems, test ideas, and create something useful.</p><p>Across both, we bring software, design, motion, and AI into the same conversation. The medium changes. The attention to the work doesn’t.</p></div></section><section class="principles section-pad">${[['Clarity first.', 'Understand the job before choosing the solution. Give people a clear way forward.'], ['Details matter.', 'The big idea and the small interactions should belong to the same experience.'], ['Build with purpose.', 'Use the tools the work needs. Keep the result useful, considered, and understandable.']].map(([title, description]) => `<article><h3>${title}</h3><p>${description}</p></article>`).join('')}</section>${closing('Your ambition.<br>Our next conversation.')}`;
}

function contact() {
  const query = new URLSearchParams(location.search);
  const offer = offers.find(item => item.id === query.get('offer'));
  const requested = query.get('service') || (offer?.id === 'creative' ? 'design' : offer?.id === 'system' ? 'ai' : offer ? 'build' : '');
  return `${pageIntro('Start a conversation', 'What are<br>you imagining?', 'A new website. A better system. A different direction.<br>Tell us what’s on your mind.')}<section class="contact-section section-pad"><aside class="contact-aside"><h2>Good work starts<br>with understanding.</h2><p>You don’t need every answer.<br>A starting point is enough.</p><div class="contact-expectations"><span>We’ll shape the brief around</span><ul class="plain-list"><li>Your goals</li><li>The right scope</li><li>A practical next step</li></ul></div><div class="contact-product-help"><p>Looking for one of our apps?</p>${textLink('Explore our products', '/products')}</div></aside><div class="contact-form-wrap"><form id="brief-form"><div class="form-row"><label>Your name<input name="name" autocomplete="name" required maxlength="120" placeholder="Alex Morgan"></label><label>Email address<input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="alex@company.com"></label></div><label>Company <span class="optional">(optional)</span><input name="company" autocomplete="organization" maxlength="160" placeholder="Your company or project"></label><fieldset><legend>What can we help with?</legend><div class="service-choices">${serviceGroups.map(group => `<label class="service-choice"><input type="checkbox" name="services" value="${group.title}" ${requested === group.id ? 'checked' : ''}><span>${group.title}</span></label>`).join('')}</div></fieldset><label>Tell us about your idea<textarea name="details" required minlength="20" maxlength="5000" rows="4" placeholder="What are you building, and what would a great result look like?">${offer ? `I’m interested in ${offer.name.toLowerCase()}. ` : ''}</textarea></label><label>When would you like to start?<select name="timing"><option>Let’s figure it out together</option><option>As soon as practical</option><option>In the next 1–3 months</option><option>Later this year</option></select></label><p class="form-error" id="form-error" role="alert"></p><button class="button ink" type="submit">Prepare project brief ${arrow()}</button><p class="form-note">Save a brief to share with us. Nothing is sent or stored on a server.</p></form><div class="brief-result" id="brief-result" hidden><h2>Your starting point<br>is ready.</h2><span class="status-tag">Ready to share</span><p>Copy or download your brief. Preparing it hasn’t sent an inquiry.</p><pre id="brief-preview"></pre><div class="brief-actions"><button class="button ink" id="copy-brief" type="button">Copy brief ${arrow()}</button><button class="button outline" id="download-brief" type="button">Download .txt ${arrow('down')}</button></div><p id="brief-feedback" role="status"></p><button class="text-link" id="edit-brief" type="button">Edit your brief ${arrow()}</button></div></div></section>`;
}

function projectPage(project) {
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return `${pageIntro(project.type, `${project.name}<span class="project-title-dot">.</span>`, project.title, textLink('Back to all work', '/work'))}<section class="project-detail section-pad"><div class="detail-visual">${mockup(project)}</div><div class="project-overview"><div><h2>The direction.</h2><span class="status-tag">Illustrative concept</span></div><div><p>${project.description}</p><p class="concept-note">This preview demonstrates a creative direction. Final portfolio entries will use actual project assets and verified details.</p></div><ul class="plain-list">${project.scope.map(item => `<li>${item}</li>`).join('')}</ul></div></section><section class="next-project section-pad"><a href="/work/${next.slug}" data-link><h2>${next.name}</h2>${arrow()}</a></section>${closing('Something similar<br>in mind?')}`;
}

function updateMeta(page, project) {
  const names = { '/': 'Websites, software & bold ideas', '/work': 'Client work', '/products': 'Our products', '/services': 'Services', '/pricing': 'Pricing', '/studio': 'The studio', '/contact': 'Let’s talk', '/404': 'Page not found' };
  document.title = `${project ? project.name : names[page]} — devstackedmagazine`;
}

function render({ focus = false } = {}) {
  const version = ++pageVersion;
  disposeReel?.();
  disposeReel = null;
  disposeScene?.();
  disposeScene = null;
  disconnectReveals?.();
  const { page, project } = resolveRoute(location.pathname);
  document.body.classList.toggle('home-page', page === '/');
  document.body.classList.remove('nav-open');
  setScrollLocked(false); main.inert = footer.inert = false;
  renderChrome(page);
  const pages = { '/': home, '/work': work, '/products': products, '/services': services, '/pricing': pricing, '/studio': studio, '/contact': contact };
  main.innerHTML = project ? projectPage(project) : pages[page] ? pages[page]() : `${pageIntro('A different path', 'This page<br>isn’t here.', 'Let’s take you somewhere useful.', button('Return to the studio', '/', 'ink'))}`;
  updateMeta(page, project);
  if (focus) main.focus({ preventScroll: true });
  header.classList.toggle('scrolled', scrollY > 30);
  setupInteractions();
  setupReveals();
  const reel = main.querySelector('.project-reel');
  if (reel) disposeReel = createProjectReel(reel);
  if (page === '/') {
    import('./scene.js').then(({ createScene }) => {
      if (version !== pageVersion) return;
      disposeScene = createScene(document.querySelector('#scene-mount'), document.querySelector('.journey'), motionPreference.matches);
    }).catch(error => {
      if (version !== pageVersion) return;
      console.warn('Landscape fallback active:', error.message);
      document.querySelector('.journey')?.classList.add('scene-fallback');
      const toggle = document.querySelector('.motion-toggle');
      if (toggle) { toggle.disabled = true; toggle.querySelector('.motion-label').textContent = 'Static view'; }
    });
  }
}

function setupReveals() {
  const elements = [...main.querySelectorAll('.section-top, .section-heading, .service-row, .process-steps > div, .principles > article')];
  if (motionLimited()) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  elements.forEach(element => { element.classList.add('will-reveal'); observer.observe(element); });
  disconnectReveals = () => observer.disconnect();
}

function setupInteractions() {
  const menu = header.querySelector('.menu-toggle');
  const mobile = header.querySelector('#mobile-nav');
  let menuAnimation = null, menuVersion = 0;
  const setMenu = async open => {
    const version = ++menuVersion;
    menuAnimation?.cancel();
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('nav-open', open);
    setScrollLocked(open); main.inert = footer.inert = open;
    if (open) {
      mobile.hidden = false;
      menuAnimation = animateAction(mobile, [{ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'translateY(0)' }]);
    } else {
      menuAnimation = animateAction(mobile, [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-8px)' }], { duration: 220 });
      await menuAnimation?.finished.catch(() => {});
      if (version === menuVersion) mobile.hidden = true;
    }
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
  footer.querySelector('.back-top').onclick = () => { smoothTo(0); main.focus({ preventScroll: true }); };

  main.querySelectorAll('[data-filter]').forEach(filter => filter.addEventListener('click', () => {
    main.querySelectorAll('[data-filter]').forEach(item => { item.classList.toggle('active', item === filter); item.setAttribute('aria-pressed', String(item === filter)); });
    const items = filter.dataset.filter === 'All work' ? projects : projects.filter(project => project.category === filter.dataset.filter);
    const grid = main.querySelector('#portfolio-grid');
    grid.innerHTML = workGrid(items);
    animateAction(grid, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }]);
    main.querySelector('.filter-status').textContent = `${items.length} ${items.length === 1 ? 'concept' : 'concepts'} shown.`;
  }));

  const form = main.querySelector('#brief-form');
  if (form) {
    briefText = '';
    if (contactDraft) {
      for (const key of ['name', 'email', 'company', 'details', 'timing']) form.elements.namedItem(key).value = contactDraft[key] || '';
      form.querySelectorAll('[name="services"]').forEach(input => { input.checked ||= contactDraft.services.includes(input.value); });
    }
    const saveDraft = () => {
      const data = new FormData(form);
      contactDraft = { ...Object.fromEntries(data), services: data.getAll('services') };
    };
    form.addEventListener('input', saveDraft);
    form.addEventListener('change', saveDraft);
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      try {
        briefText = buildBrief({ ...Object.fromEntries(data), services: data.getAll('services') });
        main.querySelector('#form-error').textContent = '';
        main.querySelector('#brief-preview').textContent = briefText;
        form.hidden = true;
        const result = main.querySelector('#brief-result');
        result.hidden = false;
        result.setAttribute('tabindex', '-1');
        result.focus({ preventScroll: true });
        animateAction(result, [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }]);
        smoothTo(result, { offset: -120 });
      } catch (error) { main.querySelector('#form-error').textContent = error.message; }
    });
    main.querySelector('#edit-brief').onclick = () => { main.querySelector('#brief-result').hidden = true; form.hidden = false; animateAction(form, [{ opacity: 0 }, { opacity: 1 }]); form.querySelector('input').focus({ preventScroll: true }); smoothTo(form, { offset: -120 }); };
    main.querySelector('#copy-brief').onclick = async () => {
      try { await navigator.clipboard.writeText(briefText); main.querySelector('#brief-feedback').textContent = 'Brief copied.'; }
      catch { main.querySelector('#brief-feedback').textContent = 'Clipboard unavailable. Download the brief or select and copy its text.'; }
    };
    main.querySelector('#download-brief').onclick = () => {
      const url = URL.createObjectURL(new Blob([briefText], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'devstackedmagazine-project-brief.txt';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      main.querySelector('#brief-feedback').textContent = 'Brief download prepared.';
    };
  }
}

function scrollToHash(hash, immediate = false) {
  let id;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (target) smoothTo(target, { immediate, offset: -100 });
}

function changePage(update, offset = 0, hash = '') {
  activeTransition?.skipTransition();
  const change = () => { update(); smoothTo(offset, { immediate: true }); if (hash) scrollToHash(hash, true); };
  if (motionLimited() || !document.startViewTransition) {
    change();
    if (!motionLimited()) animateAction(main, [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 620 });
    return;
  }
  activeTransition = document.startViewTransition(change);
  const transition = activeTransition;
  transition.finished.catch(() => {}).finally(() => { if (activeTransition === transition) activeTransition = null; });
}

document.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
  const url = new URL(link.href);
  if (url.origin !== location.origin) return;
  if (url.pathname === location.pathname && url.search === location.search && url.hash) {
    event.preventDefault();
    history.replaceState({ ...history.state, scroll: scrollY }, '', url.pathname + url.search + url.hash);
    scrollToHash(url.hash);
    return;
  }
  if (!link.hasAttribute('data-link')) return;
  event.preventDefault();
  history.replaceState({ ...history.state, scroll: scrollY }, '');
  changePage(() => {
    history.pushState({ scroll: 0 }, '', url.pathname + url.search + url.hash);
    render({ focus: true });
  }, 0, url.hash);
});

history.scrollRestoration = 'manual';
window.addEventListener('popstate', () => changePage(() => render({ focus: true }), history.state?.scroll || 0));
window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 30), { passive: true });
motionPreference.addEventListener('change', () => {
  const offset = scrollY;
  render();
  requestAnimationFrame(() => smoothTo(offset, { immediate: true }));
});
window.addEventListener('studio-motion-change', () => { if (motionLimited()) activeTransition?.skipTransition(); });
render();
if (location.hash) requestAnimationFrame(() => scrollToHash(location.hash, true));
