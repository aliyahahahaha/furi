const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
toggle.addEventListener('click', () => { const open = header.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); });
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => header.classList.remove('open')));

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

const revealItems = document.querySelectorAll('.section-heading, .service-card, .about-art, .about-copy, .direction-intro, .direction-card, .values-row, .management-heading, .team-card, .business-grid article, .events-intro, .event-card, .award-heading, .award-list article, .career-copy, .cv-form');
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

const cvForm = document.querySelector('#cv-form');
const cvInput = document.querySelector('#cv-file');
const cvFileName = document.querySelector('#cv-file-name');
const cvFileMeta = document.querySelector('#cv-file-meta');
const cvSuccessModal = document.querySelector('#cv-success-modal');
const cvSuccessClose = document.querySelector('.cv-success-close');
const cvSuccessDone = document.querySelector('.cv-success-done');
const closeCvSuccess = () => cvSuccessModal.close();
cvSuccessClose.addEventListener('click', closeCvSuccess);
cvSuccessDone.addEventListener('click', closeCvSuccess);
cvSuccessModal.addEventListener('click', event => { if (event.target === cvSuccessModal) closeCvSuccess(); });
const resetCvFileLabel = () => {
  cvFileName.textContent = '＋ Choose file';
  cvFileMeta.textContent = 'PDF, DOC or DOCX · Maximum 5MB';
  cvFileName.closest('span').classList.remove('file-selected');
};

