// ===========================================================
// HJM 
// ===========================================================

(function () {
    // --- Mobile nav toggle (fullscreen overlay) ---
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('open');
            toggle.classList.toggle('open');
        });

        var links = menu.querySelectorAll('.nav-link');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function () {
                menu.classList.remove('open');
                toggle.classList.remove('open');
            });
        }
    }

    // --- Header: scroll shadow + dark-to-light transition ---
    var header = document.querySelector('.header');
    var isHerePage = document.querySelector('.hero') || document.querySelector('.page-hero');

    function updateHeader() {
        if (!header) return;
        var scrolled = window.scrollY > 60;

        if (scrolled) {
            header.classList.add('scrolled');
            header.classList.remove('header-dark');
        } else {
            header.classList.remove('scrolled');
            if (isHerePage) {
                header.classList.add('header-dark');
            }
        }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    // --- Fade-in on scroll (IntersectionObserver) ---
    var fadeEls = document.querySelectorAll('.fade-in');
    if (fadeEls.length && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeEls.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show everything
        fadeEls.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // --- Contact form handling via Formspree ---
    var form = document.getElementById('contact-form');
    var status = document.getElementById('form-status');

    if (form && status) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var data = new FormData(form);
            var action = form.getAttribute('action');

            if (action.indexOf('YOUR_FORM_ID') !== -1) {
                status.textContent = 'Form endpoint not configured. Set up Formspree and update the form action URL.';
                status.className = 'form-status error';
                return;
            }

            status.textContent = 'Sending...';
            status.className = 'form-status sending';

            fetch(action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(function (response) {
                if (response.ok) {
                    status.textContent = 'Message sent. We\'ll get back to you shortly.';
                    status.className = 'form-status success';
                    form.reset();
                } else {
                    return response.json().then(function (json) {
                        if (json.errors) {
                            var msgs = json.errors.map(function (err) { return err.message; });
                            status.textContent = msgs.join(', ');
                        } else {
                            status.textContent = 'Something went wrong. Please try again.';
                        }
                        status.className = 'form-status error';
                    });
                }
            }).catch(function () {
                status.textContent = 'Network error. Check your connection and try again.';
                status.className = 'form-status error';
            });
        });
    }
})();
