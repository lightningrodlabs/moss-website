// Download Overlay Functionality

(function() {
    const overlay = document.getElementById('download-overlay');
    const backdrop = overlay.querySelector('.download-overlay-backdrop');
    const closeButton = overlay.querySelector('.download-modal-close');

    // Find all "Download Moss" buttons/links
    const downloadTriggers = document.querySelectorAll('.nav-cta, a[href="download.html"]');

    // Open overlay
    function openOverlay(e) {
        e.preventDefault();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Close overlay
    function closeOverlay() {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Add click handlers to download triggers
    downloadTriggers.forEach(trigger => {
        trigger.addEventListener('click', openOverlay);
    });

    // Close on backdrop click
    backdrop.addEventListener('click', closeOverlay);

    // Close on close button click
    closeButton.addEventListener('click', closeOverlay);

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeOverlay();
        }
    });
})();
