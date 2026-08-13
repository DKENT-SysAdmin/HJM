// ===========================================================
// HJM International — shared behavior
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initRouteAnimation();
  initContactForm();
  initYear();
});

/* Mobile nav toggle */
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a nav link is tapped
  nav.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Pause the cargo-dot animation when off-screen to save cycles */
function initRouteAnimation() {
  const dots = document.querySelectorAll('.cargo-dot');
  if (!dots.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    });
  }, { threshold: 0.1 });

  dots.forEach(dot => observer.observe(dot));
}

/* Contact form — front-end only placeholder.
   Wire this up to your form handler / email service before going live. */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const status = form.querySelector('.form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) valid = false;
    });

    if (!valid) {
      status.textContent = 'Please fill in all required fields before submitting.';
      status.classList.remove('is-success');
      return;
    }

    // Placeholder confirmation. Replace with a real submission
    // (fetch() to a form endpoint, mailto handoff, etc.)
    status.textContent = 'Thanks — your message has been queued. Our team will follow up shortly.';
    status.classList.add('is-success');
    form.reset();
  });
}

/* Keep the footer year current without a manual edit each January */
function initYear() {
  const el = document.querySelector('[data-year]');
  if (el) el.textContent = new Date().getFullYear();
}
