export const routes = ['/', '/work', '/products', '/services', '/pricing', '/studio', '/contact'];

export const projects = [
  { slug: 'form-and-field', name: 'Form & Field', type: 'Website concept', category: 'Websites', className: 'form-field', title: 'A considered home for a design practice.', description: 'An illustrative website direction exploring generous typography, tactile imagery, and a clear path from discovery to inquiry.', scope: ['Visual direction', 'Responsive website', 'Project discovery'], kind: 'website' },
  { slug: 'signal', name: 'Signal', type: 'SaaS interface concept', category: 'Software', className: 'signal', title: 'Make room for the work that matters.', description: 'An illustrative product interface for keeping projects, tasks and team activity in one focused workspace. This is a design demonstration, not an available product.', scope: ['Product design', 'Interface system', 'Workflow prototype'], kind: 'product' },
  { slug: 'afterhours', name: 'Afterhours', type: 'Motion & identity concept', category: 'Design & motion', className: 'afterhours', title: 'An identity that refuses to sit still.', description: 'An illustrative identity and motion study combining bold typographic composition with a flexible system for social creative.', scope: ['Graphic design', 'Motion direction', 'Social creative'], kind: 'design' },
  { slug: 'relay', name: 'Relay', type: 'AI system concept', category: 'Software', className: 'relay', title: 'A clearer view of every conversation.', description: 'An illustrative interface exploring call activity, summaries and human handoff for an AI calling workflow. This is a concept preview, not a claim of a deployed system.', scope: ['System design', 'AI workflow concept', 'Human handoff'], kind: 'ai' },
];

export const serviceGroups = [
  { id: 'build', title: 'Websites & software', short: 'Build', description: 'From a single landing page to the system your business runs on. Clear interfaces, thoughtful structure, and software built around the job it needs to do.', items: ['Landing pages', 'Business websites', 'Custom systems', 'SaaS development'], number: '01' },
  { id: 'design', title: 'Brand & content', short: 'Design', description: 'Give your business a visual language worth remembering. Then carry it consistently across screens, social feeds, and motion.', items: ['Graphic design', 'Social media creative', 'Motion graphics', 'Visual identity'], number: '02' },
  { id: 'ai', title: 'AI & automation', short: 'Automate', description: 'Turn a useful idea into a practical workflow. Connect the tools, define the handoffs, and keep people in control where it matters.', items: ['AI calling agents', 'AI integrations', 'Workflow automation', 'Internal tools'], number: '03' },
];

export const offers = [
  { id: 'landing', name: 'Landing page', model: 'Project pricing', description: 'One focused page. One clear purpose.', items: ['Design & development', 'Responsive layouts', 'Inquiry or conversion flow', 'Launch handover'], note: 'Content, integrations, and delivery schedule agreed before work begins.' },
  { id: 'website', name: 'Business website', model: 'Project pricing', description: 'A complete home for your business.', items: ['Multi-page website', 'Design direction', 'Content structure & CMS options', 'Responsive development & handover'], note: 'Page count, content responsibilities, hosting and maintenance scoped separately.' },
  { id: 'system', name: 'Software & AI', model: 'Scoped engagement', description: 'Built around the way you work.', items: ['Discovery & workflow mapping', 'Product or system design', 'Development & integrations', 'Testing & rollout plan'], note: 'AI usage, third-party subscriptions and ongoing operation quoted separately.' },
  { id: 'creative', name: 'Creative partnership', model: 'Project or monthly scope', description: 'A consistent creative presence.', items: ['Graphic design', 'Social media assets', 'Motion graphics', 'Agreed delivery & revision scope'], note: 'Deliverables and cadence defined together. Social management and ad spend are separate scope decisions.' },
];

export function resolveRoute(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (routes.includes(path)) return { page: path, project: null };
  const match = /^\/work\/([a-z0-9-]+)$/.exec(path);
  const project = match && projects.find(item => item.slug === match[1]);
  return project ? { page: '/project', project } : { page: '/404', project: null };
}

export function buildBrief(values) {
  const name = String(values.name || '').trim();
  const email = String(values.email || '').trim();
  const details = String(values.details || '').trim();
  if (!name || name.length > 120) throw new Error('Enter your name (up to 120 characters).');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error('Enter a valid email address.');
  if (details.length < 20 || details.length > 5000) throw new Error('Describe your project in 20–5,000 characters.');
  const services = [...new Set((values.services || []).filter(service => serviceGroups.some(group => group.title === service)))];
  return `Project brief — devstackedmagazine\n\nName: ${name}\nEmail: ${email}\nCompany: ${String(values.company || '').trim().slice(0,160) || 'Not specified'}\nServices: ${services.join(', ') || 'Let’s discuss'}\nTiming: ${String(values.timing || '').slice(0,120) || 'Flexible'}\n\nProject\n${details}\n`;
}
