// Video Overlay Functionality

(function() {
    const overlay = document.getElementById('video-overlay');
    const backdrop = overlay.querySelector('.video-overlay-backdrop');
    const closeButton = overlay.querySelector('.video-close');
    const iframe = document.getElementById('video-iframe');
    const videoTrigger = document.getElementById('video-trigger');
    const videoContainer = overlay.querySelector('.video-container');

    // YouTube video ID
    const youtubeVideoId = 'kh1UVlIKvNg';
    const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`;

    // Open overlay
    function openOverlay(e) {
        e.preventDefault();

        // Get the position and size of the clicked card
        const card = videoTrigger.closest('.early-movers-card');
        const rect = card.getBoundingClientRect();

        // Set initial position and size to match the card
        videoContainer.style.setProperty('--start-x', rect.left + 'px');
        videoContainer.style.setProperty('--start-y', rect.top + 'px');
        videoContainer.style.setProperty('--start-width', rect.width + 'px');
        videoContainer.style.setProperty('--start-height', rect.height + 'px');

        // Show overlay
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling

        // Trigger expansion animation after a brief delay
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                videoContainer.classList.add('expanded');
                // Set the iframe src when expanding (enables autoplay)
                setTimeout(() => {
                    iframe.src = youtubeEmbedUrl;
                }, 200);
            });
        });
    }

    // Close overlay
    function closeOverlay() {
        videoContainer.classList.remove('expanded');

        // Wait for animation to complete before hiding overlay
        setTimeout(() => {
            overlay.classList.remove('active');
            // Clear iframe src to stop video
            iframe.src = '';
            document.body.style.overflow = ''; // Restore scrolling
        }, 300);
    }

    // Add click handler to video trigger
    if (videoTrigger) {
        videoTrigger.addEventListener('click', openOverlay);
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