cvInput.addEventListener('change', () => {
  const file = cvInput.files[0];
  if (!file) {
    resetCvFileLabel();
    return;
  }
  cvFileName.textContent = `✓ ${file.name}`;
  cvFileMeta.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB · Ready to submit`;
  cvFileName.closest('span').classList.add('file-selected');
});

cvForm.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.currentTarget;
  const file = form.cv.files[0];
  const result = document.querySelector('#cv-result');
  const submitButton = form.querySelector('button[type="submit"]');
  const allowedExtensions = ['pdf', 'doc', 'docx'];
  const extension = file?.name.split('.').pop().toLowerCase();

  result.className = '';
  if (file && file.size > 5 * 1024 * 1024) {
    result.textContent = 'The file is too large. Please choose a file under 5MB.';
    result.classList.add('form-error');
    return;
  }
  if (!file || !allowedExtensions.includes(extension)) {
    result.textContent = 'Please attach your CV in PDF, DOC or DOCX format.';
    result.classList.add('form-error');
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Submitting application…';
  result.textContent = 'Uploading your CV securely…';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const basinMessage = data.message || data.error || data.errors?.map(error => error.message || error).join(' ');
      throw new Error(basinMessage || 'Submission failed. Please check the form and try again.');
    }

    form.reset();
    resetCvFileLabel();
    result.textContent = 'Thank you! Your application and CV have been submitted successfully.';
    result.classList.add('form-success');
    cvSuccessModal.showModal();
    cvSuccessDone.focus();
  } catch (error) {
    result.textContent = error.message || 'We could not submit your application. Please try again.';
    result.classList.add('form-error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Submit Application →';
  }
});

const eventDetails = {
  innovation: {
    title: 'FURI Supply Chain Innovation Day', meta: '12 JUNE 2026 · SHAH ALAM', tag: 'FEATURED EVENT · 01',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    intro: 'A focused industry session exploring how technology, collaboration and smarter processes can strengthen automotive logistics operations.',
    details: '<h3>Event highlights</h3><ul><li>Digital transformation in automotive supply chains</li><li>Operational excellence and process improvement</li><li>Industry networking and knowledge sharing</li></ul>'
  },
  community: {
    title: 'Community & Sustainability Day', meta: '20 APRIL 2026 · SELANGOR', tag: 'COMMUNITY EVENT · 02',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80',
    intro: 'A day dedicated to giving back, strengthening local connections and encouraging practical sustainability across our workplace and community.',
    details: '<h3>Programme focus</h3><ul><li>Employee volunteer activities</li><li>Environmental awareness initiatives</li><li>Community partnership programmes</li></ul>'
  },
  gathering: {
    title: 'Annual Team Gathering', meta: '08 FEBRUARY 2026 · MALAYSIA', tag: 'TEAM EVENT · 03',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    intro: 'An opportunity to recognise shared achievements, strengthen collaboration and celebrate the people who keep every FURI operation moving.',
    details: '<h3>Gathering highlights</h3><ul><li>Business and team updates</li><li>Employee recognition</li><li>Team-building and networking</li></ul>'
  },
  safety: {
    title: 'Warehouse Safety Week', meta: '18 NOVEMBER 2025 · SHAH ALAM', tag: 'SAFETY EVENT · 04', image: 'https://images.unsplash.com/photo-1586528116493-da8b9346ad93?auto=format&fit=crop&w=1000&q=80',
    intro: 'A focused programme reinforcing safe behaviour, shared accountability and operational awareness across our warehouse teams.',
    details: '<h3>Programme highlights</h3><ul><li>Safe material-handling practices</li><li>Emergency response awareness</li><li>Team safety challenges</li></ul>'
  },
  partner: {
    title: 'Automotive Partner Forum', meta: '04 OCTOBER 2025 · SELANGOR', tag: 'PARTNER EVENT · 05', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
    intro: 'Bringing customers and industry partners together to exchange perspectives and strengthen the automotive supply-chain ecosystem.',
    details: '<h3>Forum highlights</h3><ul><li>Automotive market outlook</li><li>Supplier collaboration sessions</li><li>Partnership networking</li></ul>'
  },
  operations: {
    title: 'Operations Excellence Workshop', meta: '16 AUGUST 2025 · PORT KLANG', tag: 'OPERATIONS EVENT · 06', image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1000&q=80',
    intro: 'A practical workshop focused on simplifying workflows, reducing waste and improving consistency throughout daily operations.',
    details: '<h3>Workshop focus</h3><ul><li>Lean process mapping</li><li>Performance problem-solving</li><li>Cross-functional improvement</li></ul>'
  },
  green: {
    title: 'Green Logistics Initiative', meta: '21 JUNE 2025 · MALAYSIA', tag: 'SUSTAINABILITY EVENT · 07', image: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1000&q=80',
    intro: 'Exploring responsible practices and practical improvements that can reduce environmental impact across logistics operations.',
    details: '<h3>Initiative themes</h3><ul><li>Resource and energy awareness</li><li>Packaging waste reduction</li><li>Sustainable workplace habits</li></ul>'
  },
  leadership: {
    title: 'Leadership Development Day', meta: '10 MAY 2025 · SELANGOR', tag: 'PEOPLE EVENT · 08', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=80',
    intro: 'A people-development session designed to strengthen communication, decision-making and leadership confidence.',
    details: '<h3>Learning themes</h3><ul><li>Leading high-performing teams</li><li>Effective communication</li><li>Coaching and feedback</li></ul>'
  },
  quality: {
    title: 'Quality & Kaizen Showcase', meta: '22 MARCH 2025 · SHAH ALAM', tag: 'QUALITY EVENT · 09', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
    intro: 'Showcasing employee-led improvement ideas that strengthen quality, productivity and customer value.',
    details: '<h3>Showcase highlights</h3><ul><li>Employee improvement projects</li><li>Quality problem-solving</li><li>Best-practice recognition</li></ul>'
  },
  kickoff: {
    title: 'New Year Business Kick-Off', meta: '18 JANUARY 2025 · MALAYSIA', tag: 'CORPORATE EVENT · 10', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    intro: 'Aligning teams around shared priorities, operational goals and a clear direction for the year ahead.',
    details: '<h3>Kick-off highlights</h3><ul><li>Business direction and priorities</li><li>Department action plans</li><li>Team alignment activities</li></ul>'
  }
};
const eventModal = document.querySelector('#event-modal');
const modalClose = eventModal.querySelector('.modal-close');
document.querySelectorAll('.event-more').forEach(button => button.addEventListener('click', () => {
  const event = eventDetails[button.dataset.event];
  document.querySelector('#event-modal-image').style.backgroundImage = `url('${event.image}')`;
  document.querySelector('#event-modal-meta').textContent = event.meta;
  document.querySelector('#event-modal-tag').textContent = event.tag;
  document.querySelector('#event-modal-title').textContent = event.title;
  document.querySelector('#event-modal-intro').textContent = event.intro;
  document.querySelector('#event-modal-details').innerHTML = event.details;
  stopEventAutoplay();
  eventModal.showModal();
  modalClose.focus();
}));
modalClose.addEventListener('click', () => eventModal.close());
eventModal.addEventListener('click', event => { if (event.target === eventModal) eventModal.close(); });
eventModal.addEventListener('close', () => { if (autoplayEnabled) startEventAutoplay(); });

const eventSlider = document.querySelector('#events-grid');
const eventPrev = document.querySelector('.event-prev');
const eventNext = document.querySelector('.event-next');
const eventProgress = document.querySelector('.event-slider-progress i');
const updateEventSlider = () => {
  const max = eventSlider.scrollWidth - eventSlider.clientWidth;
  const position = max > 0 ? eventSlider.scrollLeft / max : 0;
  eventProgress.style.transform = `scaleX(${Math.max(.08, position)})`;
  eventPrev.disabled = eventSlider.scrollLeft < 5;
  eventNext.disabled = eventSlider.scrollLeft > max - 5;
};
const slideEvents = direction => eventSlider.scrollBy({ left: direction * Math.min(650, eventSlider.clientWidth * .82), behavior: 'smooth' });
eventPrev.addEventListener('click', () => slideEvents(-1));
eventNext.addEventListener('click', () => slideEvents(1));
eventSlider.addEventListener('scroll', updateEventSlider, { passive: true });
let sliderDragging = false, sliderStartX = 0, sliderStartScroll = 0;
eventSlider.addEventListener('pointerdown', event => {
  if (event.target.closest('button')) return;
  sliderDragging = true; sliderStartX = event.clientX; sliderStartScroll = eventSlider.scrollLeft;
  eventSlider.classList.add('dragging'); eventSlider.setPointerCapture(event.pointerId);
});
eventSlider.addEventListener('pointermove', event => { if (sliderDragging) eventSlider.scrollLeft = sliderStartScroll - (event.clientX - sliderStartX); });
const stopSliderDrag = () => { sliderDragging = false; eventSlider.classList.remove('dragging'); };
eventSlider.addEventListener('pointerup', stopSliderDrag);
eventSlider.addEventListener('pointercancel', stopSliderDrag);
let autoplayEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let autoplayTimer;
const stopEventAutoplay = () => { clearInterval(autoplayTimer); autoplayTimer = undefined; };
const startEventAutoplay = () => {
  stopEventAutoplay();
  if (!autoplayEnabled || document.hidden || eventModal.open) return;
  autoplayTimer = setInterval(() => {
    const max = eventSlider.scrollWidth - eventSlider.clientWidth;
    if (eventSlider.scrollLeft >= max - 10) eventSlider.scrollTo({ left: 0, behavior: 'smooth' });
    else slideEvents(1);
  }, 4500);
};
eventSlider.addEventListener('pointerenter', stopEventAutoplay);
eventSlider.addEventListener('pointerleave', () => { if (autoplayEnabled) startEventAutoplay(); });
eventSlider.addEventListener('focusin', stopEventAutoplay);
eventSlider.addEventListener('focusout', () => setTimeout(() => { if (autoplayEnabled && !eventSlider.contains(document.activeElement)) startEventAutoplay(); }, 0));
document.addEventListener('visibilitychange', () => { if (document.hidden) stopEventAutoplay(); else if (autoplayEnabled) startEventAutoplay(); });
updateEventSlider();
startEventAutoplay();
