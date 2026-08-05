const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const menuLinks = document.querySelectorAll('#main-nav a');
const backTop = document.querySelector('.back-top');

document.querySelectorAll('.directory-card img[alt]').forEach((logo) => {
  const companyName = document.createElement('b');
  companyName.className = 'partner-company-name';
  companyName.textContent = logo.alt;
  logo.insertAdjacentElement('afterend', companyName);
});

menuToggle?.addEventListener('click', () => {
  const isOpen = header.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

menuLinks.forEach((link) => link.addEventListener('click', () => {
  header.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

window.addEventListener('scroll', () => {
  backTop?.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
