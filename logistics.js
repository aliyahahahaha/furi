const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
toggle.addEventListener('click', () => { const open = header.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); });
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => header.classList.remove('open')));
document.querySelector('#tracking-form').addEventListener('submit', e => { e.preventDefault(); const id = document.querySelector('#tracking-number').value.trim().toUpperCase(); document.querySelector('#tracking-result').textContent = `${id} — In transit to the destination hub. Estimated arrival: tomorrow at 3:30 PM.`; });
document.querySelector('#quote-form').addEventListener('submit', e => { e.preventDefault(); document.querySelector('#quote-result').textContent = 'Thank you! Your demo request has been received.'; e.target.reset(); });

window.addEventListener('load', () => setTimeout(() => document.querySelector('.page-loader').classList.add('loaded'), 350));
const progress = document.querySelector('.scroll-progress');
const backTop = document.querySelector('.back-top');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max ? (y / max) * 100 : 0}%`;
  header.classList.toggle('scrolled', y > 100);
  backTop.classList.toggle('show', y > 650);
}, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const revealItems = document.querySelectorAll('.section-heading, .service-card, .tracking > *, .about-art, .about-copy, .quote > *, .business-grid article, .events-intro, .event-card, .award-heading, .award-list article, .career-copy, .cv-form');
revealItems.forEach(el => el.classList.add('reveal'));
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
}), { threshold: .14 });
revealItems.forEach(el => revealObserver.observe(el));

const counters = document.querySelectorAll('.counter');
const countObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  const el = entry.target, target = Number(el.dataset.target), suffix = el.dataset.suffix || '', started = performance.now();
  const tick = now => { const p = Math.min((now - started) / 1400, 1), value = Math.round(target * (1 - Math.pow(1 - p, 3))); el.textContent = `${target > 999 ? (value / 1000).toFixed(1) + 'K' : value}${suffix}`; if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick); countObserver.unobserve(el);
}), { threshold: .5 });
counters.forEach(el => countObserver.observe(el));

document.querySelector('#cv-form').addEventListener('submit', e => {
  e.preventDefault();
  const file = e.target.cv.files[0];
  const result = document.querySelector('#cv-result');
  if (file && file.size > 5 * 1024 * 1024) { result.textContent = 'The file is too large. Please choose a file under 5MB.'; return; }
  result.textContent = 'Thank you! Your CV will be ready to send once the form service is connected.';
  e.target.reset();
});
