const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const backTop = document.querySelector('.back-top');
const form = document.querySelector('#contact-form');
const status = document.querySelector('#contact-status');
const successModal = document.querySelector('#contact-success');

menuToggle?.addEventListener('click', () => {
  const open = header.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

window.addEventListener('scroll', () => backTop?.classList.toggle('visible', window.scrollY > 500), { passive: true });
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  status.classList.remove('error');
  status.textContent = 'Sending your enquiry...';
  try {
    const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Submission failed');
    form.reset();
    status.textContent = 'Your enquiry has been sent successfully.';
    successModal?.showModal();
  } catch {
    status.classList.add('error');
    status.textContent = 'We could not send your enquiry. Please try again or email us directly.';
  } finally {
    button.disabled = false;
  }
});

document.querySelectorAll('.contact-success-close,.contact-success-done').forEach((button) => button.addEventListener('click', () => successModal?.close()));
successModal?.addEventListener('click', (event) => { if (event.target === successModal) successModal.close(); });
