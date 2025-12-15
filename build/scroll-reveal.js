/**
 * Scroll-Reveal Animation for Motivation Section
 * Progressively reveals text paragraphs as user scrolls through the section
 */

(function() {
    'use strict';

    // Configuration
    const REVEAL_THRESHOLD = 0.15; // Reveal when 15% of viewport height into section

    let motivationSection = null;
    let motivationText = null;
    let paragraphs = [];
    let ticking = false;

    /**
     * Initialize the scroll reveal effect
     */
    function init() {
        motivationSection = document.querySelector('.motivation-section');
        motivationText = document.querySelector('.motivation-text');

        if (!motivationSection || !motivationText) {
            return;
        }

        paragraphs = Array.from(motivationText.querySelectorAll('p'));

        if (paragraphs.length === 0) {
            return;
        }

        // Set up scroll listener
        window.addEventListener('scroll', onScroll, { passive: true });

        // Initial check
        checkReveal();
    }

    /**
     * Handle scroll events with requestAnimationFrame for performance
     */
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                checkReveal();
                ticking = false;
            });
            ticking = true;
        }
    }

    /**
     * Check scroll position and reveal paragraphs progressively
     */
    function checkReveal() {
        const sectionRect = motivationSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate how far user has scrolled into the section (0 to 1)
        const scrollProgress = Math.max(0, Math.min(1,
            (viewportHeight - sectionRect.top) / (viewportHeight + sectionRect.height)
        ));

        // Calculate how many paragraphs should be revealed based on scroll progress
        const totalParagraphs = paragraphs.length;
        const revealCount = Math.floor(scrollProgress * totalParagraphs * 1.5);

        // Reveal paragraphs progressively
        paragraphs.forEach((paragraph, index) => {
            if (index <= revealCount) {
                paragraph.classList.add('revealed');
            }
        });

        // If all paragraphs are revealed, remove listener for performance
        if (revealCount >= totalParagraphs - 1) {
            window.removeEventListener('scroll', onScroll);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
