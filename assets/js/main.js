/**
 * Main JS for Kombucha Brewery Website
 */

document.addEventListener('DOMContentLoaded', () => {
    // Selectors
    const html = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    const rtlBtn = document.getElementById('rtl-toggle');
    const bsLink = document.getElementById('bootstrap-link');
    const BS_CDN_LTR = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
    const BS_CDN_RTL = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css';

    // Current State Initialization
    let currentTheme = localStorage.getItem('theme') || 'dark';
    let currentDir = localStorage.getItem('dir') || 'ltr';

    // Apply Saved State
    html.setAttribute('data-theme', currentTheme);
    html.setAttribute('dir', currentDir);
    updateBootstrapUI();

    // Toggle Theme
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            currentTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            updateThemeIcons();
        });
    }

    // Toggle RTL
    if (rtlBtn) {
        rtlBtn.addEventListener('click', () => {
            currentDir = html.getAttribute('dir') === 'ltr' ? 'rtl' : 'ltr';
            html.setAttribute('dir', currentDir);
            localStorage.setItem('dir', currentDir);
            updateBootstrapUI();
        });
    }

    /**
     * Update Bootstrap CDN and UI based on RTL state
     */
    function updateBootstrapUI() {
        if (bsLink) {
            bsLink.href = currentDir === 'rtl' ? BS_CDN_RTL : BS_CDN_LTR;
        }

        // Update RTL Button Text or Indicator
        if (rtlBtn) {
            rtlBtn.querySelector('.rtl-text').innerText = currentDir.toUpperCase();
        }

        // Add class to body to handle specific CSS overrides
        document.body.classList.toggle('is-rtl', currentDir === 'rtl');
    }

    function updateThemeIcons() {
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (icon) {
                icon.className = currentTheme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
            }
        }
    }

    // Initial icon state
    updateThemeIcons();

    // Simple Scroll Animation Observer
    const animateOnScroll = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const targets = document.querySelectorAll('.animate-on-scroll');
        targets.forEach(t => observer.observe(t));
    };

    animateOnScroll();

    // Sticky Header Scroll
    const header = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.background = 'rgba(11, 15, 20, 0.98)';
        } else {
            header.style.padding = '1rem 0';
            header.style.background = 'rgba(11, 15, 20, 0.9)';
        }
    });
});
