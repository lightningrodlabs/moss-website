// Mobile navigation menu: the "..." button toggles the nav links as a dropdown
(function() {
    const nav = document.querySelector('.site-navigation');
    const button = nav && nav.querySelector('.nav-mobile-menu');
    if (!button) return;

    function setOpen(open) {
        nav.classList.toggle('nav-open', open);
        button.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    button.addEventListener('click', function(e) {
        e.stopPropagation();
        setOpen(!nav.classList.contains('nav-open'));
    });

    // Close when tapping a link, tapping outside, or pressing Escape
    document.addEventListener('click', function(e) {
        if (e.target.closest('.nav-links a') || !e.target.closest('.nav-links')) {
            setOpen(false);
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') setOpen(false);
    });
})();
