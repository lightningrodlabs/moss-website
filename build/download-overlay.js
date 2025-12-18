// Download Overlay Functionality

(function() {
    const overlay = document.getElementById('download-overlay');
    const backdrop = overlay.querySelector('.download-overlay-backdrop');
    const closeButton = overlay.querySelector('.download-modal-close');
    const modal = overlay.querySelector('.download-modal');

    // Find all "Download Moss" buttons/links
    const topNavTriggers = document.querySelectorAll('.nav-cta, a[href="download.html"]');
    const bottomGetMossButton = document.getElementById('get-moss-bottom');
    const mobileDownloadButton = document.getElementById('send-download-link-mobile');

    // Open overlay with positioning based on trigger
    function openOverlay(e, fromBottom = false) {
        e.preventDefault();

        // Adjust modal position based on trigger source
        if (fromBottom) {
            // Stick to bottom and right-aligned when triggered from bottom
            modal.style.top = 'auto';
            modal.style.bottom = '24px';
            modal.style.right = '24px';
        } else {
            // Default top navigation position
            modal.style.top = '80px';
            modal.style.bottom = 'auto';
            modal.style.right = '24px';
        }

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Close overlay
    function closeOverlay() {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Add click handlers to top navigation triggers
    topNavTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => openOverlay(e, false));
    });

    // Add click handler to bottom "Get Moss" button
    if (bottomGetMossButton) {
        bottomGetMossButton.addEventListener('click', (e) => openOverlay(e, true));
    }

    // Add click handler to mobile "Send Download link" button
    if (mobileDownloadButton) {
        mobileDownloadButton.addEventListener('click', (e) => openOverlay(e, false));
    }

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
